import dbClient from '../clients/dbClient';
import { AppointmentStatus } from '../../../src/utils/enums/appointment-status.enum';

class SeedAppointments {
  static async up() {
    await dbClient.client().appointment.upsert({
      where: { id: '11111111-1111-1111-1111-111111111111' },
      update: {},
      create: {
        id: '11111111-1111-1111-1111-111111111111',
        doctor: { connect: { id: '22222222-2222-2222-2222-222222222222' } },
        patient: { connect: { id: '33333333-3333-3333-3333-333333333333' } } ,
        reason: 'Reason for the appointment',
        date_and_time: new Date(),
      },
    });

    await dbClient.client().appointment.upsert({
      where: { id: '22222222-2222-2222-2222-222222222222' },
      update: {},
      create: {
        id: '22222222-2222-2222-2222-222222222222',
        doctor: { connect: { id: '22222222-2222-2222-2222-222222222222' } },
        patient: { connect: { id: '44444444-4444-4444-4444-444444444444' } } ,
        reason: 'Reason for the appointment',
        date_and_time: new Date(),
        status: AppointmentStatus.COMPLETED
      },
    });

    await dbClient.client().appointment.upsert({
      where: { id: '33333333-3333-3333-3333-333333333333' },
      update: {},
      create: {
        id: '33333333-3333-3333-3333-333333333333',
        doctor: { connect: { id: '22222222-2222-2222-2222-222222222222' } },
        patient: { connect: { id: '55555555-5555-5555-5555-555555555555' } } ,
        reason: 'Reason for the appointment',
        date_and_time: new Date(),
        status: AppointmentStatus.CANCELED
      },
    });
  };

  static async down() {
    await dbClient.client().appointment.deleteMany({});
  };
}

export default SeedAppointments;