'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

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

// Curated modern gradient preset arts
const PRESET_AVATARS = [
  { name: 'Warm Sunset', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23FF512F"/><stop offset="100%" stop-color="%23DD2476"/></linearGradient></defs><rect width="120" height="120" fill="url(%23g1)"/></svg>' },
  { name: 'Ocean Breeze', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2300c6ff"/><stop offset="100%" stop-color="%230072ff"/></linearGradient></defs><rect width="120" height="120" fill="url(%23g2)"/></svg>' },
  { name: 'Lush Meadow', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%2311998e"/><stop offset="100%" stop-color="%2338ef7d"/></linearGradient></defs><rect width="120" height="120" fill="url(%23g3)"/></svg>' },
  { name: 'Royal Velvet', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%238A2387"/><stop offset="50%" stop-color="%23E94057"/><stop offset="100%" stop-color="%23F27121"/></linearGradient></defs><rect width="120" height="120" fill="url(%23g4)"/></svg>' },
  { name: 'Deep Purple', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236441A5"/><stop offset="100%" stop-color="%232a0845"/></linearGradient></defs><rect width="120" height="120" fill="url(%23g5)"/></svg>' },
  { name: 'Golden Hour', url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><defs><linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23F12711"/><stop offset="100%" stop-color="%23F5AF19"/></linearGradient></defs><rect width="120" height="120" fill="url(%23g6)"/></svg>' },
];

export default function ClientProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Perfil atualizado com sucesso!');
  const [mounted, setMounted] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [about, setAbout] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PRESET_AVATARS[0].url);

  // Document Verification States
  const [isVerified, setIsVerified] = useState(false);
  const [docType, setDocType] = useState<'RG' | 'CPF' | 'CNH'>('RG');
  const [docFile, setDocFile] = useState<File | null>(null);
  const [verifyingDoc, setVerifyingDoc] = useState(false);
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [ocrMessage, setOcrMessage] = useState('');

  // Autocomplete City States
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/auth?mode=signin');
          return;
        }

        setName(user.user_metadata?.full_name || user.user_metadata?.name || '');
        setEmail(user.email || '');
        setCity(user.user_metadata?.city || '');
        setAbout(user.user_metadata?.about || '');
        setIsVerified(user.app_metadata?.document_verified === true);
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
        }
      } catch (err) {
        console.error('Erro ao obter perfil do usuário:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [router]);

  // Autocomplete Handlers
  const handleCityChange = (val: string) => {
    setCity(val);
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
    if (city.trim() === '') {
      setCitySuggestions(CIDADES_DISPONIVEIS);
    } else {
      const filtered = CIDADES_DISPONIVEIS.filter((c) =>
        c.toLowerCase().includes(city.toLowerCase())
      );
      setCitySuggestions(filtered);
    }
  };

  const handleCityBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Compress and resize image client-side to keep base64 metadata payload small
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 120;
          const MAX_HEIGHT = 120;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Compress to JPEG with 70% quality (resulting in ~4-8KB base64 string)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setAvatarUrl(dataUrl);
        };
        img.src = event.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          avatar_url: avatarUrl,
          city: city,
          about: about,
        },
      });

      if (error) {
        throw error;
      }

      setToastMessage('Suas alterações de perfil foram salvas com sucesso!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error('Erro ao salvar alterações:', err);
      alert('Ocorreu um erro ao salvar as alterações do perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) return;

    setVerifyingDoc(true);
    setOcrStatus('success');
    setOcrMessage('Documento recebido. Sua verificacao ficara pendente ate revisao administrativa.');

    try {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
      const maxSize = 5 * 1024 * 1024;
      if (!allowedTypes.includes(docFile.type) || docFile.size > maxSize) {
        setOcrStatus('error');
        setOcrMessage('Envie um documento em JPG, PNG, WEBP ou PDF com ate 5MB.');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        data: {
          document_verification_status: 'pending_review',
          document_type: docType,
        },
      });

      if (error) throw error;

      setIsVerified(false);
      setToastMessage('Documento enviado para analise administrativa.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error('Erro ao atualizar estado de verificação:', err);
      setOcrStatus('error');
      setOcrMessage('Erro ao salvar verificação de segurança.');
    } finally {
      setVerifyingDoc(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-container-max mx-auto px-lg py-xl flex flex-col gap-lg min-h-[calc(100vh-80px)] bg-[#F9FAFB]">
      
      {/* Toast notification */}
      {mounted && createPortal(
        <div 
          className={`fixed top-6 right-6 z-[9999] flex items-start gap-4 bg-surface-container-lowest border-l-4 border-tertiary text-on-surface p-4 pr-12 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-outline-variant/30 transition-all duration-500 ease-out transform ${
            showToast 
              ? 'translate-y-0 md:translate-x-0 opacity-100 scale-100' 
              : '-translate-y-4 md:translate-y-0 md:translate-x-12 opacity-0 scale-95 pointer-events-none'
          }`}
          style={{ maxWidth: '380px' }}
        >
          <div className="flex-shrink-0 bg-tertiary/10 text-tertiary p-2 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px] animate-bounce">check_circle</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-label-md text-label-md text-on-surface font-bold mb-1">
              Perfil Atualizado!
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {toastMessage}
            </p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="absolute top-3 right-3 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-low p-1 flex items-center justify-center cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          
          <div className="absolute bottom-0 left-0 h-[3px] bg-tertiary/20 w-full overflow-hidden rounded-b-xl">
            <div 
              className="h-full bg-tertiary transition-all"
              style={{
                width: showToast ? '0%' : '100%',
                transitionDuration: showToast ? '4000ms' : '0ms',
                transitionTimingFunction: 'linear'
              }}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-md">
        <div>
          <div className="flex items-center gap-sm">
            <h1 className="text-headline-lg font-headline-lg text-on-surface font-bold">Meu Perfil</h1>
            {isVerified && (
              <span className="material-symbols-outlined text-[24px] text-emerald-500 icon-fill" title="Conta verificada">verified</span>
            )}
          </div>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs">Gerencie suas informações cadastrais e autenticidade.</p>
        </div>
        <div>
          <Link href="/" className="text-on-surface-variant hover:text-on-surface text-label-md font-label-md px-md py-sm rounded-lg border border-outline hover:bg-surface-container-low transition-colors inline-flex items-center gap-xs">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Voltar ao Início
          </Link>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        
        {/* Left Column: Form Info */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <form onSubmit={handleSave} className="flex flex-col gap-lg">
            <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
              <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm mb-xs">Informações Pessoais</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="client-name">Nome Completo</label>
                  <input 
                    type="text"
                    id="client-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                    required
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <label className="text-label-sm font-label-sm text-on-surface-variant">E-mail (Não alterável)</label>
                  <input 
                    type="email"
                    value={email}
                    disabled
                    className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface-variant cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              {/* City Autocomplete Field */}
              <div className="flex flex-col gap-xs relative">
                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="client-city">Cidade / Região</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant/70 text-[20px] z-10">location_on</span>
                  <input 
                    type="text"
                    id="client-city"
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    onFocus={handleCityFocus}
                    onBlur={handleCityBlur}
                    placeholder="Ex: Porto Ferreira"
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-[44px] pr-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                    autoComplete="off"
                  />

                  {showSuggestions && citySuggestions.length > 0 && (
                    <ul className="absolute top-[calc(100%+4px)] left-0 w-full bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto py-xs animate-fade-in">
                      {citySuggestions.map((item) => (
                        <li
                          key={item}
                          onMouseDown={() => {
                            setCity(item);
                            setShowSuggestions(false);
                          }}
                          className="px-md py-[8px] text-[12px] font-semibold text-on-surface hover:bg-amber-50/50 hover:text-amber-900 cursor-pointer transition-all flex items-center gap-xs"
                        >
                          <span className="material-symbols-outlined text-[14px] text-on-surface-variant/60">location_on</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="client-about">Sobre Mim / Minhas Necessidades</label>
                <textarea 
                  id="client-about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={4}
                  placeholder="Conte-nos um pouco sobre você, tipo de serviços que costuma contratar ou detalhes sobre seus projetos..."
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all resize-none"
                />
              </div>
            </section>

            {/* Save Buttons */}
            <div className="flex gap-md justify-end mt-2xs">
              <Link 
                href="/" 
                className="text-on-surface-variant hover:text-on-surface text-label-md font-label-md px-xl py-md rounded-lg border border-outline hover:bg-surface-container-low transition-colors focus:outline-none"
              >
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={isSaving}
                className="bg-primary text-on-primary text-label-md font-label-md px-xl py-md rounded-lg hover:opacity-90 transition-opacity focus:outline-none disabled:opacity-50 flex items-center justify-center gap-sm shadow-md cursor-pointer font-bold"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Identity Verification System Section */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm mb-xs">Verificação de Identidade</h2>
            
            {isVerified ? (
              <div className="flex items-start gap-md bg-emerald-50/50 border border-emerald-300 rounded-xl p-md text-emerald-950 text-body-sm">
                <span className="material-symbols-outlined text-[32px] text-emerald-600 icon-fill shrink-0">shield_with_heart</span>
                <div className="flex flex-col gap-2xs mt-2xs">
                  <p className="font-bold text-label-md text-emerald-900">Sua Conta está Verificada!</p>
                  <p className="text-body-xs text-emerald-800">
                    Sua identidade foi confirmada com sucesso via escaneamento de documento oficial. Isso ajuda a garantir a transparência e a segurança para toda a rede de profissionais.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifyDocument} className="flex flex-col gap-md">
                <div className="flex items-start gap-sm bg-surface-container-low border border-outline-variant p-md rounded-xl text-on-surface-variant text-body-sm">
                  <span className="material-symbols-outlined text-[24px] text-primary shrink-0">info</span>
                  <p className="text-body-xs leading-normal">
                    Envie uma foto nitida de seu documento oficial (RG, CPF ou CNH). A aprovacao final e feita pela administracao, fora do navegador.
                  </p>
                </div>

                {/* Doc Type */}
                <div className="flex gap-sm">
                  {(['RG', 'CPF', 'CNH'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setDocType(type)}
                      className={`flex-1 py-sm rounded-lg text-body-sm font-semibold transition-all focus:outline-none border cursor-pointer text-center ${
                        docType === type 
                          ? 'border-amber-500 bg-amber-50/50 text-amber-900 shadow-sm' 
                          : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Document Image File */}
                <div>
                  <label className="block font-label-sm text-label-sm text-on-surface-variant mb-xs">Foto do Documento (Frente ou Verso)</label>
                  <div 
                    onClick={() => docFileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-md flex flex-col items-center justify-center gap-xs cursor-pointer transition-all hover:bg-surface-container-low ${
                      docFile ? 'border-emerald-500 bg-emerald-50/10' : 'border-outline-variant hover:border-amber-500/50'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[28px] ${docFile ? 'text-emerald-500 animate-bounce' : 'text-on-surface-variant/60'}`}>
                      {docFile ? 'check_circle' : 'cloud_upload'}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface text-center">
                      {docFile ? docFile.name : 'Selecionar imagem do documento'}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/70 text-center">
                      PNG, JPG, WEBP ou PDF ate 5MB
                    </span>
                    <input 
                      type="file"
                      ref={docFileInputRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setDocFile(file);
                      }}
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Document review status */}
                {ocrStatus !== 'idle' && (
                  <div className={`p-md rounded-lg border text-body-sm flex flex-col gap-2xs ${
                    ocrStatus === 'loading' 
                      ? 'bg-amber-50/50 border-amber-300 text-amber-900 animate-pulse' 
                      : ocrStatus === 'success' 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                      : 'bg-error-container/20 border-error/30 text-error'
                  }`}>
                    <span className="font-semibold flex items-center gap-2xs">
                      {ocrStatus === 'loading' && (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-amber-800 border-t-transparent"></div>
                      )}
                      {ocrStatus === 'success' && (
                        <span className="material-symbols-outlined text-[16px] text-emerald-600 icon-fill">check_circle</span>
                      )}
                      {ocrStatus === 'error' && (
                        <span className="material-symbols-outlined text-[16px] text-error">error</span>
                      )}
                      Analise de documento:
                    </span>
                    <span className="text-body-xs">{ocrMessage}</span>
                  </div>
                )}

                <div className="flex justify-end mt-2xs">
                  <button
                    type="submit"
                    disabled={verifyingDoc || !docFile}
                    className="bg-secondary-container text-on-secondary-container hover:bg-opacity-95 text-label-md font-label-md px-xl py-md rounded-lg transition-colors font-bold shadow-sm disabled:opacity-50 cursor-pointer flex items-center gap-xs"
                  >
                    {verifyingDoc ? 'Processando...' : 'Enviar para analise'}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>

        {/* Right Column: Profile Photo Upload and Selection */}
        <div className="lg:col-span-1 flex flex-col gap-lg">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col items-center gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm w-full mb-xs">Foto de Perfil</h2>
            
            {/* Circle Avatar */}
            <div className="group relative cursor-pointer w-32 h-32 rounded-full border border-outline-variant overflow-hidden shadow-inner bg-surface-container-high flex items-center justify-center">
              <img 
                alt="Foto de Perfil" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                src={avatarUrl}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-label-sm"
              >
                <span className="material-symbols-outlined text-[24px] mb-2xs">camera_alt</span>
                Alterar Foto
              </div>
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:underline text-label-md font-label-md focus:outline-none cursor-pointer"
            >
              Fazer Upload de Foto
            </button>

            {/* Curated Preset Avatars Grid */}
            <div className="w-full border-t border-surface-variant pt-md mt-xs flex flex-col gap-sm">
              <span className="text-label-sm font-label-sm text-on-surface-variant">Ou escolha um avatar ilustrativo:</span>
              <div className="grid grid-cols-3 gap-sm">
                {PRESET_AVATARS.map((avatar, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatarUrl(avatar.url)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-sm ${
                      avatarUrl === avatar.url ? 'border-primary shadow-inner scale-[1.02]' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    title={avatar.name}
                  >
                    <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}
