import { io } from 'socket.io-client';
import axios from 'axios';

const API_URL = 'http://localhost:3002/api';
const SOCKET_URL = 'http://localhost:3002';

async function runRealTimeTest() {
    console.log('--- Starting Real-Time Backend Test ---');

    // 1. Connect WebSocket
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
        console.log('[Test] WebSocket Connected:', socket.id);
    });

    socket.on('agent:progress', (data) => {
        console.log('[Test] Agent Progress:', data);
    });

    socket.on('agent:step', (data) => {
        console.log('[Test] Agent Step:', data);
    });

    let successCount = 0;
    socket.on('agent:success', (data) => {
        console.log('[Test] Agent Success:', data.message);
        successCount++;
        // We expect 4 successful actions now (Connect, Command 1, Command 2, Command 3) -> actually Connect calls don't emit 'agent:success' via socket, only agent commands do.
        // But we will have 3 agent commands.
        if (successCount >= 7) {
            console.log('[Test] All commands completed. Disconnecting.');
            socket.disconnect();
            process.exit(0);
        }
    });

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Connect Wallets (Simulating Frontend)
    try {
        console.log('\n[Test] Connecting Ethereum Wallet...');
        await axios.post(`${API_URL}/wallet/connect`, {
            chainId: 'Ethereum',
            address: '0xTestEthereumAddress',
            providerType: 'metamask'
        });

        console.log('[Test] Connecting Sui Wallet...');
        await axios.post(`${API_URL}/wallet/connect`, {
            chainId: 'Sui',
            address: '0xTestSuiAddress',
            providerType: 'sui'
        });
        console.log('[Test] Sui Wallet Connected Successfully');

    } catch (error: any) {
        console.error('[Test] Wallet Connection Failed:', error.message);
        process.exit(1);
    }

    // 3. Trigger Agent Commands
    try {
        console.log('\n[Test] Sending Command 1 (Transfer)...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Transfer 100 USDC from Ethereum to Solana via Axelar private'
        });

        // 4. Trigger Sui Transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('\n[Test] Sending Command 2 (Sui Transfer)...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Transfer 50 SUI from Sui to Ethereum'
        });

        // 5. Trigger Solana Transaction
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('\n[Test] Sending Command 3 (Solana Transfer)...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Transfer 2 SOL from Solana to Ethereum'
        });

        // 6. External Transfer (User Request: "to other accounts")
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('\n[Test] Sending Command 4 (External Transfer)...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Transfer 50 USDC from Ethereum to 0x1234567890123456789012345678901234567890 on Avalanche'
        });

        // 7. Bitcoin Check (Zcash already tested)
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('\n[Test] Sending Command 5 (Bitcoin Balance)...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Check my Bitcoin balance'
        });

        // 4. Trigger Zcash Check
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('\n[Test] Sending Command 2 (Zcash Balance)...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Check my Zcash balance'
        });


        // 5. Trigger LayerZero Check
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('\n[Test] Sending Command 3 (LayerZero Bridge)...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Bridge 50 USDC from Ethereum to Optiminism via LayerZero'
        });

    } catch (error: any) {
        console.error('[Test] Command Failed:', error.message);
    }
}

runRealTimeTest();
