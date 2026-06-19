import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const client = createClient({
  url: redisUrl
});

export const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  db: 0
};

client.on('error', (err) => {
  console.error('Redis client error', err);
});

client.on('connect', () => {
  console.log('✓ Redis client connected');
});

client.connect().catch((err) => {
  console.error('Failed to connect to Redis:', err);
  process.exit(1);
});

export default client;
