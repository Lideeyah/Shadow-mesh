import { BlockchainAdapter } from './BlockchainAdapter';
import { RealBlockchainAdapter } from './RealBlockchainAdapter';

const realAdapter = new RealBlockchainAdapter();

export class EthereumAdapter implements BlockchainAdapter {
    async getBalance(address: string): Promise<string> {
        const stats = await realAdapter.getEthereumStats();
        if (stats.status === 'online') {
            return `ETH Block: ${stats.blockNumber} | Gas: ${stats.gasPrice} | Balance: 1.5 ETH (Mock)`;
        }
        return "1.5 ETH (Mock - RPC Offline)";
    }

    async sendTransaction(to: string, amount: string, data?: string): Promise<string> {
        return "0x_eth_tx_hash_mock";
    }
}

export class SolanaAdapter implements BlockchainAdapter {
    async getBalance(address: string): Promise<string> {
        const stats = await realAdapter.getSolanaStats();
        if (stats.status === 'online') {
            return `SOL Slot: ${stats.slot} | Version: ${stats.version} | Balance: 150.5 SOL (Mock)`;
        }
        return "150.5 SOL (Mock - RPC Offline)";
    }

    async sendTransaction(to: string, amount: string, data?: string): Promise<string> {
        console.log(`[Solana] Sending ${amount} to ${to}`);
        return "5x_solana_tx_hash_mock";
    }
}

export class BitcoinAdapter implements BlockchainAdapter {
    async getBalance(address: string): Promise<string> {
        console.log(`[Bitcoin] Fetching balance for ${address}`);
        return "0.05 BTC";
    }

    async sendTransaction(to: string, amount: string, data?: string): Promise<string> {
        console.log(`[Bitcoin] Sending ${amount} to ${to}`);
        return "btc_tx_hash_mock";
    }
}

export class ZcashAdapter implements BlockchainAdapter {
    async getBalance(address: string): Promise<string> {
        console.log(`[Zcash] Fetching shielded balance for ${address}`);
        return "10.0 ZEC";
    }

    async sendTransaction(to: string, amount: string, data?: string): Promise<string> {
        console.log(`[Zcash] Sending shielded tx ${amount} to ${to}`);
        return "zec_shielded_tx_hash_mock";
    }
}
