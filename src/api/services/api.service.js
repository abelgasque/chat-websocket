class ApiService {
    async sendChatMessage(token, senderId, receiverId, chatId, message) {
        const body = {
            senderId: senderId,
            chatId: chatId,
            timestamp: new Date(),
            message: message
        };

        const response = await fetch(`${process.env.CHAT_API_BASE_URL}/v1/api/chat/message`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(data.message || 'Erro ao enviar mensagem', response);
        }

        const data = await response.json();
        console.log(`📩 Mensagem enviada ${receiverId}:`, data);
        return body;
    }
}

export default ApiService;