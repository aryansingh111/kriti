import { cn } from '@/lib/utils'

/**
 * The Kriti "K", drawn from /logo.png (a transparent PNG). The image is used as a mask and filled with the theme's
 * brand green, so it stays crisp at any size and turns light green on the dark theme.
 */
export function LogoMark({ className, shine }: { className?: string; shine?: boolean }) {
  return (
    <span
      role="img"
      aria-label="Kriti"
      className={cn('inline-block size-10 shrink-0', shine ? 'logo-shine' : 'bg-brand', className)}
      style={{
        WebkitMask: 'url(/logo.png) center / contain no-repeat',
        mask: 'url(/logo.png) center / contain no-repeat',
      }}
    />
  )
}

/** The full "Kriti" wordmark from /full-name.png, tinted the same way as the K mark. */
export function WordMark({ className }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Kriti"
      className={cn('inline-block h-10 shrink-0 bg-brand', className)}
      style={{
        aspectRatio: '2.255 / 1',
        WebkitMask: 'url(/full-name.png) center / contain no-repeat',
        mask: 'url(/full-name.png) center / contain no-repeat',
      }}
    />
  )
}

/** The brand as shown in headers: the full wordmark, or just the K when space is tight. */
export function Logo({ className, compact }: { className?: string; compact?: boolean }) {
  return <div className={cn('flex items-center', className)}>{compact ? <LogoMark /> : <WordMark />}</div>
}
