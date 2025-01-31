import SeedAppointments from "./seed-appointments";
import SeedPrescriptions from "./seed-prescription";
import SeedUsers from "./seed-users";

class seedDB {
  static async up() {
    await SeedUsers.up();
    await SeedAppointments.up();
    await SeedPrescriptions.up();
  }

  static async down() {
    await SeedUsers.down();
    await SeedAppointments.down();
    await SeedPrescriptions.down();
  }
}

export default seedDB;