import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/Button'
import { getChoice, setChoice, subscribeChoice } from '@/lib/ga'

/** On the Cookies page: shows the visitor's analytics choice and lets them change it at any time. */
export function AnalyticsChoice() {
  const choice = useSyncExternalStore(subscribeChoice, getChoice, () => null)
  const on = choice === 'granted'
  return (
    <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-5">
      <p className="text-[15px] font-bold text-ink">
        Google Analytics is currently{' '}
        <span className={on ? 'text-brand' : 'text-muted'}>{on ? 'on' : choice === 'denied' ? 'off' : 'off (you have not chosen yet)'}</span>.
      </p>
      <p className="mt-1 text-[14px] leading-snug text-muted">{on ? 'Turning it off stops the counting and removes its cookies from this browser.' : 'Turning it on lets us count which pages are used, with cookies.'}</p>
      <div className="mt-3.5">
        {on ? (
          <Button variant="secondary" size="sm" className="!rounded-full" onClick={() => setChoice('denied')}>
            Turn off analytics
          </Button>
        ) : (
          <Button variant="primary" size="sm" className="!rounded-full" onClick={() => setChoice('granted')}>
            Turn on analytics
          </Button>
        )}
      </div>
    </div>
  )
}
