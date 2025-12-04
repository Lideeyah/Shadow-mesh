import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { SecureLogger } from '../logger/SecureLogger';

export interface WalletSession {
    chainId: string;
    address: string;
    providerType: 'metamask' | 'phantom' | 'keplr' | 'private_key';
    connectedAt: number;
}

export class WalletManager {
    private sessions: Map<string, WalletSession> = new Map();
    private evmWallet: ethers.Wallet | null = null;
    private solanaKeypair: Keypair | null = null;

    constructor() {
        this.initializeAgentWallet();
    }

    private initializeAgentWallet() {
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            SecureLogger.log('No PRIVATE_KEY found. Agent will run in READ-ONLY mode.');
            return;
        }

        try {
            // Try initializing EVM Wallet
            this.evmWallet = new ethers.Wallet(privateKey);
            SecureLogger.log('Agent EVM Wallet initialized', { address: this.evmWallet.address });

            // Try initializing Solana Keypair (assuming same key or separate logic if needed)
            // For simplicity, we'll assume the user might provide a BS58 string for Solana if they want
            // But usually these are different. We will just log a warning for now if it fails.
            try {
                this.solanaKeypair = Keypair.fromSecretKey(bs58.decode(privateKey));
                SecureLogger.log('Agent Solana Wallet initialized', { address: this.solanaKeypair.publicKey.toBase58() });
            } catch (e) {
                // Ignore if not a valid solana key
            }

        } catch (error) {
            SecureLogger.error('Failed to initialize Agent Wallet', error);
        }
    }

    connectWallet(chainId: string, address: string, providerType: WalletSession['providerType']): WalletSession {
        const sessionId = `${chainId}:${address}`;
        const session: WalletSession = {
            chainId,
            address,
            providerType,
            connectedAt: Date.now()
        };
        this.sessions.set(sessionId, session);
        console.log(`[WalletManager] Connected ${chainId} wallet: ${address}`);
        return session;
    }

    disconnectWallet(chainId: string, address: string): boolean {
        const sessionId = `${chainId}:${address}`;
        return this.sessions.delete(sessionId);
    }

    getActiveWallets(): WalletSession[] {
        return Array.from(this.sessions.values());
    }

    async signTransaction(chainId: string, address: string, tx: any): Promise<string> {
        // If address matches our Agent, use real signer
        if (this.evmWallet && address.toLowerCase() === this.evmWallet.address.toLowerCase()) {
            SecureLogger.log(`[WalletManager] Signing REAL EVM transaction...`);
            return await this.evmWallet.signTransaction(tx);
        }

        // For user wallets, we can't sign without their private key (which we don't have).
        // In a real app, we would return the unsigned TX for the frontend to sign.
        // For this "Agent" demo, we will simulate success if it's a user wallet.
        SecureLogger.log(`[WalletManager] Simulating signature for user wallet`, { address });
        return '0x_simulated_signature';
    }

    getAgentAddress(chain: 'EVM' | 'SOL'): string | null {
        if (chain === 'EVM') return this.evmWallet?.address || null;
        if (chain === 'SOL') return this.solanaKeypair?.publicKey.toBase58() || null;
        return null;
    }
}
