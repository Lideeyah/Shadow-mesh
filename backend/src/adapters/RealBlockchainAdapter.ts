import { ethers } from 'ethers';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { SecureLogger } from '../logger/SecureLogger';

export class RealBlockchainAdapter {
    private ethProvider: ethers.JsonRpcProvider;
    private solConnection: Connection;

    constructor() {
        // Use public RPCs for demo purposes
        this.ethProvider = new ethers.JsonRpcProvider('https://eth.public-rpc.com');
        this.solConnection = new Connection(clusterApiUrl('mainnet-beta'));
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
