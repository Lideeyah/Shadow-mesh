const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export const api = {
    agent: {
        command: async (command: string) => {
            const res = await fetch(`${API_URL}/agent/command`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command }),
            });
            if (!res.ok) throw new Error('Agent command failed');
            return res.json();
        },
    },
    wallet: {
        connect: async (chainId: string, address: string, providerType: string) => {
            const res = await fetch(`${API_URL}/wallet/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chainId, address, providerType }),
            });
            if (!res.ok) throw new Error('Wallet connection failed');
            return res.json();
        },
        disconnect: async (chainId: string, address: string) => {
            const res = await fetch(`${API_URL}/wallet/disconnect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chainId, address }),
            });
            return res.json();
        }
    }
};
