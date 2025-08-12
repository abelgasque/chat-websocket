import { userConnections } from '../../utils/websocket-handler.js';

class ApiService {

    async sendChatMessage(token, senderId, receiverId, chatId, message) {
        const response = await fetch(`${process.env.CHAT_API_BASE_URL}/v1/api/chat/message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                senderId: senderId,
                chatId: chatId,
                message: message
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao enviar mensagem');
        }

        const toUserSocket = userConnections.get(receiverId);
        if (toUserSocket) {
            console.log(`📩 Mensagem enviada para o usuário ${receiverId}:`, data);
            toUserSocket.send(message);
        }
        
        console.log(`📩 Mensagem enviada ${receiverId}:`, data);
        return data;
    }
}

export default ApiService;