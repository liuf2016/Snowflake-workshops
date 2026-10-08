'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { DocGroup, DocMeta } from '../../../lib/docs'

const GROUPS: { group: DocGroup; label: string }[] = [
  { group: 'course',  label: 'Course manual' },
  { group: 'lessons', label: 'Lessons' },
  { group: 'quizzes', label: 'Quizzes (taken)' },
  { group: 'work',    label: 'My work' },
  { group: 'system',  label: 'System files' },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
      {children}
    </p>
  )
}

function DocLink({ doc, active }: { doc: DocMeta; active: boolean }) {
  return (
    <Link
      href={`/docs/${doc.slug}`}
      className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
        doc.kind === 'source' && doc.group === 'work' ? 'font-mono text-[12px] ' : ''
      }${
        active
          ? 'bg-slate-100 font-medium text-slate-900'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
      title={doc.description || doc.file}
    >
      {doc.title}
    </Link>
  )
}

export default function Sidebar({ docs }: { docs: DocMeta[] }) {
  const pathname = usePathname()
  const activeSlug = pathname.startsWith('/docs/') ? pathname.slice('/docs/'.length) : null

  return (
    <aside className="w-72 flex-none overflow-y-auto border-r border-slate-200 bg-white px-3 py-5 print:hidden">
      {GROUPS.map(({ group, label }) => {
        const items = docs.filter(d => d.group === group)
        if (items.length === 0) return null
        return (
          <div key={group} className="mb-6 space-y-0.5">
            <SectionLabel>{label}</SectionLabel>
            {items.map(doc => (
              <DocLink key={doc.slug} doc={doc} active={doc.slug === activeSlug} />
            ))}
          </div>
        )
      })}
    </aside>
  )
}
