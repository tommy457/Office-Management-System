import { PrismaClient, Prisma } from '@prisma/client';

class DbClient {
  private prismaClient: PrismaClient;
  private isConnected: boolean = false;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async connect(): Promise<void> {
    try {
      await this.prismaClient.$connect();
      console.log('Connected to the database');
      this.isConnected = true;
    } catch (err) {
      console.error('Failed to connect to the database:', (err as Error).message);
      this.isConnected = false;
    }
  }

  isAlive(): boolean {
    return this.isConnected;
  }

  client(): PrismaClient {
    return this.prismaClient;
  }
}

const dbClient = new DbClient();

(async () => {
  await dbClient.connect();
})();

export default dbClient;