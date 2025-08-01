import { WebSocketServer } from 'ws';
import { handleConnection } from '../utils/websocket-handler.js';

export function setupWebSocket(server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    console.log('🔌 Novo cliente conectado via WebSocket');
    await handleConnection(ws, req);
  });

  return wss;
}