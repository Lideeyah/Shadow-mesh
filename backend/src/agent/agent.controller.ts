import { Request, Response } from 'express';
import { AgentService } from './AgentService';
import { WalletManager } from '../wallets/WalletManager';
import { OrchestrationManager } from '../orchestration/OrchestrationManager';
import { PrivacyLayer } from '../privacy/PrivacyLayer';

// Singleton instances for now
const walletManager = new WalletManager();
const orchestrationManager = new OrchestrationManager();
const privacyLayer = new PrivacyLayer();
const agentService = new AgentService(walletManager, orchestrationManager, privacyLayer);

export class AgentController {
    static async handleCommand(req: Request, res: Response) {
        try {
            const { command } = req.body;
            if (!command) {
                return res.status(400).json({ error: 'Command is required' });
            }

            const result = await agentService.processCommand(command);
            res.status(200).json(result);
        } catch (error) {
            console.error('Agent Error:', error);
            res.status(500).json({ error: 'Internal Agent Error' });
        }
    }
}
