import { PaymentForm } from "@/components/PaymentForm"
import { ArrowLeft, Zap, Info } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/Button"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"

export default async function CheckoutPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return (
            <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Zap size={48} />
                </div>
                <div className="space-y-4 max-w-md">
                    <h1 className="text-4xl font-black uppercase tracking-tighter italic">Login Required.</h1>
                    <p className="text-lg font-medium text-foreground/70 leading-relaxed text-white">
                        결제를 진행하시려면 먼저 로그인이 필요합니다. <br />
                        로그인 후 마감 요정의 감시를 시작해 보세요!
                    </p>
                </div>
                <div className="flex flex-col w-full max-w-xs gap-4 text-black">
                    <Link href="/auth">
                        <Button size="xl" className="w-full">로그인하러 가기</Button>
                    </Link>
                    <Link href="/" className="text-xs font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors">
                        홈으로 돌아가기
                    </Link>
                </div>
            </div>
        )
    }

    // 성공 횟수 조회 (할인 로직을 위해)
    const { data: profile } = await supabase
        .from("profiles")
        .select("success_count")
        .eq("id", user.id)
        .single()

    const successCount = profile?.success_count || 0
    const isElite = successCount >= 20
    const originalAmount = 29000
    const discountAmount = isElite ? 10000 : 0
    const finalAmount = originalAmount - discountAmount

    return (
        <div className="flex-1 bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none select-none">
                <h1 className="text-[15rem] font-black uppercase leading-none text-white whitespace-nowrap rotate-12">
                    PAY PAY PAY
                </h1>
            </div>

            <div className="w-full max-w-4xl grid md:grid-cols-5 bg-card border-2 border-border relative z-10 shadow-2xl">
                {/* Order Summary */}
                <div className="p-8 md:col-span-2 border-b-2 md:border-b-0 md:border-r-2 border-border space-y-8 bg-black/20 text-white">
                    <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors">
                        <ArrowLeft size={12} /> 뒤로 가기
                    </Link>

                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">주문 요약</p>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">월간 <br />집중 감시</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold border-b border-border/50 pb-4">
                            <span className="text-foreground/60 uppercase tracking-widest text-xs">일반 이용권</span>
                            <span>{originalAmount.toLocaleString()}원</span>
                        </div>
                        {isElite && (
                            <div className="flex justify-between items-center text-sm font-bold border-b border-border/50 pb-4 text-accent">
                                <span className="uppercase tracking-widest text-xs">성실 우대 할인</span>
                                <span>-{discountAmount.toLocaleString()}원</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm font-bold border-b border-border/50 pb-4">
                            <span className="text-foreground/60 uppercase tracking-widest text-xs">가입비</span>
                            <span className="text-accent underline uppercase">FREE</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-black pt-4">
                            <span className="uppercase tracking-tighter">합계</span>
                            <span className="text-accent">{finalAmount.toLocaleString()}원</span>
                        </div>
                    </div>

                    <div className="pt-8 space-y-4">
                        {isElite && (
                            <div className="p-4 bg-accent/10 border border-accent/20 space-y-2 animate-in fade-in duration-1000">
                                <p className="text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-2">
                                    <Info size={12} /> 알림
                                </p>
                                <p className="text-xs font-bold leading-relaxed text-white/90">
                                    아쉽게 실패하셨군요! 하지만 20회 성공의 성실함을 인정하여 재도전 할인 혜택이 적용되었습니다. 다시 시작해 보세요!
                                </p>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">실시간 활성화</p>
                        </div>
                        <p className="text-xs text-foreground/40 leading-relaxed font-medium">
                            결제 즉시 관리자의 감시가 시작됩니다. 마감을 지키지 못하면 예치금 반환 불가 정책이 적용됩니다. 🧚
                        </p>
                    </div>
                </div>

                {/* Payment Form Area */}
                <div className="p-4 md:p-8 md:col-span-3 flex flex-col justify-start overflow-y-auto bg-white">
                    <PaymentForm amount={finalAmount} />
                </div>
            </div>
        </div>
    )
}
