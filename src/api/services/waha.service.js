import redisClient from '../../configs/redis.config.js';

class WahaService {
    async sendMessage(event) {
        const redisPrefix = "webhook:waha";
        if (event.chatId && event.senderId) {
            await redisClient.zadd(
                `${redisPrefix}:${event.senderId}:${event.chatId}:messages`, 
                new Date(),
                event
            );
        }
    }
}

export default WahaService;