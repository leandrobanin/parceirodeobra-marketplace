'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import TransitionOverlay from '@/components/TransitionOverlay';
import {
  clearLegacyAuthBypass,
  clearLocalSessionMarkers,
  getTrustedAuthContext,
  hasLocalSessionExpired,
  isPrivilegedRole,
} from '@/lib/auth-client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAvailable, setIsAvailable] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transitionType, setTransitionType] = useState<'signout' | null>(null);

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Carlos Silva');
  const [userEmail, setUserEmail] = useState('carlos.silva@email.com');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=250&auto=format&fit=crop');
  const [isVerified, setIsVerified] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Fecha pop-ups ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    async function checkAuth() {
      try {
        clearLegacyAuthBypass();
        if (hasLocalSessionExpired()) {
          clearLocalSessionMarkers();
          await supabase.auth.signOut();
          window.location.href = '/auth?mode=signin';
          return;
        }

        const context = await getTrustedAuthContext();
        if (!context) {
          window.location.href = '/auth?mode=signin';
          return;
        }

        if (!isPrivilegedRole(context.role)) {
          // Clientes normais nao acessam painel de profissionais
          window.location.href = '/';
          return;
        }

        setUserName(context.displayName);
        setUserEmail(context.email);
        setIsVerified(context.isDocumentVerified);
        if (context.avatarUrl) {
          setAvatarUrl(context.avatarUrl);
        }

        setLoading(false);
      } catch (error) {
        console.error('Erro de autenticação:', error);
        window.location.href = '/auth?mode=signin';
      }
    }
    checkAuth();
  }, []);

  const handleLogout = async () => {
    setTransitionType('signout');
    setTimeout(async () => {
      clearLocalSessionMarkers();
      await supabase.auth.signOut();
      window.location.href = '/auth?mode=signin';
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getLinkClass = (path: string) => {
    return pathname === path
      ? 'bg-primary-container text-on-primary-container rounded-lg px-md py-sm flex items-center gap-md scale-[0.98] duration-150 transition-all font-semibold shadow-sm'
      : 'text-on-surface-variant px-md py-sm flex items-center gap-md hover:bg-surface-container-low transition-colors rounded-lg';
  };

  return (
    <div className="h-full flex flex-col md:flex-row antialiased relative min-h-screen">
      {/* SideNavBar Component - Desktop */}
      <nav className="hidden md:flex flex-col bg-surface-container-lowest border-r border-outline-variant shadow-sm w-64 p-md z-40 fixed top-0 h-full">
        <div className="mb-lg">
          <Link href="/" className="text-headline-md font-headline-md text-primary font-bold">Parceiro de Obra</Link>
        </div>
        
        <div className="flex items-center gap-md mb-xl p-sm">
          <img 
            alt="Foto de Perfil do Profissional" 
            className="w-12 h-12 rounded-full object-cover border border-outline-variant" 
            src={avatarUrl}
          />
          <div>
            <div className="flex items-center gap-2xs">
              <h2 className="text-label-md font-label-md text-on-surface truncate max-w-[120px]">{userName}</h2>
              {isVerified && (
                <span className="material-symbols-outlined text-[16px] text-emerald-500 icon-fill" title="Verificado">verified</span>
              )}
            </div>
            <p className="text-label-sm font-label-sm text-on-surface-variant">Painel de Controle</p>
          </div>
        </div>
        
        <ul className="flex-1 space-y-sm text-label-md font-label-md">
          <li>
            <Link href="/dashboard" className={getLinkClass('/dashboard')}>
              <span className="material-symbols-outlined">dashboard</span>
              Painel Geral
            </Link>
          </li>
          <li>
            <Link href="/dashboard/services" className={getLinkClass('/dashboard/services')}>
              <span className="material-symbols-outlined">construction</span>
              Serviços
            </Link>
          </li>
          <li>
            <Link href="/dashboard/requests" className={getLinkClass('/dashboard/requests')}>
              <span className="material-symbols-outlined">mail</span>
              Solicitações
            </Link>
          </li>
        </ul>
        
        <div className="mt-auto pt-sm border-t border-outline-variant/60 text-center">
          <span className="inline-flex items-center gap-xs text-[11px] text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[12px] text-tertiary">cloud_done</span>
            Sessao protegida
          </span>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <nav className="w-64 bg-surface-container-lowest h-full p-md flex flex-col shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-lg flex justify-between items-center">
              <Link href="/" className="text-headline-md font-headline-md text-primary font-bold">Parceiro de Obra</Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex items-center gap-md mb-xl p-sm">
              <img 
                alt="Foto de Perfil do Profissional" 
                className="w-12 h-12 rounded-full object-cover border border-outline-variant" 
                src={avatarUrl}
              />
              <div>
                <div className="flex items-center gap-2xs">
                  <h2 className="text-label-md font-label-md text-on-surface truncate max-w-[120px]">{userName}</h2>
                  {isVerified && (
                    <span className="material-symbols-outlined text-[16px] text-emerald-500 icon-fill" title="Verificado">verified</span>
                  )}
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant">Painel de Controle</p>
              </div>
            </div>
            
            <ul className="flex-1 space-y-sm text-label-md font-label-md">
              <li>
                <Link href="/dashboard" className={getLinkClass('/dashboard')} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="material-symbols-outlined">dashboard</span>
                  Painel Geral
                </Link>
              </li>
              <li>
                <Link href="/dashboard/services" className={getLinkClass('/dashboard/services')} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="material-symbols-outlined">construction</span>
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/dashboard/requests" className={getLinkClass('/dashboard/requests')} onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="material-symbols-outlined">mail</span>
                  Solicitações
                </Link>
              </li>
            </ul>
            
            <div className="mt-auto pt-sm border-t border-outline-variant/60 text-center">
              <span className="inline-flex items-center gap-xs text-[11px] text-on-surface-variant/50">
                <span className="material-symbols-outlined text-[12px] text-tertiary">cloud_done</span>
                Sessao protegida
              </span>
            </div>
          </nav>
        </div>
      )}
      
      {/* Main Content Area Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen bg-surface w-full animate-page-in">
        {/* Top Header Bar */}
        <header className="bg-surface-container-lowest border-b border-outline-variant px-lg h-20 flex items-center justify-between sticky top-0 z-30 shadow-sm md:shadow-none min-h-[5rem]">
          {/* Logo / Mobile Menu Trigger */}
          <div className="flex items-center gap-md md:hidden">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <span className="text-headline-md font-headline-md text-primary font-bold">Parceiro de Obra</span>
          </div>

          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-xs">
              <h1 className="text-headline-md font-headline-md text-on-surface font-semibold">Olá, {userName}</h1>
              {isVerified && (
                <span className="material-symbols-outlined text-[20px] text-emerald-500 icon-fill" title="Documento verificado">verified</span>
              )}
            </div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">Bem-vindo de volta ao seu painel.</p>
          </div>

          {/* Header Action Items */}
          <div className="flex items-center gap-lg">
            {/* Availability Buttons */}
            <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-full p-xs gap-xs">
              <button 
                onClick={() => setIsAvailable(true)}
                className={`px-md py-xs rounded-full text-label-sm font-label-sm transition-all duration-200 cursor-pointer ${
                  isAvailable 
                    ? 'bg-tertiary text-on-tertiary shadow-sm font-semibold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Disponível
              </button>
              <button 
                onClick={() => setIsAvailable(false)}
                className={`px-md py-xs rounded-full text-label-sm font-label-sm transition-all duration-200 cursor-pointer ${
                  !isAvailable 
                    ? 'bg-error text-on-error shadow-sm font-semibold' 
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                Indisponível
              </button>
            </div>

            {/* Go to Home Button */}
            <Link 
              href="/"
              className="p-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-low cursor-pointer"
              title="Voltar ao site (Home)"
            >
              <span className="material-symbols-outlined text-[24px]">home</span>
            </Link>

            {/* Notifications Button */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative p-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-low cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">notifications</span>
                <span className="absolute top-[2px] right-[2px] w-2.5 h-2.5 bg-error rounded-full border border-surface-container-lowest"></span>
              </button>
              
              {/* Flat Pop-up for Notifications */}
              {showNotifications && (
                <div className="absolute right-0 mt-xs w-80 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 p-md animate-fade-in">
                  <h4 className="font-label-md text-label-md text-on-surface pb-sm border-b border-outline-variant mb-xs">Notificações</h4>
                  <div className="space-y-sm max-h-60 overflow-y-auto mt-xs">
                    <div className="p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer border-b border-outline-variant/30 last:border-0 pb-xs">
                      <p className="text-body-sm font-body-sm text-on-surface font-semibold">Novo serviço solicitado</p>
                      <p className="text-body-xs font-body-xs text-on-surface-variant">João Ribeiro solicitou um orçamento para Pintura Residencial.</p>
                      <span className="text-[10px] text-primary mt-2xs inline-block">10 min atrás</span>
                    </div>
                    <div className="p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer border-b border-outline-variant/30 last:border-0 pb-xs">
                      <p className="text-body-sm font-body-sm text-on-surface font-semibold">Avaliação de 5 estrelas recebida</p>
                      <p className="text-body-xs font-body-xs text-on-surface-variant">Sarah Jenkins deixou um depoimento elogioso no seu perfil.</p>
                      <span className="text-[10px] text-primary mt-2xs inline-block">2 dias atrás</span>
                    </div>
                    <div className="p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                      <p className="text-body-sm font-body-sm text-on-surface font-semibold">Perfil verificado!</p>
                      <p className="text-body-xs font-body-xs text-on-surface-variant">Sua documentação foi aprovada pela nossa equipe.</p>
                      <span className="text-[10px] text-primary mt-2xs inline-block">5 dias atrás</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar & Menu Pop-up */}
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                  src={avatarUrl}
                />
              </button>
              
              {/* Flat Pop-up for Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-xs w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 py-sm animate-fade-in">
                  <div className="px-md py-xs border-b border-outline-variant mb-xs">
                    <p className="text-label-md font-label-md text-on-surface font-semibold">{userName}</p>
                    <p className="text-body-xs font-body-xs text-on-surface-variant">{userEmail}</p>
                  </div>
                  <Link href="/dashboard/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-xs px-md py-sm text-label-md text-on-surface hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Meu Perfil
                  </Link>
                  <Link href="/dashboard/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-xs px-md py-sm text-label-md text-on-surface hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Configurações
                  </Link>
                  <div className="border-t border-outline-variant my-xs"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-xs px-md py-sm text-label-md text-error hover:bg-error-container/20 transition-colors text-left cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 p-lg md:p-xl w-full">
          {children}
        </main>
      </div>
      {transitionType && <TransitionOverlay type={transitionType} />}
    </div>
  );
}
