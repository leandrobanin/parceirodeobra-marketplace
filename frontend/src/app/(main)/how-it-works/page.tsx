'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'customers' | 'professionals'>('customers');

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      const customersSection = document.getElementById('customers');
      const professionalsSection = document.getElementById('professionals');
      if (!customersSection || !professionalsSection) return;

      const scrollPos = window.scrollY + 250;

      if (
        scrollPos >= professionalsSection.offsetTop &&
        scrollPos < professionalsSection.offsetTop + professionalsSection.offsetHeight
      ) {
        setActiveTab('professionals');
      } else {
        setActiveTab('customers');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: 'customers' | 'professionals') => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 140,
        behavior: 'smooth',
      });
      setActiveTab(id);
    }
  };

  const faqs = [
    {
      question: 'Como vocês verificam as credenciais dos profissionais?',
      answer:
        'Cada profissional no Parceiro de Obra passa por um processo de verificação em várias etapas, incluindo checagem de antecedentes, verificação de registros profissionais e autenticação de portfólio. Apenas parceiros que atendem aos nossos altos padrões são aprovados para entrar na rede.',
    },
    {
      question: 'O meu pagamento é seguro através da plataforma?',
      answer:
        'Sim. Utilizamos um sistema de pagamento seguro. Quando você contrata um profissional, o valor fica retido com segurança pelo Parceiro de Obra. O pagamento só é liberado depois que você confirmar que as etapas da obra foram concluídas e estiver satisfeito com o serviço.',
    },
    {
      question: 'E se um projeto não sair como planejado?',
      answer:
        'Nossa equipe de Confiança e Segurança está à disposição para ajudar. Oferecemos serviços de mediação para eventuais disputas e oferecemos suporte em projetos gerenciados inteiramente pela nossa plataforma, garantindo que você não saia no prejuízo.',
    },
    {
      question: 'Quanto custa para os profissionais se cadastrarem?',
      answer:
        'Criar um perfil profissional é gratuito. Operamos em um modelo de captação de clientes ou comissões, dependendo da categoria do serviço. Isso garante que você só pague quando realmente obtiver oportunidades de negócios por meio da nossa rede.',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-surface-container-low py-xxl overflow-hidden">
        <div className="max-w-container-max mx-auto px-lg relative z-10 text-center">
          <span className="inline-block px-md py-xs bg-primary-container/20 text-primary rounded-full text-label-sm font-label-sm mb-md uppercase tracking-wider">
            O Guia do Marketplace
          </span>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-lg">
            Simples. Profissional. <span className="text-primary">Confiável.</span>
          </h1>
          <p className="max-w-[672px] mx-auto text-body-lg text-on-surface-variant mb-xl">
            Seja para contratar o melhor profissional para sua reforma ou para expandir o seu negócio de serviços, o Parceiro de Obra oferece as ferramentas necessárias para você construir com confiança.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-md">
            <button
              onClick={() => scrollToSection('customers')}
              className="bg-primary-container text-on-primary-container px-xl py-md rounded-xl font-label-md flex items-center justify-center gap-sm hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Sou Cliente <span className="material-symbols-outlined">arrow_downward</span>
            </button>
            <button
              onClick={() => scrollToSection('professionals')}
              className="bg-surface-container-highest text-on-surface px-xl py-md rounded-xl font-label-md flex items-center justify-center gap-sm hover:scale-[1.02] transition-transform cursor-pointer"
            >
              Sou Profissional <span className="material-symbols-outlined">arrow_downward</span>
            </button>
          </div>
        </div>
        {/* Decorative Elements */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-container opacity-10 rounded-full blur-3xl"></div>
      </section>

      {/* Path Selector Tabs (Sticky) */}
      <div className="sticky top-20 bg-surface/80 backdrop-blur-md z-40 border-b border-outline-variant/60">
        <div className="max-w-container-max mx-auto px-lg flex justify-center">
          <div className="flex gap-xl md:gap-xxl">
            <button
              onClick={() => scrollToSection('customers')}
              className={`py-lg border-b-2 font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Para Clientes
            </button>
            <button
              onClick={() => scrollToSection('professionals')}
              className={`py-lg border-b-2 font-label-md text-label-md transition-all cursor-pointer ${
                activeTab === 'professionals'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-primary'
              }`}
            >
              Para Profissionais
            </button>
          </div>
        </div>
      </div>

      {/* For Customers Section */}
      <section className="py-xxl bg-surface scroll-mt-28" id="customers">
        <div className="max-w-container-max mx-auto px-lg">
          <div className="mb-xxl text-center max-w-3xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg mb-md">Para Clientes</h2>
            <p className="text-body-md text-on-surface-variant">
              Encontre a especialidade certa para o seu projeto em três passos simples. Nós cuidamos da verificação e da segurança para você focar no que importa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {/* Step 1 */}
            <div className="group relative bg-white border border-outline-variant rounded-2xl p-xl transition-all duration-300 hover:shadow-lg">
              <div 
                className="text-display-lg font-bold opacity-10 absolute top-4 right-6 group-hover:opacity-20 transition-opacity"
                style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}
              >
                01
              </div>
              <div className="w-14 h-14 bg-primary-container/10 text-primary rounded-xl flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-[32px]">search</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-md">Buscar</h3>
              <p className="text-body-md text-on-surface-variant mb-lg leading-relaxed">
                Navegue por milhares de profissionais verificados. Filtre por categoria, localização e necessidades específicas para encontrar o parceiro ideal.
              </p>
              <div className="rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low aspect-video">
                <img
                  alt="Interface de busca"
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq4wLdgu19apXq2EtQxkcv05skQxjOlcYHseZWpbSctsDkZw0yUGv5_TTQBbEkuuL5OW5_nwjsPgGlvSaoSUzLNXznbwlM_xQC-YLzurO7znT0_eO61Hdk51Txnt4-GfzPTdSqh3C3uJBHzp6kUYYzphrrZAFKPt7lyjkmxfm30umqJxnE6wxqZkqt0iJw2OjtVPX1qiHTZxDRXihZsoLfnmGk9NWCEvehF9r7wdhkTQtfROHh4kS6J3wBMkV1jWCvQnWgkkQL6Lcr"
                />
              </div>
            </div>
            {/* Step 2 */}
            <div className="group relative bg-white border border-outline-variant rounded-2xl p-xl transition-all duration-300 hover:shadow-lg">
              <div 
                className="text-display-lg font-bold opacity-10 absolute top-4 right-6 group-hover:opacity-20 transition-opacity"
                style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}
              >
                02
              </div>
              <div className="w-14 h-14 bg-primary-container/10 text-primary rounded-xl flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-[32px]">fact_check</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-md">Comparar</h3>
              <p className="text-body-md text-on-surface-variant mb-lg leading-relaxed">
                Avalie portfólios completos, notas reais de clientes e solicite orçamentos detalhados para garantir a qualidade alinhada ao seu orçamento.
              </p>
              <div className="rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low aspect-video">
                <img
                  alt="Ferramenta de comparação"
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgK-88nC8fQwgujWs31h9MTaRfQZE40N11Q-e95dEjCJKFfCBSzVdzaYb55ae3NCXe0YqKLKEF7xPH7MEd-b7VNlnTZrPNmbF1puYaYzsb2fVK6GmzM7B_yaLQAOHU8C3u9CzUuJznMioWENBVEisp8n0KYom9K7Y4-zcrpEHiMXkahp8dw9OCLzZ3UgNISwFTr7eN-S4Tqg-A62egoGQ1By2YGntdzPCp5rntqFLI12brfXlWUOjRRdyUlpjFvWhJjsl_fb_ku9YP"
                />
              </div>
            </div>
            {/* Step 3 */}
            <div className="group relative bg-white border border-outline-variant rounded-2xl p-xl transition-all duration-300 hover:shadow-lg">
              <div 
                className="text-display-lg font-bold opacity-10 absolute top-4 right-6 group-hover:opacity-20 transition-opacity"
                style={{ WebkitTextStroke: '1px currentColor', color: 'transparent' }}
              >
                03
              </div>
              <div className="w-14 h-14 bg-primary-container/10 text-primary rounded-xl flex items-center justify-center mb-lg">
                <span className="material-symbols-outlined text-[32px]">payments</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-md">Contratar e Pagar</h3>
              <p className="text-body-md text-on-surface-variant mb-lg leading-relaxed">
                Contrate com segurança diretamente pela nossa plataforma. Os pagamentos ficam protegidos e só são liberados conforme a conclusão das etapas combinadas.
              </p>
              <div className="rounded-lg overflow-hidden border border-outline-variant bg-surface-container-low aspect-video">
                <img
                  alt="Pagamento seguro"
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAldC_KgB-yJ9uAQC5MKsaf-ShzH5QHHc-t4-hAbdzVNsPxCbJxH8LFIS12wJuxGnlAhfP95hGAkL7PEIqXT0CnEE4KJNGWyUiZzKRrQ2tFx6MdhGA2z9I9M5NWN8ct9cKrhYzd_zrBQhXzsnqY3j6Ll2AzxQUjw_nsITjVnGfXDikxki3glMdjOj3poMBieqm2u9Es9Bo29siY1lN1mdJL8zXYyQHgnJbTW3KVKepevYy6bgZ8k5V4VR3ULfZVcyjyFCdixE4W63Dj"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Path Section */}
      <section className="py-xxl bg-surface-container-low scroll-mt-28" id="professionals">
        <div className="max-w-container-max mx-auto px-lg">
          <div className="flex flex-col lg:flex-row items-center gap-xxl mb-xxl">
            <div className="lg:w-1/2">
              <span className="text-primary font-label-md mb-md block">Para Profissionais</span>
              <h2 className="font-headline-lg text-headline-lg mb-lg">Leve o seu negócio de serviços para o próximo nível</h2>
              <p className="text-body-lg text-on-surface-variant mb-xl leading-relaxed">
                Junte-se a uma rede de profissionais de elite em Porto Ferreira e região. Nós fornecemos as ferramentas e a visibilidade comercial; você entrega a excelência na obra.
              </p>
              {/* Steps List */}
              <div className="space-y-md">
                <div className="bg-white border border-outline-variant p-md rounded-xl flex gap-md items-start">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary shrink-0 flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-xs">Criar Perfil</h4>
                    <p className="text-body-md text-on-surface-variant">
                      Cadastre-se e exiba seu portfólio de serviços, fotos de obras anteriores e competências profissionais.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-outline-variant p-md rounded-xl flex gap-md items-start">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary shrink-0 flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-xs">Receber Contatos</h4>
                    <p className="text-body-md text-on-surface-variant">
                      Receba solicitações de orçamento de clientes locais diretamente no seu perfil ou canal de atendimento.
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-outline-variant p-md rounded-xl flex gap-md items-start">
                  <div className="w-10 h-10 rounded-full bg-primary text-on-primary shrink-0 flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface mb-xs">Crescer o Negócio</h4>
                    <p className="text-body-md text-on-surface-variant">
                      Construa uma ótima reputação online através das avaliações dos clientes e atraia novos trabalhos recorrentes.
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/auth?mode=signup" className="mt-xl bg-primary text-on-primary px-xl py-md rounded-xl font-label-md shadow-lg hover:shadow-primary/20 hover:bg-primary/95 transition-all inline-block">
                Quero me cadastrar como Profissional
              </Link>
            </div>
            <div className="lg:w-1/2 relative mt-xl lg:mt-0">
              <div className="relative z-10 rounded-2xl overflow-hidden border-[8px] border-white shadow-2xl">
                <img
                  alt="Profissional trabalhando"
                  className="w-full h-auto aspect-[4/5] object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm9WUhY0na0UMDKn9FJsuUihQEJMeTkVxhTP6gN4Rf82VRp6xRqZ7D_S4GHYFGU316TIvIptqCZBnh1Nrg0e5jz_qz3sDYUMA4ACLYuyyByp0KIctxaS65TuK6OpeJigTh01KjyKHUNwqCzP8uVv4yDmNSc1g_5cU2K8YcR6lw8ndZc8yB1n_eObmJZSejJMLEuWjeH5bWJuznmu7B1HgGM98b2EpKr7SVbBsHuldMY8uLClbQ-xoVUkdEMfXXTlFmRnCDUOskeFgm"
                />
              </div>
              {/* Floating Achievement Chip */}
              <div className="absolute -bottom-6 -left-6 z-20 bg-white p-md rounded-xl shadow-xl flex items-center gap-md border border-outline-variant animate-bounce">
                <div className="w-12 h-12 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                </div>
                <div>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">Aumento de Faturamento</p>
                  <p className="text-headline-md font-bold text-primary">+42% Méd.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-xxl bg-surface">
        <div className="max-w-3xl mx-auto px-lg">
          <div className="text-center mb-xxl">
            <h2 className="font-headline-lg text-headline-lg mb-md">Perguntas Frequentes</h2>
            <p className="text-body-md text-on-surface-variant">Tudo o que você precisa saber para começar a usar o Parceiro de Obra.</p>
          </div>
          <div className="space-y-md">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-outline-variant rounded-xl overflow-hidden bg-white">
                <button
                  className={`w-full px-lg py-xl text-left flex justify-between items-center transition-colors group cursor-pointer ${
                    openFaq === index ? 'bg-surface-container-low' : 'hover:bg-surface-container-low'
                  }`}
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-label-md text-label-md text-on-surface">{faq.question}</span>
                  <span
                    className={`material-symbols-outlined text-primary transition-transform duration-200 ${
                      openFaq === index ? 'rotate-180' : 'rotate-0'
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'block px-lg pb-xl text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/30 pt-md' : 'hidden'
                  }`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-xxl px-lg bg-surface">
        <div className="max-w-container-max mx-auto bg-inverse-surface text-inverse-on-surface text-center rounded-3xl p-xl md:p-xxl shadow-xl">
          <div className="max-w-[576px] mx-auto">
            <h2 className="font-headline-lg text-headline-lg mb-lg text-white">Pronto para transformar sua obra ou reforma?</h2>
            <p className="text-body-lg text-surface-variant mb-xl opacity-90">
              Junte-se a milhares de proprietários e profissionais na melhor rede de serviços residenciais.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-md">
              <Link href="/search" className="w-full sm:w-auto bg-primary text-on-primary px-xl py-md rounded-xl font-label-md hover:scale-105 transition-all inline-block shadow-md text-center">
                Buscar um Profissional
              </Link>
              <Link href="/auth?mode=signup" className="w-full sm:w-auto bg-white/10 text-white border border-white/20 px-xl py-md rounded-xl font-label-md hover:bg-white/20 transition-all inline-block text-center">
                Cadastrar como Profissional
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
