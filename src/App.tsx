function App() {
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
          <a href="https://app.usecanopy.com/c/tomlinson-and-co" target="_blank" rel="noopener noreferrer" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold text-sm transition">
            Get a Quote →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-blue-900 py-16 md:py-24 px-4 text-white overflow-hidden">
        <style>{`@keyframes kenBurnsCA{0%{transform:scale(1.0) translate(0%,0%)}25%{transform:scale(1.08) translate(-1%,-1.5%)}50%{transform:scale(1.12) translate(1.5%,-1%)}75%{transform:scale(1.08) translate(1%,1.5%)}100%{transform:scale(1.0) translate(0%,0%)}}.hero-bg-ca{animation:kenBurnsCA 30s ease-in-out infinite;will-change:transform;}`}</style>
        <div className="absolute inset-0 overflow-hidden"><div className="hero-bg-ca absolute inset-0 bg-cover bg-center" style={{backgroundImage:"url('/hero-auto.jpg')",opacity:0.4}}></div><div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-slate-900/70"></div></div>
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
            <a href="https://hoinsurance.wufoo.com/forms/z1ba066s0pme7eo/" target="_blank" rel="noopener noreferrer" className="bg-white hover:bg-blue-50 text-blue-800 px-7 py-4 rounded-xl font-bold text-base transition shadow-lg text-center">
              <span className="block text-xl mb-0.5">📝</span>
              Full Quote Form
              <span className="block text-xs font-normal opacity-60">Detailed application</span>
            </a>
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
            <a href="https://hoinsurance.wufoo.com/forms/z1ba066s0pme7eo/" target="_blank" rel="noopener noreferrer" className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg transition">
              Start Quote →
            </a>
            <a href="tel:800-616-1418" className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xl py-4 px-8 rounded-lg shadow-lg transition">
              📞 800-616-1418
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center">
        <h4 className="text-white font-bold text-xl mb-2">EasyCommercialAuto.com</h4>
        <p className="text-sm">A Tomlinson & Co Agency • Florida Licensed Since 1966</p>
        <p className="text-xs mt-4">© {new Date().getFullYear()} Tomlinson & Co Inc. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
