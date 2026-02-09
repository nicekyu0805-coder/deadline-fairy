import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
    try {
        const { paymentKey, orderId, amount } = await request.json()

        // 1. 토스페이먼츠 결제 승인 API 호출
        const secretKey = process.env.TOSS_SECRET_KEY || ""
        const basicAuth = Buffer.from(`${secretKey}:`).toString("base64")

        const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
            method: "POST",
            headers: {
                Authorization: `Basic ${basicAuth}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                paymentKey,
                orderId,
                amount,
            }),
        })

        const result = await response.json()

        if (!response.ok) {
            console.error("Toss API Error:", result)
            return NextResponse.json(
                { message: result.message || "결제 승인 실패" },
                { status: response.status }
            )
        }

        // 2. DB 업데이트 (Supabase)
        const supabase = await createClient()

        // 현재 로그인한 사용자 정보 가져오기
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { message: "로그인 정보가 없습니다. 로그인 세션이 만료되었거나 로그인이 되어 있지 않습니다. 다시 로그인해 주세요." },
                { status: 401 }
            )
        }

        // 2-1. 프로필 업데이트 (구독 활성화 및 종료일 설정)
        // 종료일은 현재로부터 30일 뒤로 설정
        const subscriptionEndAt = new Date()
        subscriptionEndAt.setDate(subscriptionEndAt.getDate() + 30)

        const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .update({
                subscription_status: "active",
                subscription_end_at: subscriptionEndAt.toISOString(),
            })
            .eq("id", user.id)
            .select()
            .single()

        if (profileError) {
            console.error("Profile update error:", profileError)
        }

        // 2-2. 알림 문자 발송 (Solapi)
        const { sendSMS } = await import("@/lib/solapi")
        const userPhone = profileData?.phone || user.user_metadata?.phone
        const adminPhone = process.env.ADMIN_PHONE_NUMBER

        // 유저 알림
        if (userPhone) {
            await sendSMS({
                to: userPhone,
                text: `[마감요정] 결제가 완료되었습니다! 이제부터 요정의 집중 감시가 시작됩니다. 오늘부터 마감을 반드시 사수하세요! 🧚‍♀️`
            })
        }

        // 사장님 알림 (관리자 보고)
        if (adminPhone) {
            await sendSMS({
                to: adminPhone,
                text: `[관리자보고] 새로운 결제 발생!\n구매자: ${profileData?.full_name || user.email}\n금액: ${amount.toLocaleString()}원\n구독이 활성화되었습니다. 🔥`
            })
        }

        // 2-3. 결제 로그 기록
        const { error: paymentError } = await supabase
            .from("payments")
            .insert({
                user_id: user.id,
                amount: amount,
                currency: "KRW",
                status: "completed",
                stripe_payment_intent_id: paymentKey, // 토스의 경우 paymentKey를 저장
            })

        if (paymentError) {
            console.error("Payment log error:", paymentError)
        }

        return NextResponse.json({ success: true, data: result })
    } catch (error) {
        console.error("Internal Server Error:", error)
        return NextResponse.json({ message: "서버 내부 오류" }, { status: 500 })
    }
}
