import { ethers } from 'ethers';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { SecureLogger } from '../logger/SecureLogger';
import { Config } from '../config';

export class RealBlockchainAdapter {
    private ethProvider: ethers.JsonRpcProvider;
    private solConnection: Connection;

    constructor() {
        // Use configured RPCs
        this.ethProvider = new ethers.JsonRpcProvider(Config.ETH_RPC_URL);
        this.solConnection = new Connection(Config.SOLANA_RPC_URL);
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
                gasPrice: feeData.gasPrice ? ethers.formatUnits(feeData.gasPrice, 'gwei') : 'N/A',
                status: 'online'
            };
        } catch (error) {
            SecureLogger.error('Failed to fetch ETH stats', error);
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
        } catch (error) {
            SecureLogger.error('Failed to fetch SOL stats', error);
            return { chain: 'Solana', status: 'offline', error: 'RPC unreachable' };
        }
    }
}
