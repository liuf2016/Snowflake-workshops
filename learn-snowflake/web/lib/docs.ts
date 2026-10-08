import { readFile } from 'fs/promises'
import { existsSync, readFileSync, readdirSync } from 'fs'
import path from 'path'

export type DocGroup = 'course' | 'lessons' | 'quizzes' | 'work' | 'system'

export interface DocMeta {
  slug:        string
  title:       string
  description: string
  /** Path relative to the repo root, always with forward slashes. */
  file:        string
  /** Sidebar group. "course" = the manual (syllabus, schedule, progress, ...),
   *  "lessons" = per-day lesson notes, "quizzes" = released quiz banks and stage tests,
   *  "work" = the student's lab/homework files,
   *  "system" = coding-agent entry points (CLAUDE.md, AGENTS.md, SKILL.md). */
  group:       DocGroup
  /** "markdown" renders as formatted prose; "source" shows the file as-authored
   *  (system docs, .sql, .py). */
  kind:        'markdown' | 'source'
}

// This file lives at web/lib/docs.ts; repo root is one level up from web/.
export const ROOT = path.join(process.cwd(), '..')

// Where docs are discovered. Every matching file shows up automatically — add a directory
// here, not a per-file entry, to bring a new location into the viewer.
const SCAN: { dir: string; group: DocGroup; recursive: boolean; exts: string[] }[] = [
  { dir: '.',       group: 'course',  recursive: false, exts: ['.md'] },
  { dir: 'lessons', group: 'lessons', recursive: false, exts: ['.md'] },
  { dir: 'quizzes', group: 'quizzes', recursive: false, exts: ['.md'] },
  { dir: 'work',    group: 'work',    recursive: true,  exts: ['.md', '.sql', '.py'] },
]

// Filenames classified as "system" docs (coding-agent entry points).
const SYSTEM_DOC_NAMES = new Set(['CLAUDE.md', 'AGENTS.md', 'SKILL.md'])

// Course docs listed in this order (the manual's reading order); anything else follows by title.
const COURSE_ORDER = ['README.md', 'SYLLABUS.md', 'SCHEDULE.md', 'PROGRESS.md', 'NOTES.md']

// Quiz files carry one of these markers on their first line. Sealed files are hidden from the
// viewer until the instructor releases them (after the student has taken the quiz).
const SEALED_MARKER = '<!-- status: sealed -->'
const STATUS_MARKER = /^<!-- status: \w+ -->\r?\n?/

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', 'web', 'data'])

function stripMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*([^*]*)\*\*/g, '$1')
    .replace(/\*([^*]*)\*/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .trim()
}

const MAX_DESCRIPTION_LENGTH = 240

/** Title = the file's first `# ` heading. Description = the first paragraph after it. Both
 *  fall back gracefully (filename, empty string) when a doc doesn't follow that shape. */
function extractTitleAndDescription(content: string, fallbackTitle: string): { title: string; description: string } {
  const lines = content.split('\n')

  let title = fallbackTitle
  let titleLineIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith('# ')) {
      title = stripMarkdown(line.slice(2).trim())
      titleLineIndex = i
      break
    }
  }

  let description = ''
  for (let i = titleLineIndex + 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line === '') continue
    if (line.startsWith('#')) break // next heading reached with no paragraph in between

    const paragraph: string[] = []
    for (let j = i; j < lines.length && lines[j].trim() !== ''; j++) {
      paragraph.push(lines[j].trim())
    }
    description = stripMarkdown(paragraph.join(' '))
    break
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    description = description.slice(0, MAX_DESCRIPTION_LENGTH).replace(/\s+\S*$/, '') + '…'
  }

  return { title, description }
}

function slugify(relPath: string): string {
  return relPath
    .replace(/\.md$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function listFiles(dirPath: string, recursive: boolean): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const abs = path.join(/* turbopackIgnore: true */ dirPath, entry.name)
    if (entry.isDirectory()) {
      if (recursive && !SKIP_DIRS.has(entry.name) && !entry.name.startsWith('.')) out.push(...listFiles(abs, true))
    } else if (entry.isFile()) {
      out.push(abs)
    }
  }
  return out
}

function discoverDocs(): DocMeta[] {
  const docs: DocMeta[] = []

  for (const { dir, group, recursive, exts } of SCAN) {
    const dirPath = path.join(/* turbopackIgnore: true */ ROOT, dir)
    if (!existsSync(dirPath)) continue

    for (const absPath of listFiles(dirPath, recursive)) {
      const name = path.basename(absPath)
      const ext = path.extname(name).toLowerCase()
      if (!exts.includes(ext)) continue

      const content = readFileSync(absPath, 'utf-8')
      if (content.trim() === '') continue // skip empty placeholder files
      if (content.startsWith(SEALED_MARKER)) continue // not yet taken — keep it out of sight

      const file = path.relative(ROOT, absPath).split(path.sep).join('/')
      const isSystem = SYSTEM_DOC_NAMES.has(name)
      const isMarkdown = ext === '.md'

      let title: string
      let description = ''
      if (isMarkdown) {
        ({ title, description } = extractTitleAndDescription(content, name.replace(/\.md$/i, '').replace(/[-_]+/g, ' ')))
      } else {
        title = group === 'work' ? file.slice('work/'.length) : name
      }

      docs.push({
        slug:  slugify(file),
        title,
        description,
        file,
        group: isSystem ? 'system' : group,
        kind:  isSystem || !isMarkdown ? 'source' : 'markdown',
      })
    }
  }

  const courseRank = (d: DocMeta) => {
    const i = COURSE_ORDER.indexOf(d.file)
    return i === -1 ? COURSE_ORDER.length : i
  }

  docs.sort((a, b) => {
    if (a.group === 'course' && b.group === 'course') {
      return courseRank(a) - courseRank(b) || a.title.localeCompare(b.title)
    }
    // Lessons and work files sort by path, so day-01 < day-02 regardless of their titles.
    return a.file.localeCompare(b.file)
  })

  return docs
}

/** Re-scanned on every request, so a lesson or homework file written mid-course shows up
 *  on the next page load without restarting the server. */
export function listDocs(): DocMeta[] {
  return discoverDocs()
}

export function getDoc(slug: string): DocMeta | undefined {
  return listDocs().find(d => d.slug === slug)
}

/** Maps a repo-relative file path to its viewer slug, for resolving links between docs. */
export function slugIndex(): Record<string, string> {
  return Object.fromEntries(listDocs().map(d => [d.file, d.slug]))
}

export function docExists(doc: DocMeta): boolean {
  return existsSync(path.join(ROOT, doc.file))
}

export async function readDocContent(doc: DocMeta): Promise<string> {
  const content = await readFile(path.join(ROOT, doc.file), 'utf-8')
  if (content.startsWith(SEALED_MARKER)) return '# Sealed\n\nThis quiz has not been taken yet.'
  return content.replace(STATUS_MARKER, '')
}
