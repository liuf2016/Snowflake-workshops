import { listDocs } from '../../lib/docs'
import Sidebar from './_components/Sidebar'

// Docs are read from disk on every request so new lessons/homework appear without a rebuild.
export const dynamic = 'force-dynamic'

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full print:block">
      <Sidebar docs={listDocs()} />
      <main className="flex-1 overflow-y-auto print:overflow-visible">
        {children}
      </main>
    </div>
  )
}
