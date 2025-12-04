# ShadowMesh

**Trade and transfer across chains in complete privacy.**

ShadowMesh is a **privacy-first, multi-chain bridge and orchestration platform** that allows users to securely manage, transfer, and utilize assets across multiple blockchain networks without compromising their privacy. Powered by an **AI agent**, ShadowMesh intelligently orchestrates transactions and asset management while keeping sensitive data shielded.

---

## **Problem It Solves**

* Users face difficulty managing assets across multiple chains while maintaining privacy.
* Cross-chain interactions often expose transaction data, wallet addresses, and sensitive financial activities.
* ShadowMesh provides a **single interface to connect multiple wallets, execute cross-chain transactions, and manage assets privately**, eliminating the need for multiple tools while ensuring complete privacy.

---

## **Key Features**

### **1. Multi-Wallet Connection & Management**

* Connect multiple wallets across different chains in one interface.
* Session persistence: disconnecting all wallets logs out the user; individual wallet disconnect keeps remaining connections active.

### **2. Cross-Chain Privacy Bridge**

* Transfer assets between supported chains (Zcash, Starknet, Mina, Solana, Aztec, etc.) with shielded transactions.
* AI agent orchestrates actions like swaps, lending, and DeFi primitives privately.

### **3. AI Agent Orchestration**

* Users can issue natural language commands to the agent for executing complex multi-chain operations.
* Handles privacy-preserving routing, transaction bundling, and shielded asset transfers.

### **4. Privacy-First Dashboard**

* Cross-chain portfolio view: users can see their total assets without revealing sensitive details.
* Analytics and reporting are client-side, shielded, and privacy-preserving.

### **5. Landing Page & UX**

* Landing page acts as the entry point for new users.
* Wallet connect = login; disconnect all wallets = logout.
* Minimal, glassmorphic dark mode design for a relaxing and professional user experience.

---

## **Technologies Used**

* **Frontend:** React, TailwindCSS, Glassmorphism-based UI
* **Blockchain & Cross-Chain:** Zcash, Starknet, Mina, Solana, Aztec, NEAR, Axelar, Arcium, Fhenix
* **AI Orchestration:** Agent-driven transaction handling, privacy-preserving computation
* **Wallet Integration:** Multi-wallet support, session management, shielded transactions
* **Smart Contracts & SDKs:** NEAR Intents SDK, Noir contracts, Zashi Wallet SDK, Mina zkApps

---

## **Challenges Encountered**

* Building a **large, complex privacy-first multi-chain solution** in a hackathon timeframe.
* Integrating frontend with multiple chains and wallets, debugging **cross-chain orchestration logic**.
* Technical interruptions (laptop dying, power outage) led to last-minute adjustments.
* Managed to overcome setbacks by reaching out to hackathon coordinators for extended time, prioritizing MVP functionality, and focusing on stable cross-chain operations.

---

## **Demo / Screenshots**

> <img width="1365" height="584" alt="Screenshot 2025-12-04 194943" src="https://github.com/user-attachments/assets/58b20a04-a1ed-4c81-8270-7e6a55f5c26d" />
<img width="1363" height="628" alt="Screenshot 2025-12-04 214437" src="https://github.com/user-attachments/assets/04857052-e941-4072-94d6-4a8140e0f8de" />
<img width="1351" height="620" alt="Screenshot 2025-12-04 214710" src="https://github.com/user-attachments/assets/18053df6-5a96-46ca-bf46-79f0a388e674" />


---

## **How to Use**

1. **Landing Page:** View overview of ShadowMesh and connect your wallets.
2. **Wallet Connect:** Login by connecting one or multiple wallets.
3. **Dashboard:**

   * Manage your wallets, view cross-chain portfolio, and see shielded balances.
   * Interact with the AI agent for multi-chain operations.
4. **Disconnect Wallets:**

   * Disconnect individual wallets or all wallets to end session and return to landing page.

---

## **Supported Hackathon Tracks**

ShadowMesh aligns with multiple tracks and bounties:

* **NEAR:** Cross-Chain Privacy Solutions & Privacy-Preserving AI
* **Starknet:** Self-Custody & Wallet Innovation, Cross-chain Messaging
* **Mina:** Cross-Chain Privacy Solutions
* **Axelar:** Cross-Chain Privacy & AI
* **Aztec Labs:** Cross-Chain Track & Wallet Innovation
* **Fhenix:** Private DeFi / Analytics / Infrastructure
* **Miden / Pump Fun / Helius:** Cross-Chain Privacy Solutions
* **Gemini / Zcash Community Grants:** Zcash Data & Analytics
* **Nillion:** Privacy-Preserving AI & Computation

Each of these is supported by ShadowMesh’s **multi-wallet management, AI agent orchestration, privacy-first data flow, and cross-chain bridging capabilities.**

---

## **Installation / Setup**

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/shadowmesh.git
   cd shadowmesh
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm start
   ```
4. Open in browser: `http://localhost:3000`

> **Note:** Multi-chain operations require testnet credentials for each supported chain.

---

## **Future Work / Roadmap**

* Integrate fully functional **cross-chain private DeFi primitives**.
* Support more chains, wallets, and **private AI-powered automation**.
* Expand analytics and reporting while maintaining privacy-first principles.
* Introduce **FHE-based computation** for advanced private operations.

---

## **Contributor**

* **Lydia Solomon** – Builder
 
 # ShadowMesh

## Getting Started

### Backend
1. Navigate to `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies (if not already):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   Server runs on http://localhost:3002

### Frontend
1. Navigate to `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   App runs on http://localhost:3000

## Integration
The frontend is configured to communicate with the backend at `http://localhost:3002`.
Ensure the backend is running before using the AI Agent features in the frontend.


