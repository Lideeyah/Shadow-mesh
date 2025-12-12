import { ethers } from 'ethers';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import fs from 'fs';
import path from 'path';
import { SecureLogger } from '../logger/SecureLogger';
import { Config } from '../config';

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
    private sessionsFile: string;

    constructor() {
        this.sessionsFile = path.join(Config.DATA_DIR, Config.SESSIONS_FILE);
        this.ensureDataDir();
        this.loadSessions();
        this.initializeAgentWallet();
    }

    private ensureDataDir() {
        if (!fs.existsSync(Config.DATA_DIR)) {
            fs.mkdirSync(Config.DATA_DIR, { recursive: true });
        }
    }

    private loadSessions() {
        try {
            if (fs.existsSync(this.sessionsFile)) {
                const data = fs.readFileSync(this.sessionsFile, 'utf-8');
                const sessionsArray = JSON.parse(data) as WalletSession[];
                sessionsArray.forEach(s => this.sessions.set(`${s.chainId}:${s.address}`, s));
                SecureLogger.log(`[WalletManager] Loaded ${this.sessions.size} wallet sessions from disk.`);
            }
        } catch (error) {
            SecureLogger.error('Failed to load wallet sessions', error);
        }
    }

    private saveSessions() {
        try {
            const sessionsArray = Array.from(this.sessions.values());
            fs.writeFileSync(this.sessionsFile, JSON.stringify(sessionsArray, null, 2));
        } catch (error) {
            SecureLogger.error('Failed to save wallet sessions', error);
        }
    }

    private initializeAgentWallet() {
        if (!Config.EVM_PRIVATE_KEY && !Config.SOLANA_PRIVATE_KEY) {
            SecureLogger.log('No PRIVATE_KEY found. Agent will run in READ-ONLY mode.');
            return;
        }

        try {
            if (Config.EVM_PRIVATE_KEY) {
                this.evmWallet = new ethers.Wallet(Config.EVM_PRIVATE_KEY);
                SecureLogger.log('Agent EVM Wallet initialized', { address: this.evmWallet.address });
            }

            if (Config.SOLANA_PRIVATE_KEY) {
                try {
                    this.solanaKeypair = Keypair.fromSecretKey(bs58.decode(Config.SOLANA_PRIVATE_KEY));
                    SecureLogger.log('Agent Solana Wallet initialized', { address: this.solanaKeypair.publicKey.toBase58() });
                } catch (e) {
                    SecureLogger.error('Invalid Solana Private Key', e);
                }
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
        this.saveSessions();
        console.log(`[WalletManager] Connected ${chainId} wallet: ${address}`);
        return session;
    }

    disconnectWallet(chainId: string, address: string): boolean {
        const sessionId = `${chainId}:${address}`;
        const result = this.sessions.delete(sessionId);
        if (result) this.saveSessions();
        return result;
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
        return '0x_simulated_signature_user_wallet_action_required';
    }

    getAgentAddress(chain: 'EVM' | 'SOL'): string | null {
        if (chain === 'EVM') return this.evmWallet?.address || null;
        if (chain === 'SOL') return this.solanaKeypair?.publicKey.toBase58() || null;
        return null;
    }
}
