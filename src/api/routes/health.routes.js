import express from "express";
import HealthController from "../controllers/health.controller.js";

const controller = new HealthController();
const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verificar o status da aplicação
 *     description: Esta rota verifica o status da aplicação e retorna uma mensagem.
 *     tags:
 *       - [Health]
 *     responses:
 *       200:
 *         description: Sucesso. A aplicação está em execução.
 *       401:
 *         description: Credenciais de autenticação inválidas.
 *       500:
 *         description: Ocorreu um erro interno na aplicação.
 */
router.get("/", async (req, res, next) => {
  try {
    await controller.get(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;