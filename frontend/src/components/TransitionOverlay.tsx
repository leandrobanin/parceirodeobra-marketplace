'use client';

interface TransitionOverlayProps {
  type: 'signin' | 'signup' | 'signout';
}

export default function TransitionOverlay({ type }: TransitionOverlayProps) {
  // If it's a signout, do a clean, minimal fade-out to the page background color
  if (type === 'signout') {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#f9f9ff] flex flex-col items-center justify-center animate-page-in">
        <div className="flex flex-col items-center gap-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-body-sm font-semibold text-on-surface-variant animate-pulse">
            Saindo da conta...
          </p>
        </div>
      </div>
    );
  }

  let title = '';
  let subtitle = '';
  let iconName = '';
  let iconColorClass = '';
  let ringColorClass = '';

  if (type === 'signin') {
    title = 'Acesso Autorizado!';
    subtitle = 'Você está conectado. Redirecionando para a página inicial...';
    iconName = 'check_circle';
    iconColorClass = 'text-emerald-500';
    ringColorClass = 'bg-emerald-100/50';
  } else if (type === 'signup') {
    title = 'Cadastro Realizado!';
    subtitle = 'Sua conta foi criada com sucesso! Redirecionando...';
    iconName = 'celebration';
    iconColorClass = 'text-amber-500';
    ringColorClass = 'bg-amber-100/50';
  }

  return (
    <div className="fixed inset-0 z-[999999] bg-[#f9f9ff]/80 backdrop-blur-md flex flex-col items-center justify-center animate-page-in">
      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-xl shadow-2xl flex flex-col items-center gap-md text-center w-[320px] sm:w-[400px] flex-shrink-0 mx-auto animate-fade-in">
        {/* Pulsing Animated Icon Container */}
        <div className={`relative w-20 h-20 rounded-full flex items-center justify-center ${ringColorClass}`}>
          <div className="absolute inset-0 rounded-full border-4 border-current opacity-20 scale-110 animate-ping"></div>
          <span className={`material-symbols-outlined text-[48px] ${iconColorClass}`}>
            {iconName}
          </span>
        </div>

        {/* Text Details */}
        <div className="flex flex-col gap-xs mt-xs">
          <h3 className="text-headline-md font-headline-md font-bold text-on-surface">
            {title}
          </h3>
          <p className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed px-sm">
            {subtitle}
          </p>
        </div>

        {/* Small loader spinner */}
        <div className="mt-sm flex items-center gap-2xs text-[12px] font-semibold text-on-surface-variant/70">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          Aguarde um momento...
        </div>
      </div>
    </div>
  );
}
