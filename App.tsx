
import React, { useState, useEffect, useCallback, useRef } from 'react';

const SHARED_LINKS = [
  'https://i.imgur.com/6n3gTAp.png',
  'https://i.imgur.com/6wY4sTQ.png',
  'https://i.imgur.com/EN8EgZS.png',
  'https://i.imgur.com/5AWe35G.png',
  'https://i.imgur.com/NATHOLc.jpeg',
  'https://i.imgur.com/PZ1s6Fe.jpeg',
  'https://i.imgur.com/xjdi25t.jpeg',
  'https://i.imgur.com/4lA2V3f.jpeg'
];

const PROFILE_PHOTO = 'https://i.imgur.com/Syh4bbe.png';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'contact' | 'about'>('home');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const galleryItems = SHARED_LINKS.map((link, i) => ({
    id: i,
    url: link,
    title: `Entry ${i + 1}`
  }));

  const resetTransform = () => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
  };

  const openModal = (index: number) => {
    setSelectedIndex(index);
    resetTransform();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = useCallback(() => {
    setSelectedIndex(null);
    resetTransform();
    document.body.style.overflow = 'auto';
  }, []);

  const goToNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetTransform();
    setSelectedIndex((prev) => 
      prev !== null ? (prev + 1) % galleryItems.length : null
    );
  }, [galleryItems.length]);

  const goToPrevious = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    resetTransform();
    setSelectedIndex((prev) => 
      prev !== null ? (prev - 1 + galleryItems.length) % galleryItems.length : null
    );
  }, [galleryItems.length]);

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const delta = e.deltaY * -0.001;
    setZoomLevel(prev => {
      const next = Math.min(Math.max(prev + delta, 1), 5);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (zoomLevel <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.current.x;
    const newY = e.clientY - dragStart.current.y;
    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex !== null) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'ArrowLeft') goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, goToNext, goToPrevious, closeModal]);

  const currentImage = selectedIndex !== null ? galleryItems[selectedIndex].url : null;

  return (
    <div className="min-h-screen bg-blue-50 text-black font-sans selection:bg-black selection:text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto pt-20 pb-16 px-8 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-blue-100 gap-8">
        <button onClick={() => setView('home')} className="text-left group">
          <h1 className="text-4xl font-light tracking-[0.2em] uppercase font-calibri transition-opacity group-hover:opacity-60 text-black">Mark Natad</h1>
          <p className="text-black text-[10px] uppercase tracking-[0.4em] mt-4 opacity-70">Visual Explorer — Creative Repository</p>
        </button>
        
        <nav className="flex items-center gap-8 md:gap-12 text-[11px] uppercase tracking-[0.3em] font-medium">
          <button 
            onClick={() => setView('home')}
            className={`${view === 'home' ? 'opacity-100 border-b border-black' : 'opacity-40'} text-black hover:opacity-100 transition-all pb-1`}
          >
            Home
          </button>
          <button 
            onClick={() => setView('about')}
            className={`${view === 'about' ? 'opacity-100 border-b border-black' : 'opacity-40'} text-black hover:opacity-100 transition-all pb-1`}
          >
            About Me
          </button>
          <button 
            onClick={() => setView('contact')}
            className={`${view === 'contact' ? 'opacity-100 border-b border-black' : 'opacity-40'} text-black hover:opacity-100 transition-all pb-1`}
          >
            Contact
          </button>
          {view === 'home' && (
            <div className="text-black opacity-30 font-mono hidden sm:block">
              Idx [{galleryItems.length}]
            </div>
          )}
        </nav>
      </header>

      {view === 'home' && (
        <main className="max-w-6xl mx-auto px-8 py-24 animate-fade-in">
          <section>
            <div className="mb-12 flex items-center gap-6">
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-black whitespace-nowrap opacity-60">The Collection</h3>
              <div className="h-px w-full bg-gradient-to-r from-black/10 to-transparent"></div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {galleryItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => openModal(index)}
                  className="group relative aspect-[4/5] overflow-hidden bg-white border border-blue-100 transition-all duration-700 hover:border-black hover:shadow-xl"
                >
                  <img 
                    src={item.url} 
                    alt={item.title}
                    className="w-full h-full object-cover grayscale opacity-80 transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-50/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-black mb-1 opacity-60">Perspective {item.id + 1}</span>
                    <span className="text-xs font-light tracking-widest text-black">VIEW FULL SIZE</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {view === 'about' && (
        <main className="max-w-6xl mx-auto px-8 py-24 animate-fade-in">
          <section className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
            <div className="relative group shrink-0">
              <div 
                className="absolute -inset-4 bg-blue-200/50 blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-1000 rounded-full"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
              ></div>
              <div 
                className="relative w-64 h-64 md:w-80 md:h-80 overflow-hidden bg-white border-2 border-black/5 p-1 transition-all duration-1000 group-hover:scale-105"
                style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
              >
                <img 
                  src={PROFILE_PHOTO} 
                  alt="Mark Natad" 
                  className="w-full h-full object-cover scale-110 grayscale group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div 
                className="absolute inset-0 border border-black/10 transition-all duration-1000 group-hover:rotate-12"
                style={{ borderRadius: '40% 60% 70% 30% / 40% 70% 30% 60%' }}
              ></div>
            </div>

            <div className="space-y-12 max-w-2xl">
              <div className="flex items-center gap-6">
                <h3 className="text-[10px] uppercase tracking-[0.5em] text-black whitespace-nowrap opacity-60">Professional Profile</h3>
                <div className="h-px w-24 bg-black/10"></div>
              </div>

              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-light font-calibri tracking-[0.1em] text-black leading-tight">
                  I am an inspiring graphic designer with a niche on <span className="underline decoration-blue-200 decoration-4 underline-offset-8">minimalistic designs</span> but do cater client customizations and preferences.
                </h2>
                
                <p className="text-lg md:text-xl font-light text-black/70 leading-relaxed max-w-xl italic">
                  My philosophy centers around the subtraction of noise to find the essence of a brand. Every pixel is intentional, every space is considered.
                </p>
              </div>

              <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-black opacity-40 block mb-4">Aesthetics</span>
                  <ul className="text-xs uppercase tracking-widest space-y-2">
                    <li>Minimalism</li>
                    <li>Visual Archiving</li>
                    <li>Digital Spaces</li>
                  </ul>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-black opacity-40 block mb-4">Focus</span>
                  <ul className="text-xs uppercase tracking-widest space-y-2">
                    <li>Identity Design</li>
                    <li>Marketing Designs</li>
                    <li>Art Direction</li>
                  </ul>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-[0.4em] text-black opacity-40 block mb-4">Tools</span>
                  <ul className="text-xs uppercase tracking-widest space-y-2">
                    <li>Canva</li>
                    <li>Adobe</li>
                    <li>Nano Banana</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {view === 'contact' && (
        <main className="max-w-3xl mx-auto px-8 py-24 animate-fade-in">
          <section className="space-y-16">
            <div className="flex items-center gap-6">
              <h3 className="text-[10px] uppercase tracking-[0.5em] text-black whitespace-nowrap opacity-60">Get in Touch</h3>
              <div className="h-px w-full bg-gradient-to-r from-black/10 to-transparent"></div>
            </div>

            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-black font-medium opacity-60">Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full bg-transparent border-b border-black/10 py-3 text-lg font-light focus:outline-none focus:border-black transition-colors placeholder:text-black/20 text-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-black font-medium opacity-60">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full bg-transparent border-b border-black/10 py-3 text-lg font-light focus:outline-none focus:border-black transition-colors placeholder:text-black/20 text-black"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-black font-medium opacity-60">Message</label>
                <textarea 
                  rows={4}
                  placeholder="How can I help you?"
                  className="w-full bg-transparent border-b border-black/10 py-3 text-lg font-light focus:outline-none focus:border-black transition-colors placeholder:text-black/20 text-black resize-none"
                ></textarea>
              </div>
              <button className="px-10 py-4 bg-black text-white text-[11px] uppercase tracking-[0.5em] font-medium hover:opacity-80 transition-all transform hover:-translate-y-1 shadow-lg">
                Send Message
              </button>
            </form>

            <div className="pt-20 border-t border-blue-100 space-y-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-black block opacity-60">Direct Line</span>
              <p className="text-2xl font-light text-black font-mono">mark.natad@aol.com</p>
            </div>
          </section>
        </main>
      )}

      {/* Gallery Modal */}
      {selectedIndex !== null && currentImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-50/98 backdrop-blur-md transition-all duration-500 animate-fade-in overflow-hidden"
          onClick={closeModal}
        >
          <div className="absolute top-8 right-8 flex items-center gap-2 z-50">
             <div className="text-[10px] uppercase tracking-widest text-black opacity-50 mr-4 hidden md:block">
              {zoomLevel > 1 ? `Zoom: ${Math.round(zoomLevel * 100)}%` : 'Scroll to Zoom • Drag to Pan'}
            </div>
            <button 
              className="p-3 rounded-full text-black hover:bg-black/5 transition-all"
              onClick={closeModal}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <button 
            className="absolute left-4 md:left-8 text-black hover:bg-black/5 rounded-full transition-all p-4 z-50 group"
            onClick={goToPrevious}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transform transition-transform group-hover:-translate-x-2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button 
            className="absolute right-4 md:right-8 text-black hover:bg-black/5 rounded-full transition-all p-4 z-50 group"
            onClick={goToNext}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="transform transition-transform group-hover:translate-x-2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
          
          <div 
            className="w-full h-full flex items-center justify-center cursor-default select-none"
            onWheel={handleWheel}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="relative transition-transform duration-75 ease-out"
              style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
                cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              <img 
                src={currentImage} 
                alt={`View ${selectedIndex + 1}`} 
                className="max-h-[85vh] max-w-[85vw] object-contain shadow-2xl border border-blue-100 pointer-events-none bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {zoomLevel === 1 && (
              <div className="absolute bottom-8 left-0 right-0 text-center flex justify-between items-center px-12 w-full">
                 <p className="text-[9px] uppercase tracking-[0.6em] text-black opacity-50 font-mono">Archive Entry 0{selectedIndex + 1}</p>
                 <p className="text-[9px] uppercase tracking-[0.6em] text-black opacity-50 font-mono">{selectedIndex + 1} / {galleryItems.length}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-8 py-24 border-t border-blue-100 flex flex-col md:flex-row justify-between items-center gap-12 text-[9px] uppercase tracking-[0.5em] text-black">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <p className="italic font-medium text-black">© 2024 Mark Natad</p>
          <p className="opacity-60">Visual Curated Space</p>
        </div>
        <div className="flex gap-16">
          <button onClick={() => setView('home')} className="text-black hover:opacity-50 transition-opacity">Manifest</button>
          <button onClick={() => setView('about')} className="text-black hover:opacity-50 transition-opacity">Coordinates</button>
          <button onClick={() => setView('contact')} className="text-black hover:opacity-50 transition-opacity">Archive</button>
        </div>
      </footer>
    </div>
  );
};

export default App;
