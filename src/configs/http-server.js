import express from "express";
import cors from "cors";

import swaggerRoutes from "../api/routes/swagger.routes.js";
import healthRoutes from "../api/routes/health.routes.js";

const allowedOrigins = process.env.CORS_ORIGINS.split(',');

const createApp = () => {
    const app = express();

    app.use(cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }));

    app.use(express.json());

    app.use("/", swaggerRoutes);
    app.use("/api/health", healthRoutes);

    return app;
};

export default createApp;   