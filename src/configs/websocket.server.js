import { WebSocketServer } from 'ws';
import Redis from 'ioredis';

import { handleConnection } from '../utils/websocket-handler.js';

const redisClient = new Redis(process.env.REDIS_URL);

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    const params = new URLSearchParams(url.parse(req.url).query);
    const token = params.get('token');
    const userId = params.get('userId');

    if (!token) {
      ws.send('❌ Conexão recusada: token não fornecido.');
      ws.close();
      return;
    }

    if (!userId) {
      ws.send('❌ Conexão recusada: userId não fornecido.');
      ws.close();
      return;
    }

    console.log(`🔌 Novo cliente conectado: ${userId}`);
    await redisClient.set(`ws:client:${userId}`, JSON.stringify({ connectedAt: Date.now() }));

    ws.clientId = userId;
    await handleConnection(ws, token, userId);

    ws.on('close', async () => {
      await redisClient.del(`ws:client:${userId}`);
      console.log(`❌ Cliente desconectado: ${userId}`);
    });
  });

  return wss;
}