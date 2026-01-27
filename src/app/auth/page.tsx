import LoginForm from "@/components/LoginForm"

export default function AuthPage() {
    return (
        <section className="flex-1 flex items-center justify-center p-6 bg-background relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
                <p className="text-[20rem] font-black uppercase leading-none text-white whitespace-nowrap -rotate-12 translate-x-[-10%] translate-y-[20%]">
                    DEADLINE DEADLINE DEADLINE
                </p>
            </div>

            <LoginForm />
        </section>
    )
}
