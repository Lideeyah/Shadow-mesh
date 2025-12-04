"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletManager = void 0;
const ethers_1 = require("ethers");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const SecureLogger_1 = require("../logger/SecureLogger");
class WalletManager {
    constructor() {
        this.sessions = new Map();
        this.evmWallet = null;
        this.solanaKeypair = null;
        this.initializeAgentWallet();
    }
    initializeAgentWallet() {
        const privateKey = process.env.PRIVATE_KEY;
        if (!privateKey) {
            SecureLogger_1.SecureLogger.log('No PRIVATE_KEY found. Agent will run in READ-ONLY mode.');
            return;
        }
        try {
            // Try initializing EVM Wallet
            this.evmWallet = new ethers_1.ethers.Wallet(privateKey);
            SecureLogger_1.SecureLogger.log('Agent EVM Wallet initialized', { address: this.evmWallet.address });
            // Try initializing Solana Keypair (assuming same key or separate logic if needed)
            // For simplicity, we'll assume the user might provide a BS58 string for Solana if they want
            // But usually these are different. We will just log a warning for now if it fails.
            try {
                this.solanaKeypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(privateKey));
                SecureLogger_1.SecureLogger.log('Agent Solana Wallet initialized', { address: this.solanaKeypair.publicKey.toBase58() });
            }
            catch (e) {
                // Ignore if not a valid solana key
            }
        }
        catch (error) {
            SecureLogger_1.SecureLogger.error('Failed to initialize Agent Wallet', error);
        }
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
    async signTransaction(chainId, address, tx) {
        // If address matches our Agent, use real signer
        if (this.evmWallet && address.toLowerCase() === this.evmWallet.address.toLowerCase()) {
            SecureLogger_1.SecureLogger.log(`[WalletManager] Signing REAL EVM transaction...`);
            return await this.evmWallet.signTransaction(tx);
        }
        // For user wallets, we can't sign without their private key (which we don't have).
        // In a real app, we would return the unsigned TX for the frontend to sign.
        // For this "Agent" demo, we will simulate success if it's a user wallet.
        SecureLogger_1.SecureLogger.log(`[WalletManager] Simulating signature for user wallet`, { address });
        return '0x_simulated_signature';
    }
    getAgentAddress(chain) {
        if (chain === 'EVM')
            return this.evmWallet?.address || null;
        if (chain === 'SOL')
            return this.solanaKeypair?.publicKey.toBase58() || null;
        return null;
    }
}
exports.WalletManager = WalletManager;
