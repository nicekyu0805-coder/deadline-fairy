import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 lg:p-24 max-w-4xl mx-auto space-y-12">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors">
                <ArrowLeft size={12} /> 홈으로 돌아가기
            </Link>

            <header className="space-y-4 border-b-2 border-border pb-8">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Legal Compliance</p>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Terms of <br />Service.</h1>
            </header>

            <div className="space-y-8 text-foreground/80 leading-relaxed font-medium">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">1. 서비스의 목적</h2>
                    <p>본 서비스는 사용자의 생산성 향상과 목표 달성을 돕기 위해 실시간 모니터링 및 심리적 독려 시스템을 제공하는 '마감 관리 보조 서비스'입니다.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">2. 이용 계약 및 결제</h2>
                    <p>사용자는 약정을 체결하고 월간 이용권을 구매함으로써 서비스를 이용할 수 있습니다. 결제는 토스페이먼츠 등 제3자 결제 대행사를 통해 이루어집니다.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">3. 목표 달성 및 예치금 반환 정책</h2>
                    <p>마감 요정의 핵심 정책인 '예치금 반환'은 다음 조건을 모두 충족할 때 성립합니다:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>한 달(30일) 기준 총 20회 이상의 일일 목표 달성 인증 완료</li>
                        <li>1일 1회 인증만 성공 횟수로 인정됨</li>
                        <li>모든 인증은 지정된 마감 시간 전까지 매니저가 승인할 수 있는 형태로 제출되어야 함</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">4. 실패 시 벌칙 및 예치금 반환 불가 조건</h2>
                    <p>다음의 경우 예치금 반환이 불가능하며 약정된 벌칙 대상이 될 수 있습니다:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>챌린지 기간 중 단 한 번이라도 목표 달성에 실패하거나 인증을 누락한 경우</li>
                        <li>허위 인증(무의미한 목표 설정 등)으로 매니저에 의해 반려된 경우</li>
                        <li>사용자의 부정행위가 발각될 경우</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white italic">5. 책임 및 면책</h2>
                    <p>회사는 사용자의 목표 달성을 지원하는 보조적인 역할을 수행하며, 사용자의 최종적인 작업 결과물 품질이나 비즈니스 성과에 대해서는 책임을 지지 않습니다.</p>
                </section>
            </div>

            <footer className="pt-12 border-t border-border text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-center">
                Last Updated: 2026. 01. 27.
            </footer>
        </div>
    )
}
