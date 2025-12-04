"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useShadowMeshStore, type WalletType } from "@/lib/store"
import { MetaMaskIcon, PhantomIcon, NamiIcon, ElectrumIcon, ZcashIcon } from "./wallet-icons"
import { Loader2 } from "lucide-react"

const WALLETS: { type: WalletType; name: string; chain: string; Icon: React.ComponentType<{ className?: string }> }[] =
  [
    { type: "metamask", name: "MetaMask", chain: "Ethereum", Icon: MetaMaskIcon },
    { type: "phantom", name: "Phantom", chain: "Solana", Icon: PhantomIcon },
    { type: "nami", name: "Nami", chain: "Cardano", Icon: NamiIcon },
    { type: "electrum", name: "Electrum", chain: "Bitcoin", Icon: ElectrumIcon },
    { type: "zcash", name: "Zcash Shielded", chain: "Zcash", Icon: ZcashIcon },
  ]

export function WalletModal() {
  const { isWalletModalOpen, setWalletModalOpen, connectWallet, connectingWallet, wallets } = useShadowMeshStore()

  const connectedTypes = wallets.map((w) => w.type)

  return (
    <Dialog open={isWalletModalOpen} onOpenChange={setWalletModalOpen}>
      <DialogContent className="glass border-glass-border bg-card/95 backdrop-blur-xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">Connect Wallet</DialogTitle>
          <p className="text-sm text-muted-foreground">Select a wallet to connect to ShadowMesh</p>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {WALLETS.map(({ type, name, chain, Icon }) => {
            const isConnected = connectedTypes.includes(type)
            const isConnecting = connectingWallet === type

            return (
              <button
                key={type}
                onClick={() => !isConnected && !isConnecting && connectWallet(type)}
                disabled={isConnected || isConnecting}
                className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200
                  ${
                    isConnected
                      ? "border-primary/50 bg-primary/10 cursor-not-allowed"
                      : isConnecting
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50 cursor-pointer"
                  }`}
              >
                <div className="relative">
                  <Icon className="h-10 w-10" />
                  {isConnected && (
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-success flex items-center justify-center">
                      <svg
                        className="h-2.5 w-2.5 text-background"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="font-medium text-foreground">{name}</div>
                  <div className="text-sm text-muted-foreground">{chain}</div>
                </div>

                {isConnecting ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                ) : isConnected ? (
                  <span className="text-xs font-medium text-primary">Connected</span>
                ) : (
                  <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    Connect →
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          By connecting, you agree to ShadowMesh&apos;s Terms of Service
        </p>
      </DialogContent>
    </Dialog>
  )
}
