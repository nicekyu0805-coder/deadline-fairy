"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Zap, Clock, ShieldAlert, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function UserDashboard() {
    const [goal, setGoal] = useState("")
    const [deadline, setDeadline] = useState("18:00")
    const [mode, setMode] = useState<'gentle' | 'ruthless'>('gentle')
    const [status, setStatus] = useState<'idle' | 'submitted' | 'failed' | 'verified'>('idle')
    const [loading, setLoading] = useState(false)
    const [subscriptionEndAt, setSubscriptionEndAt] = useState<string | null>(null) // 초기에는 null
    const [stats, setStats] = useState({
        continuousDays: 0,
        successCount: 0,
        totalRequired: 20
    })

    useEffect(() => {
        // 실제로는 여기서 Supabase 데이터를 불러와야 합니다.
        // 임시로 가입 후 30일 뒤를 종료일로 설정
        const thirtyDaysLater = new Date()
        thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30)
        setSubscriptionEndAt(thirtyDaysLater.toISOString().split('T')[0])
    }, [])

    const getDaysRemaining = (dateString: string | null) => {
        if (!dateString) return 30
        const end = new Date(dateString)
        const now = new Date()
        const diffTime = end.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const daysLeft = getDaysRemaining(subscriptionEndAt)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate Supabase submission
        setTimeout(() => {
            setStatus('submitted')
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="flex-1 bg-background p-6 md:p-12 space-y-12 max-w-5xl mx-auto w-full">
            {/* Header */}
            <header className="flex justify-between items-end border-b-2 border-border pb-8">
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">개인 전담 매니저</p>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">내 대시보드</h1>
                </div>
                <div className="flex items-end gap-6">
                    {daysLeft !== null && (
                        <div className={cn(
                            "text-right space-y-1 px-4 py-2 border-l-2",
                            daysLeft <= 3 ? "border-red-600 animate-pulse" : "border-border"
                        )}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">챌린지 종료까지</p>
                            <p className={cn("text-2xl font-black tabular-nums", daysLeft <= 3 ? "text-red-500" : "text-foreground")}>
                                D-{daysLeft}
                            </p>
                        </div>
                    )}
                    <div className="text-right space-y-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">연속 달성일</p>
                        <p className="text-2xl font-black text-accent">{stats.continuousDays}일</p>
                    </div>
                </div>
            </header>

            {/* Monthly Progress & Motivation */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 border-2 border-border p-6 bg-card/30 space-y-4">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-accent">이번 달 성적표</p>
                            <h3 className="text-xl font-black uppercase">Redemption Progress</h3>
                        </div>
                        <p className="text-sm font-black"><span className="text-accent text-2xl">{stats.successCount}</span> / {stats.totalRequired} 성공</p>
                    </div>
                    <div className="h-4 bg-border relative overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000"
                            style={{ width: `${(stats.successCount / stats.totalRequired) * 100}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-tight">
                        * 20회 달성 시 다음 달 30% 할인권 지급 | 현재 6회 남음
                    </p>
                </div>
                <div className="border-2 border-accent/20 p-6 bg-accent/5 flex flex-col justify-center relative group overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-accent/10 group-hover:scale-110 transition-transform">
                        <Zap size={80} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">오늘의 요정 한마디</p>
                    <p className="text-sm font-bold italic leading-relaxed relative z-10">
                        "어제의 실패는 시스템 오류일 뿐입니다. 오늘 다시 재부팅하세요. 마감 요정은 당신의 '오늘'을 다시 지켜보고 있습니다."
                    </p>
                </div>
            </div>

            {status === 'idle' ? (
                /* Goal Input Form */
                <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="space-y-6">
                        <label className="text-3xl md:text-5xl font-black uppercase tracking-tighter block italic">
                            오늘 <span className="text-accent underline">반드시</span> 끝내야 할 일은?
                        </label>
                        <Input
                            className="text-2xl md:text-4xl h-20 md:h-28 px-6 bg-card border-4 border-border focus:border-accent"
                            placeholder="예: 홈페이지 디자인 시안 완성"
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                <Clock size={16} /> 마감 시간
                            </label>
                            <Input
                                type="time"
                                className="h-16 text-2xl font-bold bg-card border-2"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                                <ShieldAlert size={16} /> 집착 모드
                            </label>
                            <div className="flex border-2 border-border h-16 bg-card overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setMode('gentle')}
                                    className={cn(
                                        "flex-1 font-bold uppercase tracking-widest text-sm transition-all",
                                        mode === 'gentle' ? "bg-accent text-accent-foreground" : "hover:bg-white/5"
                                    )}
                                >
                                    온건
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMode('ruthless')}
                                    className={cn(
                                        "flex-1 font-bold uppercase tracking-widest text-sm transition-all border-l-2 border-border",
                                        mode === 'ruthless' ? "bg-red-600 text-white" : "hover:bg-white/5"
                                    )}
                                >
                                    무자비
                                </button>
                            </div>
                        </div>
                    </div>

                    <Button size="xl" className="w-full" disabled={loading}>
                        {loading ? "목표 등록 중..." : "목표 확정하기"}
                    </Button>
                </form>
            ) : (
                /* Success State / Status Bar */
                <div className="space-y-24 animate-in zoom-in-95 duration-500">
                    <div className="relative group overflow-hidden border-2 border-accent bg-accent/5 p-12 text-center space-y-6">
                        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Scanner animation effect */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent/50 animate-bounce blur-sm" />

                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 text-accent mb-4">
                            <Zap size={40} className="animate-pulse" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-5xl font-black uppercase tracking-tighter">목표 고정됨.</h2>
                            <p className="text-foreground/60 font-bold uppercase tracking-widest text-sm">매니저가 당신의 진행 상황을 지켜보고 있습니다...</p>
                        </div>

                        <div className="max-w-xl mx-auto p-6 border-2 border-accent/20 bg-background text-2xl font-bold italic">
                            "{goal}"
                        </div>

                        <div className="flex justify-center gap-8 pt-8">
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">마감 시각</p>
                                <p className="text-xl font-black">{deadline}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">리스크 모드</p>
                                <p className={cn("text-xl font-black uppercase", mode === 'ruthless' ? "text-red-500" : "text-accent")}>
                                    {mode === 'ruthless' ? '무자비' : '온건'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="border-2 border-border p-8 space-y-4">
                            <h3 className="font-black uppercase tracking-tighter text-xl flex items-center gap-2">
                                <AlertCircle size={20} className="text-accent" /> 인증 방법은?
                            </h3>
                            <p className="text-foreground/60 text-sm leading-relaxed">
                                마감 시간 전까지 매니저가 연락을 드릴 예정입니다. 메시지에 답장으로 작업 결과를 증명할 수 있는 스크린샷이나 링크를 보내주세요.
                            </p>
                        </div>

                        <div className="border-2 border-border p-8 space-y-4 opacity-50">
                            <h3 className="font-black uppercase tracking-tighter text-xl flex items-center gap-2">
                                <CheckCircle2 size={20} /> 검증된 결과물
                            </h3>
                            <p className="text-foreground/60 text-sm italic">
                                검증된 증거가 아직 없습니다.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Psychological Pressure Ticker */}
            <div className="fixed bottom-0 left-0 w-full bg-accent text-accent-foreground py-2 overflow-hidden whitespace-nowrap border-t-2 border-black z-50">
                <div className="inline-block animate-marquee font-black uppercase tracking-[0.2em] text-xs">
                    매니저가 지켜보고 있습니다 • 마감을 사수하세요 • 목표를 달성하세요 • 실패 시 100% 환불 • 변명은 필요 없습니다 • 더 열심히 일하세요 • 시간이 얼마 남지 않았습니다 •
                    매니저가 지켜보고 있습니다 • 마감을 사수하세요 • 목표를 달성하세요 • 실패 시 100% 환불 • 변명은 필요 없습니다 • 더 열심히 일하세요 • 시간이 얼마 남지 않았습니다 •
                </div>
            </div>

            <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
        </div>
    )
}
