import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const Config = {
    PORT: process.env.PORT || 3002,
    EVM_PRIVATE_KEY: process.env.EVM_PRIVATE_KEY || process.env.PRIVATE_KEY, // Fallback for backward compatibility
    SOLANA_PRIVATE_KEY: process.env.SOLANA_PRIVATE_KEY,

    // RPC URLs
    ETH_RPC_URL: process.env.ETH_RPC_URL || 'https://eth.public-rpc.com',
    SOLANA_RPC_URL: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',

    // Persistence
    DATA_DIR: path.resolve(__dirname, '../../data'),
    SESSIONS_FILE: 'sessions.json'
};

// Simple validation
if (!Config.EVM_PRIVATE_KEY && !Config.SOLANA_PRIVATE_KEY) {
    console.warn("WARNING: No private keys found in environment variables. Agent will run in READ-ONLY mode.");
}
