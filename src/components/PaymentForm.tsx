"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/Button"
import { CreditCard, ShieldCheck, Lock } from "lucide-react"
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk"

export function PaymentForm({ amount }: { amount: number }) {
    const [loading, setLoading] = useState(false)
    const [widgetError, setWidgetError] = useState<string | null>(null)
    const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null)
    const paymentMethodsWidgetRef = useRef<any>(null)

    // 심사용 클라이언트 키 (환경변수 미설정 시 에러 메시지 표시)
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || ""
    const customerKey = "df-customer-anonymous" // 비회원 또는 익명 키

    useEffect(() => {
        let isMounted = true

        const initWidget = async () => {
            try {
                // 이미 위젯이 초기화되어 있다면 다시 로드하지 않음
                if (paymentWidgetRef.current) return;

                const paymentWidget = await loadPaymentWidget(clientKey, customerKey)
                if (!isMounted) return

                // 결제 수단 위젯 렌더링
                const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
                    "#payment-method",
                    {
                        value: amount,
                        currency: "KRW",
                        country: "KR"
                    },
                    { variantKey: "DEFAULT" }
                )

                // 이용약관 위젯 렌더링
                paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" })

                paymentWidgetRef.current = paymentWidget
                paymentMethodsWidgetRef.current = paymentMethodsWidget
            } catch (error: any) {
                console.error("Widget initialization failed:", error)
                if (isMounted) {
                    setWidgetError("결제 위젯을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요. (Client Key 확인 필요)")
                }
            }
        }

        initWidget()
        return () => { isMounted = false }
    }, [amount, clientKey, customerKey])

    const handlePayment = async () => {
        const paymentWidget = paymentWidgetRef.current
        if (!paymentWidget) return

        setLoading(true)
        try {
            // orderId는 영문 대소문자, 숫자, 특수문자 -, _로 이루어진 6자 이상 64자 이하의 문자열이어야 합니다.
            const orderId = `df-${Math.random().toString(36).substring(2, 11)}`

            await paymentWidget.requestPayment({
                orderId: orderId,
                orderName: "마감 요정 월간 패스",
                customerName: "마감요정 사용자",
                customerEmail: "user@example.com",
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            })
        } catch (error) {
            console.error("Payment request failed:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-black flex items-center gap-2">
                    <CreditCard size={14} /> 결제 수단 선택 (Payment Method)
                </label>

                {/* 1. 결제 수단 위젯 영역 */}
                {widgetError ? (
                    <div className="w-full bg-red-500/5 border-2 border-red-500/20 p-8 rounded-xl flex flex-col items-center justify-center text-center gap-4 animate-in fade-in duration-500">
                        <ShieldCheck size={32} className="text-red-500/50" />
                        <p className="text-sm font-bold text-red-500/80">{widgetError}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-[10px] font-black uppercase tracking-widest text-accent underline underline-offset-4"
                        >
                            페이지 새로고침
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div id="payment-method" className="w-full min-h-[300px]" />
                        {/* 2. 이용약관 위젯 영역 */}
                        <div id="agreement" className="w-full min-h-[150px]" />
                    </div>
                )}
            </div>

            <div className="p-4 bg-accent/5 border border-accent/20 flex items-start gap-3 text-black">
                <ShieldCheck className="text-accent shrink-0" size={18} />
                <p className="text-[10px] font-bold text-black/60 leading-relaxed uppercase tracking-widest">
                    토스페이먼츠의 보안 결제 시스템을 이용합니다. <br />
                    아래 결제하기 버튼을 누르면 최종 결제가 진행됩니다.
                </p>
            </div>

            <Button
                size="xl"
                className="w-full relative group overflow-hidden"
                disabled={loading}
                onClick={handlePayment}
            >
                <span className={loading ? "opacity-0" : "flex items-center gap-2"}>
                    {amount.toLocaleString()}원 결제하기
                </span>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </Button>

            <div className="flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/20">
                <Lock size={10} /> 보안 프로토콜 활성화됨
            </div>
        </div>
    )
}
