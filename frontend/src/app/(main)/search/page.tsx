'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

const CATEGORIES = [
  { name: 'Pedreiro', icon: 'construction' },
  { name: 'Eletricista', icon: 'bolt' },
  { name: 'Encanador', icon: 'plumbing' },
  { name: 'Pintor', icon: 'brush' },
  { name: 'Gesseiro', icon: 'grid_view' },
  { name: 'Carpinteiro', icon: 'handyman' },
  { name: 'Vidraceiro', icon: 'window' },
  { name: 'Serralheiro', icon: 'build' },
];

interface Professional {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  distance: number;
  category: string;
  specialty: string;
  rating: number;
  reviews: number;
  availableNow: boolean;
  description: string;
  img: string;
  whatsapp: string;
  tags: string[];
}

interface ProfessionalRow {
  id: string;
  name: string | null;
  slug: string | null;
  city: string | null;
  state: string | null;
  specialties: string | null;
  availability: boolean | null;
  description: string | null;
  profilePhoto: string | null;
  whatsapp: string | null;
}

export default function SearchPage() {
  const [professionalsList, setProfessionalsList] = useState<Professional[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProfessionals() {
      try {
        const { data, error } = await supabase
          .from('Professional')
          .select('*');

        if (error) {
          console.error('Error fetching professionals:', error.message);
        } else if (data) {
          const mapped = (data as ProfessionalRow[]).map((pro, idx): Professional => {
            let specialtiesArr: string[] = [];
            try {
              if (pro.specialties) {
                specialtiesArr = JSON.parse(pro.specialties);
              }
            } catch (e) {
              if (typeof pro.specialties === 'string') {
                specialtiesArr = pro.specialties.split(',').map((s: string) => s.trim());
              }
            }

            return {
              id: pro.id,
              name: pro.name || 'Sem Nome',
              slug: pro.slug || '',
              city: pro.city || 'Porto Ferreira',
              state: pro.state || 'SP',
              distance: 1.0 + (idx * 0.5),
              category: specialtiesArr[0] || 'Profissional',
              specialty: specialtiesArr.join(', ') || 'Prestador de Serviço',
              rating: 5.0,
              reviews: 0,
              availableNow: pro.availability ?? true,
              description: pro.description || 'Nenhuma descrição detalhada disponível.',
              img: pro.profilePhoto || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?q=80&w=250&auto=format&fit=crop',
              whatsapp: pro.whatsapp || '',
              tags: specialtiesArr
            };
          });
          setProfessionalsList(mapped);
        }
      } catch (err) {
        console.error('Unexpected error loading professionals:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfessionals();
  }, []);

  // Applied filters (the ones that filter the actual list)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [distanceFilter, setDistanceFilter] = useState<number>(30); // 30km radius default
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean>(false);

  // Pending filters (the ones edited in the sidebar UI before applying)
  const [pendingCategories, setPendingCategories] = useState<string[]>([]);
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const [pendingLocation, setPendingLocation] = useState<string>('');
  const [pendingDistance, setPendingDistance] = useState<number>(30);
  const [pendingAvailability, setPendingAvailability] = useState<boolean>(false);

  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);
  
  // key to re-trigger grid mount animation
  const [filterKey, setFilterKey] = useState<number>(0);

  // Apply filters
  const handleApplyFilters = () => {
    setSelectedCategories(pendingCategories);
    setSelectedRating(pendingRating);
    setLocationSearch(pendingLocation);
    setDistanceFilter(pendingDistance);
    setAvailabilityFilter(pendingAvailability);
    setFilterKey(prev => prev + 1);
    setCurrentPage(1);
    setIsMobileFiltersOpen(false);
  };

  // Clear all filters (both pending and applied)
  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedRating(null);
    setLocationSearch('');
    setDistanceFilter(30);
    setAvailabilityFilter(false);

    setPendingCategories([]);
    setPendingRating(null);
    setPendingLocation('');
    setPendingDistance(30);
    setPendingAvailability(false);

    setSortBy('featured');
    setCurrentPage(1);
    setFilterKey(prev => prev + 1);
  };

  // Toggle category select (pending)
  const handleToggleCategory = (categoryName: string) => {
    setPendingCategories(prev => {
      const isAlreadySelected = prev.includes(categoryName);
      return isAlreadySelected 
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName];
    });
  };

  // Immediate chip removals (updates both applied and pending states)
  const handleRemoveCategoryChip = (catName: string) => {
    const nextCategories = selectedCategories.filter(c => c !== catName);
    setSelectedCategories(nextCategories);
    setPendingCategories(nextCategories);
    setFilterKey(prev => prev + 1);
    setCurrentPage(1);
  };

  const handleRemoveRatingChip = () => {
    setSelectedRating(null);
    setPendingRating(null);
    setFilterKey(prev => prev + 1);
    setCurrentPage(1);
  };

  const handleRemoveLocationChip = () => {
    setLocationSearch('');
    setPendingLocation('');
    setFilterKey(prev => prev + 1);
    setCurrentPage(1);
  };

  const handleRemoveAvailabilityChip = () => {
    setAvailabilityFilter(false);
    setPendingAvailability(false);
    setFilterKey(prev => prev + 1);
    setCurrentPage(1);
  };

  // Filter professionals based on APPLIED filters
  const filteredProfessionals = professionalsList.filter((pro: Professional) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(pro.category)) {
      return false;
    }
    if (selectedRating !== null && pro.rating < selectedRating) {
      return false;
    }
    if (availabilityFilter && !pro.availableNow) {
      return false;
    }
    if (locationSearch && !pro.city.toLowerCase().includes(locationSearch.toLowerCase())) {
      return false;
    }
    if (pro.distance > distanceFilter) {
      return false;
    }
    return true;
  });

  // Calculate pending filters count for the buttons/drawer
  const pendingFilteredCount = professionalsList.filter((pro: Professional) => {
    if (pendingCategories.length > 0 && !pendingCategories.includes(pro.category)) {
      return false;
    }
    if (pendingRating !== null && pro.rating < pendingRating) {
      return false;
    }
    if (pendingAvailability && !pro.availableNow) {
      return false;
    }
    if (pendingLocation && !pro.city.toLowerCase().includes(pendingLocation.toLowerCase())) {
      return false;
    }
    if (pro.distance > pendingDistance) {
      return false;
    }
    return true;
  }).length;

  // Sort professionals based on APPLIED list
  const sortedProfessionals = [...filteredProfessionals].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviews - a.reviews;
    if (sortBy === 'distance') return a.distance - b.distance;
    return 0; // default order
  });

  // Dynamic Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedProfessionals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProfessionals = sortedProfessionals.slice(startIndex, startIndex + itemsPerPage);

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    selectedRating !== null || 
    locationSearch !== '' || 
    availabilityFilter;

  const hasPendingFilters =
    pendingCategories.length > 0 ||
    pendingRating !== null ||
    pendingLocation !== '' ||
    pendingAvailability;

  // Count category elements inside the total list
  const getCategoryCount = (categoryName: string) => {
    return professionalsList.filter((pro: Professional) => pro.category === categoryName).length;
  };

  return (
    <div className="flex-1 flex max-w-container-max mx-auto w-full relative">
      {/* Filter Sidebar (Desktop) */}
      <aside className="hidden lg:block w-72 flex-shrink-0 border-r border-outline-variant h-[calc(100vh-80px)] sticky top-20 overflow-y-auto p-lg bg-surface">
        <div className="flex items-center justify-between mb-xl">
          <h2 className="text-headline-md font-headline-md text-on-surface">Filtros</h2>
          {(hasActiveFilters || hasPendingFilters) && (
            <button 
              onClick={handleClearAll}
              className="text-primary font-label-sm text-label-sm hover:underline cursor-pointer"
            >
              Limpar tudo
            </button>
          )}
        </div>
        
        {/* Category Filter */}
        <div className="mb-xl border-b border-surface-container-highest pb-lg">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Categoria</h3>
          <div className="space-y-sm">
            {CATEGORIES.map((cat, idx) => {
              const isChecked = pendingCategories.includes(cat.name);
              return (
                <label key={idx} className="flex items-center gap-sm cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleToggleCategory(cat.name)}
                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 transition-colors cursor-pointer" 
                  />
                  <span className={`text-body-md font-body-md transition-colors ${
                    isChecked ? 'text-primary font-semibold' : 'text-on-surface-variant group-hover:text-on-surface'
                  }`}>
                    {cat.name}
                  </span>
                  <span className="ml-auto text-label-sm font-label-sm text-secondary bg-surface-container-low px-2 py-0.5 rounded-full">
                    {getCategoryCount(cat.name)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Location Filter */}
        <div className="mb-xl border-b border-surface-container-highest pb-lg">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Cidade</h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">location_on</span>
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm pl-xl pr-md text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              placeholder="Digite a cidade (ex: Porto Ferreira)" 
              type="text" 
              value={pendingLocation}
              onChange={(e) => setPendingLocation(e.target.value)}
            />
          </div>
          <div className="mt-md">
            <label className="text-label-sm font-label-sm text-on-surface-variant mb-xs block">Distância Máxima: {pendingDistance}km</label>
            <input 
              className="w-full accent-primary h-1 bg-surface-container-highest rounded-full appearance-none outline-none cursor-pointer" 
              max="50" 
              min="5" 
              step="5"
              type="range" 
              value={pendingDistance}
              onChange={(e) => setPendingDistance(Number(e.target.value))}
            />
            <div className="flex justify-between mt-xs text-label-sm font-label-sm text-secondary">
              <span>5km</span>
              <span>25km</span>
              <span>50km</span>
            </div>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="mb-xl border-b border-surface-container-highest pb-lg">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Avaliação Mínima</h3>
          <div className="flex gap-sm">
            {[3.0, 4.0, 4.5].map(rating => {
              const isSelected = pendingRating === rating;
              return (
                <button 
                  key={rating} 
                  onClick={() => setPendingRating(pendingRating === rating ? null : rating)}
                  className={`flex-1 py-xs rounded-lg text-body-md font-body-md flex items-center justify-center gap-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? 'border-2 border-primary bg-primary-container/20 text-primary font-semibold' 
                      : 'border border-outline-variant hover:border-primary hover:bg-surface-container-low'
                  }`}
                >
                  {rating}+ <span className="material-symbols-outlined text-primary text-[16px] fill">star</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-xl">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Disponibilidade</h3>
          <label className="flex items-center gap-sm cursor-pointer bg-surface-container-low p-md rounded-lg border border-transparent hover:border-outline-variant transition-colors group">
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                checked={pendingAvailability}
                onChange={(e) => setPendingAvailability(e.target.checked)}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline-variant checked:border-primary checked:right-0 transition-all duration-200 ease-in-out" 
              />
              <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${pendingAvailability ? 'bg-primary-container bg-opacity-30' : 'bg-surface-container-highest'}`}></label>
            </div>
            <span className="text-body-md font-body-md text-on-surface group-hover:text-primary transition-colors flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
              Disponível Agora
            </span>
          </label>
        </div>

        {/* Apply Button */}
        <button 
          onClick={handleApplyFilters}
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-opacity-95 transition-all shadow-sm flex items-center justify-center gap-xs cursor-pointer mt-lg"
        >
          <span className="material-symbols-outlined text-[18px]">filter_alt</span>
          Aplicar Filtros
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-md lg:p-lg lg:pl-xl w-full">
        {/* Header & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-xl gap-md">
          <div>
            <h1 className="text-display-lg-mobile md:text-headline-lg font-headline-lg text-on-surface mb-xs">Contratar Profissional</h1>
            <p className="text-body-md font-body-md text-on-surface-variant">
              Encontrados <span className="font-semibold text-on-surface">{sortedProfessionals.length}</span> profissionais em Porto Ferreira e região
            </p>
          </div>
          <div className="flex items-center gap-md">
            {/* Mobile Filter Trigger */}
            <button 
              onClick={() => {
                // Pre-fill pending state with currently active filters when opening mobile modal
                setPendingCategories(selectedCategories);
                setPendingRating(selectedRating);
                setPendingLocation(locationSearch);
                setPendingDistance(distanceFilter);
                setPendingAvailability(availabilityFilter);
                setIsMobileFiltersOpen(true);
              }}
              className="lg:hidden flex items-center gap-xs px-md py-sm border border-outline-variant rounded-lg text-label-md font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span> Filtros
            </button>
            
            {/* Sorting Select */}
            <div className="relative inline-flex items-center">
              <span className="text-body-md font-body-md text-on-surface-variant mr-sm">Ordenar por:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-surface border border-outline-variant rounded-lg py-sm pl-md pr-xl text-body-md font-body-md text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer hover:bg-surface-container-low transition-colors"
              >
                <option value="featured">Destaques</option>
                <option value="rating">Melhor Avaliado</option>
                <option value="reviews">Mais Avaliações</option>
                <option value="distance">Mais Próximo</option>
              </select>
              <span className="material-symbols-outlined absolute right-sm pointer-events-none text-on-surface-variant text-[20px]">expand_more</span>
            </div>
          </div>
        </div>

        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-sm mb-lg">
            {selectedCategories.map(cat => (
              <span key={cat} className="inline-flex items-center gap-xs bg-surface-container-high px-sm py-xs rounded-full text-label-sm font-label-sm text-on-surface">
                {cat} 
                <button onClick={() => handleRemoveCategoryChip(cat)} className="hover:text-error transition-colors flex items-center cursor-pointer">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))}
            {selectedRating !== null && (
              <span className="inline-flex items-center gap-xs bg-surface-container-high px-sm py-xs rounded-full text-label-sm font-label-sm text-on-surface">
                {selectedRating}+ Estrelas
                <button onClick={handleRemoveRatingChip} className="hover:text-error transition-colors flex items-center cursor-pointer">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
            {locationSearch && (
              <span className="inline-flex items-center gap-xs bg-surface-container-high px-sm py-xs rounded-full text-label-sm font-label-sm text-on-surface">
                Cidade: {locationSearch}
                <button onClick={handleRemoveLocationChip} className="hover:text-error transition-colors flex items-center cursor-pointer">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
            {availabilityFilter && (
              <span className="inline-flex items-center gap-xs bg-tertiary-fixed-dim bg-opacity-20 px-sm py-xs rounded-full text-label-sm font-label-sm text-on-tertiary-container">
                Disponível Agora 
                <button onClick={handleRemoveAvailabilityChip} className="hover:text-tertiary transition-colors flex items-center cursor-pointer">
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            )}
            <button onClick={handleClearAll} className="text-label-sm font-label-sm text-primary hover:underline ml-xs cursor-pointer">
              Limpar Tudo
            </button>
          </div>
        )}

        {/* Results Grid - Dynamic fade-in animation triggered by key */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-body-md text-on-surface-variant mt-md animate-pulse">Carregando profissionais parceiros...</p>
          </div>
        ) : paginatedProfessionals.length > 0 ? (
          <>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeInGrid {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fade-in-grid {
                animation: fadeInGrid 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}} />
            
            <div 
              key={filterKey} 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg animate-fade-in-grid"
            >
              {paginatedProfessionals.map((pro) => (
                <div 
                  key={pro.id} 
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_10px_15px_-3px_rgba(17,24,39,0.05)] transition-all duration-300 group flex flex-col h-full"
                >
                  {/* Card Header Info */}
                  <div className="p-md flex items-center gap-md relative pr-8">
                    {/* Selo laranjinha no canto superior direito (apenas o ícone selo) */}
                    <span 
                      className="absolute top-md right-md z-10 material-symbols-outlined text-[#FF9800] text-[22px] fill select-none" 
                      style={{ fontVariationSettings: "'FILL' 1" }} 
                      title="Profissional Verificado"
                    >
                      verified
                    </span>
                    <img 
                      alt={pro.name} 
                      className="w-16 h-16 rounded-lg object-cover border border-outline-variant bg-surface-container-highest shrink-0" 
                      src={pro.img} 
                    />
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/professional/${pro.slug}`} 
                        className="text-headline-md font-headline-md text-on-surface truncate group-hover:text-primary transition-colors text-[18px] block font-bold"
                      >
                        {pro.name}
                      </Link>
                    </div>
                  </div>
                  
                  {/* Description & Rating */}
                  <div className="px-md pb-md flex-1 flex flex-col justify-between">
                    <div>
                      {/* Localidade em uma única linha, sem quebra, começando da esquerda */}
                      <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-xs text-[13px] whitespace-nowrap overflow-hidden text-ellipsis mb-xs">
                        <span className="material-symbols-outlined text-[16px] text-primary">location_on</span> 
                        <span className="truncate">{pro.city}, {pro.state} ({pro.distance}km)</span>
                      </p>
                      
                      {/* Cargo começando na esquerda, acima das estrelas (menor contraste) */}
                      <div className="flex items-center mb-sm">
                        <span className="bg-surface-container-low text-on-surface-variant px-sm py-[2px] rounded-full text-[12px] font-medium flex items-center gap-xs border border-outline-variant">
                          <span className="material-symbols-outlined text-[14px]">work</span> {pro.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-sm bg-surface p-sm rounded-lg border border-surface-container-highest">
                        <div className="flex items-center gap-xs flex-nowrap whitespace-nowrap">
                          <span className="material-symbols-outlined text-primary-container fill text-[18px]">star</span>
                          <span className="font-label-md text-label-md text-on-surface">{pro.rating.toFixed(1)}</span>
                          <span className="text-body-md font-body-md text-on-surface-variant text-[13px] whitespace-nowrap">({pro.reviews} av.)</span>
                        </div>
                        {pro.availableNow ? (
                          <span className="text-label-sm font-label-sm bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded-full flex items-center gap-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span> Disponível
                          </span>
                        ) : (
                          <span className="text-label-sm font-label-sm bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-full flex items-center gap-xs">
                            Agenda lotada
                          </span>
                        )}
                      </div>
                      <p className="text-body-md font-body-md text-on-surface-variant line-clamp-2 text-[14px] mb-sm">
                        {pro.description}
                      </p>
                    </div>

                    {/* Specialty Tags */}
                    {pro.tags && (
                      <div className="flex flex-wrap gap-xs mb-sm">
                        {pro.tags.map((tag) => (
                          <span 
                            key={tag} 
                            className="bg-surface text-on-surface-variant border border-outline-variant px-sm py-[2px] rounded-md text-[11px] font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="p-md border-t border-outline-variant bg-surface-container-lowest mt-auto grid grid-cols-2 gap-sm">
                    <Link 
                      href={`/professional/${pro.slug}`} 
                      className="bg-surface border border-outline-variant text-on-surface font-label-md text-label-md py-sm rounded-lg hover:bg-surface-container-low transition-colors text-center inline-block w-full"
                    >
                      Ver Perfil
                    </Link>
                    <a 
                      href={`https://wa.me/55${pro.whatsapp}?text=Olá%20${pro.name},%20vi%20seu%20perfil%20no%20Parceiro%20de%20Obra%20e%20gostaria%20de%20um%20orçamento.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary text-on-primary font-label-md text-label-md py-sm rounded-lg hover:bg-opacity-95 transition-all text-center shadow-sm flex items-center justify-center gap-xs"
                    >
                      Contratar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-md">search_off</span>
            <h3 className="text-headline-md font-headline-md text-on-surface mb-xs">Nenhum profissional encontrado</h3>
            <p className="text-body-md text-on-surface-variant max-w-[384px] mx-auto mb-lg">
              Tente alterar os seus filtros de categorias ou pesquisar por outra cidade na barra lateral.
            </p>
            <button 
              onClick={handleClearAll}
              className="bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg hover:bg-primary/95 transition-colors"
            >
              Resetar Filtros
            </button>
          </div>
        )}

        {/* Dynamic Pagination Bar - ONLY shows active pages depending on total results */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-sm mt-xxl mb-xl">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                  currentPage === page
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'border border-outline-variant text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </main>

      {/* Mobile Drawer Backdrop */}
      {isMobileFiltersOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 lg:hidden"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}

      {/* Mobile Drawer (Filters list) */}
      <div className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-surface p-lg shadow-xl overflow-y-auto transform transition-transform duration-300 ease-in-out lg:hidden ${
        isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-xl">
          <h2 className="text-headline-md font-headline-md text-on-surface">Filtros</h2>
          <button 
            onClick={() => setIsMobileFiltersOpen(false)}
            className="text-on-surface-variant hover:text-on-surface p-sm bg-surface-container-low rounded-full"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Mobile Clear All */}
        {(hasActiveFilters || hasPendingFilters) && (
          <button 
            onClick={() => {
              handleClearAll();
              setIsMobileFiltersOpen(false);
            }}
            className="w-full bg-surface-container-low text-primary text-center font-label-md text-label-md py-sm rounded-lg mb-lg hover:bg-surface-container transition-colors"
          >
            Limpar todos os filtros
          </button>
        )}

        {/* Mobile Category Filter */}
        <div className="mb-xl border-b border-surface-container-highest pb-lg">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Categoria</h3>
          <div className="space-y-sm">
            {CATEGORIES.map((cat, idx) => {
              const isChecked = pendingCategories.includes(cat.name);
              return (
                <label key={idx} className="flex items-center gap-sm cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={isChecked}
                    onChange={() => handleToggleCategory(cat.name)}
                    className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 transition-colors" 
                  />
                  <span className={`text-body-md font-body-md transition-colors ${
                    isChecked ? 'text-primary font-semibold' : 'text-on-surface-variant'
                  }`}>
                    {cat.name}
                  </span>
                  <span className="ml-auto text-label-sm font-label-sm text-secondary bg-surface-container-low px-2 py-0.5 rounded-full">
                    {getCategoryCount(cat.name)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Mobile Location Filter */}
        <div className="mb-xl border-b border-surface-container-highest pb-lg">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Cidade</h3>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">location_on</span>
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg py-sm pl-xl pr-md text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
              placeholder="Digite a cidade" 
              type="text" 
              value={pendingLocation}
              onChange={(e) => setPendingLocation(e.target.value)}
            />
          </div>
          <div className="mt-md">
            <label className="text-label-sm font-label-sm text-on-surface-variant mb-xs block">Distância: {pendingDistance}km</label>
            <input 
              className="w-full accent-primary h-1 bg-surface-container-highest rounded-full appearance-none outline-none" 
              max="50" 
              min="5" 
              step="5"
              type="range" 
              value={pendingDistance}
              onChange={(e) => setPendingDistance(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Mobile Rating Filter */}
        <div className="mb-xl border-b border-surface-container-highest pb-lg">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Avaliação Mínima</h3>
          <div className="flex gap-sm">
            {[3.0, 4.0, 4.5].map(rating => {
              const isSelected = pendingRating === rating;
              return (
                <button 
                  key={rating} 
                  onClick={() => setPendingRating(pendingRating === rating ? null : rating)}
                  className={`flex-1 py-xs rounded-lg text-body-md font-body-md flex items-center justify-center gap-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? 'border-2 border-primary bg-primary-container/20 text-primary font-semibold' 
                      : 'border border-outline-variant hover:border-primary hover:bg-surface-container-low'
                  }`}
                >
                  {rating}+ <span className="material-symbols-outlined text-primary text-[16px] fill">star</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Availability */}
        <div className="mb-xl">
          <h3 className="text-label-md font-label-md text-on-surface mb-md">Disponibilidade</h3>
          <label className="flex items-center gap-sm cursor-pointer bg-surface-container-low p-md rounded-lg border border-transparent hover:border-outline-variant transition-colors group">
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                checked={pendingAvailability}
                onChange={(e) => setPendingAvailability(e.target.checked)}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline-variant checked:border-primary checked:right-0" 
              />
              <label className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${pendingAvailability ? 'bg-primary-container bg-opacity-30' : 'bg-surface-container-highest'}`}></label>
            </div>
            <span className="text-body-md font-body-md text-on-surface flex items-center gap-xs">
              Disponível Agora
            </span>
          </label>
        </div>

        <button 
          onClick={handleApplyFilters}
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg hover:bg-opacity-95 transition-colors shadow-sm mt-lg cursor-pointer"
        >
          Ver {pendingFilteredCount} resultados
        </button>
      </div>
    </div>
  );
}
