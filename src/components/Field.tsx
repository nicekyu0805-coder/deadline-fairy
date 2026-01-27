import { Input, type InputProps } from "./Input"

interface FieldProps extends InputProps {
    label: string
}

export function Field({ label, ...props }: FieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-accent/80">
                {label}
            </label>
            <Input {...props} />
        </div>
    )
}
