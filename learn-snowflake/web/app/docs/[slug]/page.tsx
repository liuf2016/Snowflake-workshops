import { notFound } from 'next/navigation'
import { docExists, getDoc, readDocContent, slugIndex } from '../../../lib/docs'
import DocViewer from '../_components/DocViewer'

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = getDoc(slug)
  if (!doc || !docExists(doc)) notFound()

  const content = await readDocContent(doc)
  return <DocViewer doc={doc} content={content} slugs={slugIndex()} />
}
