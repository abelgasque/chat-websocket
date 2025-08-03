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
            
            if (req.body.id) {
                await redisClient.set(`waha:webhook:${req.body.id}`, JSON.stringify(req.body));
            }

            res.status(200).json({
                message: "Nova mensagem recebida do waha", 
                body: req.body
            });
        } catch (error) {
            next(error);
        }
    }
}

export default WebhookController;