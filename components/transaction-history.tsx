"use client"

import type React from "react"

import { useShadowMeshStore, type Transaction } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  EthereumIcon,
  SolanaIcon,
  CardanoIcon,
  BitcoinIcon,
  ZcashChainIcon,
  AxelarIcon,
  WormholeIcon,
  LayerZeroIcon,
} from "./wallet-icons"
import { ArrowRight, CheckCircle2, Clock, XCircle, Shield, Lock, History, ExternalLink } from "lucide-react"
import Image from "next/image"

const STATUS_CONFIG: Record<Transaction["status"], { icon: React.ElementType; color: string; bgColor: string }> = {
  pending: { icon: Clock, color: "text-warning", bgColor: "bg-warning/10" },
  bridging: { icon: ArrowRight, color: "text-info", bgColor: "bg-info/10" },
  shielding: { icon: Lock, color: "text-primary", bgColor: "bg-primary/10" },
  completed: { icon: CheckCircle2, color: "text-success", bgColor: "bg-success/10" },
  failed: { icon: XCircle, color: "text-destructive", bgColor: "bg-destructive/10" },
}

const CHAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ethereum: EthereumIcon,
  solana: SolanaIcon,
  cardano: CardanoIcon,
  bitcoin: BitcoinIcon,
  zcash: ZcashChainIcon,
}

const PROTOCOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  axelar: AxelarIcon,
  wormhole: WormholeIcon,
  layerzero: LayerZeroIcon,
}

export function TransactionHistory() {
  const { transactions } = useShadowMeshStore()

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  return (
    <Card className="glass border-glass-border bg-card/80 flex flex-col">
      <CardHeader className="pb-2 border-b border-border/30">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          Transaction History
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4">
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx) => {
              const statusConfig = STATUS_CONFIG[tx.status]
              const StatusIcon = statusConfig.icon
              const SourceChainIcon = CHAIN_ICONS[tx.sourceChain]
              const TargetChainIcon = tx.targetChain ? CHAIN_ICONS[tx.targetChain] : null
              const ProtocolIcon = tx.bridgeProtocol ? PROTOCOL_ICONS[tx.bridgeProtocol] : null

              return (
                <div
                  key={tx.id}
                  className="p-4 rounded-xl bg-secondary/20 border border-border/20 hover:border-primary/20 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${statusConfig.bgColor}`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                      </div>
                      <div>
                        <div className="font-medium text-foreground capitalize">
                          {tx.type === "shield" ? "Shielded Transfer" : tx.type}
                        </div>
                        <div className="text-xs text-muted-foreground">{formatTime(tx.timestamp)}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${statusConfig.color} border-current/30 capitalize`}>
                      {tx.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50">
                        {SourceChainIcon && <SourceChainIcon className="h-4 w-4" />}
                        <span className="text-foreground capitalize">{tx.sourceChain}</span>
                      </div>
                      {tx.targetChain && (
                        <>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/50">
                            {TargetChainIcon && <TargetChainIcon className="h-4 w-4" />}
                            <span className="text-foreground capitalize">{tx.targetChain}</span>
                          </div>
                        </>
                      )}
                    </div>
                    <span className="font-semibold text-foreground">
                      {tx.amount} {tx.symbol}
                    </span>
                  </div>

                  {/* Badges with protocol icons */}
                  <div className="flex flex-wrap items-center gap-2">
                    {tx.bridgeProtocol && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-info/10 text-info text-xs">
                        {ProtocolIcon && <ProtocolIcon className="h-3.5 w-3.5" />}
                        {tx.bridgeProtocol}
                      </span>
                    )}
                    {tx.privacyProtocol && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary text-xs">
                        <Shield className="h-3 w-3" />
                        {tx.privacyProtocol}
                      </span>
                    )}
                    {tx.zkProof && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-success/10 text-success text-xs">
                        <Lock className="h-3 w-3" />
                        zk-proof
                      </span>
                    )}
                    {tx.hash && (
                      <button className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground text-xs hover:text-foreground transition-colors">
                        <ExternalLink className="h-3 w-3" />
                        {tx.hash}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-4">
              <Image
                src="/images/shadowmesh-logo-icon-removebg-preview.png"
                alt="ShadowMesh"
                width={40}
                height={40}
                className="opacity-30"
              />
            </div>
            <p className="text-sm">No transactions yet</p>
            <p className="text-xs mt-1">Use the AI Agent to start bridging</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
