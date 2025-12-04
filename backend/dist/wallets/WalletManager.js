"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletManager = void 0;
class WalletManager {
    constructor() {
        this.sessions = new Map();
    }
    connectWallet(chainId, address, providerType) {
        const sessionId = `${chainId}:${address}`;
        const session = {
            chainId,
            address,
            providerType,
            connectedAt: Date.now()
        };
        this.sessions.set(sessionId, session);
        console.log(`[WalletManager] Connected ${chainId} wallet: ${address}`);
        return session;
    }
    disconnectWallet(chainId, address) {
        const sessionId = `${chainId}:${address}`;
        return this.sessions.delete(sessionId);
    }
    getActiveWallets() {
        return Array.from(this.sessions.values());
    }
    // Mock signing for now since we don't have a real frontend provider here
    async signTransaction(chainId, address, tx) {
        const session = this.sessions.get(`${chainId}:${address}`);
        if (!session)
            throw new Error('Wallet not connected');
        console.log(`[WalletManager] Signing tx on ${chainId} for ${address}`);
        return '0x_signed_payload_mock';
    }
}
exports.WalletManager = WalletManager;
