"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const services_1 = require("../services");
class WalletController {
    static connect(req, res) {
        try {
            const { walletManager } = (0, services_1.getServices)();
            const { chainId, address, providerType } = req.body;
            if (!chainId || !address || !providerType) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            if (!walletManager)
                throw new Error('Wallet Manager not initialized');
            const session = walletManager.connectWallet(chainId, address, providerType);
            res.status(200).json({ status: 'connected', session });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to connect wallet' });
        }
    }
    static list(req, res) {
        const { walletManager } = (0, services_1.getServices)();
        if (!walletManager)
            return res.status(500).json({ error: 'Wallet Manager not initialized' });
        const wallets = walletManager.getActiveWallets();
        res.status(200).json({ wallets });
    }
    static disconnect(req, res) {
        const { walletManager } = (0, services_1.getServices)();
        if (!walletManager)
            return res.status(500).json({ error: 'Wallet Manager not initialized' });
        const { chainId, address } = req.body;
        const success = walletManager.disconnectWallet(chainId, address);
        res.status(200).json({ success });
    }
}
exports.WalletController = WalletController;
