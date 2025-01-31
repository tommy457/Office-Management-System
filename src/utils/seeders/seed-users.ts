import dbClient from '../clients/dbClient';
import bcrypt from 'bcrypt';
import { UserType } from '../enums/user-role.enum';

class SeedUsers {
  static async up() {
    await dbClient.client().user.upsert({
      where: { id: '11111111-1111-1111-1111-111111111111' },
      update: {},
      create: {
        id: '11111111-1111-1111-1111-111111111111',
        password: await bcrypt.hash('testing123', 10),
        email: 'mohamed.lamine@admin.com',
        name: 'Boukhalfa Mohamed Lamine',
        role: UserType.ADMIN,
      },
    });

    await dbClient.client().user.upsert({
      where: { id: '22222222-2222-2222-2222-222222222222' },
      update: {},
      create: {
        id: '22222222-2222-2222-2222-222222222222',
        password: await bcrypt.hash('password123', 10),
        email: 'mohamed.lamine@doctor.com',
        name: 'Boukhalfa Mohamed Lamine 2',
        role: UserType.DOCTOR,
        specialization: "Surgeon",
      },
    });

    await dbClient.client().user.upsert({
      where: { id: '33333333-3333-3333-3333-333333333333' },
      update: {},
      create: {
        id: '33333333-3333-3333-3333-333333333333',
        password: await bcrypt.hash('testing123', 10),
        email: 'mohamed.lamine3@patient.com',
        name: 'Boukhalfa Mohamed Lamine 3',
        role: UserType.PATIENT,
        date_of_birth: '1996/11/06',
        address: 'Ain Touta Batna',
      },
    });

    await dbClient.client().user.upsert({
      where: { id: '44444444-4444-4444-4444-444444444444' },
      update: {},
      create: {
        id: '44444444-4444-4444-4444-444444444444',
        password: await bcrypt.hash('testing123', 10),
        email: 'mohamed.lamine4@patient.com',
        name: 'Boukhalfa Mohamed Lamine 4',
        role: UserType.PATIENT,
        date_of_birth: '1996/11/06',
        address: 'Ain Touta Batna',
      },
    });

    await dbClient.client().user.upsert({
      where: { id: '55555555-5555-5555-5555-555555555555' },
      update: {},
      create: {
        id: '55555555-5555-5555-5555-555555555555',
        password: await bcrypt.hash('testing123', 10),
        email: 'mohamed.lamine5@patient.com',
        name: 'Boukhalfa Mohamed Lamine 5',
        role: UserType.PATIENT,
        date_of_birth: '1996/11/06',
        address: 'Ain Touta Batna',
      },
    });
  };

  static async down() {
    await dbClient.client().user.deleteMany({});
  };
}

export default SeedUsers;