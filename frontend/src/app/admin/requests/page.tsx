'use client';
import { useState, useEffect } from 'react';

interface ClientRequest {
  id: string;
  title: string;
  clientName: string;
  location: string;
  date: string;
  price: string;
  description: string;
  status: 'Pendente' | 'Em Andamento' | 'Concluido';
}

const initialRequests: ClientRequest[] = [
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

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'Todas' | 'Pendente' | 'Em Andamento' | 'Concluido'>('Todas');

  useEffect(() => {
    const stored = localStorage.getItem('obra_certa_requests');
    if (stored) {
      try {
        setRequests(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('obra_certa_requests', JSON.stringify(initialRequests));
      setRequests(initialRequests);
    }
  }, []);

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'Todas') return true;
    return req.status === activeTab;
  });

  const handleUpdateStatus = (id: string, newStatus: 'Pendente' | 'Em Andamento' | 'Concluido') => {
    const updated = requests.map(req => req.id === id ? { ...req, status: newStatus } : req);
    setRequests(updated);
    localStorage.setItem('obra_certa_requests', JSON.stringify(updated));
  };

  const handleDeleteRequest = (id: string) => {
    const updated = requests.filter(req => req.id !== id);
    setRequests(updated);
    localStorage.setItem('obra_certa_requests', JSON.stringify(updated));
  };

  const getStatusBadge = (status: 'Pendente' | 'Em Andamento' | 'Concluido') => {
    switch (status) {
      case 'Pendente':
        return <span className="bg-warning-container/30 text-warning text-xs px-2.5 py-1 rounded-full font-semibold border border-warning/10">Pendente</span>;
      case 'Em Andamento':
        return <span className="bg-primary-container/20 text-primary text-xs px-2.5 py-1 rounded-full font-semibold border border-primary/10">Em Andamento</span>;
      case 'Concluido':
        return <span className="bg-tertiary-container/20 text-tertiary text-xs px-2.5 py-1 rounded-full font-semibold border border-tertiary/10">Concluído</span>;
    }
  };

  return (
    <div className="p-md md:p-lg lg:p-xl max-w-4xl mx-auto w-full space-y-lg">
      <div className="border-b border-outline-variant pb-md">
        <h1 className="text-headline-md font-headline-md text-on-surface font-bold">Solicitações de Clientes</h1>
        <p className="text-body-sm text-on-surface-variant">Veja, gerencie, aceite ou conclua as solicitações enviadas pelos clientes na plataforma.</p>
      </div>

      {/* Tabs Filter Header */}
      <div className="flex border-b border-outline-variant/60 gap-md overflow-x-auto scrollbar-none">
        {(['Todas', 'Pendente', 'Em Andamento', 'Concluido'] as const).map((tab) => {
          const count = tab === 'Todas' 
            ? requests.length 
            : requests.filter(r => r.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-sm px-xs font-semibold text-label-md transition-all relative border-b-2 cursor-pointer whitespace-nowrap ${
                activeTab === tab 
                  ? 'border-primary text-primary font-bold' 
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab === 'Pendente' ? 'Pendentes' : tab === 'Concluido' ? 'Concluídas' : tab}
              <span className={`ml-sm px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === tab ? 'bg-primary-container text-on-primary-container font-bold' : 'bg-surface-container-low text-on-surface-variant'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Requests List */}
      <div className="space-y-md">
        {filteredRequests.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-xl text-center text-on-surface-variant shadow-sm">
            <span className="material-symbols-outlined text-[48px] text-outline-variant mb-sm">mail</span>
            <p className="text-body-md font-semibold">Nenhuma solicitação encontrada.</p>
            <p className="text-body-xs mt-2xs">Não há solicitações neste filtro no momento.</p>
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md sm:p-lg flex flex-col gap-md hover:shadow-sm transition-all duration-200 animate-fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-sm">
                <div>
                  <h3 className="text-label-lg font-bold text-on-surface">{req.title}</h3>
                  <div className="flex flex-wrap items-center gap-xs sm:gap-md mt-sm text-body-xs text-on-surface-variant">
                    <span className="flex items-center gap-2xs">
                      <span className="material-symbols-outlined text-[14px]">person</span>
                      {req.clientName}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-2xs">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {req.location}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-2xs">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {req.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-sm shrink-0 self-start sm:self-center">
                  <span className="text-label-md font-bold text-tertiary bg-tertiary-container/10 px-sm py-xs rounded-lg">{req.price}</span>
                  {getStatusBadge(req.status)}
                </div>
              </div>

              <p className="text-body-sm text-on-surface-variant leading-relaxed bg-surface-container-low/40 p-sm rounded-lg border border-outline-variant/10">
                {req.description}
              </p>

              <div className="flex flex-col sm:flex-row justify-end gap-sm pt-xs border-t border-outline-variant/30">
                {req.status === 'Pendente' && (
                  <>
                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      className="bg-surface border border-outline-variant text-error text-label-sm font-semibold px-md py-1.5 rounded-lg hover:bg-error-container/20 transition-colors cursor-pointer"
                    >
                      Recusar Orçamento
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'Em Andamento')}
                      className="bg-primary text-on-primary text-label-sm font-semibold px-md py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      Aceitar Serviço
                    </button>
                  </>
                )}
                {req.status === 'Em Andamento' && (
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'Concluido')}
                    className="bg-tertiary text-on-tertiary text-label-sm font-semibold px-md py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Marcar como Concluído
                  </button>
                )}
                {req.status === 'Concluido' && (
                  <span className="text-body-xs font-semibold text-tertiary flex items-center gap-2xs">
                    <span className="material-symbols-outlined text-[16px] text-tertiary">check_circle</span>
                    Serviço concluído e faturado.
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
