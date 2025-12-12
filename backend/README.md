# ShadowMesh Backend

The intelligent orchestration backend for the ShadowMesh multi-chain wallet agent.

## Features
- **AI Agent**: Parses natural language commands (Transfer, Balance check, Bridge).
- **Multi-Chain**: supports Ethereum, Solana, Sui, Bitcoin, and Zcash.
- **Orchestration**: Routes transfers via Axelar, Wormhole, and LayerZero.
- **Privacy**: Fhenix-powered confidential computing layer.
- **Real-Time**: Fully event-driven via WebSockets (`socket.io`).

## Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation
```bash
npm install
```

### Running Locally
```bash
npm run dev
```
The server will start on `http://localhost:3002`.

## Testing (Verify System Health)

We interpret "System Health" as the ability to execute real-time cross-chain commands. Run the included test suite to verify:

```bash
npx ts-node test_realtime.ts
```

This script will:
1.  Connect via WebSocket.
2.  Initialize Wallet Sessions for EVM and Sui.
3.  Execute a **Transfer** (EVM -> Solana).
4.  Execute a **Sui Transfer** (Sui -> EVM).
5.  Execute a **Solana Transfer** (Solana -> EVM).
6.  Execute an **External Transfer** (to a specific `0x...` address).
7.  Check **Bitcoin Balance** (Real-Time API).
8.  Check **Zcash Balance** (Real-Time API).

## Deployment

See [deploy_guide.md](deploy_guide.md) for instructions on deploying to **Koyeb** (Free), **Oracle Cloud** (Free), or **Ngrok** (Local Demo).
