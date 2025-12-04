import React from "react"
import { Bot } from "lucide-react"

export function TypingIndicator() {
    return (
        <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
            </div>
            <div className="rounded-xl px-4 py-3 border bg-primary/10 border-primary/20">
                <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
            </div>
        </div>
    )
}
