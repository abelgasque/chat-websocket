import "dotenv/config";
import http from 'http';

import app from './configs/http-server.js';
import { setupWebSocket } from './configs/websocket.server.js';
import { processQueue } from './configs/queue-server.js';

const port = process.env.NODE_PORT || 9090;
const server = http.createServer(app());

server.listen(port, '0.0.0.0', () => {
    if (process.env.NODE_ENV === "development") {
        console.log(`Aplicação executando em: http://localhost:${port}`);
    }
});

setupWebSocket(server);