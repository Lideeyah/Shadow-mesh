import { Request, Response } from 'express';
import { WalletManager } from './WalletManager';

const walletManager = new WalletManager();

export class WalletController {
    static connect(req: Request, res: Response) {
        try {
            const { chainId, address, providerType } = req.body;
            if (!chainId || !address || !providerType) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const session = walletManager.connectWallet(chainId, address, providerType);
            res.status(200).json({ status: 'connected', session });
        } catch (error) {
            res.status(500).json({ error: 'Failed to connect wallet' });
        }
    }

    static list(req: Request, res: Response) {
        const wallets = walletManager.getActiveWallets();
        res.status(200).json({ wallets });
    }

    static disconnect(req: Request, res: Response) {
        const { chainId, address } = req.body;
        const success = walletManager.disconnectWallet(chainId, address);
        res.status(200).json({ success });
    }
}
