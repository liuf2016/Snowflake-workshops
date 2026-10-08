import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex-none border-b border-slate-200 bg-white print:hidden">
      <div className="flex items-center gap-1 px-6 py-2.5">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white mr-3">
          ❄
        </div>
        <Link href="/docs/readme" className="text-sm font-semibold text-slate-900 mr-6">
          learn-snowflake
        </Link>
        <nav className="flex gap-4 text-sm text-slate-500">
          <Link href="/docs/schedule" className="hover:text-slate-900">Schedule</Link>
          <Link href="/docs/progress" className="hover:text-slate-900">Progress</Link>
        </nav>
      </div>
    </header>
  )
}
