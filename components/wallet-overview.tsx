"use client"

import type React from "react"

import { useShadowMeshStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MetaMaskIcon,
  PhantomIcon,
  NamiIcon,
  ElectrumIcon,
  ZcashIcon,
  EthereumIcon,
  SolanaIcon,
  CardanoIcon,
  BitcoinIcon,
  ZcashChainIcon,
} from "./wallet-icons"
import { TrendingUp, Shield, Wallet } from "lucide-react"

const WALLET_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  metamask: MetaMaskIcon,
  phantom: PhantomIcon,
  nami: NamiIcon,
  electrum: ElectrumIcon,
  zcash: ZcashIcon,
}

const CHAIN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  ethereum: EthereumIcon,
  solana: SolanaIcon,
  cardano: CardanoIcon,
  bitcoin: BitcoinIcon,
  zcash: ZcashChainIcon,
}

const TOKEN_PRICES: Record<string, number> = {
  ETH: 2350,
  SOL: 145,
  ADA: 0.45,
  BTC: 67500,
  ZEC: 28,
}

export function WalletOverview() {
  const { wallets, setWalletModalOpen } = useShadowMeshStore()

  const totalUSD = wallets.reduce((acc, w) => {
    return acc + w.balance * (TOKEN_PRICES[w.symbol] || 0)
  }, 0)

  return (
    <Card className="glass border-glass-border bg-card/80">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Portfolio Overview
          </CardTitle>
          <button
            onClick={() => setWalletModalOpen(true)}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            + Add Wallet
          </button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Value */}
        <div className="mb-6 p-4 rounded-xl bg-secondary/30 border border-border/30">
          <div className="text-sm text-muted-foreground mb-1">Total Portfolio Value</div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="flex items-center text-sm text-success">
              <TrendingUp className="h-4 w-4 mr-1" />
              +2.4%
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Privacy-enabled across {wallets.length} chains</span>
          </div>
        </div>

        {/* Wallet List */}
        <div className="space-y-3">
          {wallets.map((wallet) => {
            const WalletIcon = WALLET_ICONS[wallet.type]
            const ChainIcon = CHAIN_ICONS[wallet.chain]
            const usdValue = wallet.balance * (TOKEN_PRICES[wallet.symbol] || 0)

            return (
              <div
                key={wallet.id}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/20 border border-border/20 hover:border-primary/30 transition-all"
              >
                <div className="relative">
                  <WalletIcon className="h-10 w-10" />
                  {ChainIcon && (
                    <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-card border border-border flex items-center justify-center">
                      <ChainIcon className="h-3 w-3" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{wallet.name}</span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-primary/10 text-primary capitalize">
                      {wallet.chain}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {wallet.address.slice(0, 12)}...{wallet.address.slice(-8)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-foreground">
                    {wallet.balance.toLocaleString(undefined, { maximumFractionDigits: 4 })} {wallet.symbol}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {wallets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No wallets connected</p>
            <button onClick={() => setWalletModalOpen(true)} className="text-primary mt-2 hover:underline">
              Connect your first wallet
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
