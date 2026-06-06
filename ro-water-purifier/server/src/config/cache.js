const logger = require('./logger');

let redis = null;
const memoryCache = new Map();

try {
  // Redis is optional during local scaffolding; install dependencies for production use.
  const Redis = require('ioredis');
  if (process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 2 });
    redis.on('error', (error) => logger.warn(`Redis unavailable: ${error.message}`));
  }
} catch {
  redis = null;
}

async function get(key) {
  if (redis) {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  const item = memoryCache.get(key);
  if (!item) return null;
  if (item.expiresAt <= Date.now()) {
    memoryCache.delete(key);
    return null;
  }
  return item.value;
}

async function set(key, value, ttlSeconds = 60) {
  if (redis) {
    await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    return;
  }

  memoryCache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

async function del(key) {
  if (redis) {
    await redis.del(key);
    return;
  }
  memoryCache.delete(key);
}

module.exports = { get, set, del };
