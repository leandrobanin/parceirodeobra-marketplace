'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer className="w-full py-xxl px-lg bg-surface-container-high border-t border-outline-variant mt-auto transition-colors duration-300">
      <div className="max-w-container-max mx-auto w-full flex flex-col gap-lg">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl pb-md">
          {/* Brand Column */}
          <div className="flex flex-col gap-md">
            <div className="flex items-center gap-sm">
              {/* Logo icon using the theme's primary color */}
              <svg className="w-[3em] h-[3em] fill-current text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M 25 20 H 38 V 31 L 50 19 L 75 44 V 68 H 62 V 81 H 38 L 25 68 Z M 38 68 H 62 V 48 L 50 36 L 38 48 Z" />
              </svg>
              <span className="text-headline-md font-headline-md text-on-surface tracking-wide">
                Parceirode<span className="text-primary font-bold">Obra</span>
              </span>
            </div>
            <p className="text-body-md font-body-md text-on-surface-variant leading-relaxed">
              Conecte-se com os melhores profissionais de Porto Ferreira e região.
              <br />
              Serviço de qualidade para sua casa.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-sm mt-sm">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:bg-amber-50 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                aria-label="Facebook"
              >
                <img src="https://img.icons8.com/material-outlined/48/facebook-new.png" alt="Facebook" className="w-5 h-5 opacity-85 hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:bg-amber-50 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                aria-label="Instagram"
              >
                <img src="https://img.icons8.com/material-outlined/48/instagram-new--v1.png" alt="Instagram" className="w-5 h-5 opacity-85 hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="https://wa.me/5519992435847"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:bg-amber-50 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                aria-label="WhatsApp"
              >
                <img src="https://img.icons8.com/material-outlined/48/whatsapp--v1.png" alt="WhatsApp" className="w-5 h-5 opacity-85 hover:opacity-100 transition-opacity" />
              </a>
              <a
                href="mailto:suporte.pdo@gmail.com"
                className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/30 hover:border-primary hover:bg-amber-50 flex items-center justify-center transition-all hover:scale-110 shadow-sm"
                aria-label="E-mail"
              >
                <img src="https://img.icons8.com/material-outlined/48/new-post.png" alt="E-mail" className="w-5 h-5 opacity-85 hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-md">
            <h3 className="text-label-md font-label-md text-on-surface uppercase tracking-wide">Links Rápidos</h3>
            <ul className="flex flex-col gap-sm text-body-md font-body-md text-on-surface-variant">
              <li>
                <Link href="/sobre-nos" className="hover:text-primary hover:underline transition-all">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="hover:text-primary hover:underline transition-all">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/home" className="hover:text-primary hover:underline transition-all">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-primary hover:underline transition-all">
                  Como funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-md">
            <h3 className="text-label-md font-label-md text-on-surface uppercase tracking-wide">Contato</h3>
            <ul className="flex flex-col gap-sm text-body-md font-body-md text-on-surface-variant">
              <li className="flex items-center gap-sm group">
                <span className="text-primary flex-shrink-0">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <a href="mailto:suporte.pdo@gmail.com" className="hover:text-primary transition-colors duration-200">
                  suporte.pdo@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-sm group">
                <span className="text-primary flex-shrink-0">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <a href="tel:+5519992185482" className="hover:text-primary transition-colors duration-200">
                  (19) 99218-5482
                </a>
              </li>
              <li className="flex items-center gap-sm group">
                <span className="text-primary flex-shrink-0">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <a href="https://maps.app.goo.gl/yHVSvc1CYA7ksbtk9" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors duration-200">
                  Porto Ferreira, SP - Brasil
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-outline-variant/60"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-md text-label-sm font-label-sm text-on-surface-variant">
          <div>
            © 2026 <span className="text-primary font-semibold">ParceirodeObra</span>. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-xs cursor-default">
            <span>Desenvolvido por</span>
            <img 
              src="https://img.icons8.com/pastel-glyph/64/855300/source-code--v3.png" 
              alt="Código Fonte" 
              className="w-[22px] h-[22px] inline-block" 
            />
            <a 
              href="https://leandrobanin.github.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold text-on-surface hover:text-primary transition-colors cursor-pointer"
            >
              Leandro Banin
            </a>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-primary hover:bg-primary/90 text-on-primary flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-primary/20 active:scale-95 ${showScrollTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
          }`}
        title="Voltar ao topo"
      >
        <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>
    </footer>
  );
}

