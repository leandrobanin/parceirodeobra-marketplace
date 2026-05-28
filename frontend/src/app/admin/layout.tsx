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
} from '@/lib/auth-client';

export default function AdminLayout({
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
  const [avatarUrl, setAvatarUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuD3RECfNTRsA_JnVgEyzjL-YYn-Igb7zHsoeozQqKUY247yKALuYqGvxtJ-i_zW8s5k4Gw7tI0tJPGKz6hB5X280t7pG9q1EX-MGtW4LxLRwgBogbkUvE_0kawwkae-4VDfu5Hr_WxwCvQV0kQVs7ZPhBJK1JMwQrF50985rm9pop8qoHRJT2QkEri-RC5S7HyOZ45zlXow3GhJlCTm1BOO5F_O6xJH-1eYDNHkMmKgum-cMg52H1L9JinYiVZpsLF-6bIelUAIuvyL');
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

        if (context.role !== 'ADMIN') {
          // O painel interno fica restrito a administradores reais.
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
    <div className="bg-background text-on-background flex h-screen overflow-hidden antialiased">
      {/* SideNavBar - Desktop */}
      <aside className="hidden md:flex bg-surface-container-lowest text-label-md font-label-md border-r border-outline-variant shadow-sm fixed left-0 top-0 h-screen w-64 flex-col p-md z-40">
        <div className="mb-xl flex items-center gap-sm mt-sm px-sm">
          <Link href="/" className="text-headline-md font-headline-md text-primary font-bold">Parceiro de Obra</Link>
          <span className="bg-primary-container text-on-primary-container text-xs px-2 py-1 rounded-full font-bold ml-auto">ADMIN</span>
        </div>
        
        <nav className="flex-1 flex flex-col gap-sm">
          <Link href="/admin" className={getLinkClass('/admin')}>
            <span className="material-symbols-outlined icon-fill text-[20px]">dashboard</span>
            Painel Geral
          </Link>
          <Link href="/admin/services" className={getLinkClass('/admin/services')}>
            <span className="material-symbols-outlined text-[20px]">construction</span>
            Serviços
          </Link>
          <Link href="/admin/requests" className={getLinkClass('/admin/requests')}>
            <span className="material-symbols-outlined text-[20px]">mail</span>
            Solicitações
          </Link>
        </nav>
        
        <div className="mt-auto pt-sm border-t border-outline-variant/60 text-center">
          <span className="inline-flex items-center gap-xs text-[11px] text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[12px] text-tertiary">cloud_done</span>
            Sessao protegida
          </span>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-64 bg-surface-container-lowest h-full p-md flex flex-col shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="mb-lg flex justify-between items-center">
              <Link href="/" className="text-headline-md font-headline-md text-primary font-bold">Parceiro de Obra</Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col gap-sm">
              <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/admin')}>
                <span className="material-symbols-outlined icon-fill text-[20px]">dashboard</span>
                Painel Geral
              </Link>
              <Link href="/admin/services" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/admin/services')}>
                <span className="material-symbols-outlined text-[20px]">construction</span>
                Serviços
              </Link>
              <Link href="/admin/requests" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/admin/requests')}>
                <span className="material-symbols-outlined text-[20px]">mail</span>
                Solicitações
              </Link>
            </nav>
            
            <div className="mt-auto pt-sm border-t border-outline-variant/60 text-center">
              <span className="inline-flex items-center gap-xs text-[11px] text-on-surface-variant/50">
                <span className="material-symbols-outlined text-[12px] text-tertiary">cloud_done</span>
                Sessao protegida
              </span>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Canvas */}
      <main className="flex-1 ml-0 md:ml-64 flex flex-col h-screen overflow-y-auto bg-[#F9FAFB] animate-page-in">
        {/* Top Bar for Canvas */}
        <header className="bg-surface-container-lowest border-b border-outline-variant px-lg h-20 flex items-center justify-between sticky top-0 z-30 shadow-sm md:shadow-none min-h-[5rem]">
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
            <p className="text-label-sm font-label-sm text-on-surface-variant mt-xs">Métricas em tempo real e status do sistema.</p>
          </div>
          
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
              className="text-on-surface-variant hover:text-primary transition-colors p-xs flex items-center justify-center rounded-full hover:bg-surface-container-low cursor-pointer"
              title="Voltar ao site (Home)"
            >
              <span className="material-symbols-outlined">home</span>
            </Link>

            {/* Notifications Button */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="relative text-on-surface-variant hover:text-primary transition-colors p-xs flex items-center justify-center rounded-full hover:bg-surface-container-low cursor-pointer"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-surface-container-lowest"></span>
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
              <div 
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden hover:opacity-90 transition-opacity cursor-pointer"
              >
                <img 
                  alt="Admin Avatar" 
                  className="w-full h-full object-cover" 
                  src={avatarUrl}
                />
              </div>

              {/* Flat Pop-up for Profile Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-xs w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 py-sm animate-fade-in">
                  <div className="px-md py-xs border-b border-outline-variant mb-xs">
                    <p className="text-label-md font-label-md text-on-surface font-semibold">{userName}</p>
                    <p className="text-body-xs font-body-xs text-on-surface-variant">{userEmail}</p>
                  </div>
                  <Link href="/admin/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-xs px-md py-sm text-label-md text-on-surface hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Meu Perfil
                  </Link>
                  <Link href="/admin/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-xs px-md py-sm text-label-md text-on-surface hover:bg-surface-container-low transition-colors">
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

        {/* Page Content */}
        {children}
      </main>
      {transitionType && <TransitionOverlay type={transitionType} />}
    </div>
  );
}
