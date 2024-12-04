import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Create a Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

class CarrinhosService {
  // Save data to Redis
  static async setKey(key: string, value: any, expirationInSeconds?: number): Promise<string> {
    try {
      // If expiration is provided, set the key with an expiration time
      if (expirationInSeconds) {
        return await redis.setex(key, expirationInSeconds, JSON.stringify(value));
      } else {
        return await redis.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error setting Redis key:", error);
      throw new Error("Failed to set value in Redis");
    }
  }

  // Get data from Redis
  static async getKey(key: string): Promise<any> {
    try {
      const result = await redis.get(key);
      if (!result) return null; // Return null if the key doesn't exist
      return JSON.parse(result); // Parse and return the stored JSON
    } catch (error) {
      console.error("Error getting Redis key:", error);
      throw new Error("Failed to get value from Redis");
    }
  }

  // Delete a key from Redis
  static async deleteKey(key: string): Promise<boolean> {
    try {
      const result = await redis.del(key);
      return result > 0; // If the result is greater than 0, the key was deleted
    } catch (error) {
      console.error("Error deleting Redis key:", error);
      throw new Error("Failed to delete key from Redis");
    }
  }

  // Optionally, you can also implement a method to check if a key exists
  static async existsKey(key: string): Promise<boolean> {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error("Error checking if Redis key exists:", error);
      throw new Error("Failed to check if key exists in Redis");
    }
  }
}

export default CarrinhosService;
