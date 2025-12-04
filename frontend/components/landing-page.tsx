"use client"

import { useShadowMeshStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
  MetaMaskIcon,
  PhantomIcon,
  NamiIcon,
  ElectrumIcon,
  ZcashIcon,
  AxelarIcon,
  WormholeIcon,
  LayerZeroIcon,
} from "./wallet-icons"
import { ArrowRight, Lock, Zap, Globe, Eye } from "lucide-react"
import Image from "next/image"

import { FEATURES } from "@/lib/constants"

export function LandingPage() {
  const { setWalletModalOpen } = useShadowMeshStore()

  return (
    <div className="min-h-screen mesh-bg">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Animated mesh lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full opacity-20" viewBox="0 0 1000 600">
            <defs>
              <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            {/* Grid lines */}
            {[...Array(20)].map((_, i) => (
              <line
                key={`h-${i}`}
                x1="0"
                y1={i * 30}
                x2="1000"
                y2={i * 30}
                stroke="url(#mesh-gradient)"
                strokeWidth="0.5"
              />
            ))}
            {[...Array(30)].map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 35}
                y1="0"
                x2={i * 35}
                y2="600"
                stroke="url(#mesh-gradient)"
                strokeWidth="0.5"
              />
            ))}
          </svg>
        </div>

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-glass-border mb-8">
            <Image src="/images/shadowmesh-logo-icon-removebg-preview.png" alt="ShadowMesh" width={18} height={18} />
            <span className="text-sm text-muted-foreground">Private Cross-Chain Infrastructure</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">ShadowMesh</span>
            <br />
            Private Cross-Chain Bridge
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-pretty">
            Connect your wallets. Move assets across chains securely and privately. Powered by AI orchestration and
            zero-knowledge cryptography.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => setWalletModalOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg px-8 py-6"
            >
              Connect Wallet
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/50 bg-secondary/30 hover:bg-secondary/50 text-lg px-8 py-6"
            >
              Learn More
            </Button>
          </div>

          {/* Supported wallets */}
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <span className="text-sm text-muted-foreground">Supported:</span>
            <div className="flex items-center gap-4">
              <MetaMaskIcon className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity" />
              <PhantomIcon className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity" />
              <NamiIcon className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity" />
              <ElectrumIcon className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity" />
              <ZcashIcon className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Privacy Meets Cross-Chain</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Enterprise-grade security with consumer-friendly experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="group glass border-glass-border rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.tools.map((tool) => (
                        <span key={tool} className="px-2 py-1 text-xs rounded-md bg-secondary/50 text-muted-foreground">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridge Protocols */}
      <section className="py-20 px-4 border-t border-border/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-xl font-semibold text-foreground mb-8">Powered By</h3>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AxelarIcon className="h-8 w-8" />
              <span>Axelar</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <WormholeIcon className="h-8 w-8" />
              <span>Wormhole</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <LayerZeroIcon className="h-8 w-8" />
              <span>LayerZero</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ZcashIcon className="h-6 w-6" />
              <span>Zcash</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
