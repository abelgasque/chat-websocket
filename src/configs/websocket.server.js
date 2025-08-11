import { WebSocketServer } from 'ws';
import Redis from 'ioredis';
import { handleConnection } from '../utils/websocket-handler.js';

const redisClient = new Redis(process.env.REDIS_URL);

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    const clientId = req.url?.split('?id=')[1] || Date.now();

    console.log(`🔌 Novo cliente conectado: ${clientId}`);

    await redisClient.set(`ws:client:${clientId}`, JSON.stringify({ connectedAt: Date.now() }));

    ws.clientId = clientId;

    await handleConnection(ws, req);

    ws.on('close', async () => {
      await redisClient.del(`ws:client:${clientId}`);
      console.log(`❌ Cliente desconectado: ${clientId}`);
    });
  });

  return wss;
}