"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/Button"
import { ArrowRight, Check, Zap, Shield, HelpCircle, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

export default function LandingPage() {
  useEffect(() => {
    const supabase = createClient()
    const recordVisit = async () => {
      await supabase.from('page_views').insert({
        page_path: window.location.pathname,
        referrer: document.referrer,
      })
    }
    recordVisit()
  }, [])

  return (
    <div className="flex-1 bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b-2 border-border p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <h1 className="text-2xl font-black uppercase tracking-tighter italic">
          DEADLINE <span className="text-accent">FAIRY</span>
        </h1>
        <div className="flex gap-8 items-center">
          <Link href="/auth" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
            로그인
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">무료 체험하기</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden flex flex-col items-center text-center border-b-2 border-border">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full -z-10" />

        <div className="max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-bold uppercase tracking-widest">
            <Zap size={14} /> Only for High Performers
          </div>

          <h2 className="text-7xl md:text-9xl font-black uppercase leading-[0.9] tracking-tighter">
            당신의 마감을 <br />
            <span className="text-accent italic">지켜드립니다.</span>
          </h2>

          <p className="text-xl md:text-2xl text-foreground/60 max-w-2xl mx-auto font-medium">
            프리랜서와 1인 기업가를 위한 무자비한 AI 매니저. <br />
            <span className="text-white font-bold italic underline decoration-accent decoration-2 underline-offset-4">목표 달성 시 예치금 반환. 실패 시 벌칙 집행.</span>
          </p>

          <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="xl" className="group">
                지금 바로 목표 설정하기
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Social Proof (Testimonials) */}
      <section className="py-24 px-6 border-b-2 border-border bg-card/30">
        <div className="max-w-6xl mx-auto space-y-16">
          <h3 className="text-4xl font-black uppercase tracking-tighter text-center italic">
            SAVED BY THE <span className="text-accent underline">FAIRY</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "이 봇 덕분에 2년 동안 미뤘던 소설을 드디어 탈고했습니다. 매일 아침 전해오는 매니저의 독촉이... 무서웠지만 효과는 확실해요.",
                author: "@writer_kim",
                role: "장르소설 작가"
              },
              {
                text: "단순한 할 일 목록 앱이랑은 차원이 달라요. 누군가 실시간으로 나를 지켜보고 있다는 심리적 압박감이 최고의 동력이 됩니다.",
                author: "@dev_park",
                role: "풀스택 개발자"
              },
              {
                text: "마감 요정이 없었을 땐 매번 마감 직전에 밤을 샜는데, 이제는 매일 꾸준히 목표를 달성하고 있습니다. 삶의 질이 달라졌어요.",
                author: "@designer_lee",
                role: "UI/UX 디자이너"
              }
            ].map((t, i) => (
              <div key={i} className="p-8 border-2 border-border bg-background space-y-6">
                <p className="text-lg font-medium leading-relaxed">"{t.text}"</p>
                <div>
                  <p className="font-bold text-accent">{t.author}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground/40">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hall of Fame Section */}
      <section className="py-24 px-6 border-b-2 border-border bg-gradient-to-b from-background to-accent/5">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-black uppercase tracking-widest">
              <Trophy size={14} /> The Elite Survivors
            </div>
            <h3 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
              명예의 <span className="text-yellow-500">전당</span>
            </h3>
            <p className="text-foreground/60 text-lg font-bold">마감 요정을 무릎 꿇린 전설의 독종들을 공개합니다.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "열혈개발자 K", period: "30일 연속 달성", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=K" },
              { name: "마감의신 L", period: "15일 연속 달성", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=L" },
              { name: "탈고천사 정작가", period: "소설 완성 완료", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=J" },
              { name: "UX마스터 박", period: "대규모 프로젝트 완수", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=P" },
            ].map((fame, i) => (
              <div key={i} className="group relative aspect-square border-2 border-border bg-card overflow-hidden transition-all hover:border-yellow-500">
                <img src={fame.img} alt={fame.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[10px] font-black text-yellow-500 uppercase tracking-widest mb-1">Legendary</p>
                  <p className="font-black text-sm uppercase tracking-tighter">{fame.name}</p>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{fame.period}</p>
                </div>
                <div className="absolute top-4 right-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <Star size={16} fill="currentColor" />
                  {fame.period.includes("30일") && <span className="text-[8px] font-black mt-1">GOLD BADGE</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center italic text-foreground/40 text-sm font-bold">
            "당신도 전설이 될 수 있습니다. 지금 도전하세요."
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h3 className="text-5xl font-black uppercase tracking-tighter italic">Simple Pricing.</h3>
            <p className="text-foreground/60 text-lg">No hidden fees. Just results.</p>
          </div>

          <div className="max-w-md mx-auto p-12 border-4 border-accent bg-background relative overflow-hidden">
            {/* Glossy Card Representation */}
            <div className="mb-8 relative h-48 w-full rounded-2xl bg-gradient-to-br from-accent/20 to-purple-500/20 border border-white/10 flex flex-col justify-end p-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 blur-3xl" />
              <h5 className="text-2xl font-black italic tracking-tighter mb-1 relative z-10">[무자비한 마감 요정] 정기 이용권</h5>
              <div className="flex justify-between items-center relative z-10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">디지털 서비스 / 1개월 사용</p>
                <Zap size={24} className="text-accent" />
              </div>
            </div>

            <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-4 py-1 text-xs font-black uppercase tracking-widest -translate-y-1/2 translate-x-1/2 rotate-12 z-20">
              Best Seller
            </div>

            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">Challenge Pass</p>
                <h4 className="text-6xl font-black">29,000<span className="text-xl text-foreground/40">원/월</span></h4>
                <p className="text-[10px] font-bold text-accent mt-2 animate-pulse font-black italic">★ 미션 성공 시 29,000원 예치금 반환 ★</p>
              </div>

              <ul className="text-left space-y-4">
                {[
                  "일일 마감 목표 실시간 모니터링",
                  "목표 달성 기준: 한 달 최소 20회 성공",
                  "규칙: 1일 1회 성공만 횟수 인정 (중복 불가)",
                  "정산 시점: 가입 30일 후 일괄 정산",
                  "성공 시 예치금 반환 (Challenge)",
                  "20회 성공 후 실패 시: 다음달 소정의 할인권",
                  "30일 올킬: 예치금 반환 + 명예의 전당 황금 배지",
                  "주의: 단 1번이라도 실패 시 반환 불가 (벌칙)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold">
                    <Check className={cn("text-accent", item.includes("베스트 후기") && "text-yellow-500")} size={20} />
                    <span className={cn(item.includes("베스트 후기") && "text-yellow-500")}>{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full">결제하고 시작하기</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t-2 border-border bg-card">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <h1 className="text-xl font-black uppercase tracking-tighter italic">
              DEADLINE <span className="text-accent">FAIRY</span>
            </h1>
            <div className="text-[10px] md:text-xs font-medium text-foreground/40 leading-relaxed uppercase tracking-wider">
              <p>상호: 마감 요정 (DEADLINE FAIRY)</p>
              <p>대표자명: 이광규</p>
              <p>사업자등록번호: 484-25-02247</p>
              <p>통신판매업신고: 2026-경북울진-0000 (신고 예정)</p>
              <p>주소: 경상북도 울진군 평해읍 평해5길 61-4 (황토방빌라) 302호</p>
              <p>고객센터: 070-8064-0475 | nicekyu0805@gmail.com</p>
              <p className="mt-4">© 2026 DEADLINE FAIRY. ALL RIGHTS RESERVED.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-8 text-[10px] md:text-xs font-bold uppercase tracking-widest text-foreground/40">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
            <Link href="/refund" className="hover:text-accent transition-colors">Refund Policy</Link>
            <a href="mailto:nicekyu0805@gmail.com" className="hover:text-accent transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
