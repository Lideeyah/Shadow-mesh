"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZcashAdapter = exports.BitcoinAdapter = exports.SolanaAdapter = exports.EthereumAdapter = void 0;
const RealBlockchainAdapter_1 = require("./RealBlockchainAdapter");
const realAdapter = new RealBlockchainAdapter_1.RealBlockchainAdapter();
class EthereumAdapter {
    async getBalance(address) {
        const stats = await realAdapter.getEthereumStats();
        if (stats.status === 'online') {
            return `ETH Block: ${stats.blockNumber} | Gas: ${stats.gasPrice} | Balance: 1.5 ETH (Mock)`;
        }
        return "1.5 ETH (Mock - RPC Offline)";
    }
    async sendTransaction(to, amount, data) {
        return "0x_eth_tx_hash_mock";
    }
}
exports.EthereumAdapter = EthereumAdapter;
class SolanaAdapter {
    async getBalance(address) {
        const stats = await realAdapter.getSolanaStats();
        if (stats.status === 'online') {
            return `SOL Slot: ${stats.slot} | Version: ${stats.version} | Balance: 150.5 SOL (Mock)`;
        }
        return "150.5 SOL (Mock - RPC Offline)";
    }
    async sendTransaction(to, amount, data) {
        console.log(`[Solana] Sending ${amount} to ${to}`);
        return "5x_solana_tx_hash_mock";
    }
}
exports.SolanaAdapter = SolanaAdapter;
class BitcoinAdapter {
    async getBalance(address) {
        console.log(`[Bitcoin] Fetching balance for ${address}`);
        return "0.05 BTC";
    }
    async sendTransaction(to, amount, data) {
        console.log(`[Bitcoin] Sending ${amount} to ${to}`);
        return "btc_tx_hash_mock";
    }
}
exports.BitcoinAdapter = BitcoinAdapter;
class ZcashAdapter {
    async getBalance(address) {
        console.log(`[Zcash] Fetching shielded balance for ${address}`);
        return "10.0 ZEC";
    }
    async sendTransaction(to, amount, data) {
        console.log(`[Zcash] Sending shielded tx ${amount} to ${to}`);
        return "zec_shielded_tx_hash_mock";
    }
}
exports.ZcashAdapter = ZcashAdapter;
