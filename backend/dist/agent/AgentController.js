"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const AgentService_1 = require("./AgentService");
const WalletManager_1 = require("../wallets/WalletManager");
const OrchestrationManager_1 = require("../orchestration/OrchestrationManager");
const PrivacyLayer_1 = require("../privacy/PrivacyLayer");
// Singleton instances for now
const walletManager = new WalletManager_1.WalletManager();
const orchestrationManager = new OrchestrationManager_1.OrchestrationManager();
const privacyLayer = new PrivacyLayer_1.PrivacyLayer();
const agentService = new AgentService_1.AgentService(walletManager, orchestrationManager, privacyLayer);
class AgentController {
    static async handleCommand(req, res) {
        try {
            const { command } = req.body;
            if (!command) {
                return res.status(400).json({ error: 'Command is required' });
            }
            const result = await agentService.processCommand(command);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Agent Error:', error);
            res.status(500).json({ error: 'Internal Agent Error' });
        }
    }
}
exports.AgentController = AgentController;
