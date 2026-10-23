import { Analytics } from '@vercel/analytics/react'
import { AnimatePresence, motion } from 'motion/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useParams } from 'react-router'
import { Toaster } from 'sonner'
import { Home } from '@/components/home/Home'
import { LogoLoader } from '@/components/LogoLoader'
import { FeedbackPage } from '@/components/pages/FeedbackPage'
import { CookiesPage, PrivacyPage, TermsPage } from '@/components/pages/legal/PolicyPages'
import { NotFound } from '@/components/pages/NotFound'
import { ResumesPage } from '@/components/pages/ResumesPage'
import { BackToTop } from '@/components/BackToTop'
import { ConsentBanner } from '@/components/ConsentBanner'
import { SiteNav } from '@/components/SiteNav'
import { scrubAnalytics } from '@/lib/analytics'
import { trackPageView } from '@/lib/ga'
import { startLive } from '@/lib/live'
import { isRail, paths, showsSiteNav } from '@/lib/routes'
import { useTheme } from '@/lib/theme'
import { useSeo } from '@/seo/useSeo'
import { useStore } from '@/store'

const Editor = lazy(() => import('@/components/editor/Editor'))
const TemplatesPage = lazy(() => import('@/components/templates/TemplatesPage').then((m) => ({ default: m.TemplatesPage })))
const IndiaPage = lazy(() => import('@/components/pages/IndiaPage').then((m) => ({ default: m.IndiaPage })))
const OtherTemplatesPage = lazy(() => import('@/components/templates/OtherTemplatesPage').then((m) => ({ default: m.OtherTemplatesPage })))
const ReviewPage = lazy(() => import('@/components/review/ReviewPage').then((m) => ({ default: m.ReviewPage })))

const Loading = LogoLoader

/** Plays the logo animation over the page for a moment, then lets it zoom away. Mounted once per page change. */
function RouteFlash() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const id = window.setTimeout(() => setVisible(false), 650)
    return () => window.clearTimeout(id)
  }, [])
  return <AnimatePresence>{visible && <LogoLoader key="flash" />}</AnimatePresence>
}

/** Fades each page in and returns to the top when the page (not just the editor panel) changes. */
function Shell() {
  const { pathname } = useLocation()
  useSeo()
  // the "people online now" count: this visitor is counted for as long as the site is open and in use
  useEffect(() => startLive(), [])
  // after useSeo, so the page title is already the new page's when Google Analytics reads it
  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])
  const pageKey = pathname.replace(/\/edit\/[^/]+$/, '/edit')
  // flash the logo on every page change, but not on first load (a full reload already shows the splash from index.html)
  const [seenKey, setSeenKey] = useState(pageKey)
  const [flashKey, setFlashKey] = useState<string | null>(null)
  if (pageKey !== seenKey) {
    setSeenKey(pageKey)
    setFlashKey(pageKey)
  }

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pageKey])

  return (
    <>
      {/* the header lives here, outside the page that fades, so it stays put and its pill can slide between pages */}
      {showsSiteNav(pathname) && <SiteNav />}
      {showsSiteNav(pathname) && <BackToTop />}
      {showsSiteNav(pathname) && <ConsentBanner />}
      <motion.div key={pageKey} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.16 }}>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
        {flashKey && <RouteFlash key={flashKey} />}
      </motion.div>
    </>
  )
}

/** Everything under /resumes/:id - makes that resume the active one, or sends you to your list if it does not exist. */
function ResumeRoute() {
  const { id = '' } = useParams()
  const exists = useStore((s) => s.docs.some((d) => d.id === id))
  const active = useStore((s) => s.activeId === id)
  const openDoc = useStore((s) => s.openDoc)

  useEffect(() => {
    if (exists && !active) openDoc(id)
  }, [exists, active, id, openDoc])

  if (!exists) return <Navigate to={paths.resumes} replace />
  if (!active) return <Loading />
  return <Outlet />
}

/** /resumes/:id/edit lands on Design for sample content and on Content once you have started typing. */
function EditIndex() {
  const { id = '' } = useParams()
  const isSample = useStore((s) => s.isSample)
  return <Navigate to={paths.edit(id, isSample ? 'design' : 'content')} replace />
}

function EditPanel() {
  const { id = '', panel } = useParams()
  if (!isRail(panel)) return <Navigate to={paths.edit(id)} replace />
  return <Editor rail={panel} />
}

export default function App() {
  const { dark } = useTheme()

  return (
    <>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="templates" element={<TemplatesPage mode="new" />} />
          <Route path="made-for-india" element={<IndiaPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="resumes" element={<ResumesPage />} />
          <Route path="resumes/:id" element={<ResumeRoute />}>
            <Route index element={<EditIndex />} />
            <Route path="edit" element={<EditIndex />} />
            <Route path="edit/:panel" element={<EditPanel />} />
            <Route path="templates" element={<TemplatesPage mode="switch" />} />
            <Route path="other-templates" element={<OtherTemplatesPage />} />
            <Route path="review" element={<ReviewPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      {/* Vercel Web Analytics: cookie-free page-view counts (see the Privacy Policy) */}
      <Analytics beforeSend={scrubAnalytics} />
      <Toaster position="bottom-center" theme={dark ? 'dark' : 'light'} toastOptions={{ style: { borderRadius: 6, fontFamily: 'var(--font-sans)' } }} />
    </>
  )
}
