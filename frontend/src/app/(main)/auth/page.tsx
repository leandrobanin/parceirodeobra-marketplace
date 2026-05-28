'use client';
import { useState, useEffect, Suspense, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import TransitionOverlay from '@/components/TransitionOverlay';
import { clearLegacyAuthBypass, markSessionCreated } from '@/lib/auth-client';

const CIDADES_DISPONIVEIS = [
  'Americana',
  'Analândia',
  'Araras',
  'Bauru',
  'Brotas',
  'Campinas',
  'Cordeirópolis',
  'Corumbataí',
  'Descalvado',
  'Espirito Santo do Pinhal',
  'Ibaté',
  'Itirapina',
  'Jaú',
  'Leme',
  'Limeira',
  'Mogi Guaçu',
  'Mogi Mirim',
  'Piracicaba',
  'Pirassununga',
  'Porto Ferreira',
  'Ribeirão Preto',
  'Rio Claro',
  'Santa Cruz das Palmeiras',
  'Santa Gertrudes',
  'São Carlos',
  'São João da Boa Vista',
  'Tambaú',
  'Valinhos'
];

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function AuthContent() {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const [tab, setTab] = useState<'signup' | 'signin'>('signup');
  const [role, setRole] = useState<'customer' | 'pro'>('customer');
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const signUpRef = useRef<HTMLFormElement>(null);
  const signInRef = useRef<HTMLFormElement>(null);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Sign Up State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Removed pro document verification step from signup (moved to edit profile)

  // Autocomplete city state & handlers
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [transitionType, setTransitionType] = useState<'signin' | 'signup' | null>(null);

  const handleCityChange = (val: string) => {
    setRegCity(val);
    if (val.trim() === '') {
      setCitySuggestions(CIDADES_DISPONIVEIS);
    } else {
      const filtered = CIDADES_DISPONIVEIS.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      );
      setCitySuggestions(filtered);
    }
  };

  const handleCityFocus = () => {
    setShowSuggestions(true);
    if (regCity.trim() === '') {
      setCitySuggestions(CIDADES_DISPONIVEIS);
    } else {
      const filtered = CIDADES_DISPONIVEIS.filter((c) =>
        c.toLowerCase().includes(regCity.toLowerCase())
      );
      setCitySuggestions(filtered);
    }
  };

  const handleCityBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  useEffect(() => {
    if (mode === 'signin') {
      setTab('signin');
    } else if (mode === 'signup') {
      setTab('signup');
    }
  }, [mode]);

  useEffect(() => {
    const updateHeight = () => {
      const activeRef = tab === 'signup' ? signUpRef : signInRef;
      if (activeRef.current) {
        setContainerHeight(activeRef.current.scrollHeight);
      }
    };
    
    // Measure right after render
    updateHeight();
    
    // Re-measure on window resizing to stay responsive
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [tab, role]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    clearLegacyAuthBypass();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      if (error) {
        setLoginError(error.message);
        setIsLoggingIn(false);
        return;
      }

      if (data.user) {
        if (typeof window !== 'undefined') {
          markSessionCreated();
          sessionStorage.setItem('obra_certa_show_signin_transition', 'true');
        }
        window.location.href = '/';
      }
    } catch (err: unknown) {
      setLoginError(getErrorMessage(err, 'Erro ao realizar login.'));
      setIsLoggingIn(false);
    }
  };

  const handleSignUpNext = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegisterSubmit(e);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');
    setIsRegistering(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        options: {
          data: {
            full_name: regName,
            role: role === 'pro' ? 'PROFESSIONAL' : 'CUSTOMER',
            city: regCity,
            document_type: null,
            document_verification_status: null,
          },
        },
      });

      if (error) {
        setRegError(error.message);
        setIsRegistering(false);
        return;
      }

      if (data.user && !data.session) {
        setRegSuccess('Cadastro realizado! Por favor, verifique seu e-mail para confirmar a conta.');
      } else if (data.session) {
        if (typeof window !== 'undefined') {
          markSessionCreated();
          sessionStorage.setItem('obra_certa_show_signup_transition', 'true');
        }
        window.location.href = '/';
      }
    } catch (err: unknown) {
      setRegError(getErrorMessage(err, 'Erro ao realizar cadastro.'));
    } finally {
      setIsRegistering(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginError('');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setLoginError(error.message);
      }
    } catch (err: unknown) {
      setLoginError(getErrorMessage(err, 'Erro ao iniciar login com Google'));
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-md sm:p-lg bg-background min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-[24px] border border-surface-variant p-lg sm:p-xl shadow-[0_10px_15px_-3px_rgba(17,24,39,0.05)] relative overflow-hidden">
        {/* Subtle decorative top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container"></div>
        
        {/* Header */}
        <div className="text-center mb-xl mt-sm">
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Parceiro de Obra</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Rede premium de serviços para sua obra</p>
        </div>
        
        {/* Main Auth Toggle */}
        <div className="flex bg-surface-container-high rounded-lg p-xs mb-lg relative">
          <div 
            className={`absolute top-xs left-xs h-[calc(100%-8px)] w-[calc(50%-4px)] bg-surface-container-lowest rounded-md shadow-sm transition-transform duration-300 ease-out z-0 ${tab === 'signin' ? 'translate-x-full' : 'translate-x-0'}`} 
          />
          <button 
            type="button"
            className={`flex-1 py-sm text-center relative z-10 font-label-md text-label-md transition-colors focus:outline-none ${tab === 'signup' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`} 
            onClick={() => setTab('signup')}
          >
            Criar Conta
          </button>
          <button 
            type="button"
            className={`flex-1 py-sm text-center relative z-10 font-label-md text-label-md transition-colors focus:outline-none ${tab === 'signin' ? 'text-on-surface' : 'text-on-surface-variant hover:text-on-surface'}`} 
            onClick={() => setTab('signin')}
          >
            Entrar
          </button>
        </div>
        
        {/* Forms Container - Animated transitions between Sign Up and Sign In */}
        <div 
          style={{ height: containerHeight ? `${containerHeight}px` : 'auto' }}
          className="relative overflow-hidden transition-all duration-500 ease-in-out"
        >
          {/* Sign Up Flow */}
          <form 
            onSubmit={handleSignUpNext}
            ref={signUpRef}
            className={`transition-all duration-500 ease-in-out flex flex-col gap-md ${
              tab === 'signup' 
                ? 'opacity-100 translate-x-0 pointer-events-auto' 
                : 'opacity-0 -translate-x-12 pointer-events-none absolute inset-x-0 top-0'
            }`}
          >
            {regError && (
              <div className="bg-error-container/30 border border-error/50 text-error rounded-lg px-md py-sm text-body-sm font-body-sm">
                {regError}
              </div>
            )}
            {regSuccess && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg px-md py-sm text-body-sm font-body-sm">
                {regSuccess}
              </div>
            )}

            {/* Container slide layout */}
            <div className="relative overflow-hidden w-full transition-all duration-500 ease-in-out p-[6px] -m-[6px]" style={{ minHeight: '348px' }}>
              {/* STEP 1: Basic Info & Role */}
              <div className="flex flex-col gap-md transition-all duration-500 ease-in-out w-full p-[2px]">
                {/* Role Toggle */}
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-sm">Quero me cadastrar como:</label>
                  <div className="flex gap-md p-[4px] -m-[4px]">
                    <button 
                      type="button"
                      className={`flex-1 rounded-xl p-md flex flex-col items-center justify-center gap-xs cursor-pointer focus:outline-none transition-all duration-300 ${
                        role === 'customer' 
                          ? 'border-2 border-amber-500 bg-amber-50/50 shadow-[0_4px_12px_rgba(245,158,11,0.15)] scale-[1.03]' 
                          : 'border border-outline-variant bg-surface-container-lowest opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                      }`}
                      onClick={() => setRole('customer')}
                    >
                      <span className={`material-symbols-outlined ${role === 'customer' ? 'icon-fill text-amber-500 scale-[1.1]' : 'text-on-surface-variant/60'}`}>home</span>
                      <span className={`font-label-md text-label-md ${role === 'customer' ? 'text-amber-800 font-bold scale-[1.02]' : 'text-on-surface-variant/60 font-medium'}`}>Cliente</span>
                    </button>
                    <button 
                      type="button"
                      className={`flex-1 rounded-xl p-md flex flex-col items-center justify-center gap-xs cursor-pointer focus:outline-none transition-all duration-300 ${
                        role === 'pro' 
                          ? 'border-2 border-amber-500 bg-amber-50/50 shadow-[0_4px_12px_rgba(245,158,11,0.15)] scale-[1.03]' 
                          : 'border border-outline-variant bg-surface-container-lowest opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
                      }`}
                      onClick={() => setRole('pro')}
                    >
                      <span className={`material-symbols-outlined ${role === 'pro' ? 'icon-fill text-amber-500 scale-[1.1]' : 'text-on-surface-variant/60'}`}>handyman</span>
                      <span className={`font-label-md text-label-md ${role === 'pro' ? 'text-amber-800 font-bold scale-[1.02]' : 'text-on-surface-variant/60 font-medium'}`}>Profissional</span>
                    </button>
                  </div>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-md">
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[12px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all" 
                    placeholder="Nome Completo" 
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[12px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all" 
                    placeholder="E-mail" 
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px]">location_on</span>
                    <input 
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-[44px] pr-md py-[12px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all" 
                      placeholder="Cidade (Ex: Porto Ferreira)" 
                      type="text"
                      value={regCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                      onFocus={handleCityFocus}
                      onBlur={handleCityBlur}
                      required
                      autoComplete="off"
                    />

                    {/* Autocomplete list dropdown */}
                    {showSuggestions && citySuggestions.length > 0 && (
                      <ul className="absolute top-[calc(100%+4px)] left-0 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] z-50 max-h-64 overflow-y-auto py-xs animate-fade-in">
                        {citySuggestions.map((city) => (
                          <li
                            key={city}
                            onMouseDown={() => {
                              setRegCity(city);
                              setShowSuggestions(false);
                            }}
                            className="px-md py-[6px] text-[12px] font-semibold text-on-surface hover:bg-amber-50/50 hover:text-amber-900 cursor-pointer transition-all flex items-center gap-xs"
                          >
                            <span className="material-symbols-outlined text-[14px] text-on-surface-variant/60">location_on</span>
                            {city}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <input 
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[12px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all" 
                    placeholder="Senha" 
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isRegistering}
                  className="w-full bg-primary-container text-on-primary-container rounded-lg py-[14px] font-label-md text-label-md text-center hover:bg-inverse-primary transition-colors mt-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container disabled:opacity-50 flex items-center justify-center gap-xs cursor-pointer"
                >
                  {isRegistering ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary-container border-t-transparent"></div>
                      Cadastrando...
                    </>
                  ) : (
                    'Criar Conta'
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Sign In Flow */}
          <form 
            onSubmit={handleLoginSubmit}
            ref={signInRef}
            className={`transition-all duration-500 ease-in-out flex flex-col gap-md ${
              tab === 'signin' 
                ? 'opacity-100 translate-x-0 pointer-events-auto' 
                : 'opacity-0 translate-x-12 pointer-events-none absolute inset-x-0 top-0'
            }`}
          >
            {loginError && (
              <div className="bg-error-container/30 border border-error/50 text-error rounded-lg px-md py-sm text-body-sm font-body-sm">
                {loginError}
              </div>
            )}
            <div className="flex flex-col gap-md">
              <input 
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[12px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all" 
                id="login-email" 
                placeholder="E-mail" 
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <div className="flex flex-col gap-xs">
                <input 
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[12px] font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all" 
                  id="login-password" 
                  placeholder="Senha" 
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <div className="text-right mt-xs">
                  <Link className="font-label-sm text-label-sm text-primary hover:underline" href="#">
                    Esqueceu a senha?
                  </Link>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-primary-container text-on-primary-container rounded-lg py-[14px] font-label-md text-label-md text-center hover:bg-inverse-primary transition-colors mt-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container disabled:opacity-50 flex items-center justify-center gap-xs"
            >
              {isLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary-container border-t-transparent"></div>
                  Acessando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>
        </div>
        
        {/* Shared Bottom Elements */}
        <div>
          <div className="flex items-center gap-md my-lg">
            <div className="flex-1 h-px bg-surface-variant"></div>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Ou</span>
            <div className="flex-1 h-px bg-surface-variant"></div>
          </div>
          <div className="flex flex-col gap-sm">
            <button 
              type="button" 
              onClick={handleGoogleLogin}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-[12px] flex items-center justify-center gap-sm hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-outline-variant cursor-pointer"
            >
              <svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
              <span className="font-label-md text-label-md text-on-surface">Continuar com o Google</span>
            </button>
          </div>
          <p className="text-center mt-xl font-label-sm text-label-sm text-on-surface-variant px-md">
            Ao continuar, você concorda com nossos <Link className="text-primary hover:underline" href="#">Termos de Serviço</Link> e <Link className="text-primary hover:underline" href="#">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
      {transitionType && <TransitionOverlay type={transitionType} />}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-background min-h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
