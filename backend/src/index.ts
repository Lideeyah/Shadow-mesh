import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { AgentController } from './agent/agent.controller';
import { WalletController } from './wallets/WalletController';
import { Config } from './config';

import { createServer } from 'http';
import { initWebSocket } from './websocket/WebSocketServer';

const app = express();
const httpServer = createServer(app);
const PORT = Config.PORT;

// Initialize WebSocket
initWebSocket(httpServer);

app.use(cors());
app.use(helmet());
app.use(express.json());

// Agent Routes
app.post('/api/agent/command', AgentController.handleCommand);

// Wallet Routes
app.post('/api/wallet/connect', WalletController.connect);
app.get('/api/wallet/list', WalletController.list);
app.post('/api/wallet/disconnect', WalletController.disconnect);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Shadowmesh Backend' });
});

httpServer.listen(PORT, () => {
    console.log(`Shadowmesh Backend running on port ${PORT}`);
});
