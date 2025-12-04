"use client"

import { useEffect, useRef } from "react"
import { useShadowMeshStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { QUICK_ACTIONS } from "@/lib/constants"
import Image from "next/image"
import { ChatMessage } from "./chat/chat-message"
import { ChatInput } from "./chat/chat-input"
import { TypingIndicator } from "./chat/typing-indicator"

export function AIChat() {
  const { messages, sendMessage, isAgentTyping, wallets } = useShadowMeshStore()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isAgentTyping])

  return (
    <Card className="glass border-glass-border bg-card/80 flex flex-col h-[600px]">
      <CardHeader className="pb-2 border-b border-border/30">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden">
            <Image src="/images/shadowmesh-logo-icon-removebg-preview.png" alt="ShadowMesh" width={24} height={24} />
          </div>
          <div>
            <span>ShadowMesh AI Agent</span>
            <div className="text-xs text-muted-foreground font-normal flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              NEAR AI Execution • Online
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden flex flex-col p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}

          {isAgentTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {wallets.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.command)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-border/30"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          disabled={wallets.length === 0}
          placeholder={
            wallets.length > 0
              ? "Type a command... (e.g., 'Transfer 1 ETH privately')"
              : "Connect a wallet to start..."
          }
        />
      </CardContent>
    </Card>
  )
}
