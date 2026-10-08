'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { DocMeta } from '../../../lib/docs'
import { COLORS, markdownComponents } from './markdownStyles'

/** Resolve a relative link (e.g. `lessons/day-01.md`, `../SCHEDULE.md#day-2`) against the
 *  current doc's directory, returning the repo-relative path and any #anchor. */
function resolveRelative(fromFile: string, href: string): { file: string; hash: string } {
  const [target, hash = ''] = href.split('#')
  const parts = fromFile.split('/').slice(0, -1)
  for (const seg of target.split('/')) {
    if (seg === '' || seg === '.') continue
    if (seg === '..') parts.pop()
    else parts.push(seg)
  }
  return { file: parts.join('/'), hash: hash ? `#${hash}` : '' }
}

export default function DocViewer({ doc, content, slugs }: { doc: DocMeta; content: string; slugs: Record<string, string> }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)
  const isSource = doc.kind === 'source'

  // Links to other course docs stay inside the viewer; everything else opens in a new tab.
  const components = {
    ...markdownComponents,
    a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
      if (href && !/^[a-z]+:/i.test(href) && !href.startsWith('#')) {
        const { file, hash } = resolveRelative(doc.file, href)
        const slug = slugs[file]
        if (slug) {
          return (
            <Link href={`/docs/${slug}${hash}`} style={{ color: COLORS.link, textDecoration: 'underline' }}>
              {children}
            </Link>
          )
        }
      }
      return markdownComponents.a({ href, children })
    },
  }

  function exportTxt() {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = doc.file.split('/').pop() ?? `${doc.slug}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function exportPdf() {
    if (!contentRef.current || exporting) return
    setExporting(true)
    try {
      const { default: jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ unit: 'pt', format: 'letter' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const margin = 48
      await pdf.html(contentRef.current, {
        margin: [margin, margin, margin, margin],
        autoPaging: 'text',
        width: pageWidth - margin * 2,
        windowWidth: contentRef.current.scrollWidth,
      })
      pdf.save(`${doc.slug}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar — screen only */}
      <div className="flex-none flex items-center gap-2 px-6 py-3 border-b border-slate-200 bg-white text-xs text-slate-500 print:hidden">
        <Link href="/docs" className="hover:text-slate-800 transition-colors">
          Docs
        </Link>
        <span>›</span>
        <span className="text-slate-700 font-medium">{doc.title}</span>
        <span className="font-mono text-slate-400">({doc.file})</span>
        <button
          type="button"
          onClick={isSource ? exportTxt : exportPdf}
          disabled={exporting}
          title={isSource ? 'Download this file as-authored' : 'Export this document as a PDF'}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          <span>⎙</span> {exporting ? 'Preparing…' : isSource ? 'Download' : 'Print'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          <div ref={contentRef} style={{ backgroundColor: '#ffffff' }}>
            {isSource ? (
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 12.5,
                  lineHeight: 1.6,
                  color: COLORS.ink,
                  backgroundColor: COLORS.chipBg,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                {content}
              </pre>
            ) : (
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
