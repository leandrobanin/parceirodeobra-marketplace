'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { markSessionCreated } from '@/lib/auth-client';

function CallbackContent() {
  const router = useRouter();

  useEffect(() => {
    // Supabase handles token/code parsing automatically on mount.
    // We listen to the auth state transitions to redirect once loaded.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session) {
        if (typeof window !== 'undefined') {
          markSessionCreated();
          sessionStorage.setItem('obra_certa_show_signin_transition', 'true');
        }
        router.replace('/');
      } else if (event === 'INITIAL_SESSION') {
        if (session) {
          if (typeof window !== 'undefined') {
            markSessionCreated();
            sessionStorage.setItem('obra_certa_show_signin_transition', 'true');
          }
          router.replace('/');
        } else {
          // If after INITIAL_SESSION check there's still no session, wait a brief moment then go to auth
          const timeout = setTimeout(() => {
            router.replace('/auth');
          }, 4000);
          return () => clearTimeout(timeout);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center bg-background min-h-[60vh] p-lg">
      <div className="flex flex-col items-center gap-md">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        <p className="font-body-md text-body-md text-on-surface-variant animate-pulse">
          Autenticando e sincronizando sua conta...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center bg-background min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
