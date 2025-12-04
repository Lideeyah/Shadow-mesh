export interface WalletSession {
    chainId: string;
    address: string;
    providerType: 'metamask' | 'phantom' | 'keplr' | 'private_key';
    connectedAt: number;
}

export class WalletManager {
    private sessions: Map<string, WalletSession> = new Map();

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

    // Mock signing for now since we don't have a real frontend provider here
    async signTransaction(chainId: string, address: string, tx: any): Promise<string> {
        const session = this.sessions.get(`${chainId}:${address}`);
        if (!session) throw new Error('Wallet not connected');

        console.log(`[WalletManager] Signing tx on ${chainId} for ${address}`);
        return '0x_signed_payload_mock';
    }
}
