'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

interface PortfolioPhoto {
  id: string;
  url: string;
  caption: string;
}

export default function ProfileEditPage() {
  // Mock Data Initialization (Carlos Silva)
  const [name, setName] = useState('Carlos Silva');
  const [category, setCategory] = useState('Eletricista');
  const [specialty, setSpecialty] = useState('Eletricista Master');
  const [city, setCity] = useState('Porto Ferreira');
  const [state, setState] = useState('SP');
  const [whatsapp, setWhatsapp] = useState('(19) 99243-5847');
  const [description, setDescription] = useState(
    'Especialista em instalações elétricas residenciais, manutenção preventiva, iluminação de LED e automação. Mais de 10 anos de experiência.'
  );
  const [isAvailable, setIsAvailable] = useState(true);
  const [tags, setTags] = useState<string[]>(['Fiação', 'Iluminação', 'Disjuntores']);
  const [profilePhoto, setProfilePhoto] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD3RECfNTRsA_JnVgEyzjL-YYn-Igb7zHsoeozQqKUY247yKALuYqGvxtJ-i_zW8s5k4Gw7tI0tJPGKz6hB5X280t7pG9q1EX-MGtW4LxLRwgBogbkUvE_0kawwkae-4VDfu5Hr_WxwCvQV0kQVs7ZPhBJK1JMwQrF50985rm9pop8qoHRJT2QkEri-RC5S7HyOZ45zlXow3GhJlCTm1BOO5F_O6xJH-1eYDNHkMmKgum-cMg52H1L9JinYiVZpsLF-6bIelUAIuvyL'
  );
  const [portfolioPhotos, setPortfolioPhotos] = useState<PortfolioPhoto[]>([
    {
      id: '1',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBR_Cof2dQzavwqsBjA70GCraw3sIIuSMEkwCl6xvEJpFFvQs8poMc-G40OJVoVwMPSynAdgRYJ3fBfKmpSu5bFgxZjLpFOZ2pBr70WkPobxHHaMTIiUEg2-ou2hUFajsVc3NtIn9ak-JNf8flM3qwWI71afKdDOg7SarhekC8y1MsTAplmD9EE09mO-GHf00odAarkOaDXylI-8rFJmSUyiY4I0BTfJVhv2Ox4S7TKZ92dt_T4O2PcVLH6KEXJCvyyB8coUvdwP-W_',
      caption: 'Instalação de Painel de LED',
    },
    {
      id: '2',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_BMfM17vhRWQVqqH0Ou3SJczKAk8E_TMyhFxLn4a_SsFaoWwd6YMhs4sjx1ix7Ez8GYAWzWmHQ5NDKtn5bnnqkdDTzX2cthbxuoBk_j3qgIsgLEvQ9czsCp2Ymvnq_MBUPUdnQ9LFM9dZ1j5NpHM1h3c5leuzWGliDp_AlRtCzaf2mFvMuQa0Rx1_yu-8eQXefQw3SGYWOek_qB6-Ti9LsB7vV9LX0PfQNNkgx8lZK7qNfEz-aFAgMItAS9dim4gqbspjLMsruiH9',
      caption: 'Fiação Nova Residencial',
    },
  ]);

  // UI States
  const [tagInput, setTagInput] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Refs for local file uploads
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(URL.createObjectURL(file));
    }
  };

  const handleAddPortfolioPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newPhoto: PortfolioPhoto = {
        id: Date.now().toString(),
        url: URL.createObjectURL(file),
        caption: newCaption.trim() || 'Nova Foto do Portfólio',
      };
      setPortfolioPhotos([...portfolioPhotos, newPhoto]);
      setNewCaption('');
    }
  };

  const handleRemovePortfolioPhoto = (id: string) => {
    setPortfolioPhotos(portfolioPhotos.filter((p) => p.id !== id));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = tagInput.trim();
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleAddTagClick = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col gap-xl">
      {/* Toast Notification with Portal to render outside stacking contexts */}
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
              Alterações Salvas!
            </h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Seu perfil profissional foi atualizado com sucesso e as alterações já estão visíveis para os clientes.
            </p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="absolute top-3 right-3 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container-low p-1 flex items-center justify-center cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
          
          {/* Progress Bar showing remaining time */}
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
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
        <div>
          <h1 className="text-headline-lg font-headline-lg text-on-surface">Editar Meu Perfil</h1>
          <p className="text-body-md font-body-md text-on-surface-variant mt-xs">Atualize suas informações profissionais, localização, especialidades e fotos do portfólio.</p>
        </div>
        <div className="flex items-center gap-md">
          <Link href="/admin" className="text-on-surface-variant hover:text-on-surface text-label-md font-label-md px-md py-sm rounded-lg border border-outline hover:bg-surface-container-low transition-colors">
            Voltar ao Painel
          </Link>
          <button 
            type="button"
            onClick={() => setShowPreview(true)}
            className="bg-primary text-on-primary text-label-md font-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-xs focus:outline-none"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Visualizar Perfil
          </button>
        </div>
      </header>

      {/* Main Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          {/* Card 1: Informações Básicas */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm mb-xs">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="prof-name">Nome Completo</label>
                <input 
                  type="text"
                  id="prof-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="prof-category">Categoria Principal</label>
                <select 
                  id="prof-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                >
                  <option value="Eletricista">Eletricista</option>
                  <option value="Pedreiro">Pedreiro</option>
                  <option value="Pintor">Pintor</option>
                  <option value="Gesseiro">Gesseiro</option>
                  <option value="Encanador">Encanador</option>
                  <option value="Carpinteiro">Carpinteiro</option>
                  <option value="Azulejista">Azulejista</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="prof-specialty">Cargo ou Especialidade Curta</label>
              <input 
                type="text"
                id="prof-specialty"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                placeholder="Ex: Eletricista Master, Pintor Residencial Alto Padrão"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                required
              />
            </div>
          </section>

          {/* Card 2: Localização e Contato */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm mb-xs">Localização & Contato</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
              <div className="sm:col-span-2 flex flex-col gap-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="prof-city">Cidade</label>
                <input 
                  type="text"
                  id="prof-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                  required
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="prof-state">Estado</label>
                <select 
                  id="prof-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                >
                  <option value="SP">SP</option>
                  <option value="MG">MG</option>
                  <option value="RJ">RJ</option>
                  <option value="PR">PR</option>
                  <option value="SC">SC</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md items-end">
              <div className="flex flex-col gap-xs">
                <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="prof-whatsapp">WhatsApp (com DDD)</label>
                <input 
                  type="text"
                  id="prof-whatsapp"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Ex: (19) 99243-5847"
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                  required
                />
              </div>
              
              {/* Availability Switch */}
              <div className="flex items-center justify-between border border-outline-variant bg-surface-container-low rounded-xl px-md py-sm">
                <span className="text-label-md font-label-md text-on-surface mr-sm">Disponibilidade Imediata:</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isAvailable}
                    onChange={(e) => setIsAvailable(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
                  <span className="ml-2 text-label-sm font-label-sm text-on-surface-variant w-[80px] text-right">{isAvailable ? 'Disponível' : 'Ocupado'}</span>
                </label>
              </div>
            </div>
          </section>

          {/* Card 3: Biografia e Tags de Especialidades */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm mb-xs">Sobre Mim & Especialidades</h2>
            
            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant" htmlFor="prof-desc">Biografia Profissional</label>
              <textarea 
                id="prof-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all resize-none"
                placeholder="Escreva sobre suas qualificações, serviços prestados, tempo de experiência..."
                required
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="text-label-sm font-label-sm text-on-surface-variant">Tags de Especialidades (Aperte Enter para adicionar)</label>
              <div className="flex gap-sm mb-sm">
                <input 
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Ex: Drywall, Pintura Epóxi, Lustres"
                  className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg px-md py-[10px] font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container/30 focus:border-primary-container transition-all"
                />
                <button 
                  type="button" 
                  onClick={handleAddTagClick}
                  className="bg-secondary-container text-on-secondary-container hover:bg-opacity-95 text-label-md font-label-md px-lg py-[10px] rounded-lg transition-colors focus:outline-none"
                >
                  Adicionar
                </button>
              </div>
              
              {/* Tags Display */}
              <div className="flex flex-wrap gap-sm mt-xs">
                {tags.length === 0 ? (
                  <p className="text-body-sm font-body-sm text-on-surface-variant/60 italic">Nenhuma tag cadastrada ainda.</p>
                ) : (
                  tags.map((tag) => (
                    <span 
                      key={tag}
                      className="bg-surface-container-high border border-outline-variant text-on-surface font-label-sm text-label-sm px-md py-xs rounded-full flex items-center gap-xs"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-on-surface-variant hover:text-error transition-colors flex items-center justify-center rounded-full p-2xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex gap-md justify-end mt-sm">
            <Link 
              href="/admin" 
              className="text-on-surface-variant hover:text-on-surface text-label-md font-label-md px-xl py-md rounded-lg border border-outline hover:bg-surface-container-low transition-colors focus:outline-none"
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={isSaving}
              className="bg-primary text-on-primary text-label-md font-label-md px-xl py-md rounded-lg hover:opacity-90 transition-opacity focus:outline-none disabled:opacity-50 flex items-center justify-center gap-sm shadow-md"
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
        </div>

        {/* Right Column: Profile Photo & Portfolio Gallery */}
        <div className="lg:col-span-1 flex flex-col gap-lg">
          {/* Card 4: Foto de Perfil */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col items-center gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm w-full mb-xs">Foto de Perfil</h2>
            
            <div className="group relative cursor-pointer w-32 h-32 rounded-full border border-outline-variant overflow-hidden shadow-inner">
              <img 
                alt="Foto do Carlos Silva" 
                className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                src={profilePhoto}
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-label-sm"
              >
                <span className="material-symbols-outlined text-[24px] mb-2xs">camera_alt</span>
                Alterar
              </div>
            </div>
            
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleProfilePhotoChange}
              accept="image/*"
              className="hidden"
            />
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="text-primary hover:underline text-label-md font-label-md focus:outline-none"
            >
              Escolher outra imagem
            </button>
          </section>

          {/* Card 5: Galeria do Portfólio */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm flex flex-col gap-md">
            <h2 className="text-headline-md font-headline-md text-on-surface border-b border-surface-variant pb-sm mb-xs">Galeria do Portfólio</h2>
            
            {/* Portfolio Grid */}
            <div className="grid grid-cols-2 gap-sm">
              {portfolioPhotos.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-lg bg-surface-container-low overflow-hidden group relative border border-surface-variant">
                  <img 
                    alt={photo.caption} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    src={photo.url}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-xs text-center gap-xs">
                    <span className="text-[10px] font-label-sm text-white line-clamp-2 px-2xs">{photo.caption}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemovePortfolioPhoto(photo.id)}
                      className="text-error bg-surface-container-lowest rounded-full p-xs hover:bg-error-container hover:text-on-error-container transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Dynamic Add Photo Area */}
              <div 
                onClick={() => galleryInputRef.current?.click()}
                className="aspect-square rounded-lg bg-surface-container-low border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:border-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[28px] mb-2xs">add_photo_alternate</span>
                <span className="text-label-sm font-label-sm text-center px-xs">Subir Foto</span>
              </div>
            </div>

            <input 
              type="file"
              ref={galleryInputRef}
              onChange={handleAddPortfolioPhoto}
              accept="image/*"
              className="hidden"
            />

            {/* Optional Caption Field for the next photo upload */}
            <div className="flex flex-col gap-xs mt-xs bg-surface-container-low border border-surface-variant p-sm rounded-xl">
              <label className="text-[11px] font-label-sm text-on-surface-variant" htmlFor="photo-caption">Legenda da próxima foto</label>
              <input 
                type="text"
                id="photo-caption"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                placeholder="Ex: Reforma do quadro elétrico"
                className="bg-surface-container-lowest border border-outline-variant rounded-md px-sm py-[6px] text-body-sm font-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary-container focus:border-primary-container transition-all"
              />
              <p className="text-[10px] font-body-sm text-on-surface-variant/70 italic mt-2xs">Preencha a legenda antes de clicar em &quot;Subir Foto&quot; para aplicar.</p>
            </div>
          </section>
        </div>
      </form>

      {/* Client-View Profile Live Preview Modal Overlay */}
      {mounted && showPreview && createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-md bg-black/60 backdrop-blur-md animate-fade-in">
          {/* Modal Card */}
          <div className="w-full max-w-5xl h-[90vh] bg-surface rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/30 flex flex-col relative animate-fade-in">
            
            {/* Top Bar Banner for Live Preview */}
            <div className="bg-primary-container text-on-primary-container px-lg py-sm flex items-center justify-between font-semibold text-sm select-none border-b border-primary/20">
              <span className="flex items-center gap-xs text-[15px]">
                <span className="material-symbols-outlined text-primary text-[20px] animate-pulse">visibility</span>
                Modo de Visualização do Cliente (Pré-visualização ao vivo)
              </span>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-on-primary-container hover:text-primary transition-colors flex items-center justify-center p-xs hover:bg-primary-container-highest rounded-full cursor-pointer"
                type="button"
                title="Fechar Visualização"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            {/* Scrollable Preview Area */}
            <div className="flex-1 overflow-y-auto p-lg bg-surface">
              <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-lg pb-md">
                
                {/* Left Column: Cover, Avatar, Name, Specialty, About, Tags, Gallery */}
                <div className="lg:col-span-8 flex flex-col gap-lg">
                  
                  {/* Profile Header */}
                  <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden flex flex-col shadow-sm">
                    <div 
                      className="h-40 w-full bg-surface-container-highest relative bg-cover bg-center" 
                      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop')` }}
                    />
                    <div className="px-lg pb-lg relative pt-12">
                      <img 
                        alt={name} 
                        className="absolute -top-16 left-lg w-28 h-28 rounded-2xl border-4 border-surface object-cover shadow-md bg-surface-container-highest" 
                        src={profilePhoto}
                      />
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-md mt-xs">
                        <div>
                          <div className="flex items-center gap-xs">
                            <h1 className="text-headline-md font-bold text-on-surface">{name || 'Carlos Silva'}</h1>
                            <span 
                              className="material-symbols-outlined text-[#FF9800] text-[22px] select-none" 
                              style={{ fontVariationSettings: "'FILL' 1" }} 
                              title="Profissional Verificado"
                            >
                              verified
                            </span>
                          </div>
                          <p className="text-body-md text-on-surface-variant font-medium mt-1">{specialty || 'Eletricista Master'}</p>
                          <div className="flex flex-wrap items-center gap-md mt-sm text-on-surface-variant font-label-sm text-[13px]">
                            <span className="flex items-center gap-2xs">
                              <span className="material-symbols-outlined text-[16px]">location_on</span>
                              {city || 'Porto Ferreira'}, {state || 'SP'}
                            </span>
                            <span className="flex items-center gap-2xs text-primary font-semibold">
                              <span className="material-symbols-outlined text-[16px] icon-fill">star</span>
                              4.9 (128 av.)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* About Section */}
                  <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
                    <h2 className="text-label-lg font-bold text-on-surface mb-sm">Sobre</h2>
                    <p className="text-body-sm text-on-surface-variant leading-relaxed mb-md">
                      {description || 'Escreva algo sobre você na biografia...'} Com foco em qualidade de atendimento na região de {city || 'Porto Ferreira'} e arredores, trabalho prezando pela segurança, limpeza do canteiro e cumprimento rigoroso de prazos acordados.
                    </p>
                    
                    <h3 className="text-[11px] font-bold text-on-surface mb-xs uppercase tracking-wider">Certificações & Especialidades</h3>
                    <div className="flex flex-wrap gap-xs">
                      <span className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-sm py-xs rounded-lg font-label-sm text-[12px] flex items-center gap-2xs">
                        <span className="material-symbols-outlined text-[16px]">workspace_premium</span> Profissional Especialista
                      </span>
                      <span className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-sm py-xs rounded-lg font-label-sm text-[12px] flex items-center gap-2xs">
                        <span className="material-symbols-outlined text-[16px]">verified_user</span> Garantia do Serviço
                      </span>
                      <span className="bg-surface-container-low border border-outline-variant text-on-surface-variant px-sm py-xs rounded-lg font-label-sm text-[12px] flex items-center gap-2xs">
                        <span className="material-symbols-outlined text-[16px]">construction</span> {category || 'Eletricista'}
                      </span>
                      {tags.map(tag => (
                        <span key={tag} className="bg-orange-50 border border-orange-200 text-orange-700 px-sm py-xs rounded-lg font-label-sm text-[12px] flex items-center gap-2xs">
                          <span className="material-symbols-outlined text-[16px]">sell</span> {tag}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Portfolio Gallery */}
                  <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
                    <h2 className="text-label-lg font-bold text-on-surface mb-sm flex items-center gap-2xs">
                      <span className="material-symbols-outlined">photo_library</span> Portfólio
                    </h2>
                    {portfolioPhotos.length === 0 ? (
                      <p className="text-body-sm text-on-surface-variant/60 italic">Nenhuma foto adicionada ao portfólio.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
                        {portfolioPhotos.map(photo => (
                          <div key={photo.id} className="aspect-square bg-surface-container-low rounded-lg overflow-hidden relative group border border-outline-variant/25">
                            <img 
                              alt={photo.caption} 
                              className="w-full h-full object-cover" 
                              src={photo.url}
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-xs font-label-sm truncate">
                              {photo.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>

                {/* Right Column: Sticky Contact Card */}
                <div className="lg:col-span-4 flex flex-col gap-md">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
                    <div className="mb-md">
                      <h3 className="text-label-lg font-bold text-on-surface mb-xs">Contratar {name ? name.split(' ')[0] : 'Carlos'}</h3>
                      <p className="text-body-xs text-on-surface-variant">Costuma responder em menos de 2 horas</p>
                    </div>
                    
                    <div className="flex flex-col gap-xs mb-md">
                      <div className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg">
                        <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-2xs">
                          <span className="material-symbols-outlined text-[16px]">event_available</span> Disponibilidade
                        </span>
                        <span className={`text-[12px] font-bold ${isAvailable ? 'text-tertiary' : 'text-on-surface-variant'}`}>
                          {isAvailable ? 'Disponível Hoje' : 'Sob Consulta'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg">
                        <span className="text-[12px] font-semibold text-on-surface-variant flex items-center gap-2xs">
                          <span className="material-symbols-outlined text-[16px]">payments</span> Orçamento
                        </span>
                        <span className="text-[12px] font-bold text-on-surface">Estimativa Grátis</span>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      className="w-full bg-primary text-on-primary font-label-sm text-label-sm py-md rounded-lg flex justify-center items-center gap-xs hover:opacity-90 transition-opacity mb-xs text-center shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                      Contatar via WhatsApp
                    </button>
                    <button 
                      type="button"
                      className="w-full bg-surface text-on-surface border border-outline-variant font-label-sm text-label-sm py-md rounded-lg flex justify-center items-center gap-xs hover:bg-surface-container-low transition-colors text-center cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                      Enviar Mensagem
                    </button>
                  </div>

                  {/* Trust Badge */}
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-md flex flex-col gap-xs shadow-sm">
                    <div className="flex items-start gap-xs">
                      <span className="material-symbols-outlined text-primary text-[20px] shrink-0">shield</span>
                      <div>
                        <h4 className="text-[12px] font-bold text-on-surface">Garantia Parceiro de Obra</h4>
                        <p className="text-[10px] text-on-surface-variant leading-normal mt-xs">
                          Serviços fechados pela plataforma contam com suporte e mediação garantidos de ponta a ponta.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
