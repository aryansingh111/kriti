import type { LinkKind } from '@/types'

export interface LinkMeta {
  kind: LinkKind
  label: string
  /** key into ICON_DATA */
  icon: string
  urlPlaceholder: string
  /** substrings that identify the platform in a pasted URL */
  match?: string[]
}

export const LINK_META: LinkMeta[] = [
  { kind: 'linkedin', label: 'LinkedIn', icon: 'linkedin', urlPlaceholder: 'linkedin.com/in/aarav-sharma', match: ['linkedin.com'] },
  { kind: 'github', label: 'GitHub', icon: 'github', urlPlaceholder: 'github.com/aaravsharma', match: ['github.com'] },
  { kind: 'portfolio', label: 'Portfolio', icon: 'globe', urlPlaceholder: 'aaravsharma.dev' },
  { kind: 'website', label: 'Website', icon: 'globe', urlPlaceholder: 'www.example.com' },
  { kind: 'behance', label: 'Behance', icon: 'behance', urlPlaceholder: 'behance.net/yourname', match: ['behance.net'] },
  { kind: 'dribbble', label: 'Dribbble', icon: 'dribbble', urlPlaceholder: 'dribbble.com/yourname', match: ['dribbble.com'] },
  { kind: 'x', label: 'X (Twitter)', icon: 'x', urlPlaceholder: 'x.com/yourhandle', match: ['twitter.com', 'x.com'] },
  { kind: 'instagram', label: 'Instagram', icon: 'instagram', urlPlaceholder: 'instagram.com/yourhandle', match: ['instagram.com'] },
  { kind: 'youtube', label: 'YouTube', icon: 'youtube', urlPlaceholder: 'youtube.com/@yourchannel', match: ['youtube.com', 'youtu.be'] },
  { kind: 'medium', label: 'Medium', icon: 'medium', urlPlaceholder: 'medium.com/@yourname', match: ['medium.com'] },
  { kind: 'kaggle', label: 'Kaggle', icon: 'kaggle', urlPlaceholder: 'kaggle.com/yourname', match: ['kaggle.com'] },
  { kind: 'stackoverflow', label: 'Stack Overflow', icon: 'stackoverflow', urlPlaceholder: 'stackoverflow.com/users/…', match: ['stackoverflow.com'] },
  { kind: 'leetcode', label: 'LeetCode', icon: 'leetcode', urlPlaceholder: 'leetcode.com/u/yourname', match: ['leetcode.com'] },
  { kind: 'codeforces', label: 'Codeforces', icon: 'codeforces', urlPlaceholder: 'codeforces.com/profile/…', match: ['codeforces.com'] },
  { kind: 'codechef', label: 'CodeChef', icon: 'codechef', urlPlaceholder: 'codechef.com/users/…', match: ['codechef.com'] },
  { kind: 'hackerrank', label: 'HackerRank', icon: 'hackerrank', urlPlaceholder: 'hackerrank.com/profile/…', match: ['hackerrank.com'] },
  { kind: 'geeksforgeeks', label: 'GeeksforGeeks', icon: 'geeksforgeeks', urlPlaceholder: 'geeksforgeeks.org/user/…', match: ['geeksforgeeks.org'] },
  { kind: 'googlescholar', label: 'Google Scholar', icon: 'googlescholar', urlPlaceholder: 'scholar.google.com/citations?user=…', match: ['scholar.google'] },
  { kind: 'orcid', label: 'ORCID', icon: 'orcid', urlPlaceholder: 'orcid.org/0000-0000-0000-0000', match: ['orcid.org'] },
  { kind: 'researchgate', label: 'ResearchGate', icon: 'researchgate', urlPlaceholder: 'researchgate.net/profile/…', match: ['researchgate.net'] },
  { kind: 'figma', label: 'Figma', icon: 'figma', urlPlaceholder: 'figma.com/@yourname', match: ['figma.com'] },
  { kind: 'gitlab', label: 'GitLab', icon: 'gitlab', urlPlaceholder: 'gitlab.com/yourname', match: ['gitlab.com'] },
  { kind: 'notion', label: 'Notion', icon: 'notion', urlPlaceholder: 'yourname.notion.site', match: ['notion.site', 'notion.so'] },
  { kind: 'telegram', label: 'Telegram', icon: 'telegram', urlPlaceholder: 't.me/yourname', match: ['t.me', 'telegram.me'] },
  { kind: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp', urlPlaceholder: 'wa.me/919876543210', match: ['wa.me', 'whatsapp.com'] },
  { kind: 'facebook', label: 'Facebook', icon: 'facebook', urlPlaceholder: 'facebook.com/yourname', match: ['facebook.com'] },
  { kind: 'substack', label: 'Substack', icon: 'substack', urlPlaceholder: 'yourname.substack.com', match: ['substack.com'] },
  { kind: 'other', label: 'Other link', icon: 'link', urlPlaceholder: 'https://…' },
]

export const LINK_BY_KIND = Object.fromEntries(LINK_META.map((m) => [m.kind, m])) as Record<LinkKind, LinkMeta>

/** Work out the platform from a pasted URL (falls back to a generic website). */
export function guessLinkKind(url: string): LinkKind {
  const u = url.toLowerCase()
  if (!u.trim()) return 'other'
  for (const m of LINK_META) if (m.match?.some((s) => u.includes(s))) return m.kind
  return 'website'
}

export function looksLikeUrl(s: string): boolean {
  const v = s.trim()
  return /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?([/?#]\S*)?$/i.test(v)
}
