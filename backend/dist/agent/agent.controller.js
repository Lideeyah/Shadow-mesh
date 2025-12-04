"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentController = void 0;
const services_1 = require("../services");
class AgentController {
    static async handleCommand(req, res) {
        try {
            const { agentService } = (0, services_1.getServices)();
            const { command } = req.body;
            if (!command) {
                return res.status(400).json({ error: 'Command is required' });
            }
            if (!agentService)
                throw new Error('Agent Service not initialized');
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
