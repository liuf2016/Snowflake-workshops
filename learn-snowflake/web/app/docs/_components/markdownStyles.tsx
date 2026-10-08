// Inline hex colors (never Tailwind color utilities) throughout this file are deliberate:
// the rendered doc is captured to canvas for PDF export (see DocViewer's exportPdf), and
// html2canvas cannot resolve Tailwind v4's oklch()-based palette — only literal rgb/hex
// values survive that capture reliably.

export const COLORS = {
  ink:      '#0f172a',
  body:     '#334155',
  sub:      '#475569',
  muted:    '#94a3b8',
  border:   '#e2e8f0',
  codeBg:   '#0f172a',
  codeText: '#f1f5f9',
  chipBg:   '#f1f5f9',
  link:     '#2563eb',
  rowAlt:   '#f8fafc',
} as const

type Kids = { children?: React.ReactNode }

// GitHub-style heading anchors, so links like SCHEDULE.md#day-03 land on the right heading.
function flatten(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(flatten).join('')
  if (node && typeof node === 'object' && 'props' in node) {
    return flatten((node as { props: { children?: React.ReactNode } }).props.children)
  }
  return ''
}

function headingId(children: React.ReactNode): string {
  return flatten(children).toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s/g, '-')
}

export const markdownComponents = {
  h1: ({ children }: Kids) => (
    <h1 style={{ fontSize: 22, fontWeight: 700, color: COLORS.ink, marginTop: 0, marginBottom: 16, paddingBottom: 12, borderBottom: `2px solid ${COLORS.border}` }}>
      {children}
    </h1>
  ),
  h2: ({ children }: Kids) => (
    <h2 id={headingId(children)} style={{ fontSize: 17, fontWeight: 700, color: COLORS.ink, marginTop: 28, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>
      {children}
    </h2>
  ),
  h3: ({ children }: Kids) => (
    <h3 id={headingId(children)} style={{ fontSize: 14, fontWeight: 700, color: COLORS.sub, marginTop: 22, marginBottom: 8 }}>
      {children}
    </h3>
  ),
  h4: ({ children }: Kids) => (
    <h4 style={{ fontSize: 13, fontWeight: 600, color: COLORS.sub, marginTop: 16, marginBottom: 4 }}>
      {children}
    </h4>
  ),
  p: ({ children }: Kids) => (
    <p style={{ fontSize: 13.5, color: COLORS.body, lineHeight: 1.7, marginBottom: 12 }}>
      {children}
    </p>
  ),
  ul: ({ children }: Kids) => (
    <ul style={{ listStyleType: 'disc', paddingLeft: 20, marginBottom: 12, fontSize: 13.5, color: COLORS.body }}>
      {children}
    </ul>
  ),
  ol: ({ children }: Kids) => (
    <ol style={{ listStyleType: 'decimal', paddingLeft: 20, marginBottom: 12, fontSize: 13.5, color: COLORS.body }}>
      {children}
    </ol>
  ),
  li: ({ children }: Kids) => (
    <li style={{ lineHeight: 1.7, marginBottom: 4 }}>{children}</li>
  ),
  strong: ({ children }: Kids) => (
    <strong style={{ fontWeight: 600, color: COLORS.ink }}>{children}</strong>
  ),
  em: ({ children }: Kids) => (
    <em style={{ fontStyle: 'italic', color: COLORS.sub }}>{children}</em>
  ),
  blockquote: ({ children }: Kids) => (
    <blockquote style={{ borderLeft: `4px solid ${COLORS.border}`, paddingLeft: 16, margin: '12px 0', color: COLORS.muted, fontStyle: 'italic', fontSize: 13.5 }}>
      {children}
    </blockquote>
  ),
  hr: () => <hr style={{ margin: '24px 0', border: 'none', borderTop: `1px solid ${COLORS.border}` }} />,
  a: ({ href, children }: Kids & { href?: string }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.link, textDecoration: 'underline' }}>
      {children}
    </a>
  ),
  code: ({ children, className }: Kids & { className?: string }) => {
    const isBlock = !!className
    return isBlock ? (
      <code style={{ display: 'block', backgroundColor: COLORS.codeBg, color: COLORS.codeText, borderRadius: 8, padding: '12px 16px', fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: 1.6, overflowX: 'auto', marginBottom: 12 }}>
        {children}
      </code>
    ) : (
      <code style={{ backgroundColor: COLORS.chipBg, color: COLORS.ink, borderRadius: 4, padding: '2px 5px', fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
        {children}
      </code>
    )
  },
  pre: ({ children }: Kids) => (
    <pre style={{ backgroundColor: COLORS.codeBg, borderRadius: 8, overflowX: 'auto', marginBottom: 12 }}>
      {children}
    </pre>
  ),
  table: ({ children }: Kids) => (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>{children}</table>
    </div>
  ),
  thead: ({ children }: Kids) => (
    <thead style={{ backgroundColor: COLORS.chipBg }}>{children}</thead>
  ),
  tbody: ({ children }: Kids) => <tbody>{children}</tbody>,
  tr: ({ children }: Kids) => <tr>{children}</tr>,
  th: ({ children }: Kids) => (
    <th style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11.5, fontWeight: 600, color: COLORS.sub, border: `1px solid ${COLORS.border}` }}>
      {children}
    </th>
  ),
  td: ({ children }: Kids) => (
    <td style={{ padding: '8px 12px', fontSize: 12.5, color: COLORS.body, border: `1px solid ${COLORS.border}`, verticalAlign: 'top' }}>
      {children}
    </td>
  ),
}
