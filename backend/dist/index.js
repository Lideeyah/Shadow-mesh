"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const agent_controller_1 = require("./agent/agent.controller");
const WalletController_1 = require("./wallets/WalletController");
const config_1 = require("./config");
const http_1 = require("http");
const WebSocketServer_1 = require("./websocket/WebSocketServer");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const PORT = config_1.Config.PORT;
// Initialize WebSocket
(0, WebSocketServer_1.initWebSocket)(httpServer);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
// Agent Routes
app.post('/api/agent/command', agent_controller_1.AgentController.handleCommand);
// Wallet Routes
app.post('/api/wallet/connect', WalletController_1.WalletController.connect);
app.get('/api/wallet/list', WalletController_1.WalletController.list);
app.post('/api/wallet/disconnect', WalletController_1.WalletController.disconnect);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'Shadowmesh Backend' });
});
httpServer.listen(PORT, () => {
    console.log(`Shadowmesh Backend running on port ${PORT}`);
});
