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
 *           example:
 *             id: "evt_01k1rv7y0qfsvk4fpjcyce46ce"
 *             timestamp: 1754254276642
 *             event: "message"
 *             session: "default"
 *             me:
 *               id: "554888598227@c.us"
 *               pushName: "Abel"
 *               jid: "554888598227:24@s.whatsapp.net"
 *             payload:
 *               id: "false_554399542014@c.us_3A80CB0889EE78727451"
 *               timestamp: 1754254276
 *               from: "11111111111@c.us"
 *               fromMe: false
 *               source: "app"
 *               body: "Hello world"
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