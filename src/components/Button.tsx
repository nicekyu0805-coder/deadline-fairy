import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        const variants = {
            primary: 'bg-accent text-accent-foreground hover:opacity-90',
            secondary: 'bg-white text-black hover:bg-gray-200',
            outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground',
            ghost: 'text-foreground hover:bg-white/10',
        }

        const sizes = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-6 py-3 text-base font-bold',
            lg: 'px-8 py-4 text-lg font-black uppercase tracking-tighter',
            xl: 'px-10 py-5 text-2xl font-black uppercase tracking-widest',
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
