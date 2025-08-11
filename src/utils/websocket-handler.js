import url from 'url';
import redisClient from '../configs/redis.config.js';

export const userConnections = new Map();

export async function handleConnection(ws, req) {
  const params = new URLSearchParams(url.parse(req.url).query);
  const token = params.get('token');
  const senderId = params.get('userId');
  const receiverId = params.get('receiverId');

  if (!senderId) {
    ws.send('❌ Conexão recusada: usuário não identificado.');
    ws.close();
    return;
  }
  
  if (!token) {
    ws.send('❌ Conexão recusada: token não fornecido.');
    ws.close();
    return;
  }

  if (!receiverId) {
    ws.send('❌ Conexão recusada: receiverId não fornecido.');
    ws.close();
    return;
  }

  userConnections.set(senderId, ws);
  console.log(`✅ Usuário ${senderId} conectado`);

  ws.send('👋 Conexão WebSocket autenticada com sucesso!');

  ws.on('message', async (payload) => {
    console.log(`Mensagem recebida de ${senderId}: ${payload}`);
    try {
      const data = JSON.parse(payload);
      await redisClient.rpush(`chat:${senderId}:${receiverId}:messages`, JSON.stringify({
        to: data.toUserId,
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