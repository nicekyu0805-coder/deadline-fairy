import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 lg:p-24 max-w-4xl mx-auto space-y-12">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors">
                <ArrowLeft size={12} /> 홈으로 돌아가기
            </Link>

            <header className="space-y-4 border-b-2 border-border pb-8">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Legal Compliance</p>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Privacy <br />Policy.</h1>
            </header>

            <div className="space-y-8 text-foreground/80 leading-relaxed font-medium">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">1. 개인정보의 수집 및 이용 목적</h2>
                    <p>마감 요정(이하 '회사')은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>회원 가입 및 관리: 서비스 이용 의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증, 회원자격 유지·관리 등</li>
                        <li>서비스 제공: 마감 목표 모니터링, 알림 발송, 보상(환불) 처리 등</li>
                        <li>결제 및 정산: 서비스 요금 결제, 정산 처리, 금융거래 본인 인증 등</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">2. 수집하는 개인정보 항목</h2>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>필수항목: 이메일, 비밀번호, 성명, 휴대전화번호</li>
                        <li>결제 시 추가: 신용카드 정보, 은행계좌 정보 등 결제 수단 정보</li>
                        <li>자동 수집: 접속 IP 정보, 서비스 이용 기록, 접속 로그 등</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">3. 개인정보의 보유 및 이용 기간</h2>
                    <p>회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>회원 탈퇴 시까지 보유 (단, 관련 법령에 의거하여 보존할 필요가 있는 경우 해당 기간까지 보관)</li>
                        <li>계약 또는 청약철회 등에 관한 기록: 5년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">4. 개인정보의 제3자 제공</h2>
                    <p>회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.</p>
                    <p>결제 처리를 위해 다음과 같이 개인정보가 제공될 수 있습니다:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>제공받는 자: 토스페이먼츠(주)</li>
                        <li>제공 목적: 전자결제 서비스 제공 및 결제 여부 확인</li>
                        <li>제공 항목: 결제 수단 정보, 주문 번호, 결제 금액 등</li>
                    </ul>
                </section>
            </div>

            <footer className="pt-12 border-t border-border text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-center">
                Last Updated: 2026. 01. 27.
            </footer>
        </div>
    )
}
