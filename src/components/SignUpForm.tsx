"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/Button"
import { Field } from "@/components/Field"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignUpForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setSuccess(true)
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="w-full max-w-md space-y-8 bg-card p-10 border-2 border-accent text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-accent">가입 완료!</h2>
                <p className="text-foreground/80 leading-relaxed font-medium">
                    마감 요정의 멤버가 되신 것을 환영합니다. <br />
                    <span className="text-white/60 text-sm italic">(이메일 인증 설정에 따라 인증 메일이 발송되었을 수 있습니다.)</span>
                </p>
                <div className="space-y-4 pt-4">
                    <Link href="/auth">
                        <Button className="w-full">로그인하러 가기</Button>
                    </Link>
                    <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest leading-relaxed">
                        로그인 시 &quot;Email not confirmed&quot; 에러가 발생한다면 <br />
                        메일함을 확인해 주세요.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSignUp} className="w-full max-w-md space-y-8 bg-card p-10 border-2 border-border">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                    Start 3-Day <span className="text-accent underline">Trial</span>
                </h1>
                <p className="text-foreground/60 text-sm">3일간 무자비한 관리를 무료로 경험해 보세요.</p>
            </div>

            <div className="space-y-6">
                <Field
                    label="Full Name"
                    type="text"
                    placeholder="홍길동"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <Field
                    label="Phone Number"
                    type="tel"
                    placeholder="010-1234-5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <Field
                    label="Email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Field
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            {error && (
                <p className="bg-red-500/10 border-l-4 border-red-500 p-4 text-red-500 text-sm font-bold">
                    {error}
                </p>
            )}

            <div className="flex flex-col gap-4">
                <Button size="lg" type="submit" disabled={loading}>
                    {loading ? "작동 중..." : "3일 무료 체험 시작"}
                </Button>
                <Link href="/auth" className="text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors py-2 text-center">
                    이미 계정이 있으신가요? 로그인하기
                </Link>
            </div>
        </form>
    )
}
