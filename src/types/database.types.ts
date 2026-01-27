export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    phone: string | null
                    is_admin: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    phone?: string | null
                    is_admin?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    phone?: string | null
                    is_admin?: boolean
                    created_at?: string
                }
            }
            goals: {
                Row: {
                    id: string
                    user_id: string
                    task: string
                    deadline: string
                    status: 'pending' | 'in-progress' | 'verified' | 'failed'
                    stakes_mode: 'gentle' | 'ruthless'
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    task: string
                    deadline: string
                    status?: 'pending' | 'in-progress' | 'verified' | 'failed'
                    stakes_mode?: 'gentle' | 'ruthless'
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    task?: string
                    deadline?: string
                    status?: 'pending' | 'in-progress' | 'verified' | 'failed'
                    stakes_mode?: 'gentle' | 'ruthless'
                    created_at?: string
                }
            }
            messages: {
                Row: {
                    id: string
                    user_id: string
                    goal_id: string | null
                    content: string
                    type: 'sms' | 'whatsapp' | 'email' | 'system'
                    direction: 'inbound' | 'outbound'
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    goal_id?: string | null
                    content: string
                    type?: 'sms' | 'whatsapp' | 'email' | 'system'
                    direction: 'inbound' | 'outbound'
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    goal_id?: string | null
                    content?: string
                    type?: 'sms' | 'whatsapp' | 'email' | 'system'
                    direction?: 'inbound' | 'outbound'
                    status?: string
                    created_at?: string
                }
            }
        }
    }
}
