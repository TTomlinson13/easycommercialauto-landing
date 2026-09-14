import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function JotformModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden shadow-2xl" style={{ maxHeight: '90vh' }}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 bg-white/90 hover:bg-white text-slate-700 rounded-full w-9 h-9 flex items-center justify-center text-xl font-bold shadow transition"
          aria-label="Close"
        >×</button>
        <iframe
          src={`https://form.jotform.com/261320178590152`}
          title="Insurance Quote"
          allow="geolocation; microphone; camera"
          allowFullScreen
          style={{ width: '100%', height: '80vh', border: 'none', display: 'block', background: '#fff' }}
        />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Commercial-auto requirement checker                                 */
/* ------------------------------------------------------------------ */

type Status = 'ok' | 'add'

interface CheckItem {
  label: string
  status: Status
  tag: string
  note: string
}

const AUTO_SAMPLE =
  "Vendor shall maintain Business Automobile Liability covering all owned, hired, and non-owned " +
  "vehicles with a combined single limit of not less than $1,000,000 per accident. The Company shall be " +
  "named as an Additional Insured and such coverage shall be primary and non-contributory. A Waiver of " +
  "Subrogation shall be provided in favor of the Company. For any transportation of property for hire, " +
  "motor carrier filings (Form MCS-90) with $1,000,000 of FMCSA coverage are required. A Certificate of " +
  "Insurance with thirty (30) days' written notice of cancellation must be furnished prior to commencing services."

interface Rule {
  re: RegExp
  build: (t: string) => CheckItem
}

const AUTO_RULES: Rule[] = [
  {
    re: /business auto|automobile liability|commercial auto|auto liability/i,
    build: () => ({ label: 'Commercial Auto Liability', status: 'ok', tag: 'Covered',
      note: 'Your program carries Business Auto at $1M combined single limit — meets the required limit.' }),
  },
  {
    re: /hired and non[- ]?owned|non[- ]?owned|owned, hired|any auto|symbol 1/i,
    build: () => ({ label: 'Owned / Hired / Non-Owned', status: 'ok', tag: 'Covered',
      note: 'Owned, hired, and non-owned autos are all included — no gap for rentals or employee vehicles.' }),
  },
  {
    re: /additional insured/i,
    build: () => ({ label: 'Additional Insured', status: 'add', tag: "We'll add",
      note: 'We endorse the company onto your auto policy and show it on the certificate.' }),
  },
  {
    re: /primary and non[- ]?contributory|primary & non/i,
    build: () => ({ label: 'Primary & Non-Contributory', status: 'add', tag: "We'll endorse",
      note: 'Added by endorsement so your auto coverage responds first, as the contract requires.' }),
  },
  {
    re: /waiver of subrogation/i,
    build: () => ({ label: 'Waiver of Subrogation', status: 'add', tag: "We'll endorse",
      note: 'Waiver in favor of the company endorsed onto the auto policy.' }),
  },
  {
    re: /MCS[- ]?90|motor carrier|FMCSA|for hire|form e\b|form h\b|filing/i,
    build: () => ({ label: 'Motor Carrier Filing (MCS-90 / FMCSA)', status: 'add', tag: "We'll file",
      note: 'For for-hire trucking we add the MCS-90 endorsement and file the required federal/state forms.' }),
  },
  {
    re: /certificate of insurance|notice of cancellation|days.{0,12}(notice|cancellation)/i,
    build: () => ({ label: 'Certificate + Notice of Cancellation', status: 'add', tag: 'Same day',
      note: 'We issue the ACORD 25 with the required cancellation-notice language before you start.' }),
  },
]

function parseAuto(text: string): CheckItem[] {
  if (text.trim().length < 12) return []
  return AUTO_RULES.filter((r) => r.re.test(text)).map((r) => r.build(text))
}

function AutoRequirementChecker({ onQuote }: { onQuote: () => void }) {
  const [text, setText] = useState(AUTO_SAMPLE)
  const [items, setItems] = useState<CheckItem[]>(() => parseAuto(AUTO_SAMPLE))
  const [ran, setRan] = useState(true)

  const covered = items.filter((i) => i.status === 'ok').length
  const toAdd = items.length - covered

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      {/* input */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <span className="text-lg">📋</span>
          <span className="text-sm font-semibold text-slate-700">Paste the contract's auto-insurance requirements</span>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          aria-label="Paste contract auto insurance requirements"
          className="w-full min-h-[240px] p-4 text-sm text-slate-700 font-mono resize-y outline-none focus:bg-blue-50/40"
        />
        <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-3 items-center">
          <button
            onClick={() => { setItems(parseAuto(text)); setRan(true) }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition"
          >
            Check my coverage
          </button>
          <button
            onClick={() => { setText(AUTO_SAMPLE); setItems(parseAuto(AUTO_SAMPLE)); setRan(true) }}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Load a sample clause
          </button>
          <span className="ml-auto text-xs text-slate-400">Runs in your browser — nothing is sent.</span>
        </div>
      </div>

      {/* output */}
      <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
          <span className="text-lg">✅</span>
          <span className="text-sm font-semibold text-slate-700">Your checklist for this contract</span>
        </div>

        {!ran || items.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">
            {text.trim().length < 12
              ? 'Paste a requirements paragraph, then press “Check my coverage.”'
              : "We didn't spot standard auto-insurance requirements in that text. Send it over and we'll read it line by line."}
          </div>
        ) : (
          <>
            <div className="px-5 py-3 bg-blue-50 border-b border-slate-100 text-sm text-slate-600">
              <b className="text-slate-900">{items.length}</b> requirements found ·{' '}
              <b className="text-green-600">{covered}</b> already covered ·{' '}
              <b className="text-amber-600">{toAdd}</b> we'll handle before you sign.
            </div>
            <ul className="divide-y divide-slate-100">
              {items.map((it) => (
                <li key={it.label} className="flex gap-3 px-5 py-3.5">
                  <span
                    className={`mt-0.5 flex-none w-6 h-6 rounded-full grid place-items-center text-sm font-bold ${
                      it.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                    aria-hidden="true"
                  >
                    {it.status === 'ok' ? '✓' : '+'}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-slate-800 text-sm">{it.label}</span>
                      <span
                        className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-full ${
                          it.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {it.tag}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{it.note}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-3 items-center">
              <button
                onClick={onQuote}
                className="bg-yellow-400 hover:bg-yellow-300 text-black px-5 py-2.5 rounded-lg font-bold text-sm transition"
              >
                Get these endorsements — start a quote →
              </button>
              <span className="text-xs text-slate-400">Illustrative — final terms subject to your policy.</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function App() {
  const [showNavMenu, setShowNavMenu] = useState(false)
  const [showJotform, setShowJotform] = useState(false)
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
            <h1 className="text-2xl font-bold text-slate-800">Easy<span className="text-blue-600">Commercial</span>Auto</h1>
            <p className="text-xs text-slate-500">Business Vehicle Coverage Made Simple</p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/blog" className="hidden sm:inline text-blue-700 font-semibold hover:text-blue-900 transition text-sm">Blog</Link>
            <div className="relative">
            <button onClick={() => setShowNavMenu(!showNavMenu)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition">
              Get a Quote {showNavMenu ? '▲' : '▼'}
            </button>
            {showNavMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-blue-100 overflow-hidden" style={{zIndex:9999}}>
                <a href="https://app.usecanopy.com/c/tomlinson-and-co" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition border-b border-gray-100" onClick={() => setShowNavMenu(false)}>
                  <span className="text-xl">⚡</span><div className="text-left"><div className="font-bold text-blue-900 text-sm">Quick Quote</div><div className="text-xs text-gray-500">2 mins • Auto-fill</div></div>
                </a>
                <button onClick={() => { setShowJotform(true); setShowNavMenu(false) }} className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition border-b border-gray-100 w-full text-left">
                  <span className="text-xl">📝</span><div className="text-left"><div className="font-bold text-blue-900 text-sm">Full Quote Form</div><div className="text-xs text-gray-500">Detailed application</div></div>
                </button>
                <a href="tel:800-616-1418" className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition" onClick={() => setShowNavMenu(false)}>
                  <span className="text-xl">📞</span><div className="text-left"><div className="font-bold text-blue-900 text-sm">Call Us</div><div className="text-xs text-gray-500">800-616-1418</div></div>
                </a>
              </div>
            )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-blue-900 py-16 md:py-24 px-4 text-white overflow-hidden">
        <style>{`@keyframes kenBurnsCA{0%{transform:scale(1.0) translate(0%,0%)}25%{transform:scale(1.08) translate(-1%,-1.5%)}50%{transform:scale(1.12) translate(1.5%,-1%)}75%{transform:scale(1.08) translate(1%,1.5%)}100%{transform:scale(1.0) translate(0%,0%)}}.hero-bg-ca{animation:kenBurnsCA 30s ease-in-out infinite;will-change:transform;}`}</style>
        <div className="absolute inset-0 overflow-hidden"><div className="hero-bg-ca absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/hero-auto.jpg')",opacity:0.4,backgroundPosition:"top center"}}></div><div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-slate-900/70"></div></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-blue-300 font-semibold mb-2 uppercase">Commercial Auto Insurance</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Protect Your Business Vehicles</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            From single work trucks to entire fleets — get competitive commercial auto rates from top Florida carriers. 
            Liability, collision, comprehensive, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="https://app.usecanopy.com/c/tomlinson-and-co" target="_blank" rel="noopener noreferrer" className="bg-yellow-400 hover:bg-yellow-300 text-black px-7 py-4 rounded-xl font-bold text-base transition shadow-lg text-center">
              <span className="block text-xl mb-0.5">⚡</span>
              Quick Quote
              <span className="block text-xs font-normal opacity-75">2 mins • Auto-fill</span>
            </a>
            <button onClick={() => setShowJotform(true)} className="bg-white hover:bg-blue-50 text-blue-800 px-7 py-4 rounded-xl font-bold text-base transition shadow-lg text-center">
              <span className="block text-xl mb-0.5">📝</span>
              Full Quote Form
              <span className="block text-xs font-normal opacity-60">Detailed application</span>
            </button>
            <a href="tel:800-616-1418" className="bg-blue-700 hover:bg-blue-600 text-white px-7 py-4 rounded-xl font-bold text-base transition shadow-lg text-center">
              <span className="block text-xl mb-0.5">📞</span>
              Call Us
              <span className="block text-xs font-normal opacity-75">800-616-1418</span>
            </a>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-blue-900 py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
          <span>✓ Licensed Since 1966</span>
          <span>✓ A-Rated Carriers</span>
          <span>✓ Same-Day Quotes</span>
          <span>✓ All Fleet Sizes Welcome</span>
        </div>
      </section>

      {/* Vehicle Types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-12">Vehicles We Cover</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🚐', name: 'Vans' },
              { icon: '🛻', name: 'Pickup Trucks' },
              { icon: '🚛', name: 'Box Trucks' },
              { icon: '🚚', name: 'Semi Trucks' },
              { icon: '🚌', name: 'Buses' },
              { icon: '🚗', name: 'Company Cars' },
              { icon: '🏗️', name: 'Service Vehicles' },
              { icon: '🚜', name: 'Specialty Equipment' },
            ].map((item) => (
              <div key={item.name} className="bg-blue-50 p-6 rounded-lg text-center hover:bg-blue-100 transition">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-semibold text-slate-700">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage */}
      <section className="py-16 px-4 bg-slate-800 text-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Coverage Options</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-700 p-6 rounded-xl text-center">
              <h4 className="font-bold text-blue-400 mb-2">Liability</h4>
              <p className="text-sm text-slate-300">Bodily injury & property damage you cause</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-xl text-center">
              <h4 className="font-bold text-blue-400 mb-2">Collision</h4>
              <p className="text-sm text-slate-300">Damage to your vehicle from accidents</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-xl text-center">
              <h4 className="font-bold text-blue-400 mb-2">Comprehensive</h4>
              <p className="text-sm text-slate-300">Theft, vandalism, weather damage</p>
            </div>
            <div className="bg-slate-700 p-6 rounded-xl text-center">
              <h4 className="font-bold text-blue-400 mb-2">Hired & Non-Owned</h4>
              <p className="text-sm text-slate-300">Employee vehicles & rentals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contract requirement checker */}
      <section id="checker" className="py-16 px-4 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mb-8">
            <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2">The contract decoder</p>
            <h3 className="text-3xl font-bold text-slate-800 mb-3">Landed a contract that requires auto coverage? Check it here.</h3>
            <p className="text-slate-600">
              Vendor agreements, hauling contracts, and equipment leases bury their auto-insurance
              requirements in legalese — additional insured, waiver of subrogation, MCS-90 filings. Paste
              that paragraph and see what your policy already covers and what we'll add before you sign.
            </p>
          </div>
          <AutoRequirementChecker onQuote={() => setShowJotform(true)} />
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 px-4 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-slate-800 mb-8">Industries We Serve</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Contractors', 'Delivery Services', 'Landscaping', 'Plumbing', 'HVAC', 'Electricians', 'Cleaning Services', 'Food Trucks', 'Real Estate', 'Sales Teams'].map((ind) => (
              <span key={ind} className="bg-white px-4 py-2 rounded-full text-slate-700 shadow-sm">{ind}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Get Your Commercial Auto Quote</h3>
          <p className="text-blue-100 text-lg mb-8">Fast quotes, competitive rates, A-rated carriers.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="https://app.usecanopy.com/c/tomlinson-and-co" target="_blank" rel="noopener noreferrer" className="bg-white text-blue-700 font-bold text-xl py-4 px-8 rounded-lg shadow-lg hover:bg-slate-100 transition">
              Quick Quote (2 mins) →
            </a>
            <button onClick={() => setShowJotform(true)} className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg transition">
              Start Quote →
            </button>
            <a href="tel:800-616-1418" className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg transition">
              📞 800-616-1418
            </a>
          </div>
        </div>
      </section>

      {showJotform && <JotformModal onClose={() => setShowJotform(false)} />}
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center">
        <h4 className="text-white font-bold text-xl mb-2">EasyCommercialAuto.com</h4>
        <p className="text-sm">A Tomlinson & Co Agency • Florida Licensed Since 1966</p>

        {/* Sister Sites */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Also from Tomlinson & Co</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="https://tomlinsonandco.com" className="text-slate-400 hover:text-white transition">Tomlinson &amp; Co (Parent Agency)</a>
            <a href="https://easycommercialinsurance.com" className="text-slate-400 hover:text-white transition">Commercial Insurance (BOP/GL)</a>
            <a href="https://flawc.com" className="text-slate-400 hover:text-white transition">Workers Compensation</a>
            <a href="https://floridauto.com" className="text-slate-400 hover:text-white transition">Florida Auto Insurance</a>
          </div>
        </div>

        <p className="text-xs mt-6">© {new Date().getFullYear()} Tomlinson & Co Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
