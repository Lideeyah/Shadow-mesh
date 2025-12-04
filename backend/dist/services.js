"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServices = void 0;
const WalletManager_1 = require("./wallets/WalletManager");
const OrchestrationManager_1 = require("./orchestration/OrchestrationManager");
const PrivacyLayer_1 = require("./privacy/PrivacyLayer");
const AgentService_1 = require("./agent/AgentService");
let walletManager = null;
let orchestrationManager = null;
let privacyLayer = null;
let agentService = null;
const getServices = () => {
    if (!walletManager) {
        walletManager = new WalletManager_1.WalletManager();
        orchestrationManager = new OrchestrationManager_1.OrchestrationManager(walletManager);
        privacyLayer = new PrivacyLayer_1.PrivacyLayer();
        agentService = new AgentService_1.AgentService(walletManager, orchestrationManager, privacyLayer);
    }
    return {
        walletManager,
        orchestrationManager,
        privacyLayer,
        agentService
    };
};
exports.getServices = getServices;
