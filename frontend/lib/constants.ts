import { Globe, Lock, Zap, Eye } from "lucide-react"

export const QUICK_ACTIONS = [
  { label: "Bridge ETH → SOL", command: "Bridge 0.5 ETH to Solana via Axelar" },
  { label: "Private Transfer", command: "Transfer 10 SOL privately using Zcash shielded pool" },
  { label: "Portfolio", command: "Show my portfolio balance across all chains" },
  { label: "Help", command: "What can you do?" },
]

export const FEATURES = [
  {
    icon: Globe,
    title: "Cross-Chain Bridging",
    description:
      "Seamlessly move assets across Ethereum, Solana, Cardano, Bitcoin, and Zcash with unified orchestration.",
    tools: ["Axelar", "Wormhole", "LayerZero"],
  },
  {
    icon: Lock,
    title: "Privacy-First Execution",
    description: "Every transaction can be shielded using cutting-edge cryptographic protocols.",
    tools: ["Zcash", "FHE", "Arcium", "Fhenix"],
  },
  {
    icon: Zap,
    title: "AI-Powered Agent",
    description: "Natural language commands to execute complex multi-chain operations securely.",
    tools: ["NEAR AI Agent"],
  },
  {
    icon: Eye,
    title: "Zero-Knowledge Proofs",
    description: "Verify transactions without revealing sensitive data using zk-proof technology.",
    tools: ["Mina zk-proofs"],
  },
]
