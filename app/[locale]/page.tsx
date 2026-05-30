'use client'; // Sve strelice, klikovi, lightbox i karta ponovono rade!

import { useState, useEffect, use } from 'react';

export default function ApartmentWebsite({ params }: { params: Promise<{ locale: string }> }) {
  // Rješavamo Next.js 16 asinkroni params pomoću ugrađene use() funkcije
  const resolvedParams = use(params);
  const [messages, setMessages] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stanja za galeriju slika
  const [activeImageIndexes, setActiveImageIndexes] = useState<{ [key: number]: number }>({
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  });
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; apartmentIndex: number; imageIndex: number }>({
    isOpen: false,
    apartmentIndex: 0,
    imageIndex: 0
  });

  useEffect(() => {
    // Ručno učitavanje jezika na klijentu
    import(`../../messages/${resolvedParams.locale}.json`)
      .then((mod) => {
        setMessages(mod.default);
        setLoading(false);
      })
      .catch(() => {
        // Rezerva ako jezik fali
        import(`../../messages/hr.json`).then((mod) => {
          setMessages(mod.default);
          setLoading(false);
        });
      });
  }, [resolvedParams.locale]);

  // Pomoćna funkcija za prijevode
  const t = (key: string) => {
    if (!messages) return key;
    const keys = key.split('.');
    return keys.reduce((o, i) => (o ? o[i] : ''), messages) || key;
  };

  // Podaci o apartmanima i tvojim slikama
  const apartments = [
    { name: 'Apartman A', images: ["/a1.jpg", "/a2.jpg"] },
    { name: 'Apartman B', images: ["/b3.jpg", "/b1.jpg", "/b2.jpg", "/b4.jpg"] },
    { name: 'Apartman C', images: ["/c1.jpg"] },
    { name: 'Apartman D', images: ["/d1.jpg", "/d2.jpg", "/d3.jpg", "/d4.jpg"] },
    { name: 'Apartman E', images: ["/e1.jpg", "/e2.jpg"] },
    { name: 'Apartman F', images: ["/f1.jpg", "/f2.jpg"] },
  ];

  // Kontrola slika u karticama
  const nextImage = (aptIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes(prev => ({
      ...prev,
      [aptIndex]: (prev[aptIndex] + 1) % apartments[aptIndex].images.length
    }));
  };

  const prevImage = (aptIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndexes(prev => ({
      ...prev,
      [aptIndex]: (prev[aptIndex] - 1 + apartments[aptIndex].images.length) % apartments[aptIndex].images.length
    }));
  };

  // Kontrola slika u Lightboxu
  const nextLightboxImage = () => {
    const aptImages = apartments[lightbox.apartmentIndex].images;
    setLightbox(prev => ({
      ...prev,
      imageIndex: (prev.imageIndex + 1) % aptImages.length
    }));
  };

  const prevLightboxImage = () => {
    const aptImages = apartments[lightbox.apartmentIndex].images;
    setLightbox(prev => ({
      ...prev,
      imageIndex: (prev.imageIndex - 1 + aptImages.length) % aptImages.length
    }));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-xl font-semibold text-gray-600">
        Učitavanje...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 scroll-smooth">
      {/* JEZIČNI IZBORNIK NA VRHU */}
      <div className="bg-gray-900 text-white py-3 px-6 flex justify-end gap-5 text-sm font-semibold tracking-wide">
        <a href="/hr" className="hover:text-gray-300 transition">HR</a>
        <a href="/en" className="hover:text-gray-300 transition">EN</a>
        <a href="/de" className="hover:text-gray-300 transition">DE</a>
        <a href="/pl" className="hover:text-gray-300 transition">PL</a>
        <a href="/cs" className="hover:text-gray-300 transition">CS</a>
      </div>

      {/* HERO */}
      <section className="relative h-[70vh] overflow-hidden">
        <img src="/plaza_1.jpeg" alt="Apartmani" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">{t('Hero.title')}</h1>
          <p className="max-w-2xl text-lg md:text-xl">{t('Hero.subtitle')}</p>
          <a href="#kontakt" className="mt-8 rounded-2xl bg-white px-6 py-3 text-lg font-semibold text-black shadow-lg transition hover:scale-105">
            {t('Hero.cta')}
          </a>
        </div>
      </section>

      {/* O NAMA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="mb-6 text-4xl font-bold">{t('About.title')}</h2>
            <p className="mb-4 text-lg leading-relaxed text-gray-600">{t('About.p1')}</p>
            <p className="text-lg leading-relaxed text-gray-600">{t('About.p2')}</p>
          </div>
          <img src="/bazen1.jpg" alt="Bazen" className="h-[420px] w-full rounded-3xl object-cover shadow-2xl animate-fade-in" />
        </div>
      </section>

      {/* GALERIJA */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold">{t('Apartments.title')}</h2>
            <p className="mt-3 text-lg text-gray-600">{t('Apartments.subtitle')}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {apartments.map((apartment, aptIndex) => {
              const currentImgIndex = activeImageIndexes[aptIndex] || 0;
              return (
                <div key={aptIndex} className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                  <div 
                    className="relative h-72 w-full cursor-pointer overflow-hidden group"
                    onClick={() => setLightbox({ isOpen: true, apartmentIndex: aptIndex, imageIndex: currentImgIndex })}
                  >
                    <img 
                      src={apartment.images[currentImgIndex]} 
                      alt={apartment.name} 
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    
                    {apartment.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => prevImage(aptIndex, e)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80"
                        >
                          ❮
                        </button>
                        <button 
                          onClick={(e) => nextImage(aptIndex, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white opacity-0 transition group-hover:opacity-100 hover:bg-black/80"
                        >
                          ❯
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
                      {currentImgIndex + 1} / {apartment.images.length}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-semibold">{apartment.name}</h3>
                    <p className="mt-3 text-gray-600">{t('Apartments.description')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LIGHTBOX MODAL */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in">
          <button 
            onClick={() => setLightbox(prev => ({ ...prev, isOpen: false }))}
            className="absolute top-5 right-5 text-4xl text-white transition hover:text-gray-300"
          >
            ✕
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw]">
            <img 
              src={apartments[lightbox.apartmentIndex].images[lightbox.imageIndex]} 
              alt="Veliki prikaz" 
              className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl" 
            />

            {apartments[lightbox.apartmentIndex].images.length > 1 && (
              <>
                <button 
                  onClick={prevLightboxImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-2xl text-white hover:bg-black/70"
                >
                  ❮
                </button>
                <button 
                  onClick={nextLightboxImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-4 text-2xl text-white hover:bg-black/70"
                >
                  ❯
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* KONTAKT */}
      <section id="kontakt" className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-white p-10 shadow-2xl border border-gray-100">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold">{t('Contact.title')}</h2>
            <p className="mt-3 text-lg text-gray-600">{t('Contact.subtitle')}</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 text-lg">
              <div><p className="font-semibold text-gray-900">Telefon</p><a href="tel:+38521879238" className="text-blue-600 hover:underline">+385 21 879 238</a></div>
              <div><p className="font-semibold text-gray-900">Email</p><a href="mailto:zlatko.patarcic@gmail.com" className="text-blue-600 hover:underline">zlatko.patarcic@gmail.com</a></div>
              <div><p className="font-semibold text-gray-900">WhatsApp</p><a href="https://wa.me/385912877205" target="_blank" rel="noopener noreferrer" className="text-green-600 font-medium hover:underline">+385 91 287 7205</a></div>
              <div><p className="font-semibold text-gray-900">Lokacija</p><p className="text-gray-600">Omiš, Hrvatska</p></div>
            </div>

            <form action="https://formspree.io/f/xqejwvro" method="POST" className="space-y-4">
              <input type="text" name="ime" required placeholder={t('Contact.formName')} className="w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-black" />
              <input type="email" name="email" required placeholder={t('Contact.formEmail')} className="w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-black" />
              <textarea name="poruka" required placeholder={t('Contact.formMessage')} rows={4} className="w-full rounded-2xl border border-gray-300 p-4 outline-none transition focus:border-black" />
              <button type="submit" className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:opacity-95 shadow-md">{t('Contact.formSubmit')}</button>
            </form>

            {/* OVDJE JE TVOJA NOVA KARTA S POPRAVLJENIM REACТ KODOM */}
            <div className="w-full h-[300px] lg:h-full min-h-[250px] overflow-hidden rounded-2xl border border-gray-200 shadow-inner">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2897.8991164660556!2d16.710170976521137!3d43.42093446742154!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134a99d1cfa6fff3%3A0x4e06dae650dc8a35!2sApartmani%20Zlatko!5e0!3m2!1shr!2shr!4v1779971539561!5m2!1shr!2shr" 
                className="w-full h-full border-0" 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 py-8 text-center text-gray-500">
        © 2026 Apartmani Zlatko · Sva prava pridržana
      </footer>
    </div>
  );
}