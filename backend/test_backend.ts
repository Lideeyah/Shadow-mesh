import axios from 'axios';

const API_URL = 'http://localhost:3002/api';

async function runTest() {
    try {
        console.log('1. Connecting Wallet...');
        const connectRes = await axios.post(`${API_URL}/wallet/connect`, {
            chainId: 'Solana',
            address: 'SolanaWallet123',
            providerType: 'phantom'
        });
        console.log('Connected:', connectRes.data);

        console.log('\n2. Sending Agent Command...');
        const commandRes = await axios.post(`${API_URL}/agent/command`, {
            command: 'Transfer 100 USDC from Ethereum to Solana via Axelar private'
        });
        console.log('Agent Response:', JSON.stringify(commandRes.data, null, 2));

    } catch (error: any) {
        console.error('Test Failed:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
    }
}

// Wait for server to start then run
setTimeout(runTest, 2000);
