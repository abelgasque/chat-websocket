import express from "express";
import { swaggerUi, swaggerSpec } from "../../configs/swagger.config.js"; // Certifique-se de usar a extensão .js

const router = express.Router();

router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Configuração das rotas Swagger
router.get('/', (req, res) => {
    res.redirect('/swagger');
});

export default router;