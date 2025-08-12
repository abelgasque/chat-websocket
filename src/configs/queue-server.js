import redisClient from './redis.config.js';

export async function processQueue() {
  console.log('👀 Aguardando mensagens...');
  while (true) {
    const [, rawEvent] = await redisClient.blpop('ws:chat:message:queue', 0);
    const event = JSON.parse(rawEvent);
    console.log(`📩 Processando mensagem ${event.chatId}`);
  }
}