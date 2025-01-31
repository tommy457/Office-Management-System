import { BaseService } from "../base.service";
import dbClient from "../../utils/clients/dbClient";
import { Prescription, Prisma } from "@prisma/client";
import {
  NotFoundError,
  ForbiddenError,
} from "../../middlewares/errors.middleware";
import {
  PaginatedResponse,
  ReqQueryOptions,
} from "../../interfaces/misc.interface";
import { UserType } from "../../utils/enums/user-role.enum";

class PrescriptionService extends BaseService<
Prescription,
  Prisma.PrescriptionCreateInput,
  Prisma.PrescriptionUpdateInput,
  Prisma.PrescriptionInclude,
  Prisma.PrescriptionSelect
> {
  constructor() {
    super(dbClient.client().prescription, 'prescription');
  }
  public defaultIncludeables() {
    return {
      ...this.generateIncludeable('doctor', ['id', 'name', 'specialization']),
      ...this.generateIncludeable('patient', ['id', 'name', 'date_of_birth', 'address']),
    };
  }

  async findPrescriptionById(
    id: string,
    role: UserType,
    userId: string
): Promise<Prescription> {
    const prescription = await this.findById(
      id,
      { include: this.defaultIncludeables() }
    );
    if (!prescription) throw new NotFoundError("Prescription Not Found.");
    if(prescription.patient_id !== userId && role === UserType.PATIENT)
      throw new ForbiddenError('Access Denied.')

    return prescription;
  }

  async findPrescription(fields: { [key: string]: (string) | any }): Promise<Prescription> {
    const prescription = await this.findByMultipleFields(
      fields,
      { include: this.defaultIncludeables() }
    );
    return prescription;
  }

  async update(id: string, data: Prisma.PrescriptionUpdateInput): Promise<Prescription> {
    const updatedPrescription = await super.update(
      id,
      data,
      { include: this.defaultIncludeables() }
    );
    return updatedPrescription;
  }

  async create(data: Prisma.PrescriptionCreateInput): Promise<Prescription> {
    return await super.create(
      data,
      { include: this.defaultIncludeables() }
    );
  }

  async delete(id: string): Promise<Prescription> {
    return await super.delete(id);
  }

  async getAllPrescriptions(
    query: ReqQueryOptions,
    filters?: object
  ): Promise<PaginatedResponse<Prescription>> {
    return await super.findAllPaginated(
      query,
      filters,
      { include: this.defaultIncludeables() }
    );
  }
}

export default new PrescriptionService();