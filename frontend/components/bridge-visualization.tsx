"use client"

import type React from "react"

import { useShadowMeshStore, type Transaction } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AxelarIcon,
  WormholeIcon,
  LayerZeroIcon,
  EthereumIcon,
  SolanaIcon,
  CardanoIcon,
  BitcoinIcon,
  ZcashChainIcon,
} from "./wallet-icons"
import { ArrowRight, CheckCircle2, Loader2, Shield, Zap } from "lucide-react"
import Image from "next/image"

const PROTOCOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  axelar: AxelarIcon,
  wormhole: WormholeIcon,
  layerzero: LayerZeroIcon,
}

const CHAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ethereum: EthereumIcon,
  solana: SolanaIcon,
  cardano: CardanoIcon,
  bitcoin: BitcoinIcon,
  zcash: ZcashChainIcon,
}

export function BridgeVisualization() {
  const { pendingTransaction, transactions } = useShadowMeshStore()

  const activeTx =
    pendingTransaction ||
    transactions.find((tx) => tx.status === "pending" || tx.status === "bridging" || tx.status === "shielding")

  const getStatusInfo = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return { label: "Initializing...", color: "text-warning", progress: 20 }
      case "bridging":
        return { label: "Bridging assets...", color: "text-info", progress: 50 }
      case "shielding":
        return { label: "Applying zk-proof...", color: "text-primary", progress: 80 }
      case "completed":
        return { label: "Complete", color: "text-success", progress: 100 }
      case "failed":
        return { label: "Failed", color: "text-destructive", progress: 0 }
      default:
        return { label: "Unknown", color: "text-muted-foreground", progress: 0 }
    }
  }

  return (
    <Card className="glass border-glass-border bg-card/80">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Bridge Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeTx ? (
          <div className="space-y-4">
            {/* Bridge Animation */}
            <div className="relative p-6 rounded-xl bg-secondary/30 border border-border/30">
              <div className="flex items-center justify-between mb-6">
                {/* Source Chain */}
                <div className="text-center">
                  <div className="h-14 w-14 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-2 border border-border/50 p-2">
                    {CHAIN_ICONS[activeTx.sourceChain] ? (
                      (() => {
                        const ChainIcon = CHAIN_ICONS[activeTx.sourceChain]
                        return <ChainIcon className="h-8 w-8" />
                      })()
                    ) : (
                      <span className="text-xl font-bold text-foreground">{activeTx.sourceChain[0].toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">{activeTx.sourceChain}</span>
                </div>

                {/* Bridge Arrow with Animation */}
                <div className="flex-1 mx-6 relative">
                  <div className="h-0.5 bg-border/50 absolute top-1/2 left-0 right-0 transform -translate-y-1/2" />
                  <div
                    className="h-0.5 bg-primary absolute top-1/2 left-0 transform -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${getStatusInfo(activeTx.status).progress}%` }}
                  />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-full p-1">
                    {activeTx.bridgeProtocol && PROTOCOL_ICONS[activeTx.bridgeProtocol] ? (
                      (() => {
                        const ProtocolIcon = PROTOCOL_ICONS[activeTx.bridgeProtocol!]
                        return <ProtocolIcon className="h-8 w-8" />
                      })()
                    ) : (
                      <ArrowRight className="h-6 w-6 text-primary" />
                    )}
                  </div>
                </div>

                {/* Target Chain */}
                <div className="text-center">
                  <div className="h-14 w-14 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-2 border border-border/50 p-2">
                    {activeTx.targetChain && CHAIN_ICONS[activeTx.targetChain] ? (
                      (() => {
                        const ChainIcon = CHAIN_ICONS[activeTx.targetChain!]
                        return <ChainIcon className="h-8 w-8" />
                      })()
                    ) : (
                      <span className="text-xl font-bold text-foreground">
                        {activeTx.targetChain?.[0].toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground capitalize">{activeTx.targetChain || "Target"}</span>
                </div>
              </div>

              {/* Status */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {activeTx.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  <span className={`text-sm font-medium ${getStatusInfo(activeTx.status).color}`}>
                    {getStatusInfo(activeTx.status).label}
                  </span>
                </div>
                <div className="text-xl font-semibold text-foreground">
                  {activeTx.amount} {activeTx.symbol}
                </div>
              </div>
            </div>

            {/* Privacy Badge */}
            {(activeTx.zkProof || activeTx.privacyProtocol) && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-sm font-medium text-foreground">Privacy Layer Active</div>
                  <div className="text-xs text-muted-foreground">
                    {activeTx.privacyProtocol ? `via ${activeTx.privacyProtocol.toUpperCase()}` : "zk-proof applied"}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <div className="h-20 w-20 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-4">
              <Image
                src="/images/shadowmesh-logo-icon-removebg-preview.png"
                alt="ShadowMesh"
                width={48}
                height={48}
                className="opacity-30"
              />
            </div>
            <p className="text-sm">No active bridge operations</p>
            <p className="text-xs mt-1">Use the AI Agent to initiate transfers</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
