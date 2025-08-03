import redisClient from '../../configs/redis.config.js';

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: Rotas de webhhok da aplicação
 */
class WebhookController {
    async sendMessageWaha(req, res, next) {
        try {
            const redisPrefix = "webhook:waha";
            if (req.body.id) {
                const senderId = req.body.payload.from || null;
                const receiverId = req.body.me.id || null;
                const chatKey = `chat:${receiverId}`;

                await redisClient.set(`${redisPrefix}:event:${req.body.id}`, JSON.stringify(req.body));
                await redisClient.set(`${redisPrefix}:${chatKey}`, JSON.stringify({
                    messageId: req.body.payload.id,
                    eventId: req.body.id,
                    timestamp: req.body.payload.timestamp,
                    from: {
                        id: senderId,
                        name: req.body.payload._data?.Info?.PushName || null
                    },
                    to: {
                        id: receiverId,
                        name: req.body.me?.pushName || null
                    },
                    message: req.body.payload.body,
                    fromMe: req.body.payload.fromMe,
                    hasMedia: req.body.payload.hasMedia,
                    ack: {
                        code: req.body.payload.ack,
                        status: req.body.payload.ackName
                    },
                    session: req.body.session,
                    engine: req.body.environment?.engine,
                    verifiedName: req.body.payload._data?.Info?.VerifiedName?.Details?.verifiedName || null
                }));

                if (req.body.session && req.body.event === "message") {
                    await redisClient.zadd(
                        `${redisPrefix}:${chatKey}:message:${senderId}`,
                        req.body.payload.timestamp,
                        req.body.payload.body
                    );
                }
            }

            res.status(200).json({
                message: "New event received",
                body: req.body
            });
        } catch (error) {
            next(error);
        }
    }
}

export default WebhookController;