"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/Button"
import {
    Users,
    MessageSquare,
    Send,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    MessageCircle,
    MoreVertical,
    AlertTriangle,
    Plus,
    Eye,
    Sparkles,
    Calendar,
    ThumbsUp,
    ThumbsDown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"

// Dummy data for MVP demonstration with subscription status
const DUMMY_USERS = [
    { id: '1', name: '김철수', phone: '010-1234-5678', goal: '오늘 저녁 6시까지 홈페이지 디자인 시안 3개 완성하기', deadline: '18:00', status: 'in-progress', mode: 'ruthless', subscription_status: 'active', subscription_end_at: '2026-02-23' },
    { id: '2', name: '이영희', phone: '010-9876-5432', goal: '오후 4시까지 운동 1시간 완료 인증샷 보내기', deadline: '16:00', status: 'pending', mode: 'gentle', subscription_status: 'free', subscription_end_at: null },
    { id: '3', name: '박지민', phone: '010-1111-2222', goal: '자정까지 백엔드 API 명세서 초안 작성하기', deadline: '00:00', status: 'verified', mode: 'ruthless', subscription_status: 'active', subscription_end_at: '2026-02-15' },
]

const INITIAL_TEMPLATES = [
    { id: '1', label: '가입 환영', text: '마감 요정의 세계에 오신 것을 환영합니다! 약속하신 목표와 마감 시간을 철저히 지켜주세요. 매니저가 지켜보고 있습니다.' },
    { id: '2', label: '작업 확인', text: '작업 잘 진행되고 계신가요? 현재 진행 상황 보고해 주세요.' },
    { id: '3', label: '마감 임박', text: '🚨 마감 1시간 전입니다! 약속한 목표를 달성하지 못할 경우 정해진 벌칙이 수행됩니다. 지금 즉시 결과를 증명해 주세요.' },
    { id: '4', label: '벌칙 예고', text: '⚠️ 최종 경고: 마감 시간이 지났습니다. 10분 내로 답변이 없을 시 약속하신 벌칙(스테이크 집행 등) 절차에 착수합니다.' },
    { id: '5', label: '구독 갱신', text: '구독 만료가 임박했습니다! 계속해서 마감 요정의 강력한 관리를 받으려면 구독을 갱신해 주세요.' },
    { id: '6', label: '검증 완료', text: '목표 달성을 확인했습니다! 역시 해내실 줄 알았습니다. 고생하셨습니다.' },
    { id: '7', label: '냉철 이성', text: '환불 기회는 사라졌지만, 데이터는 말합니다. 여기서 멈추면 지금까지의 노력은 쓰레기통으로 가지만, 20회를 채우면 "다음 달 할인권"이 기다립니다. 지금 포기하는 게 가장 큰 손해입니다.' },
    { id: '8', label: '요정 속삭임', text: '완벽하지 않아도 괜찮아요. 마감 요정은 끝까지 완주하는 사람을 더 좋아하거든요. 20개 성공 뱃지라도 챙겨서 명예를 회복해 보세요!' },
    { id: '9', label: '결과 중심', text: '딱 20번만 성공하세요. 그러면 "실패한 사람"이 아니라 "역경을 딛고 보상을 쟁취한 사람"이 됩니다. 내일 다시 달립시다.' },
    { id: '10', label: '무자비 독려', text: '당신의 의지력이 이것밖에 안 됩니까? 오늘이 고비입니다. 여기서 넘어가면 당신은 평생 미루는 사람으로 남을 겁니다. 지금 당장 증명하세요.' },
    { id: '11', label: '따뜻한 응원', text: '오늘따라 힘드시죠? 마감 요정도 알고 있습니다. 하지만 기록은 거짓말을 하지 않아요. 벌써 14일이나 해냈는데, 여기서 멈추기엔 너무 아깝지 않나요?' },
    { id: '12', label: '작은 시작', text: '거창한 결과물은 필요 없습니다. 오늘 딱 한 시간만 집중하고 인증하세요. 그 한 시간이 당신의 30일을 바꿉니다.' },
    { id: '13', label: '최적화 모드', text: '어제의 실패는 시스템 오류일 뿐입니다. 오늘 다시 재부팅하세요. 마감 요정은 당신의 "오늘"을 다시 지켜보기 시작했습니다.' },
    { id: '14', label: '경고/격려', text: '한 번은 실수지만 두 번은 습관입니다. 오늘은 죽어도 성공하셔야 합니다. 지켜보고 있겠습니다.' },
    { id: '15', label: '보상 리마인드', text: '전액 환불 버튼이 비활성화되었다고 슬퍼하지 마세요. 대신 "성공 경험"이라는 더 큰 자산과 "할인권"이라는 작은 보상이 당신을 기다립니다.' },
]

export default function AdminDashboard() {
    const [selectedUser, setSelectedUser] = useState<typeof DUMMY_USERS[0] | null>(null)
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'failed' | 'paid'>('all')
    const [message, setMessage] = useState("")
    const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
    const [isAddingTemplate, setIsAddingTemplate] = useState(false)
    const [newLabel, setNewLabel] = useState("")
    const [newText, setNewText] = useState("")
    const [stats, setStats] = useState({ visitors: 0 })
    const [isWeekend, setIsWeekend] = useState(false)

    // Load templates and stats
    useEffect(() => {
        const supabase = createClient()

        // Check if it's weekend (Saturday = 6, Sunday = 0)
        const today = new Date()
        const day = today.getDay()
        setIsWeekend(day === 0 || day === 6)

        // Load templates from localStorage
        const saved = localStorage.getItem('deadline-fairy-templates')
        if (saved) {
            setTemplates(JSON.parse(saved))
        }

        // Fetch stats from Supabase
        const fetchStats = async () => {
            const { count, error } = await supabase
                .from('page_views')
                .select('*', { count: 'exact', head: true })

            if (!error) {
                setStats({ visitors: count || 0 })
            }
        }
        fetchStats()
    }, [])

    const saveTemplates = (newTemplates: typeof templates) => {
        setTemplates(newTemplates)
        localStorage.setItem('deadline-fairy-templates', JSON.stringify(newTemplates))
    }

    const addTemplate = () => {
        if (!newLabel || !newText) return
        const nextId = String(templates.length + 1)
        const updated = [...templates, { id: nextId, label: newLabel, text: newText }]
        saveTemplates(updated)
        setNewLabel("")
        setNewText("")
        setIsAddingTemplate(false)
    }

    const getDaysRemaining = (dateString: string | null) => {
        if (!dateString) return null
        const end = new Date(dateString)
        const now = new Date()
        const diffTime = end.getTime() - now.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const filteredUsers = DUMMY_USERS.filter(user => {
        if (activeTab === 'all') return true
        if (activeTab === 'paid') return user.subscription_status === 'active'
        return user.status === activeTab
    })

    const generateWhatsAppLink = (phone: string, text: string) => {
        const formattedPhone = phone.replace(/-/g, '').replace(/^0/, '82')
        return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`
    }

    const generateSMSLink = (phone: string, text: string) => {
        return `sms:${phone}?body=${encodeURIComponent(text)}`
    }

    return (
        <div className="flex-1 bg-background flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2 divide-border">
            {/* Sidebar: User List */}
            <aside className="w-full md:w-[400px] flex flex-col bg-card/10 overflow-hidden">
                <header className="p-6 border-b-2 border-border space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Users size={20} className="text-accent" />
                            <h2 className="text-xl font-black uppercase tracking-tighter">Active Targets</h2>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest text-accent">Visitor Hits</span>
                            <div className="flex items-center gap-1">
                                <Eye size={12} className="text-accent" />
                                <span className="text-sm font-black tabular-nums">{stats.visitors.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {['all', 'pending', 'failed', 'paid'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={cn(
                                    "px-3 py-1 text-[10px] font-black uppercase tracking-widest border border-border transition-colors",
                                    activeTab === tab ? "bg-accent text-accent-foreground border-accent" : "text-foreground/40 hover:text-white",
                                    tab === 'paid' && activeTab !== 'paid' && "text-yellow-500/60 border-yellow-500/20"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto divide-y divide-border/50">
                    {filteredUsers.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => setSelectedUser(user)}
                            className={cn(
                                "w-full p-6 text-left transition-all hover:bg-accent/5 flex items-start justify-between group",
                                selectedUser?.id === user.id ? "bg-accent/10 border-l-4 border-accent" : "border-l-4 border-transparent"
                            )}
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{user.name}</span>
                                    {user.subscription_status === 'active' && (
                                        <span className="text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter bg-yellow-500 text-black">
                                            PREMIUM
                                        </span>
                                    )}
                                    <span className={cn(
                                        "text-[8px] font-black px-1.5 py-0.5 uppercase tracking-tighter",
                                        user.mode === 'ruthless' ? "bg-red-600" : "bg-accent text-accent-foreground"
                                    )}>
                                        {user.mode}
                                    </span>
                                    {user.subscription_status === 'active' && user.subscription_end_at && getDaysRemaining(user.subscription_end_at)! <= 3 && (
                                        <div className="flex items-center gap-1 text-[8px] font-black text-red-500 animate-pulse">
                                            <AlertTriangle size={8} /> EXPIRING
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-foreground/60 line-clamp-1">{user.goal}</p>
                                <div className="flex items-center gap-3 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                                    <span className="flex items-center gap-1"><Clock size={10} /> {user.deadline}</span>
                                    <span className={cn(
                                        "flex items-center gap-1",
                                        user.status === 'verified' ? "text-accent" : user.status === 'in-progress' ? "text-blue-400" : "text-yellow-500"
                                    )}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                            <MoreVertical size={16} className="text-foreground/20 group-hover:text-accent" />
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content: Message & Control */}
            <main className="flex-1 flex flex-col bg-background relative">
                {selectedUser ? (
                    <>
                        <header className="p-8 border-b-2 border-border flex justify-between items-center">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter">{selectedUser.name} <span className="text-foreground/40 text-xl">[{selectedUser.phone}]</span></h3>
                                    {selectedUser.subscription_status === 'active' ? (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black px-2 py-0.5 bg-yellow-500 text-black uppercase tracking-widest w-fit">PREMIUM MEMBER</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-tighter">Expires: {selectedUser.subscription_end_at}</span>
                                                {selectedUser.subscription_end_at && (
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase",
                                                        getDaysRemaining(selectedUser.subscription_end_at)! <= 3 ? "text-red-500" : "text-accent"
                                                    )}>
                                                        (D-{getDaysRemaining(selectedUser.subscription_end_at)})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] font-black px-2 py-0.5 border border-border text-foreground/40 uppercase tracking-widest">Free Tier</span>
                                    )}
                                </div>
                                <p className="text-lg font-bold italic text-foreground/80">"{selectedUser.goal}"</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                {selectedUser.status === 'pending' && (
                                    <div className="flex gap-2 mr-4 border-r-2 border-border pr-6">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 flex gap-2"
                                            onClick={() => {
                                                // Link logic later
                                                alert(`${selectedUser.name}님의 목표를 승인했습니다.`)
                                            }}
                                        >
                                            <ThumbsUp size={16} /> APPROVE
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex gap-2"
                                            onClick={() => {
                                                setMessage("설정하신 목표가 너무 모호하거나 부적절합니다. 좀 더 도전적이고 구체적인 목표로 다시 설정해 주세요. (예: 물 마시기 X -> 보고서 작성 O)")
                                                alert(`${selectedUser.name}님의 목표를 반려했습니다. 안내 메시지를 보내주세요.`)
                                            }}
                                        >
                                            <ThumbsDown size={16} /> REJECT
                                        </Button>
                                    </div>
                                )}
                                {isWeekend && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-accent/20 border border-accent rounded-full animate-pulse mr-4">
                                        <Sparkles size={14} className="text-accent" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-accent">AI Fairy Mode Active</span>
                                    </div>
                                )}
                                <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">FAIL</Button>
                                <Button variant="outline" size="sm">VERIFY</Button>
                            </div>
                        </header>

                        <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-12 overflow-y-auto">
                            {/* Messaging Section */}
                            <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-xl">
                                        {isWeekend ? <Sparkles size={20} className="text-accent" /> : <MessageSquare size={20} className="text-accent" />}
                                        {isWeekend ? "AI Mandate Suggested" : "Send Mandate"}
                                    </div>
                                    <div className="flex gap-2">
                                        {isWeekend && (
                                            <div className="flex items-center gap-1 px-2 py-1 bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-tighter text-foreground/40">
                                                <Calendar size={10} /> Weekend Protocol
                                            </div>
                                        )}
                                        <button
                                            onClick={() => setIsAddingTemplate(!isAddingTemplate)}
                                            className="text-[10px] font-black uppercase tracking-widest text-accent hover:text-white transition-colors flex items-center gap-1 border border-accent/20 px-2 py-1"
                                        >
                                            <Plus size={12} /> Add Template
                                        </button>
                                    </div>
                                </div>

                                {isAddingTemplate && (
                                    <div className="p-6 border-2 border-accent bg-accent/5 space-y-4 animate-in fade-in slide-in-from-top-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Template Label (e.g., Warning)</p>
                                            <input
                                                value={newLabel}
                                                onChange={(e) => setNewLabel(e.target.value)}
                                                className="w-full bg-background border-2 border-border p-2 text-xs focus:outline-none focus:border-accent"
                                                placeholder="Enter label..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Message Text</p>
                                            <textarea
                                                value={newText}
                                                onChange={(e) => setNewText(e.target.value)}
                                                className="w-full bg-background border-2 border-border p-2 text-xs h-20 focus:outline-none focus:border-accent"
                                                placeholder="Enter message content..."
                                            />
                                        </div>
                                        <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
                                            <button onClick={addTemplate} className="flex-1 bg-accent text-accent-foreground py-2 hover:opacity-90">Save Template</button>
                                            <button onClick={() => setIsAddingTemplate(false)} className="px-4 border border-border py-2 hover:bg-white/5">Cancel</button>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    {templates.map((tmpl) => (
                                        <button
                                            key={tmpl.id}
                                            className="p-4 border-2 border-border bg-card hover:border-accent transition-all text-left group"
                                            onClick={() => setMessage(tmpl.text)}
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-2">{tmpl.label}</p>
                                            <p className="text-xs text-foreground/60 group-hover:text-foreground">"{tmpl.text}"</p>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <textarea
                                        className="w-full h-32 bg-card border-2 border-border p-4 text-sm focus:outline-none focus:border-accent"
                                        placeholder="Type manual message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <a
                                            href={generateWhatsAppLink(selectedUser.phone, message || "진행 상황을 확인하겠습니다.")}
                                            target="_blank"
                                            className="flex-1"
                                        >
                                            <Button variant="secondary" className="w-full flex gap-2">
                                                <MessageCircle size={18} /> WhatsApp
                                            </Button>
                                        </a>
                                        <a
                                            href={generateSMSLink(selectedUser.phone, message || "마감 시간을 지켜주세요.")}
                                        >
                                            <Button variant="primary" className="w-full flex gap-2">
                                                <Send size={18} /> Send SMS
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Status & History */}
                            <div className="space-y-8">
                                <div className="flex items-center gap-2 font-black uppercase tracking-tighter text-xl">
                                    <Clock size={20} className="text-accent" />
                                    History Log
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { time: '14:20', type: 'outbound', text: '작업 잘 진행되고 계신가요? 현재 진행 상황 보고해 주세요.', status: 'delivered' },
                                        { time: '14:25', type: 'inbound', text: '네, 지금 시안 작업 중입니다. 1시간 내로 공유 드릴게요.', status: 'received' },
                                    ].map((log, i) => (
                                        <div key={i} className={cn(
                                            "p-4 border-l-4 text-xs space-y-2",
                                            log.type === 'outbound' ? "bg-accent/5 border-accent ml-8" : "bg-white/5 border-foreground/40 mr-8"
                                        )}>
                                            <div className="flex justify-between font-bold opacity-40 uppercase tracking-widest text-[9px]">
                                                <span>{log.type}</span>
                                                <span>{log.time}</span>
                                            </div>
                                            <p className="font-medium leading-relaxed">{log.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-6">
                        <div className="w-24 h-24 rounded-full border-2 border-border flex items-center justify-center text-foreground/20 italic">
                            ?
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-3xl font-black uppercase tracking-tighter opacity-20">No Target Selected</h3>
                            <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Choose a prisoner from the left to begin oversight.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
