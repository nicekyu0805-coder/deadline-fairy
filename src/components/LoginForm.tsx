"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase"
import { Button } from "@/components/Button"
import { Field } from "@/components/Field"
import { useRouter } from "next/navigation"

import Link from "next/link"

export default function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            router.push("/dashboard")
            router.refresh()
        }
    }

    return (
        <form onSubmit={handleLogin} className="w-full max-w-md space-y-8 bg-card p-10 border-2 border-border">
            <div className="space-y-2 text-center">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">
                    Deadline <span className="text-accent underline">Fairy</span>
                </h1>
                <p className="text-foreground/60 text-sm">마감을 놓치는 것도 습관입니다.</p>
            </div>

            <div className="space-y-6">
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
                    {loading ? "작동 중..." : "로그인"}
                </Button>
                <Link
                    href="/auth/signup"
                    className="text-xs font-bold uppercase tracking-widest text-foreground/40 hover:text-accent transition-colors py-2 text-center"
                >
                    계정이 없으신가요? 3일 무료 체험 시작하기
                </Link>
            </div>
        </form>
    )
}
