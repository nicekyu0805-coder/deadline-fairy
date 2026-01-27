import { XCircle, ArrowLeft, RotateCcw } from "lucide-react"
import Link from "next/link"

export default function PaymentFailPage({
    searchParams,
}: {
    searchParams: { message?: string; code?: string }
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-8">
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 animate-in zoom-in duration-500">
                <XCircle size={48} />
            </div>

            <div className="space-y-2 max-w-md">
                <h1 className="text-4xl font-black uppercase tracking-tighter italic">Payment Failed.</h1>
                <p className="text-foreground/60 font-medium">
                    결제 처리 중 오류가 발생했습니다. 아래 내용을 확인해 주세요.
                </p>
            </div>

            <div className="bg-red-500/5 border-2 border-red-500/20 p-6 rounded-xl w-full max-w-sm space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60">Error Reason</p>
                <p className="text-sm font-bold text-red-400">
                    {searchParams.message || "알 수 없는 오류가 발생했습니다."}
                </p>
                {searchParams.code && (
                    <p className="text-[10px] text-foreground/20 font-mono tracking-tighter">Code: {searchParams.code}</p>
                )}
            </div>

            <div className="flex flex-col w-full max-w-sm gap-4">
                <Link href="/checkout" className="w-full">
                    <button className="w-full h-14 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                        <RotateCcw size={16} /> 다시 시도하기
                    </button>
                </Link>
                <Link href="/" className="w-full">
                    <button className="w-full h-14 border-2 border-border text-foreground/40 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all flex items-center justify-center gap-2">
                        <ArrowLeft size={12} /> 홈으로 돌아가기
                    </button>
                </Link>
            </div>

            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/10 py-12">
                Deadline Fairy Payment Security System
            </p>
        </div>
    )
}
