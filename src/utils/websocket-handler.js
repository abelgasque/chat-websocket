import url from 'url';
import redisClient from '../configs/redis.config.js';
import apiService from "../api/services/api.service.js";

export const userConnections = new Map();

export async function handleConnection(ws, req) {
  const params = new URLSearchParams(url.parse(req.url).query);
  const token = params.get('token');
  const chatId = params.get('chatId');
  
  if (!token) {
    ws.send('❌ Conexão recusada: token não fornecido.');
    ws.close();
    return;
  }

  if (!chatId) {
    ws.send('❌ Conexão recusada: chatId não fornecido.');
    ws.close();
    return;
  }

  userConnections.set(chatId, ws);
  console.log(`✅ Chat ${chatId} conectado`);

  ws.send('👋 Conexão WebSocket autenticada com sucesso!');

  ws.on('message', async (payload) => {
    console.log(`Mensagem recebida de ${chatId}: ${payload}`);
    try {
      const data = JSON.parse(payload);
      await redisClient.rpush(`ws:chat:message:queue`, JSON.stringify({
        to: data.toUserId,
        chatId: chatId,
        message: data.message,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
      ws.send('❌ Erro ao processar mensagem');
    }
  });

  ws.on('close', () => {
    console.log(`❌ Usuário ${senderId} desconectado`);
    userConnections.delete(senderId);
  });
}