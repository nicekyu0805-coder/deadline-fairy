import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"
import { sendSMS } from "@/lib/solapi"

export async function POST(request: Request) {
    try {
        const { task, deadline, stakes_mode } = await request.json()
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ message: "로그인이 필요합니다." }, { status: 401 })
        }

        // 1. 프로필 정보 (전화번호) 가져오기
        const { data: profile } = await supabase
            .from("profiles")
            .select("phone")
            .eq("id", user.id)
            .single()

        const userPhone = profile?.phone || user.user_metadata?.phone

        // 2. 목표 저장
        const { data: goal, error } = await supabase
            .from("goals")
            .insert({
                user_id: user.id,
                task,
                deadline,
                stakes_mode,
                status: 'submitted'
            })
            .select()
            .single()

        if (error) {
            console.error("Goal save error:", error)
            return NextResponse.json({ message: "목표 저장 실패" }, { status: 500 })
        }

        // 3. 알림 발송 (Solapi)
        const adminPhone = process.env.ADMIN_PHONE_NUMBER
        const deadlineDate = new Date(deadline)
        const timeStr = `${deadlineDate.getHours().toString().padStart(2, '0')}:${deadlineDate.getMinutes().toString().padStart(2, '0')}`

        // 3-1. 유저 알림
        if (userPhone) {
            // 즉시 발송: 목표 등록 확인
            await sendSMS({
                to: userPhone,
                text: `[마감요정] 오늘의 목표가 고정되었습니다!\n목표: ${task}\n마감: 오늘 ${timeStr}\n\n요정이 당신의 마감을 지켜보고 있습니다. 행운을 빕니다! 🧚‍♂️`
            })

            // 예약 발송: 마감 1시간 전 알림
            const oneHourBefore = new Date(deadlineDate.getTime() - 60 * 60 * 1000)
            if (oneHourBefore > new Date()) {
                await sendSMS({
                    to: userPhone,
                    text: `[마감요정] 마감 1시간 전입니다!\n목표: ${task}\n\n서두르세요! 곧 요정의 검문이 시작됩니다. 😈`,
                    scheduledDate: oneHourBefore.toISOString()
                })
            }

            // 예약 발송: 마감 정각 알림
            await sendSMS({
                to: userPhone,
                text: `[마감요정] 마감 시간이 되었습니다!\n지금 바로 매니저에게 인증 결과물(스크린샷/링크)을 보내주세요.`,
                scheduledDate: deadlineDate.toISOString()
            })
        }

        // 3-2. 사장님 알림 (관리자 보고)
        if (adminPhone) {
            await sendSMS({
                to: adminPhone,
                text: `[관리자보고] 새로운 목표 등록!\n유저: ${user.email}\n목표: ${task}\n마감: ${timeStr}\n\n오늘도 한 명의 유저가 요정의 감시 아래 들어왔습니다. 🧚‍♂️`
            })
        }

        return NextResponse.json({ success: true, goal })
    } catch (error) {
        console.error("Internal Server Error:", error)
        return NextResponse.json({ message: "서버 내부 오류" }, { status: 500 })
    }
}
