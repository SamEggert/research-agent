import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) throw new Error("REDIS_URL is not set");

const redis = new Redis(redisUrl);
export default redis;

// Utility to clear the latest-map-markers key
if (require.main === module) {
  redis.del('latest-map-markers').then(() => {
    console.log('Cleared latest-map-markers from Redis');
    process.exit(0);
  });
}
