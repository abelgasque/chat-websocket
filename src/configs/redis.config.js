import Redis from 'ioredis';

class RedisClient {
  constructor() {
    if (!RedisClient.instance) {
      this.client = new Redis(process.env.REDIS_URL);
      this.client.on('connect', () => {
        console.log('[Redis] Conectado com sucesso!');
      });

      this.client.on('error', (err) => {
        console.error('[Redis] Erro de conexão:', err);
      });

      RedisClient.instance = this;
    }

    return RedisClient.instance;
  }

  getClient() {
    return this.client;
  }
}

const redisClientInstance = new RedisClient().getClient();
export default redisClientInstance;