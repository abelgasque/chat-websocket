import url from 'url';
import ApiService from "../api/services/api.service.js";

const apiService = new ApiService();

export const userConnections = new Map();

export async function handleConnection(ws, req) {
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

  userConnections.set(userId, ws);
  console.log(`✅ Chat ${userId} conectado`);

  ws.send('👋 Conexão WebSocket autenticada com sucesso!');

  ws.on('message', async (payload) => {
    console.log(`Mensagem recebida de ${userId}`, payload);
    try {
      const data = JSON.parse(payload);
      await apiService.sendChatMessage(token, userId, data.chatId, data.message);
    } catch (err) {
      console.error('Erro ao processar mensagem:', err);
      ws.send('❌ Erro ao processar mensagem');
    }
  });

  ws.on('close', () => {
    console.log(`❌ Usuário ${userId} desconectado`);
    userConnections.delete(userId);
  });
}