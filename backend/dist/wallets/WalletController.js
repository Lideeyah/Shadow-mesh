"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const WalletManager_1 = require("./WalletManager");
const walletManager = new WalletManager_1.WalletManager();
class WalletController {
    static connect(req, res) {
        try {
            const { chainId, address, providerType } = req.body;
            if (!chainId || !address || !providerType) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const session = walletManager.connectWallet(chainId, address, providerType);
            res.status(200).json({ status: 'connected', session });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to connect wallet' });
        }
    }
    static list(req, res) {
        const wallets = walletManager.getActiveWallets();
        res.status(200).json({ wallets });
    }
    static disconnect(req, res) {
        const { chainId, address } = req.body;
        const success = walletManager.disconnectWallet(chainId, address);
        res.status(200).json({ success });
    }
}
exports.WalletController = WalletController;
