import {
  ReqQueryOptions,
  PaginatedResponse
} from "../../src/interfaces/misc.interface";

export class BaseService<T, CreateInput, UpdateInput, Include, Select = undefined> {
  private model: any;
  private tableName: any;

  constructor(model: any, tableName: string) {
    this.model = model;
    this.tableName = tableName;
  }

  protected generateIncludeable(
    relation: string,
    fields: (string | { [key: string]: string[] })[]
  ): Include {
    const select: Record<string, any> = {};

    fields.forEach((field) => {
      if (typeof field === "string") {
        select[field] = true;
      } else if (typeof field === "object") {
        const nestedRelation = Object.keys(field)[0];
        select[nestedRelation] = { select: {} };

        field[nestedRelation].forEach((nestedField: string) => {
          select[nestedRelation].select[nestedField] = true;
        });
      }
    });

    return {
      [relation]: { select },
    } as Include;
  }

  async findById(
    id: string,
    options?: { include?: Include, select?: Select }
  ): Promise<T | null> {
    return await this.model.findUnique({
      where: { id },
      ...options,
    });
  }

  async findByMultipleFields(
    fields: { [key: string]: string | any },
    options?: { include?: Include }
  ): Promise<T | null> {
    return await this.model.findFirst({
      where: { ...fields },
      ...options,
    });
  }

  async create(data: CreateInput, options?: { include?: Include, select?: Select }): Promise<T> {
    return await this.model.create({
      data,
      ...options,
    });
  }

  async update(
    id: string,
    data: UpdateInput,
    options?: { include?: Include, select?: Select }
  ): Promise<T> {
    return await this.model.update({
      where: { id },
      data,
      ...options,
    });
  }

  async delete(id: string): Promise<T> {
    return await this.model.delete({
      where: { id },
    });
  }

  async findAllPaginated(
    query: ReqQueryOptions,
    filters?: object,
    options?: { include?: Include, select?: Select },
    ): Promise<PaginatedResponse<T>> {
    const {
      cursor,
      limit,
      search,
      orderBy,
      sortOrder,
    } = query;

    const queryOptions = {
      cursor,
      limit,
      search,
      orderBy,
      sortOrder,
    };

    const records = await this.model.findMany({
      where: filters,
      take: queryOptions.limit,
      cursor: queryOptions.cursor ? { id: queryOptions.cursor } : undefined,
      skip: queryOptions.cursor ? 1 : 0,
      orderBy: { [queryOptions.orderBy]: queryOptions.sortOrder },
      ...options,
    });
    const nextCursor =
      records.length > 0 ? records[records.length - 1].id : null;
    const data = { records, nextCursor };

    return data;
  }
}