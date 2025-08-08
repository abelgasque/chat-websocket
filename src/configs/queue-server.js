import redisClient from './redis.config.js';

const redisPrefix = 'webhook:waha';

export async function processQueue() {
  console.log('👀 Aguardando mensagens...');

  while (true) {
    const [, rawEvent] = await redisClient.blpop('n8n:waha:messages', 0);
    const event = JSON.parse(rawEvent);
    console.log(`📩 Processando mensagem de ${event.senderId} para ${event.chatId}`);

    await redisClient.zadd(
      `${redisPrefix}:${event.senderId}:${event.chatId}:messages`,
      Date.now(),
      JSON.stringify(event)
    );

    console.log('✅ Mensagem salva no Redis');
  }
}