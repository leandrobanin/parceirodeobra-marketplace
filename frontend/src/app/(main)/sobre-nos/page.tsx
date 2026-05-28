import Link from 'next/link';

export const metadata = {
  title: 'Sobre Nós | Obra Certa',
  description: 'Conheça o Obra Certa, a plataforma que conecta você aos melhores e mais qualificados profissionais de construção e reforma da região.',
};

export default function AboutUsPage() {
  return (
    <main className="w-full flex-1">
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px] flex flex-col justify-center overflow-hidden bg-on-surface py-20">
        <div className="absolute inset-0 z-0">
          <img 
            alt="Estrutura de construção civil moderna de alto padrão" 
            className="w-full h-full object-cover opacity-35" 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600&auto=format&fit=crop"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-on-surface via-on-surface/90 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full max-w-container-max mx-auto px-md md:px-lg">
          <div className="w-full max-w-[672px] flex flex-col gap-lg">
            <span className="text-[#FF9800] text-label-md font-label-md tracking-widest uppercase">
              Construindo o Futuro
            </span>
            <h1 className="text-[36px] md:text-[52px] leading-[44px] md:leading-[60px] font-bold text-white tracking-tight">
              Construindo Confiança em Cada <span className="text-[#FF9800]">Detalhe.</span>
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[24px] md:leading-[28px] text-surface-variant font-medium max-w-[576px]">
              Redefinimos a contratação de serviços de construção civil conectando proprietários exigentes com um círculo selecionado de profissionais certificados de elite. Precisão é nossa linguagem; confiabilidade é nossa promessa.
            </p>
            <div className="flex gap-md pt-md">
              <a 
                href="#historia" 
                className="bg-primary text-on-primary hover:bg-opacity-95 px-lg py-md rounded-lg font-label-md text-label-md transition-all flex items-center gap-xs shadow-sm"
              >
                Conheça Nossa História <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="historia" className="py-xxl w-full max-w-container-max mx-auto px-md md:px-lg scroll-mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xxl items-center">
          <div className="relative">
            <div className="aspect-[4/3] md:aspect-[4/5] rounded-xl overflow-hidden border border-outline-variant bg-surface-container-highest">
              <img 
                alt="Reunião profissional entre prestador de serviço e cliente revisando plantas residenciais" 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1000&auto=format&fit=crop"
              />
            </div>
            <div className="absolute -bottom-lg -right-md bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-md hidden md:block">
              <p className="text-headline-md font-headline-md text-primary font-bold">Startup em 2026</p>
              <p className="text-label-md font-label-md text-on-surface-variant">Conectando profissionais à obras</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-md">
            <span className="text-primary font-label-md text-label-md tracking-widest uppercase block">
              Nossa História
            </span>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">
              Construindo pontes entre profissionais e obras
            </h2>
            <div className="flex flex-col gap-md text-on-surface-variant text-[16px] leading-[24px]">
              <p>
                O Parceiro de Obra nasceu de uma observação simples: a indústria da construção civil e reformas sofria com falta de acessibilidade e divulgação. Encontrar um profissional de confiança não deveria ser um jogo de azar; deveria ser um resultado garantido.
              </p>
              <p>
                Vimos a frustração dos proprietários de imóveis navegando por classificados e a luta de profissionais buscando divulgar seus serviços em um mercado saturado. Decidimos construir uma ponte digital — um ecossistema curado onde a qualidade é indispensável.
              </p>
              <p>
                Hoje, não somos apenas uma plataforma; somos um selo de excelência em serviços profissionais de construção e manutenção de propriedades, garantindo que cada projeto comece com total confiança.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-surface-container-low py-xxl w-full">
        <div className="max-w-container-max mx-auto px-md md:px-lg">
          <div className="text-center mb-xxl flex flex-col gap-xs">
            <span className="text-primary font-label-md text-label-md tracking-widest uppercase">
              Valores
            </span>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">
              Os Pilares do Parceiro de Obra
            </h2>
            <p className="text-on-surface-variant max-w-[576px] mx-auto text-[16px]">
              Nossa filosofia operacional é guiada por três princípios fundamentais que garantem a entrega de um serviço premium a cada usuário.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Trust Card */}
            <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant hover:shadow-md transition-all duration-300 flex flex-col gap-md">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[28px] fill" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface">Confiança</h3>
              <p className="text-on-surface-variant text-[15px] leading-relaxed">
                Cada profissional em nossa plataforma passa por um rigoroso processo de verificação em múltiplas etapas. Baseamos nossa reputação na confiabilidade de nossos parceiros.
              </p>
            </div>
            
            {/* Excellence Card */}
            <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant hover:shadow-md transition-all duration-300 flex flex-col gap-md">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[28px]">architecture</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface">Excelência</h3>
              <p className="text-on-surface-variant text-[15px] leading-relaxed">
                Não nos contentamos com o &quot;bom o suficiente&quot;. Nossos padrões são calibrados para resultados de alto padrão, garantindo precisão em cada detalhe e acabamento.
              </p>
            </div>
            
            {/* Innovation Card */}
            <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant hover:shadow-md transition-all duration-300 flex flex-col gap-md">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[28px]">auto_awesome</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface">Inovação</h3>
              <p className="text-on-surface-variant text-[15px] leading-relaxed">
                Aproveitamos a tecnologia moderna para simplificar o gerenciamento de obras, tornando projetos complexos organizados, intuitivos e totalmente livres de estresse.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-xxl w-full max-w-container-max mx-auto px-md md:px-lg">
        <div className="bg-on-surface rounded-2xl p-xl md:p-xxl text-white relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-xl md:gap-xxl text-center">
            <div className="flex flex-col gap-xs">
              <p className="text-[#FF9800] text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-bold">12</p>
              <p className="text-label-md font-label-md text-surface-variant uppercase tracking-widest text-[12px]">
                Profissionais Recomendados pela IA
              </p>
            </div>
            <div className="flex flex-col gap-xs">
              <p className="text-[#FF9800] text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-bold">500+</p>
              <p className="text-label-md font-label-md text-surface-variant uppercase tracking-widest text-[12px]">
                Projetos Agendados
              </p>
            </div>
            <div className="flex flex-col gap-xs">
              <p className="text-[#FF9800] text-[40px] md:text-[56px] leading-[48px] md:leading-[64px] font-bold">4.9/5</p>
              <p className="text-label-md font-label-md text-surface-variant uppercase tracking-widest text-[12px]">
                Avaliação Média na Região
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xxl w-full max-w-container-max mx-auto px-md md:px-lg text-center flex flex-col gap-lg items-center">
        <h2 className="text-headline-lg font-headline-lg text-on-surface max-w-[672px]">
          Pronto para tirar o seu projeto do papel com segurança?
        </h2>
        <p className="text-on-surface-variant text-[16px] max-w-[576px]">
          Seja planejando uma grande reforma residencial de alto padrão ou pequenos ajustes periódicos na sua casa, o Obra Certa te conecta com o profissional ideal.
        </p>
        <div className="flex flex-col sm:flex-row gap-md justify-center w-full sm:w-auto">
          <Link 
            href="/search" 
            className="bg-primary text-on-primary hover:bg-opacity-95 px-xxl py-md rounded-lg font-headline-md text-headline-md text-center transition-all shadow-sm"
          >
            Encontrar um Profissional
          </Link>
          <Link 
            href="/contact" 
            className="bg-surface border border-outline text-on-surface hover:bg-surface-container-low px-xxl py-md rounded-lg font-headline-md text-headline-md text-center transition-all"
          >
            Fale Conosco
          </Link>
        </div>
      </section>
    </main>
  );
}
