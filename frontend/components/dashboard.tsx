"use client"

import { useShadowMeshStore } from "@/lib/store"
import { AIChat } from "./ai-chat"
import { WalletOverview } from "./wallet-overview"

export function Dashboard() {
  const { wallets } = useShadowMeshStore()

  return (
    <div className="min-h-screen mesh-bg pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* AI Chat - takes up more space */}
          <div className="lg:col-span-3">
            <AIChat />
          </div>
          {/* Wallet Overview - sidebar style */}
          <div className="lg:col-span-2">
            <WalletOverview />
          </div>
        </div>
      </div>
    </div>
  )
}
