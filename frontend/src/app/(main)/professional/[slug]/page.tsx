'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface Professional {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  distance: number;
  category: string;
  specialty: string;
  rating: number;
  reviews: number;
  availableNow: boolean;
  description: string;
  img: string;
  whatsapp: string;
  coverImg: string;
  tags: string[];
}

export default function ProfessionalProfilePage({ params }: { params: { slug: string } }) {
  const [pro, setPro] = useState<Professional | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProfessional() {
      try {
        const { data, error } = await supabase
          .from('Professional')
          .select('*')
          .eq('slug', params.slug)
          .maybeSingle();

        if (error) {
          console.error('Error fetching professional:', error.message);
        } else if (data) {
          let specialtiesArr: string[] = [];
          try {
            if (data.specialties) {
              specialtiesArr = JSON.parse(data.specialties);
            }
          } catch (e) {
            if (typeof data.specialties === 'string') {
              specialtiesArr = data.specialties.split(',').map((s: string) => s.trim());
            }
          }

          setPro({
            id: data.id,
            name: data.name,
            slug: data.slug,
            city: data.city || 'Porto Ferreira',
            state: data.state || 'SP',
            distance: 1.2,
            category: specialtiesArr[0] || 'Profissional',
            specialty: specialtiesArr.join(', ') || 'Prestador de Serviço',
            rating: 5.0,
            reviews: 0,
            availableNow: data.availability ?? true,
            description: data.description || 'Nenhuma descrição detalhada disponível.',
            img: data.profilePhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=250&auto=format&fit=crop',
            whatsapp: data.whatsapp || '',
            coverImg: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop',
            tags: specialtiesArr
          });
        } else {
          setPro(null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProfessional();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 bg-background min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="text-body-md text-on-surface-variant mt-md animate-pulse">Carregando perfil do profissional...</p>
      </div>
    );
  }

  if (!pro) {
    return (
      <main className="flex-1 w-full max-w-container-max mx-auto px-md md:px-lg py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-[64px] text-on-surface-variant mb-md">search_off</span>
        <h1 className="text-headline-lg font-headline-lg text-on-surface font-bold">Profissional não encontrado</h1>
        <p className="text-body-md text-on-surface-variant max-w-[448px] mx-auto mt-sm mb-lg">
          O perfil que você tentou acessar não existe ou não está mais ativo na plataforma.
        </p>
        <Link 
          href="/search" 
          className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg hover:opacity-95 transition-opacity"
        >
          Voltar para Busca
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-container-max mx-auto px-md md:px-lg pt-lg pb-xxl grid grid-cols-1 lg:grid-cols-12 gap-gutter">
      {/* Left Column: Profile & Details */}
      <div className="lg:col-span-8 flex flex-col gap-lg">
        {/* Profile Header Card */}
        <section className="bg-surface border border-outline-variant rounded-xl overflow-hidden flex flex-col">
          <div 
            className="h-48 w-full bg-surface-container-highest relative bg-cover bg-center" 
            style={{ backgroundImage: `url('${pro.coverImg}')` }}
          />
          <div className="px-lg pb-lg relative pt-12">
            <img 
              alt={pro.name} 
              className="absolute -top-16 left-lg w-32 h-32 rounded-xl border-4 border-surface object-cover shadow-sm bg-surface-container-highest" 
              src={pro.img}
            />
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-md mt-sm">
              <div>
                <div className="flex flex-wrap items-center gap-xs">
                  <h1 className="text-headline-lg font-headline-lg text-on-surface font-bold">{pro.name}</h1>
                  <span 
                    className="material-symbols-outlined text-[#FF9800] text-[24px] select-none shrink-0" 
                    style={{ fontVariationSettings: "'FILL' 1" }} 
                    title="Profissional Verificado"
                  >
                    verified
                  </span>
                </div>
                <p className="text-body-lg font-body-lg text-on-surface-variant mt-xs">{pro.specialty}</p>
                <div className="flex flex-wrap items-center gap-md mt-sm text-on-surface-variant font-label-md text-label-md">
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    {pro.city}, {pro.state}
                  </span>
                  <span className="flex items-center gap-xs text-primary font-bold">
                    <span className="material-symbols-outlined text-[18px] icon-fill">star</span>
                    {pro.rating.toFixed(1)} ({pro.reviews} av.)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="bg-surface border border-outline-variant rounded-xl p-lg">
          <h2 className="text-headline-md font-headline-md text-on-surface mb-md">Sobre</h2>
          <p className="text-body-md font-body-md text-on-surface-variant mb-lg leading-relaxed">
            {pro.description} Com foco em qualidade de atendimento na região de {pro.city} e arredores, trabalho prezando pela segurança, limpeza do canteiro e cumprimento rigoroso de prazos acordados.
          </p>
          
          <h3 className="text-label-md font-label-md text-on-surface mb-sm uppercase tracking-wider">Certificações & Especialidades</h3>
          <div className="flex flex-wrap gap-sm">
            <span className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span> Profissional Especialista
            </span>
            <span className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">verified_user</span> Garantia do Serviço
            </span>
            <span className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px]">construction</span> {pro.category}
            </span>
            {pro.tags && pro.tags.map(tag => (
              <span key={tag} className="bg-orange-50 border border-orange-200 text-orange-700 px-md py-sm rounded-lg font-label-md text-label-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">sell</span> {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section className="bg-surface border border-outline-variant rounded-xl p-lg">
          <h2 className="text-headline-md font-headline-md text-on-surface mb-md flex items-center gap-sm">
            <span className="material-symbols-outlined">photo_library</span> Portfólio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-sm">
            <div className="aspect-square bg-surface-container-high rounded-lg overflow-hidden relative group cursor-pointer">
              <img 
                alt="Trabalho Recente 1" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?q=80&w=350&auto=format&fit=crop"
              />
            </div>
            <div className="aspect-square bg-surface-container-high rounded-lg overflow-hidden relative group cursor-pointer">
              <img 
                alt="Trabalho Recente 2" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=350&auto=format&fit=crop"
              />
            </div>
            <div className="aspect-square bg-surface-container-high rounded-lg overflow-hidden relative group cursor-pointer">
              <img 
                alt="Trabalho Recente 3" 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=350&auto=format&fit=crop"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Right Column: Contact & Action */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 flex flex-col gap-md">
          {/* Contact Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-lg">
              <h3 className="text-headline-md font-headline-md text-on-surface mb-xs">Contratar {pro.name.split(' ')[0]}</h3>
              <p className="text-body-md font-body-md text-on-surface-variant">Costuma responder em menos de 2 horas</p>
            </div>
            
            <div className="flex flex-col gap-sm mb-lg">
              <div className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg">
                <span className="text-label-md font-label-md text-on-surface-variant flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">event_available</span> Disponibilidade
                </span>
                <span className={`text-label-md font-label-md font-bold ${pro.availableNow ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                  {pro.availableNow ? 'Disponível Hoje' : 'Sob Consulta'}
                </span>
              </div>
              <div className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg">
                <span className="text-label-md font-label-md text-on-surface-variant flex items-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">payments</span> Orçamento
                </span>
                <span className="text-label-md font-label-md text-on-surface">Estimativa Grátis</span>
              </div>
            </div>
            
            <a 
              href={`https://wa.me/55${pro.whatsapp}?text=Olá%20${pro.name},%20vi%20seu%20perfil%20no%20Parceiro%20de%20Obra%20e%20gostaria%20de%20um%20orçamento.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg flex justify-center items-center gap-sm hover:opacity-90 transition-opacity mb-sm text-center shadow-sm"
            >
              <span className="material-symbols-outlined">chat</span>
              Contatar via WhatsApp
            </a>
            <Link 
              href="/contact" 
              className="w-full bg-surface text-on-surface border border-outline-variant font-label-md text-label-md py-md rounded-lg flex justify-center items-center gap-sm hover:bg-surface-container-low transition-colors text-center"
            >
              <span className="material-symbols-outlined">mail</span>
              Enviar Mensagem
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md flex flex-col gap-sm">
            <div className="flex items-start gap-sm">
              <span className="material-symbols-outlined text-primary text-[24px]">shield</span>
              <div>
                <h4 className="text-label-md font-label-md text-on-surface">Garantia Parceiro de Obra</h4>
                <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">
                  Serviços fechados pela plataforma contam com suporte e mediação garantidos de ponta a ponta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
