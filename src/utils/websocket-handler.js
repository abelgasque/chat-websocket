import ApiService from "../api/services/api.service.js";

const apiService = new ApiService();

export const userConnections = new Map();

export async function handleConnection(ws, token, userId) {
  userConnections.set(userId, ws);

  ws.send('👋 Conexão WebSocket autenticada com sucesso!');
  ws.on('message', async (payload) => {
    console.log(`Mensagem recebida de ${userId}`, payload);
    try {
      const data = JSON.parse(payload);
      if (!data.receiverId || !data.chatId || !data.message) {
        ws.send('❌ Dados inválidos na mensagem');
        return;
      }

      const response = await apiService.sendChatMessage(token, userId, data.receiverId, data.chatId, data.message);

      const toUserSocket = userConnections.get(data.receiverId);
      if (toUserSocket && toUserSocket.readyState === WebSocket.OPEN) {
        console.log(`📩 Mensagem enviada para o usuário ${data.receiverId}:`, response);
        toUserSocket.send(response);
      } else {
        ws.send(`❌ Usuário ${data.receiverId} não está conectado.`);
      }
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