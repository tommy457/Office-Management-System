import { createClient, RedisClientType } from 'redis';


class RedisClient {
  private client?: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: 'redis://redis:6379'
    });
    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.isConnected = true;
    });

    this.client.on('error', (err) => {
      console.error('Redis client error:', err);
      this.isConnected = false;
    });

    this.client.on('end', () => {
      console.log('Redis client disconnected');
      this.isConnected = false;
    });

    this.isConnected = false;
  }

  async connect(): Promise<void> {
    if (!this.client) return;
    try {
      await this.client.connect();
    } catch (err) {
      console.error('Failed to connect to Redis:', (err as Error).message);
    }
  }

  isAlive(): boolean {
    return this.isConnected;
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = this.client ? await this.client.get(key) : null;
      return value;
    } catch (err) {
      console.error('Error getting value:', (err as Error).message);
      return null;
    }
  }

  async set(key: string, value: string, ttl: number): Promise<void> {
    try {
      this.client ? await this.client.set(key, value, { EX: ttl }) : null;
    } catch (err) {
      console.error('Error setting value:', (err as Error).message, key);
    }
  }

  async del(key: string): Promise<void> {
    try {
      this.client ? await this.client.del(key) : null;
    } catch (err) {
      console.error('Error deleting value:', (err as Error).message);
    }
  }

  // Helper method that should be used for testing only!!!
  async deleteAllKeys(): Promise<void> {
    try {
      this.client ? await this.client.flushDb() : null;
    } catch (err) {
      console.error('Error deleting keys:', (err as Error).message);
    }
  }
}

const redisClient = new RedisClient();

(async () => {
  await redisClient.connect();
})();

export default redisClient;