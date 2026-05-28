'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
}

interface StoredRequest {
  clientName?: string;
}

const defaultServices: Service[] = [
  { 
    id: '1', 
    name: 'Instalação de Chuveiro Elétrico', 
    price: 'R$ 80,00',
    description: 'Instalação rápida de chuveiros elétricos residenciais, incluindo testes de vazamento e resistência elétrica.' 
  },
  { 
    id: '2', 
    name: 'Troca de Disjuntor Geral', 
    price: 'R$ 150,00',
    description: 'Substituição completa do disjuntor principal no padrão da distribuidora, garantindo segurança contra sobrecarga.' 
  },
  { 
    id: '3', 
    name: 'Instalação de Luminárias LED', 
    price: 'R$ 120,00',
    description: 'Fixação e ligação de spots, painéis e fitas de LED em sancas de gesso ou teto comum.' 
  },
  { 
    id: '4', 
    name: 'Manutenção Preventiva Residencial', 
    price: 'R$ 200,00',
    description: 'Revisão geral do quadro de força, verificação de aquecimento nos cabos e reaperto de conexões.' 
  },
  { 
    id: '5', 
    name: 'Instalação de Ar Condicionado', 
    price: 'R$ 350,00',
    description: 'Instalação elétrica dedicada para equipamentos de ar condicionado do tipo split ou janela.' 
  },
  { 
    id: '6', 
    name: 'Projeto Elétrico Comercial', 
    price: 'R$ 1.500,00',
    description: 'Dimensionamento de cargas e layout elétrico completo para salas comerciais e lojas.' 
  },
  { 
    id: '7', 
    name: 'Cabeamento de Rede Estruturado', 
    price: 'R$ 450,00',
    description: 'Passagem de cabo de rede Cat6, crimpagem de conectores RJ45 e instalação de tomadas de rede.' 
  },
  { 
    id: '8', 
    name: 'Instalação de Tomadas e Interruptores', 
    price: 'R$ 90,00',
    description: 'Troca e alinhamento de tomadas residenciais seguindo o novo padrão brasileiro.' 
  },
];

export default function AdminDashboardPage() {
  const pathname = usePathname();
  const panelBase = pathname.startsWith('/dashboard') ? '/dashboard' : '/admin';

  interface PendingClient {
    id: string;
    name: string;
    location: string;
    avatar: string;
  }

  const defaultClients: PendingClient[] = [
    { id: '1', name: 'Roberto Albuquerque', location: 'Campinas, SP', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop' },
    { id: '2', name: 'Fabiana Mendes', location: 'Valinhos, SP', avatar: 'FM' },
    { id: '3', name: 'Luiz Gustavo Bastos', location: 'Porto Ferreira, SP', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop' },
  ];

  const [services, setServices] = useState<Service[]>(defaultServices);
  const [pendingClients, setPendingClients] = useState<PendingClient[]>(defaultClients);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const ratingsCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedServices = localStorage.getItem('obra_certa_services');
    if (storedServices) {
      try {
        setServices(JSON.parse(storedServices));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('obra_certa_services', JSON.stringify(defaultServices));
    }

    const storedClients = localStorage.getItem('obra_certa_pending_clients');
    if (storedClients) {
      try {
        setPendingClients(JSON.parse(storedClients));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('obra_certa_pending_clients', JSON.stringify(defaultClients));
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (ratingsCardRef.current) {
      const rect = ratingsCardRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15,
      });
    }
  };

  const handleOpenAddForm = () => {
    setFormData({ name: '', price: '', description: '' });
    setEditingServiceId(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (service: Service) => {
    setFormData({ name: service.name, price: service.price, description: service.description });
    setEditingServiceId(service.id);
    setIsFormOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price.trim() || !formData.description.trim()) return;

    let updated: Service[];
    if (editingServiceId) {
      updated = services.map(s => s.id === editingServiceId ? { 
        ...s, 
        name: formData.name, 
        price: formData.price, 
        description: formData.description 
      } : s);
    } else {
      const newService: Service = {
        id: Date.now().toString(),
        name: formData.name,
        price: formData.price.startsWith('R$') ? formData.price : `R$ ${formData.price}`,
        description: formData.description,
      };
      updated = [...services, newService];
    }
    setServices(updated);
    localStorage.setItem('obra_certa_services', JSON.stringify(updated));
    setIsFormOpen(false);
    setEditingServiceId(null);
    setFormData({ name: '', price: '', description: '' });
  };

  const handleDeleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem('obra_certa_services', JSON.stringify(updated));
  };

  const handleApproveClient = (clientName: string) => {
    const updatedClients = pendingClients.filter(c => c.name !== clientName);
    setPendingClients(updatedClients);
    localStorage.setItem('obra_certa_pending_clients', JSON.stringify(updatedClients));

    const storedRequests = localStorage.getItem('obra_certa_requests');
    if (storedRequests) {
      try {
        const requestsList = JSON.parse(storedRequests);
        const updatedRequests = (requestsList as StoredRequest[]).filter((req) => req.clientName !== clientName);
        localStorage.setItem('obra_certa_requests', JSON.stringify(updatedRequests));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialRequests = [
        {
          id: '1',
          title: 'Reforma de Instalação Elétrica Comercial',
          clientName: 'Roberto Albuquerque',
          location: 'Campinas, SP',
          date: '21/05/2026',
          price: 'R$ 2.400,00',
          description: 'Preciso refazer toda a fiação elétrica de uma pequena loja comercial de 45m². O padrão de disjuntores atual é antigo e precisa de modernização completa para suportar novos aparelhos de ar condicionado.',
          status: 'Pendente'
        },
        {
          id: '2',
          title: 'Instalação de Lustre de Cristal de Alto Padrão',
          clientName: 'Fabiana Mendes',
          location: 'Valinhos, SP',
          date: '20/05/2026',
          price: 'R$ 250,00',
          description: 'Instalação de lustre de cristal pesado com pé direito duplo (aproximadamente 4.5 metros). Já possuo os andaimes e o material de fixação necessários no local.',
          status: 'Pendente'
        },
        {
          id: '3',
          title: 'Troca de Fiação para Chuveiro 220v',
          clientName: 'Luiz Gustavo Bastos',
          location: 'Porto Ferreira, SP',
          date: '19/05/2026',
          price: 'R$ 150,00',
          description: 'O chuveiro atual está queimando a fiação que é fina (4mm). Preciso passar cabos novos de 6mm e instalar um disjuntor adequado de 32A diretamente do quadro.',
          status: 'Em Andamento'
        },
        {
          id: '4',
          title: 'Laudo Técnico de Instalações Elétricas (Art)',
          clientName: 'Condomínio Residencial Bella Vista',
          location: 'São Carlos, SP',
          date: '18/05/2026',
          price: 'R$ 800,00',
          description: 'Inspeção e emissão de laudo técnico de conformidade para a área comum do condomínio (bombas de piscina, portões automáticos e iluminação de emergência).',
          status: 'Em Andamento'
        },
        {
          id: '5',
          title: 'Instalação de 15 Spots de LED e Fita de LED em Sanca',
          clientName: 'Juliana Paes',
          location: 'Porto Ferreira, SP',
          date: '14/05/2026',
          price: 'R$ 400,00',
          description: 'Marcação, corte e instalação de 15 spots direcionáveis em teto de gesso rebaixado, mais ligação de 10 metros de fita de LED RGB com controle remoto.',
          status: 'Concluido'
        }
      ];
      const updatedRequests = initialRequests.filter(req => req.clientName !== clientName);
      localStorage.setItem('obra_certa_requests', JSON.stringify(updatedRequests));
    }
  };

  return (
    <div className="p-md md:p-lg lg:p-xl max-w-container-max mx-auto w-full space-y-xl">
      {/* Grid de 4 Caixas de Métricas Destacadas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Box 1: Serviços Catalogados (Dinâmico) */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant hover:shadow-[0px_10px_15px_-3px_rgba(17,24,39,0.05)] transition-all duration-200 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between mb-sm">
            <div className="p-2 bg-surface-container-low rounded-lg text-primary">
              <span className="material-symbols-outlined text-[24px]">construction</span>
            </div>
            <span className="bg-tertiary-container/20 text-tertiary text-xs px-2 py-1 rounded-full font-label-sm flex items-center gap-1">
              Ativo
            </span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Serviços Catalogados</p>
            <h3 className="text-headline-lg font-headline-lg text-on-surface font-bold">{services.length}</h3>
          </div>
        </div>

        {/* Box 2: Média de Avaliações com Tooltip Flutuante */}
        <div 
          ref={ratingsCardRef}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onMouseMove={handleMouseMove}
          className="relative overflow-visible bg-surface-container-lowest rounded-xl p-md border border-outline-variant hover:shadow-[0px_10px_15px_-3px_rgba(17,24,39,0.05)] transition-all duration-200 flex flex-col justify-between min-h-[140px] cursor-pointer"
        >
          <div className="flex items-start justify-between mb-sm">
            <div className="p-2 bg-surface-container-low rounded-lg text-secondary">
              <span className="material-symbols-outlined text-[24px]">star</span>
            </div>
            <span className="bg-tertiary-container/20 text-tertiary text-xs px-2 py-1 rounded-full font-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">star_rate</span>
              4.9
            </span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Média de Avaliações</p>
            <h3 className="text-headline-lg font-headline-lg text-on-surface font-bold">4.9 <span className="text-label-sm font-normal text-on-surface-variant">/ 5.0</span></h3>
          </div>

          {/* Floating Tooltip following Mouse */}
          {showTooltip && (
            <div 
              style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
              className="absolute pointer-events-none bg-inverse-surface text-surface-container-lowest text-body-sm rounded-xl p-md shadow-2xl z-50 w-72 border border-outline-variant/30 animate-fade-in"
            >
              <p className="font-semibold mb-sm text-label-md border-b border-surface-variant pb-xs flex items-center gap-xs text-primary-fixed">
                <span className="material-symbols-outlined text-[16px]">reviews</span>
                Últimas Avaliações
              </p>
              <div className="space-y-sm text-left">
                <div className="border-b border-surface-variant/40 pb-xs last:border-0 last:pb-0">
                  <div className="flex justify-between text-xs text-primary-container font-semibold">
                    <span>Sarah Jenkins</span>
                    <span className="text-primary-fixed-dim">5.0 ★</span>
                  </div>
                  <p className="text-[11px] leading-tight text-surface-variant mt-2xs">&quot;Excelente trabalho de gesso e pintura, muito profissional.&quot;</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-primary-container font-semibold">
                    <span>Miguel R.</span>
                    <span className="text-primary-fixed-dim">4.5 ★</span>
                  </div>
                  <p className="text-[11px] leading-tight text-surface-variant mt-2xs">&quot;Rápido no atendimento e serviço de alta qualidade.&quot;</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Box 3: Trabalhos Aceitos */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant hover:shadow-[0px_10px_15px_-3px_rgba(17,24,39,0.05)] transition-all duration-200 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between mb-sm">
            <div className="p-2 bg-surface-container-low rounded-lg text-primary">
              <span className="material-symbols-outlined text-[24px]">handshake</span>
            </div>
            <span className="bg-tertiary-container/20 text-tertiary text-xs px-2 py-1 rounded-full font-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              +8
            </span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Trabalhos Aceitos</p>
            <h3 className="text-headline-lg font-headline-lg text-on-surface font-bold">32</h3>
          </div>
        </div>

        {/* Box 4: Visualizações do Perfil */}
        <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant hover:shadow-[0px_10px_15px_-3px_rgba(17,24,39,0.05)] transition-all duration-200 flex flex-col justify-between min-h-[140px]">
          <div className="flex items-start justify-between mb-sm">
            <div className="p-2 bg-surface-container-low rounded-lg text-primary">
              <span className="material-symbols-outlined text-[24px]">visibility</span>
            </div>
            <span className="bg-tertiary-container/20 text-tertiary text-xs px-2 py-1 rounded-full font-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px]">trending_up</span>
              12%
            </span>
          </div>
          <div>
            <p className="text-label-sm font-label-sm text-on-surface-variant mb-xs">Visualizações de Perfil</p>
            <h3 className="text-headline-lg font-headline-lg text-on-surface font-bold">1.248</h3>
          </div>
        </div>
      </section>

      {/* Seção Inferior: Grid de 2 Colunas (Gerenciamento de Serviços + Aprovações Pendentes) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-lg items-start">
        {/* Coluna Esquerda: Gerenciador de Serviços */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col shadow-sm">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright rounded-t-xl">
            <h2 className="text-label-md font-label-md text-on-surface flex items-center gap-2 font-semibold">
              <span className="material-symbols-outlined text-primary text-[20px]">construction</span>
              Gerenciar Serviços do Catálogo
            </h2>
            <button 
              onClick={handleOpenAddForm}
              className="bg-primary text-on-primary text-xs px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center gap-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              Novo Serviço
            </button>
          </div>

          <div className="p-md space-y-md">
            {/* Inline Add/Edit Form */}
            {isFormOpen && (
              <form onSubmit={handleSaveService} className="bg-surface-container-low border border-outline-variant p-md rounded-xl space-y-sm animate-fade-in">
                <h4 className="text-label-md font-semibold text-on-surface">
                  {editingServiceId ? 'Editar Serviço' : 'Novo Serviço'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  <div className="flex flex-col gap-xs">
                    <label className="text-[11px] font-label-sm text-on-surface-variant" htmlFor="service-name">Nome do Serviço</label>
                    <input 
                      type="text" 
                      id="service-name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Instalação de Tomadas"
                      className="bg-surface-container-lowest border border-outline-variant rounded-md px-sm py-[6px] text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="text-[11px] font-label-sm text-on-surface-variant" htmlFor="service-price">Preço Estimado</label>
                    <input 
                      type="text" 
                      id="service-price"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Ex: R$ 120,00"
                      className="bg-surface-container-lowest border border-outline-variant rounded-md px-sm py-[6px] text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                </div>
                {/* Description Input */}
                <div className="flex flex-col gap-xs">
                  <label className="text-[11px] font-label-sm text-on-surface-variant" htmlFor="service-description">Descrição do Serviço</label>
                  <textarea 
                    id="service-description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva detalhes do serviço oferecido, tempo médio ou requisitos..."
                    rows={2}
                    className="bg-surface-container-lowest border border-outline-variant rounded-md px-sm py-[6px] text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary transition-all resize-none"
                  />
                </div>
                <div className="flex justify-end gap-xs pt-xs">
                  <button 
                    type="button" 
                    onClick={() => setIsFormOpen(false)}
                    className="bg-surface border border-outline-variant text-on-surface text-label-sm px-md py-1.5 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    className="bg-primary text-on-primary text-label-sm px-md py-1.5 rounded-lg hover:opacity-90 transition-opacity font-semibold cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}

            {/* List of Services */}
            <div className="divide-y divide-outline-variant/30 max-h-[350px] overflow-y-auto pr-xs">
              {services.length === 0 ? (
                <div className="py-xl text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant/70 mb-xs">construction</span>
                  <p className="text-body-md">Nenhum serviço catalogado.</p>
                  <p className="text-body-xs mt-2xs">Adicione um novo serviço acima para começar.</p>
                </div>
              ) : (
                services.map((service) => (
                  <div key={service.id} className="py-sm flex items-start justify-between gap-md first:pt-0 last:pb-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-xs">
                        <p className="text-label-md font-semibold text-on-surface truncate">{service.name}</p>
                        <p className="text-body-sm text-tertiary font-medium shrink-0">{service.price}</p>
                      </div>
                      <p className="text-[11px] leading-normal text-on-surface-variant mt-xs line-clamp-2" title={service.description}>
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-xs shrink-0 self-center">
                      <button 
                        onClick={() => handleOpenEditForm(service)}
                        className="text-on-surface-variant hover:text-primary p-xs hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="text-error hover:text-on-error-container p-xs hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Aprovações Pendentes + Galeria do Portfólio */}
        <div className="flex flex-col gap-lg w-full">
          {/* Card: Aprovações Pendentes de Clientes */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col shadow-sm">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright rounded-t-xl">
              <h2 className="text-label-md font-label-md text-on-surface flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary text-[20px]">pending_actions</span>
                Aprovações Pendentes de Clientes
              </h2>
              <span className="bg-error text-on-error text-xs px-2 py-0.5 rounded-full font-bold">{pendingClients.length}</span>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {pendingClients.length === 0 ? (
                <div className="p-xl text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant/70 mb-xs">verified_user</span>
                  <p className="text-body-md">Nenhuma aprovação pendente.</p>
                  <p className="text-body-xs mt-2xs">Todos os clientes foram aprovados.</p>
                </div>
              ) : (
                pendingClients.map((client) => (
                  <div key={client.id} className="p-md border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-md">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-lg bg-surface-dim overflow-hidden flex items-center justify-center text-primary font-bold bg-primary-container/20">
                        {client.avatar.startsWith('http') ? (
                          <img alt={client.name} className="w-full h-full object-cover" src={client.avatar}/>
                        ) : (
                          client.avatar
                        )}
                      </div>
                      <div>
                        <p className="text-label-md font-label-md text-on-surface font-semibold">{client.name}</p>
                        <p className="text-label-sm font-label-sm text-on-surface-variant">Cliente • {client.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveClient(client.name)}
                        className="bg-surface border border-outline-variant text-on-surface text-label-sm font-label-sm px-md py-1.5 rounded-lg hover:bg-surface-container-highest transition-colors cursor-pointer"
                      >
                        Revisar Docs
                      </button>
                      <button 
                        onClick={() => handleApproveClient(client.name)}
                        className="bg-primary text-on-primary text-label-sm font-label-sm px-md py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        Aprovar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-sm border-t border-outline-variant bg-surface-bright rounded-b-xl text-center">
              <Link href={`${panelBase}/requests`} className="text-primary font-label-sm text-label-sm hover:underline font-semibold">
                Ver Todas as Solicitações
              </Link>
            </div>
          </div>

          {/* Card: Galeria do Portfólio */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-lg">
              <h2 className="text-label-md font-label-md text-on-surface flex items-center gap-2 font-semibold">
                <span className="material-symbols-outlined text-primary text-[20px]">photo_library</span>
                Galeria do Portfólio
              </h2>
              <Link href={`${panelBase}/profile`} className="text-primary text-label-sm font-semibold flex items-center gap-xs hover:underline">
                <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                Adicionar Nova
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-sm">
              <div className="aspect-square rounded-lg bg-surface-container-low overflow-hidden group relative border border-outline-variant/30">
                <img 
                  alt="Projeto Concluído" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBR_Cof2dQzavwqsBjA70GCraw3sIIuSMEkwCl6xvEJpFFvQs8poMc-G40OJVoVwMPSynAdgRYJ3fBfKmpSu5bFgxZjLpFOZ2pBr70WkPobxHHaMTIiUEg2-ou2hUFajsVc3NtIn9ak-JNf8flM3qwWI71afKdDOg7SarhekC8y1MsTAplmD9EE09mO-GHf00odAarkOaDXylI-8rFJmSUyiY4I0BTfJVhv2Ox4S7TKZ92dt_T4O2PcVLH6KEXJCvyyB8coUvdwP-W_"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-xs">
                  <Link href={`${panelBase}/profile`} className="text-white p-xs rounded-full hover:bg-white/20"><span className="material-symbols-outlined text-[16px]">edit</span></Link>
                  <Link href={`${panelBase}/profile`} className="text-white p-xs rounded-full hover:bg-white/20"><span className="material-symbols-outlined text-[16px]">delete</span></Link>
                </div>
              </div>
              <div className="aspect-square rounded-lg bg-surface-container-low overflow-hidden group relative border border-outline-variant/30">
                <img 
                  alt="Projeto Concluído" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_BMfM17vhRWQVqqH0Ou3SJczKAk8E_TMyhFxLn4a_SsFaoWwd6YMhs4sjx1ix7Ez8GYAWzWmHQ5NDKtn5bnnqkdDTzX2cthbxuoBk_j3qgIsgLEvQ9czsCp2Ymvnq_MBUPUdnQ9LFM9dZ1j5NpHM1h3c5leuzWGliDp_AlRtCzaf2mFvMuQa0Rx1_yu-8eQXefQw3SGYWOek_qB6-Ti9LsB7vV9LX0PfQNNkgx8lZK7qNfEz-aFAgMItAS9dim4gqbspjLMsruiH9"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-xs">
                  <Link href={`${panelBase}/profile`} className="text-white p-xs rounded-full hover:bg-white/20"><span className="material-symbols-outlined text-[16px]">edit</span></Link>
                  <Link href={`${panelBase}/profile`} className="text-white p-xs rounded-full hover:bg-white/20"><span className="material-symbols-outlined text-[16px]">delete</span></Link>
                </div>
              </div>
              <Link href={`${panelBase}/profile`} className="aspect-square rounded-lg bg-surface-container-low border border-dashed border-outline-variant flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-highest hover:border-primary transition-colors cursor-pointer text-center p-xs">
                <span className="material-symbols-outlined text-[24px] mb-xs">upload</span>
                <span className="text-[11px] font-semibold leading-tight">Subir Foto</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
