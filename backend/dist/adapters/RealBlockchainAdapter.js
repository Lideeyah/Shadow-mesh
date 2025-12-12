"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealBlockchainAdapter = void 0;
const ethers_1 = require("ethers");
const web3_js_1 = require("@solana/web3.js");
const SecureLogger_1 = require("../logger/SecureLogger");
const config_1 = require("../config");
class RealBlockchainAdapter {
    constructor() {
        // Use configured RPCs
        this.ethProvider = new ethers_1.ethers.JsonRpcProvider(config_1.Config.ETH_RPC_URL);
        this.solConnection = new web3_js_1.Connection(config_1.Config.SOLANA_RPC_URL);
    }
    async getEthereumStats() {
        try {
            const [blockNumber, feeData] = await Promise.all([
                this.ethProvider.getBlockNumber(),
                this.ethProvider.getFeeData()
            ]);
            return {
                chain: 'Ethereum',
                blockNumber,
                gasPrice: feeData.gasPrice ? ethers_1.ethers.formatUnits(feeData.gasPrice, 'gwei') : 'N/A',
                status: 'online'
            };
        }
        catch (error) {
            SecureLogger_1.SecureLogger.error('Failed to fetch ETH stats', error);
            return { chain: 'Ethereum', status: 'offline', error: 'RPC unreachable' };
        }
    }
    async getSolanaStats() {
        try {
            const slot = await this.solConnection.getSlot();
            const version = await this.solConnection.getVersion();
            return {
                chain: 'Solana',
                slot,
                version: version['solana-core'],
                status: 'online'
            };
        }
        catch (error) {
            SecureLogger_1.SecureLogger.error('Failed to fetch SOL stats', error);
            return { chain: 'Solana', status: 'offline', error: 'RPC unreachable' };
        }
    }
}
exports.RealBlockchainAdapter = RealBlockchainAdapter;
