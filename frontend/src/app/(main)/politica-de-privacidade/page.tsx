'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PoliticaPrivacidadePage() {
  const [activeSection, setActiveSection] = useState('termos');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['termos', 'privacidade', 'cookies'];
      let current = 'termos';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is near the top of the viewport
          if (rect.top <= 160) {
            current = sectionId;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -120; // offset for the fixed header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <main className="w-full flex-grow bg-surface pb-xxl">
      {/* Page Header */}
      <section className="bg-surface-container-low py-xl px-md md:px-lg border-b border-outline-variant/30">
        <div className="w-full max-w-[1280px] mx-auto text-center flex flex-col gap-sm">
          <h1 className="text-[32px] md:text-[40px] font-bold text-on-surface tracking-tight">
            Políticas e Termos
          </h1>
          <p className="text-[16px] md:text-[18px] text-on-surface-variant max-w-[672px] mx-auto leading-relaxed">
            Transparência e segurança são nossos pilares. Aqui você encontra as diretrizes que regem o uso da plataforma Parceiro de Obra e como cuidamos dos seus dados.
          </p>
        </div>
      </section>

      {/* Content Layout */}
      <section className="w-full max-w-[1280px] mx-auto px-md md:px-lg py-xl grid grid-cols-1 md:grid-cols-12 gap-lg relative">
        {/* Sidebar Navigation */}
        <aside className="md:col-span-3 hidden md:block">
          <div className="sticky top-28 flex flex-col gap-md">
            <p className="text-label-sm font-label-sm text-outline uppercase tracking-wider">
              Navegação
            </p>
            <nav className="flex flex-col gap-xs">
              <button
                onClick={() => scrollToSection('termos')}
                className={`text-left font-label-md text-label-md py-sm px-md transition-all rounded-lg border-l-2 cursor-pointer ${
                  activeSection === 'termos'
                    ? 'text-primary font-bold border-primary bg-primary/5'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container border-transparent'
                }`}
              >
                Termos de Uso
              </button>
              <button
                onClick={() => scrollToSection('privacidade')}
                className={`text-left font-label-md text-label-md py-sm px-md transition-all rounded-lg border-l-2 cursor-pointer ${
                  activeSection === 'privacidade'
                    ? 'text-primary font-bold border-primary bg-primary/5'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container border-transparent'
                }`}
              >
                Política de Privacidade
              </button>
              <button
                onClick={() => scrollToSection('cookies')}
                className={`text-left font-label-md text-label-md py-sm px-md transition-all rounded-lg border-l-2 cursor-pointer ${
                  activeSection === 'cookies'
                    ? 'text-primary font-bold border-primary bg-primary/5'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container border-transparent'
                }`}
              >
                Política de Cookies
              </button>
            </nav>
            
            <div className="mt-md p-md bg-primary/5 rounded-xl border border-outline-variant/30">
              <p className="text-label-sm font-label-sm text-primary mb-xs">
                Precisa de ajuda?
              </p>
              <p className="text-body-md font-body-md text-on-surface font-bold mb-sm">
                Entre em contato com nosso suporte.
              </p>
              <Link 
                href="/contact"
                className="inline-flex items-center text-primary font-bold hover:underline gap-xs text-[14px]"
              >
                Suporte de Atendimento
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Legal Content */}
        <article className="md:col-span-9 bg-surface-container-lowest p-md md:p-xl rounded-xl border border-outline-variant/40 flex flex-col gap-xl">
          {/* Termos de Uso */}
          <div className="scroll-mt-28 flex flex-col gap-md" id="termos">
            <div className="flex flex-col gap-xs border-b border-outline-variant/20 pb-sm">
              <h2 className="text-[24px] md:text-[28px] font-bold text-on-surface">
                Termos de Uso
              </h2>
              <p className="text-label-sm font-label-sm text-on-surface-variant/70">
                Última atualização: 15 de Outubro de 2026
              </p>
            </div>
            
            <div className="flex flex-col gap-sm text-on-surface-variant text-[15px] leading-relaxed">
              <h3 className="text-headline-md font-headline-md text-primary mt-sm">
                1. Aceitação dos Termos
              </h3>
              <p>
                Ao acessar e utilizar a plataforma Parceiro de Obra, você concorda em cumprir estes Termos de Uso. Este documento estabelece a relação contratual entre o Parceiro de Obra e seus usuários (Clientes e Profissionais).
              </p>
              
              <h3 className="text-headline-md font-headline-md text-primary mt-sm">
                2. Responsabilidades do Usuário
              </h3>
              <ul className="list-disc list-inside pl-xs flex flex-col gap-xs">
                <li>Fornecer informações verídicas e atualizadas no momento do cadastro.</li>
                <li>Manter a confidencialidade de suas credenciais de acesso.</li>
                <li>Não utilizar a plataforma para fins ilícitos ou que violem direitos de terceiros.</li>
              </ul>
              
              <h3 className="text-headline-md font-headline-md text-primary mt-sm">
                3. Obrigações dos Profissionais
              </h3>
              <p>
                Os profissionais cadastrados no Parceiro de Obra comprometem-se a:
              </p>
              <ul className="list-disc list-inside pl-xs flex flex-col gap-xs">
                <li>Possuir todas as licenças e registros necessários para exercer sua atividade.</li>
                <li>Cumprir com os prazos e orçamentos acordados com os clientes.</li>
                <li>Zelar pela qualidade e segurança dos serviços prestados.</li>
              </ul>
              
              <div className="p-md bg-surface-container-low rounded-lg border-l-4 border-primary mt-md text-on-surface text-[14px]">
                <p className="font-semibold">
                  Nota importante:
                </p>
                <p className="text-on-surface-variant mt-xs">
                  O Parceiro de Obra atua como um marketplace de conexão. A responsabilidade técnica e contratual pela execução dos serviços é integralmente do profissional contratado.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/30" />

          {/* Política de Privacidade */}
          <div className="scroll-mt-28 flex flex-col gap-md" id="privacidade">
            <h2 className="text-[24px] md:text-[28px] font-bold text-on-surface border-b border-outline-variant/20 pb-sm">
              Política de Privacidade
            </h2>
            
            <div className="flex flex-col gap-sm text-on-surface-variant text-[15px] leading-relaxed">
              <h3 className="text-headline-md font-headline-md text-primary mt-sm">
                1. Coleta de Dados
              </h3>
              <p>
                Coletamos dados necessários para o funcionamento da plataforma e melhoria da sua experiência, incluindo:
              </p>
              <ul className="list-disc list-inside pl-xs flex flex-col gap-xs">
                <li><strong>Dados de Identificação:</strong> Nome, CPF/CNPJ, e-mail e telefone.</li>
                <li><strong>Dados de Localização:</strong> Para conectar profissionais e clientes próximos.</li>
                <li><strong>Histórico de Serviços:</strong> Avaliações, contatos e buscas realizadas.</li>
              </ul>
              
              <h3 className="text-headline-md font-headline-md text-primary mt-sm">
                2. Uso das Informações
              </h3>
              <p>
                Seus dados são utilizados exclusivamente para:
              </p>
              <ul className="list-disc list-inside pl-xs flex flex-col gap-xs">
                <li>Facilitar a comunicação entre as partes durante a negociação de serviços.</li>
                <li>Garantir a segurança da plataforma contra fraudes.</li>
                <li>Personalizar a experiência de busca e usabilidade do sistema.</li>
              </ul>
              
              <h3 className="text-headline-md font-headline-md text-primary mt-sm">
                3. Compartilhamento de Dados
              </h3>
              <p>
                Não vendemos ou repassamos seus dados pessoais a terceiros. O compartilhamento ocorre apenas entre as duas partes (cliente e profissional) para viabilizar o contato e prestação do serviço, ou por determinação judicial.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30" />

          {/* Política de Cookies */}
          <div className="scroll-mt-28 flex flex-col gap-md" id="cookies">
            <h2 className="text-[24px] md:text-[28px] font-bold text-on-surface border-b border-outline-variant/20 pb-sm">
              Política de Cookies
            </h2>
            
            <div className="flex flex-col gap-sm text-on-surface-variant text-[15px] leading-relaxed">
              <p>
                Utilizamos cookies para garantir que nosso site funcione corretamente e para entender como os usuários interagem com nossos serviços.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-sm">
                <div className="p-md border border-outline-variant/30 rounded-xl bg-surface-container-low flex flex-col gap-xs">
                  <h4 className="font-label-md text-label-md text-primary flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                    Cookies Necessários
                  </h4>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">
                    Essenciais para o funcionamento básico e segurança do site. Não podem ser desativados.
                  </p>
                </div>
                
                <div className="p-md border border-outline-variant/30 rounded-xl bg-surface-container-low flex flex-col gap-xs">
                  <h4 className="font-label-md text-label-md text-primary flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[20px]">analytics</span>
                    Cookies de Desempenho
                  </h4>
                  <p className="text-label-sm font-label-sm text-on-surface-variant">
                    Nos ajudam a medir o tráfego do site e entender como as páginas estão sendo acessadas.
                  </p>
                </div>
              </div>
              
              <h3 className="text-headline-md font-headline-md text-primary mt-sm">
                Gerenciamento de Preferências
              </h3>
              <p>
                Você pode gerenciar suas preferências de cookies a qualquer momento através das configurações de privacidade do seu navegador. Note que a desativação de certos cookies necessários pode comprometer algumas funcionalidades do site.
              </p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
