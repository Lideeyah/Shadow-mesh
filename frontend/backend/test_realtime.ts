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

    socket.on('agent:success', (data) => {
        console.log('[Test] Agent Success:', data.message);
        socket.disconnect();
    });

    // Wait for connection
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 2. Trigger Agent Command
    try {
        console.log('\n[Test] Sending Command...');
        await axios.post(`${API_URL}/agent/command`, {
            command: 'Transfer 100 USDC from Ethereum to Solana via Axelar private'
        });
    } catch (error: any) {
        console.error('[Test] Command Failed:', error.message);
    }
}

runRealTimeTest();
