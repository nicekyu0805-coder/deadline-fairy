"use client"

import { useState, useEffect } from "react"
import { Shield, Zap, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const FEED_ITEMS = [
    { type: 'success', name: '이**', text: '오늘의 목표 달성! 예치금 반환 확정 🧚' },
    { type: 'fail', name: '박**', text: '마감 1분 초과... 예치금 소멸 집행 💀' },
    { type: 'start', name: '김**', text: '무자비 모드 도전 시작! 감시 개시 👁️' },
    { type: 'success', name: '최**', text: '연속 15일 성공! 명예의 전당 입성 임박 🏆' },
    { type: 'critical', name: '정**', text: '마감 10분 전! 마지막 경고가 발송됨 🚨' },
]

export function LiveTicker() {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false)
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % FEED_ITEMS.length)
                setIsVisible(true)
            }, 500)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const item = FEED_ITEMS[currentIndex]

    return (
        <div className="h-10 bg-black/80 border-b border-border flex items-center px-4 overflow-hidden relative z-50">
            <div className="flex items-center gap-2 mr-4 shrink-0">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Live Feed</span>
            </div>

            <div className={cn(
                "flex items-center gap-3 transition-all duration-500 transform",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}>
                {item.type === 'success' && <Zap size={14} className="text-accent" />}
                {item.type === 'fail' && <AlertCircle size={14} className="text-red-500" />}
                {item.type === 'start' && <Shield size={14} className="text-blue-400" />}
                {item.type === 'critical' && <AlertCircle size={14} className="text-yellow-500" />}

                <p className="text-[11px] font-bold tracking-tight">
                    <span className="text-foreground/60 mr-2">[{item.name}]</span>
                    {item.text}
                </p>
            </div>

            <div className="ml-auto pointer-events-none hidden md:block">
                <span className="text-[9px] font-black italic text-accent/30 tracking-tighter uppercase">
                    Deadline Fairy Oversight System v2.0
                </span>
            </div>
        </div>
    )
}
