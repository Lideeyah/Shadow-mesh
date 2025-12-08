"use client"

import { useEffect } from "react"
import { useShadowMeshStore } from "@/lib/store"
import { Header } from "@/components/header"
import { LandingPage } from "@/components/landing-page"
import { Dashboard } from "@/components/dashboard"
import { ActivityPage } from "@/components/activity-page"
import { WalletModal } from "@/components/wallet-modal"

export default function Home() {
  const { currentView, initializeAgentConnection } = useShadowMeshStore()

  useEffect(() => {
    initializeAgentConnection();
  }, [initializeAgentConnection]);


  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <LandingPage />
      case "dashboard":
        return <Dashboard />
      case "activity":
        return <ActivityPage />
      default:
        return <LandingPage />
    }
  }

  return (
    <main>
      <Header />
      {renderView()}
      <WalletModal />
    </main>
  )
}
