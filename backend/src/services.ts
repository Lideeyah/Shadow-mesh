import { WalletManager } from './wallets/WalletManager';
import { OrchestrationManager } from './orchestration/OrchestrationManager';
import { PrivacyLayer } from './privacy/PrivacyLayer';
import { AgentService } from './agent/AgentService';

let walletManager: WalletManager | null = null;
let orchestrationManager: OrchestrationManager | null = null;
let privacyLayer: PrivacyLayer | null = null;
let agentService: AgentService | null = null;

export const getServices = () => {
    if (!walletManager) {
        walletManager = new WalletManager();
        orchestrationManager = new OrchestrationManager(walletManager);
        privacyLayer = new PrivacyLayer();
        agentService = new AgentService(walletManager, orchestrationManager, privacyLayer);
    }

    return {
        walletManager,
        orchestrationManager,
        privacyLayer,
        agentService
    };
};
