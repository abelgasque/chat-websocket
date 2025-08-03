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
                await redisClient.set(`${redisPrefix}:event:${req.body.id}`, JSON.stringify(req.body));
                if (req.body.session) {
                    const senderId = req.body.payload.from;
                    const receiverId = req.body.me.id;
                    const chatKey = `${redisPrefix}:chat:${senderId}:${receiverId}`;
                    await redisClient.zadd(chatKey, req.body.payload.timestamp, req.body.payload.body);
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