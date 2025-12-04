import React from "react"
import type { AgentMessage } from "@/lib/store"
import { User, Bot, Sparkles, Shield, Zap } from "lucide-react"

interface ChatMessageProps {
    message: AgentMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
    const getRoleIcon = (role: string) => {
        switch (role) {
            case "user":
                return <User className="h-5 w-5" />
            case "agent":
                return <Bot className="h-5 w-5" />
            case "system":
                return <Sparkles className="h-5 w-5" />
            default:
                return <Bot className="h-5 w-5" />
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case "user":
                return "bg-secondary/50 border-border/30"
            case "agent":
                return "bg-primary/10 border-primary/20"
            case "system":
                return "bg-info/10 border-info/20"
            default:
                return "bg-secondary/50 border-border/30"
        }
    }

    return (
        <div className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0
        ${message.role === "user"
                        ? "bg-secondary/50"
                        : message.role === "agent"
                            ? "bg-primary/20 text-primary"
                            : "bg-info/20 text-info"
                    }`}
            >
                {getRoleIcon(message.role)}
            </div>
            <div className={`max-w-[80%] rounded-xl px-4 py-3 border ${getRoleColor(message.role)}`}>
                <p className="text-sm text-foreground whitespace-pre-wrap">{message.content}</p>
                {message.action && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/20">
                        {message.action.type === "shield" ? (
                            <Shield className="h-4 w-4 text-primary" />
                        ) : (
                            <Zap className="h-4 w-4 text-primary" />
                        )}
                        <span className="text-xs text-muted-foreground">
                            Action: {message.action.type} {message.action.protocol && `via ${message.action.protocol}`}
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}
