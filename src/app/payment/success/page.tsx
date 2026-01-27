"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/Button"
import { CheckCircle2, Zap, ArrowRight, ShieldCheck, Loader2, XCircle } from "lucide-react"
import Link from "next/link"

function PaymentSuccessContent() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const confirmPayment = async () => {
            const paymentKey = searchParams.get("paymentKey")
            const orderId = searchParams.get("orderId")
            const amount = searchParams.get("amount")

            if (!paymentKey || !orderId || !amount) {
                // 파라미터가 없으면 직접 접근이나 이전 가짜 성공 버전으로 간주
                setLoading(false)
                return
            }

            try {
                const response = await fetch("/api/payment/confirm", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        paymentKey,
                        orderId,
                        amount: Number(amount),
                    }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || "결제 승인 중 오류가 발생했습니다.")
                }

                setLoading(false)
            } catch (err: any) {
                console.error("Payment confirmation failed:", err)
                setError(err.message)
                setLoading(false)
            }
        }

        confirmPayment()
    }, [searchParams])

    if (loading) {
        return (
            <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
                <Loader2 size={64} className="text-accent animate-spin" />
                <h1 className="text-2xl font-black uppercase tracking-widest italic animate-pulse">Verifying Payment...</h1>
                <p className="text-foreground/60 font-bold">토스페이먼츠로부터 결제 승인을 확인하고 있습니다.</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
                <div className="w-32 h-32 rounded-full bg-red-500/10 border-4 border-red-500 flex items-center justify-center text-red-500">
                    <XCircle size={64} />
                </div>
                <div className="space-y-4 max-w-md">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic text-red-500">Payment Failed.</h1>
                    <p className="text-lg font-medium text-foreground/70 leading-relaxed">
                        {error}
                    </p>
                </div>
                <Link href="/checkout">
                    <Button variant="outline" size="xl" className="border-2 font-black uppercase italic tracking-tighter">
                        Back to Checkout
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 text-center space-y-12">
            <div className="relative">
                <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full animate-pulse" />
                <div className="relative w-32 h-32 rounded-full border-4 border-accent flex items-center justify-center text-accent bg-background">
                    <CheckCircle2 size={64} />
                </div>
            </div>

            <div className="space-y-4 max-w-xl">
                <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-accent">Payment Verified</p>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">Welcome <br />ABOARD.</h1>
                </div>
                <p className="text-lg md:text-xl font-medium text-foreground/70 leading-relaxed">
                    결제가 완료되었습니다! 이제 당신의 모든 마감은 <span className="text-white font-bold underline">마감 요정</span>이 책임집니다. 실패는 선택지에 없습니다.
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center w-full max-w-md">
                <Link href="/dashboard" className="w-full">
                    <Button size="xl" className="w-full group">
                        입장하기
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-12 border-t-2 border-border w-full max-w-xl">
                <div className="text-left space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Status</p>
                    <div className="flex items-center gap-2 font-black uppercase text-accent">
                        <ShieldCheck size={16} /> Active Member
                    </div>
                </div>
                <div className="text-left space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Subscription</p>
                    <div className="flex items-center gap-2 font-black uppercase">
                        <Zap size={16} className="text-accent" /> Monthly Pass
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 text-center space-y-6">
                <Loader2 size={64} className="text-accent animate-spin" />
                <p className="text-foreground/60">페이지 로딩 중...</p>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    )
}
