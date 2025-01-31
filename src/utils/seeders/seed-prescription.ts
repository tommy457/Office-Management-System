import dbClient from '../clients/dbClient';

class SeedPrescriptions {
  static async up() {
    await dbClient.client().prescription.upsert({
      where: { id: '11111111-1111-1111-1111-111111111111' },
      update: {},
      create: {
        id: '11111111-1111-1111-1111-111111111111',
        doctor: { connect: { id: '22222222-2222-2222-2222-222222222222' } },
        patient: { connect: { id: '33333333-3333-3333-3333-333333333333' } } ,
        medication: 'medication',
        dosage: 'dosage',
        frequency: 'frequency',
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    await dbClient.client().prescription.upsert({
      where: { id: '22222222-2222-2222-2222-222222222222' },
      update: {},
      create: {
        id: '22222222-2222-2222-2222-222222222222',
        doctor: { connect: { id: '22222222-2222-2222-2222-222222222222' } },
        patient: { connect: { id: '44444444-4444-4444-4444-444444444444' } } ,
        medication: 'medication',
        dosage: 'dosage',
        frequency: 'frequency',
        startDate: new Date(),
        endDate: new Date(),
      },
    });

    await dbClient.client().prescription.upsert({
      where: { id: '33333333-3333-3333-3333-333333333333' },
      update: {},
      create: {
        id: '33333333-3333-3333-3333-333333333333',
        doctor: { connect: { id: '22222222-2222-2222-2222-222222222222' } },
        patient: { connect: { id: '33333333-3333-3333-3333-333333333333' } } ,
        medication: 'medication',
        dosage: 'dosage',
        frequency: 'frequency',
        startDate: new Date(),
        endDate: new Date(),
      },
    });
  };

  static async down() {
    await dbClient.client().prescription.deleteMany({});
  };
}

export default SeedPrescriptions;