"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const WebSocketServer_1 = require("../websocket/WebSocketServer");
const SecureLogger_1 = require("../logger/SecureLogger");
class AgentService {
    constructor(walletManager, orchestrationManager, privacyLayer) {
        this.walletManager = walletManager;
        this.orchestrationManager = orchestrationManager;
        this.privacyLayer = privacyLayer;
    }
    async processCommand(command) {
        SecureLogger_1.SecureLogger.log(`[Agent] Processing command`, { command });
        const ws = (0, WebSocketServer_1.getWebSocket)();
        // 1. Parse Intent
        ws.emit('agent:progress', { step: 'parsing', message: 'Parsing natural language command...' });
        const intent = this.parseIntent(command);
        if (!intent) {
            SecureLogger_1.SecureLogger.error('Command parsing failed', { command });
            ws.emit('agent:error', { message: 'Could not understand command.' });
            return {
                status: 'error',
                message: 'Could not understand command.',
                steps: []
            };
        }
        const steps = [];
        ws.emit('agent:progress', { step: 'intent_identified', intent });
        // 2. Execute Logic based on Intent
        if (intent.type === 'transfer') {
            const step1 = { id: '1', description: `Identified transfer of ${intent.amount} ${intent.asset} from ${intent.source} to ${intent.dest}`, status: 'completed' };
            steps.push(step1);
            ws.emit('agent:step', step1);
            // Check Privacy
            // Check Privacy
            if (intent.private) {
                const privacyStep = { id: '2', description: 'Encrypting transaction data via Fhenix FHE...', status: 'active' };
                steps.push(privacyStep);
                ws.emit('agent:step', privacyStep);
                await this.privacyLayer.executeConfidentialComputation({ amount: intent.amount, asset: intent.asset });
                privacyStep.status = 'completed';
                ws.emit('agent:step', privacyStep);
            }
            // Route Message via Orchestrator
            const routeStep = { id: '3', description: `Routing via ${intent.bridge || 'Best Bridge'}...`, status: 'active' };
            steps.push(routeStep);
            ws.emit('agent:step', routeStep);
            const result = await this.orchestrationManager.routeMessage(intent.source, intent.dest, JSON.stringify(intent));
            routeStep.status = 'completed';
            ws.emit('agent:step', routeStep);
            ws.emit('agent:success', { message: 'Transaction Executed Successfully' });
            return {
                status: 'success',
                message: 'Command processed successfully',
                steps: steps,
                data: result
            };
        }
        return {
            status: 'error',
            message: 'Unknown intent',
            steps: []
        };
    }
    parseIntent(command) {
        const lower = command.toLowerCase();
        if (lower.includes('transfer') || lower.includes('send') || lower.includes('bridge')) {
            return {
                type: 'transfer',
                asset: 'USDC', // Mock extraction
                amount: '100',
                source: 'Ethereum',
                dest: 'Solana',
                bridge: 'Axelar',
                private: lower.includes('private') || lower.includes('secret')
            };
        }
        return null;
    }
}
exports.AgentService = AgentService;
