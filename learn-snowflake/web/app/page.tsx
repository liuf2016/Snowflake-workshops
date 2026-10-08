import { redirect } from 'next/navigation'

// The course manual *is* the site — land on its front page.
export default function HomePage() {
  redirect('/docs/readme')
}
