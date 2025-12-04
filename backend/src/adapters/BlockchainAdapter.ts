export interface BlockchainAdapter {
    getBalance(address: string): Promise<string>;
    sendTransaction(to: string, amount: string, data?: string): Promise<string>;
}

export class EthereumAdapter implements BlockchainAdapter {
    async getBalance(address: string): Promise<string> {
        // TODO: Implement using ethers.js
        return "0.0";
    }

    async sendTransaction(to: string, amount: string, data?: string): Promise<string> {
        // TODO: Implement transaction signing and sending
        return "0x_tx_hash_placeholder";
    }
}
