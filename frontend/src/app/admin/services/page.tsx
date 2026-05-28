'use client';
import { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  price: string;
  description: string;
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

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });

  useEffect(() => {
    const stored = localStorage.getItem('obra_certa_services');
    if (stored) {
      try {
        setServices(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem('obra_certa_services', JSON.stringify(defaultServices));
    }
  }, []);

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

  return (
    <div className="p-md md:p-lg lg:p-xl max-w-4xl mx-auto w-full space-y-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-outline-variant pb-md">
        <div>
          <h1 className="text-headline-md font-headline-md text-on-surface font-bold">Meus Serviços</h1>
          <p className="text-body-sm text-on-surface-variant">Gerencie os serviços ativos no catálogo público do seu perfil.</p>
        </div>
        <button 
          onClick={handleOpenAddForm}
          className="bg-primary text-on-primary text-label-md font-semibold px-lg py-sm rounded-lg hover:opacity-90 transition-opacity flex items-center gap-xs cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Adicionar Novo Serviço
        </button>
      </div>

      {/* Inline Form */}
      {isFormOpen && (
        <form onSubmit={handleSaveService} className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl space-y-md shadow-sm animate-fade-in">
          <div className="flex justify-between items-center pb-xs border-b border-outline-variant/30">
            <h3 className="text-label-md font-bold text-on-surface">
              {editingServiceId ? 'Editar Serviço' : 'Cadastrar Novo Serviço'}
            </h3>
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)}
              className="text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            <div className="flex flex-col gap-xs">
              <label className="text-[11px] font-semibold text-on-surface-variant" htmlFor="service-name">Nome do Serviço</label>
              <input 
                type="text" 
                id="service-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Instalação de Ventilador de Teto"
                className="bg-surface border border-outline-variant rounded-lg px-md py-[8px] text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
            <div className="flex flex-col gap-xs">
              <label className="text-[11px] font-semibold text-on-surface-variant" htmlFor="service-price">Preço Médio Estimado</label>
              <input 
                type="text" 
                id="service-price"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Ex: R$ 150,00"
                className="bg-surface border border-outline-variant rounded-lg px-md py-[8px] text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-xs">
            <label className="text-[11px] font-semibold text-on-surface-variant" htmlFor="service-description">Descrição Detalhada</label>
            <textarea 
              id="service-description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva as especificações, o que está incluso, tempo médio de execução e requisitos técnicos..."
              rows={3}
              className="bg-surface border border-outline-variant rounded-lg px-md py-[8px] text-body-sm text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-sm pt-xs border-t border-outline-variant/30">
            <button 
              type="button" 
              onClick={() => setIsFormOpen(false)}
              className="bg-surface border border-outline-variant text-on-surface text-label-md font-semibold px-lg py-sm rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="bg-primary text-on-primary text-label-md font-semibold px-lg py-sm rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              Salvar Serviço
            </button>
          </div>
        </form>
      )}

      {/* Services List Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="p-md bg-surface-bright border-b border-outline-variant flex justify-between items-center">
          <h2 className="text-label-md font-bold text-on-surface">Lista de Serviços Cadastrados ({services.length})</h2>
        </div>
        
        <div className="divide-y divide-outline-variant/30">
          {services.length === 0 ? (
            <div className="p-xl text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-sm">construction</span>
              <p className="text-body-md font-semibold">Nenhum serviço disponível no catálogo.</p>
              <p className="text-body-xs mt-2xs">Adicione um novo serviço usando o botão superior para aparecer em seu perfil público.</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="p-md flex items-start gap-md hover:bg-surface-container-lowest/60 transition-colors">
                <div className="p-sm bg-surface-container-low rounded-xl text-primary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">construction</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-xs">
                    <h3 className="text-label-md font-bold text-on-surface truncate">{service.name}</h3>
                    <span className="text-label-md font-bold text-tertiary bg-tertiary-container/10 px-xs py-2xs rounded-md shrink-0">{service.price}</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-sm leading-relaxed" title={service.description}>
                    {service.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-xs shrink-0 self-center">
                  <button 
                    onClick={() => handleOpenEditForm(service)}
                    className="text-on-surface-variant hover:text-primary p-sm hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <button 
                    onClick={() => handleDeleteService(service.id)}
                    className="text-error hover:text-on-error-container p-sm hover:bg-error-container/20 rounded-lg transition-colors cursor-pointer"
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
  );
}
