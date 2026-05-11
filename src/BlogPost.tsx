import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

interface Post {
  id: number
  slug: string
  title: string
  date: string
  summary: string
  body: string
  tags: string[]
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch('/blog/posts.json')
      .then(r => r.json())
      .then((data: Post[]) => {
        const found = data.find(p => p.slug === slug)
        if (found) {
          setPost(found)
        } else {
          setNotFound(true)
        }
        setLoading(false)
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [slug])

  // Inject JSON-LD schema once post loads
  useEffect(() => {
    if (!post) return
    const existingScript = document.getElementById('blog-jsonld')
    if (existingScript) existingScript.remove()

    const script = document.createElement('script')
    script.id = 'blog-jsonld'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: 'EasyCommercialAuto.com — Tomlinson & Co',
        url: 'https://easycommercialauto.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'EasyCommercialAuto.com',
        url: 'https://easycommercialauto.com'
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://easycommercialauto.com/blog/${post.slug}`
      },
      keywords: post.tags.join(', ')
    })
    document.head.appendChild(script)

    // Also update page title
    document.title = `${post.title} | EasyCommercialAuto.com`

    return () => {
      const s = document.getElementById('blog-jsonld')
      if (s) s.remove()
    }
  }, [post])

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="bg-blue-800 text-white text-sm py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <span>🚛 Florida Commercial Auto Insurance</span>
          <a href="tel:800-616-1418" className="hover:text-blue-200">📞 800-616-1418</a>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link to="/" className="text-2xl font-bold text-slate-800 hover:text-blue-700 transition">
              Easy<span className="text-blue-600">Commercial</span>Auto
            </Link>
            <p className="text-xs text-slate-500">Business Vehicle Coverage Made Simple</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="hidden sm:inline text-blue-700 font-semibold hover:text-blue-900 transition">Blog</Link>
            <a href="tel:800-616-1418" className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition">
              📞 800-616-1418
            </a>
          </div>
        </div>
      </header>

      {loading && (
        <div className="text-center text-gray-500 py-32">Loading…</div>
      )}

      {notFound && !loading && (
        <div className="text-center py-32">
          <h1 className="text-3xl font-bold text-gray-700 mb-4">Post Not Found</h1>
          <Link to="/blog" className="text-blue-600 underline hover:text-blue-800">← Back to Blog</Link>
        </div>
      )}

      {post && !loading && (
        <>
          {/* Back Link + Hero */}
          <section className="bg-blue-900 py-10 px-4">
            <div className="max-w-3xl mx-auto">
              <Link to="/blog" className="inline-flex items-center gap-2 text-blue-300 hover:text-white text-sm font-semibold mb-5 transition">
                ← Back to Blog
              </Link>
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-blue-700 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">{post.title}</h1>
              <p className="text-blue-300 text-sm">
                {new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                {' · '}EasyCommercialAuto.com
              </p>
            </div>
          </section>

          {/* Post Body */}
          <section className="py-12 px-4">
            <div className="max-w-3xl mx-auto">
              <div
                className="prose prose-lg prose-headings:text-slate-800 prose-a:text-blue-600 prose-strong:text-slate-800 max-w-none text-gray-700 leading-relaxed
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                  [&_li]:text-gray-700
                  [&_p]:mb-4"
                dangerouslySetInnerHTML={{ __html: post.body }}
              />

              {/* CTA Box */}
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold text-slate-800 mb-2">Questions About Commercial Auto Insurance?</h3>
                <p className="text-slate-700 mb-4">Our team specializes in Florida commercial auto and fleet insurance. We compare top-rated carriers to find the best rate for your business.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href="tel:800-616-1418"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition"
                  >
                    📞 Call 800-616-1418
                  </a>
                  <a
                    href="https://app.usecanopy.com/c/tomlinson-and-co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-bold py-3 px-6 rounded-xl transition"
                  >
                    Get Free Quote →
                  </a>
                </div>
              </div>

              {/* Back to blog */}
              <div className="mt-8 text-center">
                <Link to="/blog" className="text-blue-600 hover:text-blue-800 font-semibold underline text-sm">
                  ← Back to Blog
                </Link>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 mt-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-lg text-white mb-2">Protecting Florida Business Vehicles — From Single Trucks to Full Fleets</p>
          <p className="text-sm">EasyCommercialAuto.com • Florida Commercial Auto Specialists<br/>A Tomlinson &amp; Co Agency</p>
          <p className="text-xs mt-4">© {new Date().getFullYear()} Tomlinson &amp; Co Inc. All rights reserved.</p>
          <p className="text-xs mt-2">
            <Link to="/" className="text-gray-400 hover:text-white underline mr-4">Home</Link>
            <Link to="/blog" className="text-gray-400 hover:text-white underline mr-4">Blog</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
