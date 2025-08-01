/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Rotas de verificação de status da aplicação
 */
class HealthController {
    async get(req, res, next) {
        try {
            res.status(200).json({ message: "A aplicação está em execução." });
        } catch (error) {
            next(error);
        }
    }
}

export default HealthController;