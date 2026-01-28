import { PaymentForm } from "@/components/PaymentForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
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
                <div className="p-8 md:col-span-2 border-b-2 md:border-b-0 md:border-r-2 border-border space-y-8 bg-black/20">
                    <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors">
                        <ArrowLeft size={12} /> 뒤로 가기
                    </Link>

                    <div className="space-y-2">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">주문 요약</p>
                        <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">월간 <br />집중 감시</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold border-b border-border/50 pb-4">
                            <span className="text-foreground/60 uppercase tracking-widest text-xs">모든 기능 이용권</span>
                            <span>29,000원</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold border-b border-border/50 pb-4">
                            <span className="text-foreground/60 uppercase tracking-widest text-xs">가입비</span>
                            <span className="text-accent underline">무료</span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-black pt-4">
                            <span className="uppercase tracking-tighter">합계</span>
                            <span className="text-accent">29,000원</span>
                        </div>
                    </div>

                    <div className="pt-8 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/60">실시간 활성화</p>
                        </div>
                        <p className="text-xs text-foreground/40 leading-relaxed font-medium">
                            결제 즉시 관리자의 감시가 시작됩니다. 마감을 지키지 못하면 전액 환불 정책이 적용됩니다.
                        </p>
                    </div>
                </div>

                {/* Payment Form Area */}
                <div className="p-4 md:p-8 md:col-span-3 flex flex-col justify-start overflow-y-auto bg-white">
                    <PaymentForm amount={29000} />
                </div>
            </div>
        </div>
    )
}
