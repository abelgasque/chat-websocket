import redisClient from '../../configs/redis.config.js';

class WahaService {
    async sendMessage(event) {
        const redisPrefix = "webhook:waha";
        if (event.id && event.session) {
            const senderId = event.payload.from || null;
            const chatKey = `chat:${event.session}:${senderId}`;

            await redisClient.set(`${redisPrefix}:event:${event.id}`, JSON.stringify(event));
            const exists = await redisClient.exists(`${redisPrefix}:${chatKey}`);

            if (!exists) {
                await redisClient.set(`${redisPrefix}:${chatKey}`, JSON.stringify({
                    messageId: event.payload.id,
                    eventId: event.id,
                    timestamp: event.payload.timestamp,
                    from: {
                        id: senderId,
                        name: event.payload._data?.Info?.PushName || null
                    },
                    to: {
                        id: req.event.me.id,
                        name: event.me?.pushName || null
                    },
                    message: event.payload.event,
                    fromMe: event.payload.fromMe,
                    hasMedia: event.payload.hasMedia,
                    ack: {
                        code: event.payload.ack,
                        status: event.payload.ackName
                    },
                    session: event.session,
                    engine: event.environment?.engine,
                    verifiedName: event.payload._data?.Info?.VerifiedName?.Details?.verifiedName || null
                }));
            }

            if (event.event === "message") {
                await redisClient.zadd(
                    `${redisPrefix}:${chatKey}:messages`,
                    event.payload.timestamp,
                    event.payload.body
                );
            }
        }
    }
}

export default WahaService;