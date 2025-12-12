"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletManager = void 0;
const ethers_1 = require("ethers");
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const SecureLogger_1 = require("../logger/SecureLogger");
const config_1 = require("../config");
class WalletManager {
    constructor() {
        this.sessions = new Map();
        this.evmWallet = null;
        this.solanaKeypair = null;
        this.sessionsFile = path_1.default.join(config_1.Config.DATA_DIR, config_1.Config.SESSIONS_FILE);
        this.ensureDataDir();
        this.loadSessions();
        this.initializeAgentWallet();
    }
    ensureDataDir() {
        if (!fs_1.default.existsSync(config_1.Config.DATA_DIR)) {
            fs_1.default.mkdirSync(config_1.Config.DATA_DIR, { recursive: true });
        }
    }
    loadSessions() {
        try {
            if (fs_1.default.existsSync(this.sessionsFile)) {
                const data = fs_1.default.readFileSync(this.sessionsFile, 'utf-8');
                const sessionsArray = JSON.parse(data);
                sessionsArray.forEach(s => this.sessions.set(`${s.chainId}:${s.address}`, s));
                SecureLogger_1.SecureLogger.log(`[WalletManager] Loaded ${this.sessions.size} wallet sessions from disk.`);
            }
        }
        catch (error) {
            SecureLogger_1.SecureLogger.error('Failed to load wallet sessions', error);
        }
    }
    saveSessions() {
        try {
            const sessionsArray = Array.from(this.sessions.values());
            fs_1.default.writeFileSync(this.sessionsFile, JSON.stringify(sessionsArray, null, 2));
        }
        catch (error) {
            SecureLogger_1.SecureLogger.error('Failed to save wallet sessions', error);
        }
    }
    initializeAgentWallet() {
        if (!config_1.Config.EVM_PRIVATE_KEY && !config_1.Config.SOLANA_PRIVATE_KEY) {
            SecureLogger_1.SecureLogger.log('No PRIVATE_KEY found. Agent will run in READ-ONLY mode.');
            return;
        }
        try {
            if (config_1.Config.EVM_PRIVATE_KEY) {
                this.evmWallet = new ethers_1.ethers.Wallet(config_1.Config.EVM_PRIVATE_KEY);
                SecureLogger_1.SecureLogger.log('Agent EVM Wallet initialized', { address: this.evmWallet.address });
            }
            if (config_1.Config.SOLANA_PRIVATE_KEY) {
                try {
                    this.solanaKeypair = web3_js_1.Keypair.fromSecretKey(bs58_1.default.decode(config_1.Config.SOLANA_PRIVATE_KEY));
                    SecureLogger_1.SecureLogger.log('Agent Solana Wallet initialized', { address: this.solanaKeypair.publicKey.toBase58() });
                }
                catch (e) {
                    SecureLogger_1.SecureLogger.error('Invalid Solana Private Key', e);
                }
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
        this.saveSessions();
        console.log(`[WalletManager] Connected ${chainId} wallet: ${address}`);
        return session;
    }
    disconnectWallet(chainId, address) {
        const sessionId = `${chainId}:${address}`;
        const result = this.sessions.delete(sessionId);
        if (result)
            this.saveSessions();
        return result;
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
        return '0x_simulated_signature_user_wallet_action_required';
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
