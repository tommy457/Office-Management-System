import { BaseService } from "../base.service";
import dbClient from "../../utils/clients/dbClient";
import { Appointment, Prisma } from "@prisma/client";
import {
  NotFoundError,
  ForbiddenError,
} from "../../middlewares/errors.middleware";
import {
  PaginatedResponse,
  ReqQueryOptions,
} from "../../interfaces/misc.interface";
import { UserType } from "../../utils/enums/user-role.enum";

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
  public defaultIncludeables() {
    return {
      ...this.generateIncludeable('doctor', ['id', 'name', 'specialization']),
      ...this.generateIncludeable('patient', ['id', 'name', 'date_of_birth', 'address']),
    };
  }

  async findAppointmentById(id: string, role: UserType, userId: string): Promise<Appointment> {
    const appointment = await this.findById(
      id,
      { include: this.defaultIncludeables() }
    );
    if (!appointment) throw new NotFoundError("Appointment Not Found.");
    if(appointment.patient_id !== userId && role === UserType.PATIENT)
      throw new ForbiddenError('Access Denied.')

    return appointment;
  }

  async findAppointment(fields: { [key: string]: (string) | any }): Promise<Appointment> {
    const appointment = await this.findByMultipleFields(
      fields,
      { include: this.defaultIncludeables() }
    );
    return appointment;
  }

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Appointment> {
    const updatedAppointment = await super.update(
      id,
      data,
      { include: this.defaultIncludeables() }
    );
    return updatedAppointment;
  }

  async create(data: Prisma.AppointmentCreateInput): Promise<Appointment> {
    return await super.create(
      data,
      { include: this.defaultIncludeables() }
    );
  }

  async getAllAppointments(
    query: ReqQueryOptions,
    filters?: object
  ): Promise<PaginatedResponse<Appointment>> {
    return await super.findAllPaginated(
      query,
      filters,
      { include: this.defaultIncludeables() }
    );
  }
}

export default new AppointmentService();