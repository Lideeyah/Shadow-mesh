import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface ChatInputProps {
    onSend: (message: string) => void
    disabled: boolean
    placeholder: string
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
    const [input, setInput] = useState("")

    const handleSend = () => {
        if (!input.trim()) return
        onSend(input)
        setInput("")
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="p-4 border-t border-border/30">
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="flex-1 bg-secondary/30 border-border/30 focus:border-primary/50"
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || disabled}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
