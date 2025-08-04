import WahaService from '../services/waha.service.js';

/**
 * @swagger
 * tags:
 *   name: Webhook
 *   description: Rotas de webhhok da aplicação
 */
class WebhookController {
    constructor() { 
        this.service = new WahaService();
    }

    async sendMessageWaha(req, res, next) {
        try {
            this.service.sendMessage(req.body);
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