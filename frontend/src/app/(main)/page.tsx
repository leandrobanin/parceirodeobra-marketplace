'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface FeaturedPro {
  name: string;
  role: string;
  img: string;
  rating: string;
  reviews: number;
  slug: string;
}

interface ProfessionalRow {
  name: string | null;
  profilePhoto: string | null;
  specialties: string | null;
  slug: string | null;
}

export default function Home() {
  const [featuredProfessionals, setFeaturedProfessionals] = useState<FeaturedPro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const { data, error } = await supabase
          .from('Professional')
          .select('*')
          .limit(5);

        if (error) {
          console.error('Error fetching featured professionals:', error.message);
        } else if (data) {
          const mapped = (data as ProfessionalRow[]).map((pro): FeaturedPro => {
            let specialtiesArr: string[] = [];
            try {
              if (pro.specialties) {
                specialtiesArr = JSON.parse(pro.specialties);
              }
            } catch (e) {
              if (typeof pro.specialties === 'string') {
                specialtiesArr = pro.specialties.split(',').map((s: string) => s.trim());
              }
            }

            return {
              name: pro.name || 'Sem Nome',
              role: specialtiesArr[0] || 'Profissional',
              img: pro.profilePhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=200&auto=format&fit=crop',
              rating: '5.0',
              reviews: 0,
              slug: pro.slug || ''
            };
          });
          setFeaturedProfessionals(mapped);
        }
      } catch (err) {
        console.error('Unexpected error loading featured professionals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
      observer.observe(el);
    });
  }, [featuredProfessionals]);

  return (
    <>
      <main className="pt-[120px] pb-xxl px-md md:px-lg max-w-container-max mx-auto min-h-[921px] flex flex-col justify-center relative">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 bg-surface" />
        <div className="absolute inset-0 -z-10" style={{
            backgroundImage: 'radial-gradient(#dce2f3 1px, transparent 1px)',
            backgroundSize: '24px 24px'
        }} />

        <div className="text-center max-w-4xl mx-auto fade-up opacity-0 translate-y-5 transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0">
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-background mb-md">
            Sua obra ou reforma, <br/>
            <span className="text-primary relative inline-block">
              nas mãos dos melhores.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-container opacity-50 z-[-1]" preserveAspectRatio="none" viewBox="0 0 100 10">
                <path d="M0,5 Q50,10 100,5" fill="none" stroke="currentColor" strokeWidth="4"></path>
              </svg>
            </span>
          </h1>
          <p className="text-body-lg font-body-lg text-on-surface-variant mb-xl max-w-[672px] mx-auto">
            Conecte-se com os melhores profissionais de <strong>Porto Ferreira e região</strong>. Mais segurança e qualidade para o seu projeto.
          </p>
          
          {/* Search Bar */}
          <div className="bg-white/70 backdrop-blur-md border border-white/50 p-sm md:p-md rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] max-w-3xl mx-auto flex flex-col md:flex-row gap-sm items-stretch">
            <div className="relative flex-1 flex items-center bg-surface-container-lowest rounded-lg border border-outline-variant focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant ml-md">search</span>
              <input className="w-full bg-transparent border-none text-body-md font-body-md text-on-surface focus:ring-0 px-md py-md rounded-lg placeholder-on-surface-variant/70 outline-none" placeholder="Qual serviço você precisa? (ex: Eletricista)" type="text"/>
            </div>

            <Link href="/search" className="bg-primary text-on-primary text-label-md font-label-md px-xl py-md rounded-lg hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap flex items-center justify-center gap-sm">
              Buscar Profissionais
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
          
          <div className="mt-lg flex items-center justify-center gap-md text-label-sm font-label-sm text-on-surface-variant flex-wrap">
            <span>Populares:</span>
            <span className="bg-surface-container-high px-3 py-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer">Encanador</span>
            <span className="bg-surface-container-high px-3 py-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer">Pintor</span>
            <span className="bg-surface-container-high px-3 py-1 rounded-full hover:bg-surface-container transition-colors cursor-pointer">Pedreiro</span>
          </div>
        </div>

        {/* Featured Professionals Carousel */}
        <div className="mt-24 w-full max-w-5xl mx-auto fade-up opacity-0 translate-y-5 transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0">
          <h2 className="text-headline-sm font-headline-sm text-on-background mb-lg text-left">Profissionais em Destaque</h2>
          
          {/* Carousel Container */}
          {loading ? (
            <div className="flex items-center justify-center py-10 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary text-primary"></div>
              <span className="ml-sm text-body-sm text-on-surface-variant">Buscando destaques...</span>
            </div>
          ) : featuredProfessionals.length > 0 ? (
            <div className="flex gap-md overflow-x-auto pb-lg snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {featuredProfessionals.map((pro, idx) => (
                <Link key={idx} href={`/professional/${pro.slug}`} className="snap-start shrink-0 w-[280px] bg-surface border border-outline-variant rounded-xl p-md flex flex-col gap-sm hover:border-primary hover:shadow-md transition-all group">
                  <div className="flex items-center gap-md">
                    <img src={pro.img} alt={pro.name} className="w-16 h-16 rounded-full object-cover bg-surface-container-highest" />
                    <div>
                      <h3 className="text-label-lg font-label-lg text-on-surface group-hover:text-primary transition-colors">{pro.name}</h3>
                      <p className="text-body-sm font-body-sm text-on-surface-variant">{pro.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-sm pt-sm border-t border-outline-variant/50">
                    <span className="flex items-center gap-xs text-primary font-bold text-label-sm">
                      <span className="material-symbols-outlined text-[16px] icon-fill">star</span>
                      {pro.rating} <span className="text-on-surface-variant font-normal">({pro.reviews})</span>
                    </span>
                    <span className="text-label-sm text-primary font-medium flex items-center gap-xs opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
                      Ver Perfil <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl">
              <p className="text-body-md text-on-surface-variant">Nenhum profissional em destaque no momento.</p>
              <p className="text-body-xs text-on-surface-variant/70 mt-2xs">Seja o primeiro a se cadastrar e aparecer aqui!</p>
            </div>
          )}
          {/* Custom CSS to hide scrollbar but keep functionality */}
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}} />
        </div>
      </main>

      {/* Featured Categories Bento */}
      <section className="py-xxl px-md md:px-lg max-w-container-max mx-auto">
        <div className="text-center mb-xl fade-up opacity-0 translate-y-5 transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0">
          <h2 className="text-headline-lg font-headline-lg text-on-background mb-sm">Especialidades</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Encontre o profissional certo para cada etapa da sua obra.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-md">
          {/* Category Cards */}
          {[
            { icon: 'electrical_services', label: 'Eletricista' },
            { icon: 'format_paint', label: 'Pintor' },
            { icon: 'plumbing', label: 'Encanador' },
            { icon: 'architecture', label: 'Pedreiro' },
            { icon: 'grid_view', label: 'Gesseiro' },
          ].map((cat, idx) => (
            <Link key={idx} href={`/search?category=${cat.label.toLowerCase()}`} className={`group bg-surface-container-lowest rounded-xl border border-outline-variant p-lg flex flex-col items-center justify-center text-center hover:border-primary hover:shadow-[0_10px_15px_-3px_rgba(17,24,39,0.05)] transition-all duration-300 fade-up opacity-0 translate-y-5 transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0 delay-[${(idx + 1) * 100}ms]`}>
              <div className="w-14 h-14 rounded-full bg-primary/5 flex items-center justify-center mb-md group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-primary text-[28px] fill">{cat.icon}</span>
              </div>
              <h3 className="text-label-md font-label-md text-on-surface mb-xs">{cat.label}</h3>
              <span className="text-label-sm font-label-sm text-on-surface-variant group-hover:text-primary transition-colors">Ver Profissionais →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section className="py-xxl px-md md:px-lg max-w-container-max mx-auto bg-surface-container-low rounded-xl mb-xxl">
        <div className="text-center mb-xl fade-up opacity-0 translate-y-5 transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0">
          <h2 className="text-headline-lg font-headline-lg text-on-background mb-sm">Como Funciona</h2>
          <p className="text-body-md font-body-md text-on-surface-variant max-w-[600px] mx-auto">Um processo simples projetado para sua obra iniciar rapidamente e com segurança.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-xl relative">
          {[
            { step: 1, title: 'Buscar', desc: 'Descreva seu projeto e encontre profissionais em Porto Ferreira e região.' },
            { step: 2, title: 'Comparar', desc: 'Veja o portfólio, leia as avaliações e compare os profissionais com facilidade.' },
            { step: 3, title: 'Contratar', desc: 'Escolha o profissional ideal e entre em contato diretamente pelo WhatsApp.' },
          ].map((item, idx) => (
            <div key={idx} className={`relative z-10 flex flex-col items-center text-center fade-up opacity-0 translate-y-5 transition-all duration-700 ease-out [&.visible]:opacity-100 [&.visible]:translate-y-0 delay-[${(idx + 1) * 100}ms]`}>
              <div className="w-16 h-16 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center text-headline-md font-headline-md text-primary mb-md shadow-sm">{item.step}</div>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-sm">{item.title}</h3>
              <p className="text-body-md font-body-md text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
