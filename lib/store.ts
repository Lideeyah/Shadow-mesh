import { create } from "zustand"

// Wallet types
export type WalletType = "metamask" | "phantom" | "nami" | "electrum" | "zcash"
export type ChainType = "ethereum" | "solana" | "cardano" | "bitcoin" | "zcash"

export interface Wallet {
  id: string
  type: WalletType
  name: string
  address: string
  chain: ChainType
  balance: number
  symbol: string
  connected: boolean
  icon: string
}

// Transaction types
export type TransactionStatus =
  | "pending"
  | "confirming"
  | "bridging"
  | "shielding"
  | "generating_proof"
  | "finalizing"
  | "completed"
  | "failed"

export type BridgeProtocol = "axelar" | "wormhole" | "layerzero"
export type PrivacyProtocol = "zcash" | "fhe" | "arcium" | "fhenix" | "mina"

export interface Transaction {
  id: string
  type: "transfer" | "bridge" | "swap" | "shield"
  status: TransactionStatus
  sourceChain: ChainType
  targetChain?: ChainType
  amount: number
  symbol: string
  bridgeProtocol?: BridgeProtocol
  privacyProtocol?: PrivacyProtocol
  timestamp: Date
  hash?: string
  zkProof?: boolean
  steps?: string[]
  currentStep?: number
}

// AI Agent types
export interface AgentMessage {
  id: string
  role: "user" | "agent" | "system"
  content: string
  timestamp: Date
  action?: AgentAction
  status?: "typing" | "processing" | "complete" | "error"
}

export interface AgentAction {
  type: "bridge" | "transfer" | "swap" | "shield" | "connect"
  protocol?: BridgeProtocol | PrivacyProtocol
  details?: Record<string, unknown>
  amount?: number
  symbol?: string
  targetChain?: ChainType
}

// Store interface
interface ShadowMeshState {
  // Wallets
  wallets: Wallet[]
  connectingWallet: WalletType | null

  // Transactions
  transactions: Transaction[]
  pendingTransaction: Transaction | null

  // AI Agent
  messages: AgentMessage[]
  isAgentTyping: boolean

  // UI State
  isWalletModalOpen: boolean
  currentView: "landing" | "dashboard" | "activity"

  // Actions
  connectWallet: (type: WalletType) => Promise<void>
  disconnectWallet: (id: string) => void
  disconnectAllWallets: () => void

  addTransaction: (tx: Omit<Transaction, "id" | "timestamp">) => void
  updateTransactionStatus: (id: string, status: TransactionStatus) => void

  sendMessage: (content: string) => void

  setWalletModalOpen: (open: boolean) => void
  setCurrentView: (view: "landing" | "dashboard" | "activity") => void
}

// Mock wallet data
const WALLET_CONFIGS: Record<WalletType, Omit<Wallet, "id" | "connected">> = {
  metamask: {
    type: "metamask",
    name: "MetaMask",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f5ED1a",
    chain: "ethereum",
    balance: 2.45,
    symbol: "ETH",
    icon: "🦊",
  },
  phantom: {
    type: "phantom",
    name: "Phantom",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    chain: "solana",
    balance: 45.8,
    symbol: "SOL",
    icon: "👻",
  },
  nami: {
    type: "nami",
    name: "Nami",
    address: "addr1qy8ac7qqy0vtulyl7wntmsxc6wex80gvcyjy33qffrhm7sh927ysx5sftuw0dlft05dz3c7revpf7jx0xnlcjz3g69mq4afdhv",
    chain: "cardano",
    balance: 1250,
    symbol: "ADA",
    icon: "🔮",
  },
  electrum: {
    type: "electrum",
    name: "Electrum",
    address: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    chain: "bitcoin",
    balance: 0.085,
    symbol: "BTC",
    icon: "⚡",
  },
  zcash: {
    type: "zcash",
    name: "Zcash Shielded",
    address: "zs1z7rejlpsa98s2rrrfkwmaxu53e4ue0ulcrw0h4x5g8jl04tak0d3mm47vdtahatqrlkngh9sly",
    chain: "zcash",
    balance: 15.3,
    symbol: "ZEC",
    icon: "🛡️",
  },
}

// Helper to parse amount from string
const parseAmount = (text: string): number | undefined => {
  const match = text.match(/(\d+(\.\d+)?)/)
  return match ? Number.parseFloat(match[0]) : undefined
}

// AI Agent responses
const processAgentCommand = (content: string, wallets: Wallet[]): { response: string; action?: AgentAction } => {
  const lowerContent = content.toLowerCase()

  // Check if any wallet is connected
  if (wallets.length === 0 && !lowerContent.includes("help")) {
    return {
      response: "⚠️ No wallets connected. Please connect a wallet to perform operations.",
      action: { type: "connect" },
    }
  }

  if (lowerContent.includes("transfer") || lowerContent.includes("send")) {
    const amount = parseAmount(content) || 1
    const isEth = lowerContent.includes("eth") || lowerContent.includes("ethereum")
    const isSol = lowerContent.includes("sol") || lowerContent.includes("solana")
    const isBtc = lowerContent.includes("btc") || lowerContent.includes("bitcoin")

    // Determine source wallet
    let sourceWallet = wallets[0]
    if (isEth) sourceWallet = wallets.find((w) => w.chain === "ethereum") || wallets[0]
    else if (isSol) sourceWallet = wallets.find((w) => w.chain === "solana") || wallets[0]
    else if (isBtc) sourceWallet = wallets.find((w) => w.chain === "bitcoin") || wallets[0]

    if (!sourceWallet) {
      return {
        response: `❌ I couldn't find a connected wallet for the requested chain. Please connect your ${isEth ? "Ethereum" : isSol ? "Solana" : "Bitcoin"} wallet.`,
        action: undefined,
      }
    }

    if (sourceWallet.balance < amount) {
      return {
        response: `⚠️ Insufficient funds. You have ${sourceWallet.balance} ${sourceWallet.symbol} but are trying to send ${amount} ${sourceWallet.symbol}.`,
        action: undefined,
      }
    }

    if (lowerContent.includes("private") || lowerContent.includes("shield")) {
      return {
        response: `🛡️ Initiating shielded transfer of ${amount} ${sourceWallet.symbol}. Generating zk-SNARK proof for confidential execution via Fhenix FHE layer...`,
        action: {
          type: "shield",
          protocol: "fhenix",
          amount,
          symbol: sourceWallet.symbol,
        },
      }
    }

    if (
      (lowerContent.includes("eth") && lowerContent.includes("sol")) ||
      (lowerContent.includes("ethereum") && lowerContent.includes("solana"))
    ) {
      return {
        response: `🌉 Cross-chain transfer detected. Bridging ${amount} ETH to Solana. Routing through Axelar GMP for optimal security. Estimated gas: 0.002 ETH.`,
        action: {
          type: "bridge",
          protocol: "axelar",
          amount,
          symbol: "ETH",
          targetChain: "solana",
        },
      }
    }

    return {
      response: `✅ Transfer command received. Sending ${amount} ${sourceWallet.symbol} on ${sourceWallet.chain}. Validating network status...`,
      action: {
        type: "transfer",
        amount,
        symbol: sourceWallet.symbol,
      },
    }
  }

  if (lowerContent.includes("bridge") || lowerContent.includes("cross-chain")) {
    const amount = parseAmount(content) || 0.5
    const protocol: BridgeProtocol = lowerContent.includes("wormhole")
      ? "wormhole"
      : lowerContent.includes("layerzero")
        ? "layerzero"
        : "axelar"

    return {
      response: `🌉 Initiating cross-chain bridge of ${amount} assets via ${protocol.charAt(0).toUpperCase() + protocol.slice(1)}. Scanning for optimal route across connected chains. Estimated time: 2-5 minutes...`,
      action: { type: "bridge", protocol, amount },
    }
  }

  if (lowerContent.includes("swap")) {
    return {
      response:
        "💱 Swap request acknowledged. Querying DEX aggregators for best rates. Privacy mode: checking if shielded swap is available via Arcium...",
      action: { type: "swap", protocol: "arcium" },
    }
  }

  if (lowerContent.includes("balance") || lowerContent.includes("portfolio")) {
    const totalUSD = wallets.reduce((acc, w) => {
      const prices: Record<string, number> = { ETH: 2350, SOL: 145, ADA: 0.45, BTC: 67500, ZEC: 28 }
      return acc + w.balance * (prices[w.symbol] || 0)
    }, 0)
    return {
      response: `📊 Portfolio Analysis:\n\nTotal Value: $${totalUSD.toLocaleString()}\nConnected Wallets: ${wallets.length}\nChains: ${[...new Set(wallets.map((w) => w.chain))].join(", ")}\n\nAll balances verified via decentralized oracles.`,
      action: undefined,
    }
  }

  if (lowerContent.includes("privacy") || lowerContent.includes("zk") || lowerContent.includes("proof")) {
    return {
      response:
        "🔐 Privacy analysis complete. Your connected wallets support:\n• Zcash shielded transactions\n• Mina zk-proof verification\n• Arcium confidential compute\n• Fhenix FHE encryption\n\nReady to execute private transactions on command.",
      action: undefined,
    }
  }

  if (lowerContent.includes("help") || lowerContent.includes("what can you do")) {
    return {
      response:
        '🤖 ShadowMesh AI Agent Capabilities:\n\n• Cross-chain bridges (Axelar, Wormhole, LayerZero)\n• Shielded transfers (Zcash, FHE, Arcium)\n• Portfolio analysis across all chains\n• zk-proof generation (Mina)\n• Confidential swaps\n\nTry: "Transfer 1 ETH to Solana privately"',
      action: undefined,
    }
  }

  return {
    response:
      '🤖 I understand you\'re looking to interact with your wallets. Could you be more specific? Try commands like:\n\n• "Transfer 1 ETH to Solana"\n• "Bridge assets via Wormhole"\n• "Show my portfolio balance"\n• "Execute private swap"',
    action: undefined,
  }
}

export const useShadowMeshStore = create<ShadowMeshState>((set, get) => ({
  // Initial state
  wallets: [],
  connectingWallet: null,
  transactions: [],
  pendingTransaction: null,
  messages: [
    {
      id: "1",
      role: "system",
      content: "🤖 ShadowMesh AI Agent initialized. Connect your wallets to begin private cross-chain operations.",
      timestamp: new Date(),
      status: "complete",
    },
  ],
  isAgentTyping: false,
  isWalletModalOpen: false,
  currentView: "landing",

  // Wallet actions
  connectWallet: async (type) => {
    set({ connectingWallet: type })

    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const config = WALLET_CONFIGS[type]
    const newWallet: Wallet = {
      ...config,
      id: `${type}-${Date.now()}`,
      connected: true,
    }

    set((state) => ({
      wallets: [...state.wallets, newWallet],
      connectingWallet: null,
      currentView: "dashboard",
      isWalletModalOpen: false,
      messages: [
        ...state.messages,
        {
          id: `msg-${Date.now()}`,
          role: "system",
          content: `✅ ${config.name} wallet connected successfully!\n\nAddress: ${config.address.slice(0, 10)}...${config.address.slice(-6)}\nBalance: ${config.balance} ${config.symbol}\nChain: ${config.chain.charAt(0).toUpperCase() + config.chain.slice(1)}`,
          timestamp: new Date(),
          status: "complete",
        },
      ],
    }))
  },

  disconnectWallet: (id) => {
    set((state) => {
      const newWallets = state.wallets.filter((w) => w.id !== id)
      const disconnectedWallet = state.wallets.find((w) => w.id === id)

      return {
        wallets: newWallets,
        currentView: newWallets.length === 0 ? "landing" : "dashboard",
        messages: disconnectedWallet
          ? [
            ...state.messages,
            {
              id: `msg-${Date.now()}`,
              role: "system",
              content: `🔌 ${disconnectedWallet.name} disconnected. Session data cleared.`,
              timestamp: new Date(),
              status: "complete",
            },
          ]
          : state.messages,
      }
    })
  },

  disconnectAllWallets: () => {
    set((state) => ({
      wallets: [],
      currentView: "landing",
      transactions: [],
      messages: [
        ...state.messages,
        {
          id: `msg-${Date.now()}`,
          role: "system",
          content: "🔌 All wallets disconnected. Zero-trace session cleared. Returning to landing...",
          timestamp: new Date(),
          status: "complete",
        },
      ],
    }))
  },

  // Transaction actions
  addTransaction: (tx) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      timestamp: new Date(),
      steps: ["Initiated", "Confirming", "Processing", "Finalizing"],
      currentStep: 0,
    }
    set((state) => ({
      transactions: [newTx, ...state.transactions],
      pendingTransaction: newTx,
    }))

    // Simulate realistic transaction progress based on type
    const isBridge = tx.type === "bridge"
    const isShield = tx.type === "shield"

    // Step 1: Confirming
    setTimeout(
      () => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === newTx.id ? { ...t, status: "confirming", currentStep: 1 } : t,
          ),
        }))
      },
      isBridge ? 2000 : 1000,
    )

    // Step 2: Processing (Bridging or Shielding)
    setTimeout(
      () => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === newTx.id
              ? {
                ...t,
                status: isShield ? "generating_proof" : isBridge ? "bridging" : "pending",
                currentStep: 2,
              }
              : t,
          ),
        }))
      },
      isBridge ? 5000 : 3000,
    )

    // Step 3: Finalizing
    setTimeout(
      () => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === newTx.id ? { ...t, status: "finalizing", currentStep: 3 } : t,
          ),
        }))
      },
      isBridge ? 10000 : 6000,
    )

    // Step 4: Completed
    setTimeout(
      () => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === newTx.id
              ? {
                ...t,
                status: "completed",
                hash: `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`,
                zkProof: isShield,
                currentStep: 4,
              }
              : t,
          ),
          pendingTransaction: null,
          // Update wallet balance
          wallets: state.wallets.map((w) => {
            if (w.symbol === tx.symbol) {
              return { ...w, balance: Math.max(0, w.balance - tx.amount) }
            }
            return w
          }),
        }))
      },
      isBridge ? 15000 : 8000,
    )
  },

  updateTransactionStatus: (id, status) => {
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, status } : t)),
    }))
  },

  // AI Agent actions
  sendMessage: (content) => {
    const { wallets, addTransaction } = get()

    // Add user message
    const userMessage: AgentMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
      status: "complete",
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isAgentTyping: true,
    }))

    // Process and respond
    setTimeout(() => {
      const { response, action } = processAgentCommand(content, wallets)

      const agentMessage: AgentMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "agent",
        content: response,
        timestamp: new Date(),
        action,
        status: "complete",
      }

      set((state) => ({
        messages: [...state.messages, agentMessage],
        isAgentTyping: false,
      }))

      // Handle actions
      if (action?.type === "connect") {
        set({ isWalletModalOpen: true })
      } else if (action?.type === "bridge" || action?.type === "transfer" || action?.type === "shield") {
        addTransaction({
          type: action.type === "shield" ? "shield" : action.type,
          status: "pending",
          sourceChain: wallets.find((w) => w.symbol === action.symbol)?.chain || "ethereum",
          targetChain: action.targetChain,
          amount: action.amount || 0.5,
          symbol: action.symbol || "ETH",
          bridgeProtocol: action.protocol as BridgeProtocol,
          privacyProtocol: action.type === "shield" ? (action.protocol as PrivacyProtocol) : undefined,
          zkProof: action.type === "shield",
        })
      }
    }, 1500)
  },

  // UI actions
  setWalletModalOpen: (open) => set({ isWalletModalOpen: open }),
  setCurrentView: (view) => set({ currentView: view }),
}))
