import type { Metadata } from 'next'
import './globals.css'
import Header from './_components/Header'

export const metadata: Metadata = {
  title: 'learn-snowflake',
  description: 'A 20-day hands-on Snowflake course for data analysts — manual, lessons and progress.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <div className="flex h-full flex-col bg-slate-50 print:h-auto print:block print:bg-white">
          <Header />
          <div className="flex-1 overflow-hidden print:overflow-visible">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
