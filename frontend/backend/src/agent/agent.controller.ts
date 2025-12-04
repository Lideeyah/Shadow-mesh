import { Request, Response } from 'express';
import { getServices } from '../services';

export class AgentController {
    static async handleCommand(req: Request, res: Response) {
        try {
            const { agentService } = getServices();
            const { command } = req.body;
            if (!command) {
                return res.status(400).json({ error: 'Command is required' });
            }

            if (!agentService) throw new Error('Agent Service not initialized');

            const result = await agentService.processCommand(command);
            res.status(200).json(result);
        } catch (error) {
            console.error('Agent Error:', error);
            res.status(500).json({ error: 'Internal Agent Error' });
        }
    }
}
