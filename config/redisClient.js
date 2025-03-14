const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = createClient({
  url: redisUrl,
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

redisClient.connect().catch(console.error);

module.exports = redisClient;
