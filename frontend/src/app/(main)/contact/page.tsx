'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');

    setTimeout(() => {
      setFormStatus('success');

      setTimeout(() => {
        setFormStatus('idle');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }, 3000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-surface-container-lowest py-xxl px-lg">
        <div className="max-w-container-max mx-auto text-center space-y-md">
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg text-on-surface">
            Entre em Contato
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-[672px] mx-auto">
            Estamos aqui para ajudar você a transformar seus projetos em realidade.
            Nossa equipe de suporte está disponível para responder a qualquer dúvida sobre nossos serviços e profissionais.
          </p>
        </div>
      </section>

      {/* Main Layout: Form & Info */}
      <section className="max-w-container-max mx-auto px-lg py-xxl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xxl">
          {/* Left Column: Contact Form */}
          <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm transition-all hover:shadow-md">
            <form onSubmit={handleSubmit} className="space-y-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                <div className="flex flex-col gap-xs">
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="Nome Completo"
                    required
                  />
                </div>
                <div className="flex flex-col gap-xs">
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="E-mail"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <div className="relative">
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full h-12 px-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none ${
                      formData.subject === '' ? 'text-on-surface-variant/50' : 'text-on-surface'
                    }`}
                  >
                    <option value="" disabled className="text-on-surface-variant/50">Selecione um assunto</option>
                    <option className="text-on-surface bg-white">Suporte ao Usuário</option>
                    <option className="text-on-surface bg-white">Parcerias para Profissionais</option>
                    <option className="text-on-surface bg-white">Financeiro</option>
                    <option className="text-on-surface bg-white">Outros</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-md text-on-surface-variant">
                    <span className="material-symbols-outlined">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                  placeholder="Como podemos ajudar?"
                  required
                  rows={5}
                />
              </div>

              <button
                type="submit"
                disabled={formStatus !== 'idle'}
                className={`w-full py-md rounded-lg font-label-md text-label-md flex justify-center items-center gap-sm transform active:scale-[0.98] transition-all cursor-pointer ${
                  formStatus === 'idle'
                    ? 'bg-primary-container text-on-primary-container hover:opacity-95'
                    : formStatus === 'sending'
                    ? 'bg-primary-container/70 text-on-primary-container/70 cursor-not-allowed'
                    : 'bg-tertiary text-white'
                }`}
              >
                {formStatus === 'idle' && (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    Enviar Mensagem
                  </>
                )}
                {formStatus === 'sending' && (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Enviando...
                  </>
                )}
                {formStatus === 'success' && (
                  <>
                    <span className="material-symbols-outlined">check_circle</span>
                    Enviado com Sucesso!
                  </>
                )}
              </button>
              <p className="text-center mt-xl font-label-sm text-label-sm text-on-surface-variant px-md">
                Ao entrar em contato, nossa equipe de suporte analisará sua solicitação e retornará o mais breve possível.
              </p>
            </form>
          </div>

          {/* Right Column: Contact Details */}
          <div className="space-y-lg">
            <div className="space-y-md">
              <h2 className="text-headline-md font-headline-md text-on-surface">Canais de Atendimento</h2>
              <p className="text-body-md text-on-surface-variant">
                Escolha o canal que preferir. Estamos prontos para atender você com transparência e eficiência.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
              {/* Support Email */}
              <div className="p-lg bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col items-center text-center gap-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    mail
                  </span>
                </div>
                <h3 className="font-headline-md text-label-md text-on-surface">E-mail de Suporte</h3>
                <p className="text-body-md text-on-surface-variant">
                  suporte.pdo@gmail.com
                </p>
              </div>
              {/* Hours */}
              <div className="p-lg bg-surface-container-lowest border border-outline-variant rounded-xl flex flex-col items-center text-center gap-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    schedule
                  </span>
                </div>
                <h3 className="font-headline-md text-label-md text-on-surface">Horário de Funcionamento</h3>
                <p className="text-body-md text-on-surface-variant">
                  Segunda a Sexta: 08h às 18h
                  <br />
                  Sábados: 08h às 12h
                </p>
              </div>
            </div>

            {/* Trust/Brand Visual */}
            <div className="relative overflow-hidden rounded-xl h-48 group">
              <img
                alt="Profissionais Verificados"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                src="https://images.pexels.com/photos/12222682/pexels-photo-12222682.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-lg">
                <p className="text-white font-headline-md text-label-md">
                  Profissionais verificados de Porto Ferreira e região
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-surface-container-low py-xxl px-lg">
        <div className="max-w-4xl mx-auto space-y-xl text-center">
          <div className="space-y-sm">
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Dúvidas Frequentes</h2>
            <p className="text-body-lg text-on-surface-variant">
              Encontre respostas rápidas para as perguntas mais comuns dos nossos clientes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg text-left">
            <Link
              href="/how-it-works#customers"
              className="p-lg bg-white rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md"
            >
              <span className="material-symbols-outlined text-primary">help_outline</span>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">
                  Como faço para contratar um profissional?
                </h4>
                <p className="text-body-md text-on-surface-variant mt-xs">
                  Aprenda o passo a passo seguro para escolher seu prestador.
                </p>
              </div>
            </Link>
            <Link
              href="/how-it-works"
              className="p-lg bg-white rounded-xl border border-outline-variant hover:border-primary transition-colors flex items-start gap-md"
            >
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">O pagamento é seguro?</h4>
                <p className="text-body-md text-on-surface-variant mt-xs">
                  Saiba como funciona nossa garantia de serviço e pagamentos.
                </p>
              </div>
            </Link>
          </div>
          <div className="flex justify-center">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-sm text-primary font-label-md text-label-md hover:underline"
            >
              Veja todas as dúvidas em &apos;Como Funciona&apos;
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
