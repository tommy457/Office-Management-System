import { BaseService } from "../base.service";
import dbClient from "../../utils/clients/dbClient";
import { Appointment, Prisma } from "@prisma/client";
import {
  NotFoundError,
} from "../../middlewares/errors.middleware";
import {
  PaginatedResponse,
  ReqQueryOptions,
} from "../../interfaces/misc.interface";

class AppointmentService extends BaseService<
  Appointment,
  Prisma.AppointmentCreateInput,
  Prisma.AppointmentUpdateInput,
  Prisma.AppointmentInclude,
  Prisma.AppointmentSelect
> {
  constructor() {
    super(dbClient.client().appointment, 'appointment');
  }

  async findAppointmentById(id: string): Promise<Appointment> {
    const appointment = await this.findById(id);
    if (!appointment) throw new NotFoundError("Appointment Not Found.");

    return appointment;
  }

  async findAppointment(fields: { [key: string]: (string) | any }): Promise<Appointment> {
    const appointment = await this.findByMultipleFields(fields);
    return appointment;
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment> {
    const updatedAppointment = await super.update(
      id,
      data,
    );
    return updatedAppointment;
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return await super.create(data);
  }

  async getAllAppointments(
    query: ReqQueryOptions,
    filters?: object
  ): Promise<PaginatedResponse<Appointment>> {
    return await super.findAllPaginated(query, filters);
  }
}

export default new AppointmentService();