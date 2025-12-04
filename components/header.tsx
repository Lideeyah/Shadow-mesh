"use client"

import { useShadowMeshStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, LogOut, Wallet, LayoutDashboard, History } from "lucide-react"
import Image from "next/image"

export function Header() {
  const { wallets, currentView, setWalletModalOpen, disconnectWallet, disconnectAllWallets, setCurrentView } =
    useShadowMeshStore()

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const isInApp = currentView === "dashboard" || currentView === "activity"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <button
          onClick={() => (wallets.length === 0 ? setCurrentView("landing") : setCurrentView("dashboard"))}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="relative h-9 w-9">
            <Image
              src="/images/shadowmesh-logo-icon-removebg-preview.png"
              alt="ShadowMesh Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold text-foreground">ShadowMesh</span>
        </button>

        {/* Navigation / Wallet Info */}
        <div className="flex items-center gap-4">
          {isInApp && wallets.length > 0 && (
            <nav className="hidden sm:flex items-center gap-1 bg-secondary/30 rounded-lg p-1">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  currentView === "dashboard"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView("activity")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  currentView === "activity"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <History className="h-4 w-4" />
                Activity
              </button>
            </nav>
          )}

          {isInApp && wallets.length > 0 ? (
            <>
              {/* Connected wallets dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 border-border/50 bg-secondary/50">
                    <Wallet className="h-4 w-4" />
                    <span>
                      {wallets.length} Wallet{wallets.length > 1 ? "s" : ""}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-xl border-border/50">
                  <div className="sm:hidden">
                    <DropdownMenuItem onClick={() => setCurrentView("dashboard")} className="gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setCurrentView("activity")} className="gap-2">
                      <History className="h-4 w-4" />
                      Activity
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </div>
                  {wallets.map((wallet) => (
                    <DropdownMenuItem key={wallet.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{wallet.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">{truncateAddress(wallet.address)}</div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          disconnectWallet(wallet.id)
                        }}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setWalletModalOpen(true)} className="text-primary">
                    + Add Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={disconnectAllWallets} className="text-destructive">
                    Disconnect All
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              onClick={() => setWalletModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
