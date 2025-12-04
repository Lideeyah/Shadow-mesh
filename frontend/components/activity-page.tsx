"use client"

import { TransactionHistory } from "./transaction-history"
import { BridgeVisualization } from "./bridge-visualization"

export function ActivityPage() {
  return (
    <div className="min-h-screen mesh-bg pt-20 pb-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Activity</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor your bridge operations and transaction history</p>
        </div>

        {/* Bridge Visualization - Full width at top */}
        <div className="mb-6">
          <BridgeVisualization />
        </div>

        {/* Transaction History - Full width below */}
        <TransactionHistory />
      </div>
    </div>
  )
}
