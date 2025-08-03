import express from "express";
import WebhookController from "../controllers/webhook.controller.js";

const controller = new WebhookController();
const router = express.Router();

/**
 * @swagger
 * /api/webhook/waha/message:
 *   post:
 *     summary: Webhook do waha
 *     description: Webhook do waha que recebe eventos de mensagens por sessão.
 *     tags:
 *       - [Webhook]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 example: message
 *               id:
 *                 type: string
 *                 example: 559999999999@c.us
 *               from:
 *                 type: string
 *                 example: 559999999999@c.us
 *               type:
 *                 type: string
 *                 example: chat
 *               body:
 *                 type: string
 *                 example: Olá, isso é um teste!
 *               timestamp:
 *                 type: integer
 *                 example: 1691000000
 *     responses:
 *       200:
 *         description: Sucesso. A aplicação está em execução.
 *       401:
 *         description: Credenciais de autenticação inválidas.
 *       500:
 *         description: Ocorreu um erro interno na aplicação.
 */
router.post("/waha/message", async (req, res, next) => {
  try {
    await controller.sendMessageWaha(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;