import { ArrowLeft, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-background p-6 md:p-12 lg:p-24 max-w-4xl mx-auto space-y-12">
            <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors">
                <ArrowLeft size={12} /> 홈으로 돌아가기
            </Link>

            <header className="space-y-4 border-b-2 border-border pb-8">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Payment Policy</p>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">Refund <br />Policy.</h1>
            </header>

            <div className="space-y-12 text-foreground/80 leading-relaxed font-medium">
                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-accent transition-colors">
                        <CheckCircle2 size={24} />
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">1. 전액 환불 조건 (Challenge)</h2>
                    </div>
                    <div className="p-8 border-2 border-accent bg-accent/5 space-y-4">
                        <p className="text-lg font-bold">마감 요정은 사용자의 '성공'을 축하하며 이용 금액의 100%를 돌려드립니다.</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li><strong>최소 달성 횟수:</strong> 가입일로부터 30일 이내에 총 20회 이상의 일일 목표 달성 성공</li>
                            <li><strong>인증 기준:</strong> 매일 설정한 마감 시간 전까지 결과물 인증 완료 (매니저 승인 필수)</li>
                            <li><strong>정산 지급:</strong> 가입 30일 후, 조건 충족 확인 즉시 결제 취소 또는 계좌 입금 방식으로 처리 (영업일 기준 3~5일 소요)</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-red-500">
                        <AlertTriangle size={24} />
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">2. 환불 불가 조건 (Risk)</h2>
                    </div>
                    <div className="p-8 border-2 border-red-500 bg-red-500/5 space-y-4">
                        <p className="text-lg font-bold">다음의 경우, 강력한 동기 부여를 위해 환불이 엄격히 제한됩니다.</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm">
                            <li><strong>인증 실패:</strong> 챌린지 기간 중 단 한 번이라도 마감 시간을 어기거나 인증에 실패한 경우</li>
                            <li><strong>중도 포기:</strong> 사용자의 변심으로 인한 중도 해지 시 (디지털 서비스 특성상 즉시 활성화되므로 환불 불가)</li>
                            <li><strong>부정 인증:</strong> 무의미한 텍스트 입력, 허위 스크린샷 제출 등 목표 달성 의사가 없는 것으로 판단되어 매니저가 반려한 경우</li>
                        </ul>
                    </div>
                </section>

                <section className="space-y-6">
                    <div className="flex items-center gap-3 text-white">
                        <RefreshCw size={24} />
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic">3. 청약 철회 안내</h2>
                    </div>
                    <div className="space-y-4 text-sm">
                        <p>본 서비스는 결제 즉시 AI 매니저 배정 및 관리 서비스가 시작되는 '콘텐츠 및 용역 서비스'로서, 전자상거래법 제17조 제2항 제5호에 따라 소비자의 사용 또는 일부 소비로 가치가 현저히 감소한 경우에 해당되어 단순 변심에 의한 청약 철회가 제한될 수 있습니다.</p>
                        <p>단, 시스템 오류 등 회사의 귀책 사유로 서비스를 전혀 이용하지 못한 경우 고객센터(nicekyu0805@gmail.com)를 통해 100% 환불 요청이 가능합니다.</p>
                    </div>
                </section>
            </div>

            <footer className="pt-12 border-t border-border text-[10px] font-bold uppercase tracking-widest text-foreground/40 text-center">
                Last Updated: 2026. 01. 27.
            </footer>
        </div>
    )
}
