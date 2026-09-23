/**
 * Generate public/sitemap.xml from the blog data.
 *
 * The sitemap used to be hand-maintained, so it drifted: by 2026-09 it listed
 * five posts while public/blog/posts.json held seven. The two newest — the ones
 * most worth crawling — were invisible to search engines.
 *
 * Generating it from the same file the app renders from means the two cannot
 * disagree. Run `npm run sitemap` after adding a post.
 *
 * NOTE: deliberately NOT wired into `build` here. This repo's build script is a
 * no-op on purpose — Hostinger serves the committed dist/ rather than building
 * from source, so making `build` do real work would change how the host deploys
 * this site. Keep it manual until that changes.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ORIGIN = 'https://easycommercialauto.com'

const POSTS = join(ROOT, 'public', 'blog', 'posts.json')
const OUT = join(ROOT, 'public', 'sitemap.xml')

const raw = JSON.parse(readFileSync(POSTS, 'utf-8'))
const posts = Array.isArray(raw) ? raw : (raw.posts ?? [])

if (!posts.length) {
  console.error('sitemap: no posts found in public/blog/posts.json')
  process.exit(1)
}

/** Newest first, so the freshest content sits at the top of the file. */
const byDateDesc = (a, b) => String(b.date ?? '').localeCompare(String(a.date ?? ''))
const sorted = [...posts].sort(byDateDesc)
const newest = sorted[0]?.date ?? new Date().toISOString().slice(0, 10)

const entry = (loc, lastmod, priority) =>
  ['  <url>',
   `    <loc>${loc}</loc>`,
   `    <lastmod>${lastmod}</lastmod>`,
   `    <priority>${priority}</priority>`,
   '  </url>'].join('\n')

// The home page and blog index are only as fresh as the newest post on them,
// so they take its date rather than today's — a lastmod that moves on every
// build is noise, and crawlers learn to ignore it.
const urls = [
  entry(`${ORIGIN}/`, newest, '1.0'),
  entry(`${ORIGIN}/blog`, newest, '0.8'),
  ...sorted.map((p) => {
    if (!p.slug) throw new Error(`post ${p.id ?? '?'} has no slug`)
    return entry(`${ORIGIN}/blog/${p.slug}`, p.date ?? newest, '0.7')
  }),
]

writeFileSync(
  OUT,
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.join('\n') +
    '\n</urlset>\n',
  'utf-8',
)

console.log(`sitemap: ${urls.length} URLs written (${posts.length} posts) -> public/sitemap.xml`)
