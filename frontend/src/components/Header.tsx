'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import TransitionOverlay from '@/components/TransitionOverlay';
import {
  clearLegacyAuthBypass,
  clearLocalSessionMarkers,
  getTrustedAuthContext,
  hasLocalSessionExpired,
  isPrivilegedRole,
  markSessionCreated,
  type AppRole,
} from '@/lib/auth-client';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuD3RECfNTRsA_JnVgEyzjL-YYn-Igb7zHsoeozQqKUY247yKALuYqGvxtJ-i_zW8s5k4Gw7tI0tJPGKz6hB5X280t7pG9q1EX-MGtW4LxLRwgBogbkUvE_0kawwkae-4VDfu5Hr_WxwCvQV0kQVs7ZPhBJK1JMwQrF50985rm9pop8qoHRJT2QkEri-RC5S7HyOZ45zlXow3GhJlCTm1BOO5F_O6xJH-1eYDNHkMmKgum-cMg52H1L9JinYiVZpsLF-6bIelUAIuvyL');
  const [userRole, setUserRole] = useState<AppRole>('CUSTOMER');

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [transitionType, setTransitionType] = useState<'signin' | 'signup' | 'signout' | null>(null);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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
    const checkSessionExpiry = async () => {
      if (hasLocalSessionExpired()) {
        clearLocalSessionMarkers();
        await supabase.auth.signOut();
        window.location.href = '/';
        return true;
      }
      return false;
    };

    const applyAuthContext = async () => {
      const context = await getTrustedAuthContext();
      if (!context) {
        setUser(null);
        setUserName('');
        setUserEmail('');
        setUserRole('CUSTOMER');
        setAvatarUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuD3RECfNTRsA_JnVgEyzjL-YYn-Igb7zHsoeozQqKUY247yKALuYqGvxtJ-i_zW8s5k4Gw7tI0tJPGKz6hB5X280t7pG9q1EX-MGtW4LxLRwgBogbkUvE_0kawwkae-4VDfu5Hr_WxwCvQV0kQVs7ZPhBJK1JMwQrF50985rm9pop8qoHRJT2QkEri-RC5S7HyOZ45zlXow3GhJlCTm1BOO5F_O6xJH-1eYDNHkMmKgum-cMg52H1L9JinYiVZpsLF-6bIelUAIuvyL');
        return;
      }

      setUser(context.user);
      setUserName(context.displayName);
      setUserEmail(context.email);
      setUserRole(context.role);
      if (context.avatarUrl) {
        setAvatarUrl(context.avatarUrl);
      }
      markSessionCreated();
    };

    async function loadSession() {
      try {
        clearLegacyAuthBypass();
        const isExpired = await checkSessionExpiry();
        if (isExpired) return;
        await applyAuthContext();
      } catch (err) {
        console.error('Erro ao carregar header auth:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSession();

    // Check transition overlays in sessionStorage
    if (typeof window !== 'undefined') {
      const showSignin = sessionStorage.getItem('obra_certa_show_signin_transition');
      const showSignup = sessionStorage.getItem('obra_certa_show_signup_transition');
      if (showSignin === 'true') {
        sessionStorage.removeItem('obra_certa_show_signin_transition');
        setTransitionType('signin');
        setTimeout(() => {
          setTransitionType(null);
        }, 1500);
      } else if (showSignup === 'true') {
        sessionStorage.removeItem('obra_certa_show_signup_transition');
        setTransitionType('signup');
        setTimeout(() => {
          setTransitionType(null);
        }, 1500);
      }
    }

    // Interval to check expiration every 30 seconds
    const intervalId = setInterval(checkSessionExpiry, 30000);

    // Se inscreve para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      clearLegacyAuthBypass();
      if (session?.user) {
        await applyAuthContext();
      } else {
        setUser(null);
        setUserName('');
        setUserEmail('');
        setUserRole('CUSTOMER');
        setAvatarUrl('https://lh3.googleusercontent.com/aida-public/AB6AXuD3RECfNTRsA_JnVgEyzjL-YYn-Igb7zHsoeozQqKUY247yKALuYqGvxtJ-i_zW8s5k4Gw7tI0tJPGKz6hB5X280t7pG9q1EX-MGtW4LxLRwgBogbkUvE_0kawwkae-4VDfu5Hr_WxwCvQV0kQVs7ZPhBJK1JMwQrF50985rm9pop8qoHRJT2QkEri-RC5S7HyOZ45zlXow3GhJlCTm1BOO5F_O6xJH-1eYDNHkMmKgum-cMg52H1L9JinYiVZpsLF-6bIelUAIuvyL');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearInterval(intervalId);
    };
  }, []);

  const handleLogout = async () => {
    setTransitionType('signout');
    setTimeout(async () => {
      clearLocalSessionMarkers();
      await supabase.auth.signOut();
      window.location.href = '/';
    }, 1500);
  };

  const isLoggedIn = user !== null;
  const isProOrAdmin = isPrivilegedRole(userRole);
  const panelHref = userRole === 'ADMIN' ? '/admin' : '/dashboard';

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-lg border-b border-outline-variant/50">
      <nav className="flex justify-between items-center px-lg h-20 max-w-container-max mx-auto">
        {/* Brand Logo (Left aligned) */}
        <div className="flex-1 flex justify-start">
          <Link href="/" className="text-headline-md font-headline-md font-bold text-on-surface flex items-center gap-xs hover:opacity-90 transition-opacity">
            {/* Brand Logo */}
            <svg className="w-[2em] h-[2em] fill-current text-primary" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M 25 20 H 38 V 31 L 50 19 L 75 44 V 68 H 62 V 81 H 38 L 25 68 Z M 38 68 H 62 V 48 L 50 36 L 38 48 Z" />
            </svg>
            <span className="tracking-wide">Parceirode<span className="text-primary font-bold">Obra</span></span>
          </Link>
        </div>
 
        {/* Navigation Links (Centered) */}
        <div className="hidden md:flex items-center gap-lg justify-center">
          <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">
            Inicio
          </Link>
          <Link href="/search" className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">
            Contratar
          </Link>
          <Link href="/how-it-works" className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">
            Como Funciona 
          </Link>
          <Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">
            Contato
          </Link>
        </div>

        {/* Action Buttons (Right aligned) */}
        <div className="flex-1 flex justify-end items-center gap-md">
          {loading ? (
            <div className="h-9 w-20 bg-surface-variant/30 animate-pulse rounded-full"></div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-md">
              {/* Notifications Button */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="relative p-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center rounded-full hover:bg-surface-container-low cursor-pointer focus:outline-none"
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
                      <div className="p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer">
                        <p className="text-body-sm font-body-sm text-on-surface font-semibold">Perfil ativo</p>
                        <p className="text-body-xs font-body-xs text-on-surface-variant">Você está conectado na rede premium Parceiro de Obra.</p>
                        <span className="text-[10px] text-primary mt-2xs inline-block">1 dia atrás</span>
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
                  className="w-10 h-10 rounded-full border border-outline-variant overflow-hidden hover:opacity-90 transition-opacity cursor-pointer focus:outline-none flex items-center justify-center bg-surface-container-high"
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
                      <p className="text-label-md font-label-md text-on-surface font-semibold truncate max-w-[150px]">{userName}</p>
                      <p className="text-body-xs font-body-xs text-on-surface-variant truncate max-w-[150px]">{userEmail}</p>
                    </div>
                    {isProOrAdmin && (
                      <Link href={panelHref} onClick={() => setShowProfileMenu(false)} className="flex items-center gap-xs px-md py-sm text-label-md text-on-surface hover:bg-surface-container-low transition-colors font-semibold">
                        <span className="material-symbols-outlined text-[18px]">dashboard</span>
                        Painel Geral
                      </Link>
                    )}
                    <Link href={userRole === 'ADMIN' ? "/admin/profile" : userRole === 'PROFESSIONAL' ? "/dashboard/profile" : "/profile"} onClick={() => setShowProfileMenu(false)} className="flex items-center gap-xs px-md py-sm text-label-md text-on-surface hover:bg-surface-container-low transition-colors font-semibold">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      Meu Perfil
                    </Link>
                    <div className="border-t border-outline-variant my-xs"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-xs px-md py-sm text-label-md text-error hover:bg-error-container/20 transition-colors text-left cursor-pointer focus:outline-none font-semibold"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <Link href="/auth?mode=signin" className="text-label-md font-label-md text-on-surface hover:text-primary transition-colors px-md py-sm whitespace-nowrap">
                Entrar
              </Link>
              <Link href="/auth?mode=signup" className="bg-primary text-on-primary text-label-md font-label-md px-lg py-sm rounded-full hover:bg-primary/90 transition-colors shadow-sm whitespace-nowrap">
                Registrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
    {transitionType && <TransitionOverlay type={transitionType} />}
  </>
);
}
