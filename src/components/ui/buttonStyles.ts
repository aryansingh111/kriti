import { cn } from '@/lib/utils'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger' | 'dark'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

const base =
  'relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-[background-color,color,box-shadow,transform,border-color] duration-150 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-brand-ink shadow-sm hover:bg-brand-hover hover:shadow-md',
  dark: 'bg-ink text-bg hover:opacity-90',
  secondary: 'border border-line-strong bg-surface text-ink hover:bg-surface-2',
  ghost: 'text-muted hover:bg-surface-2 hover:text-ink',
  soft: 'bg-brand-soft text-brand hover:bg-brand-soft-2',
  danger: 'text-bad hover:bg-bad/10',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-[15px]',
  icon: 'h-9 w-9',
  'icon-sm': 'h-7 w-7 rounded-lg',
}

export const buttonStyles = (variant: ButtonVariant = 'secondary', size: ButtonSize = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className)
