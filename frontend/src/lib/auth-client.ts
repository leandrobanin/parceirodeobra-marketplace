import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type AppRole = 'CUSTOMER' | 'PROFESSIONAL' | 'ADMIN';

const SESSION_CREATED_KEY = 'obra_certa_session_created';
const LEGACY_ADMIN_BYPASS_KEY = 'obra_certa_admin_bypass';
const LOCAL_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface TrustedAuthContext {
  user: User;
  role: AppRole;
  displayName: string;
  email: string;
  avatarUrl?: string;
  isDocumentVerified: boolean;
}

export function clearLegacyAuthBypass() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LEGACY_ADMIN_BYPASS_KEY);
}

export function markSessionCreated() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(SESSION_CREATED_KEY)) {
    localStorage.setItem(SESSION_CREATED_KEY, Date.now().toString());
  }
}

export function clearLocalSessionMarkers() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_CREATED_KEY);
  clearLegacyAuthBypass();
}

export function hasLocalSessionExpired() {
  if (typeof window === 'undefined') return false;
  const sessionCreatedStr = localStorage.getItem(SESSION_CREATED_KEY);
  if (!sessionCreatedStr) return false;

  const sessionCreated = Number(sessionCreatedStr);
  return !Number.isNaN(sessionCreated) && Date.now() - sessionCreated > LOCAL_SESSION_MAX_AGE_MS;
}

export function isPrivilegedRole(role: AppRole) {
  return role === 'PROFESSIONAL' || role === 'ADMIN';
}

export function normalizeRole(role: unknown): AppRole {
  if (role === 'ADMIN' || role === 'PROFESSIONAL') return role;
  return 'CUSTOMER';
}

async function fetchTrustedRole(userId: string): Promise<AppRole> {
  const { data, error } = await supabase
    .from('User')
    .select('role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('Erro ao consultar role do usuario:', error.message);
    return 'CUSTOMER';
  }

  return normalizeRole(data?.role);
}

export async function getTrustedAuthContext(): Promise<TrustedAuthContext | null> {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const role = await fetchTrustedRole(user.id);
  const email = user.email || '';
  let displayName = user.user_metadata?.full_name || user.user_metadata?.name || email.split('@')[0] || 'Usuario';
  let avatarUrl = typeof user.user_metadata?.avatar_url === 'string' ? user.user_metadata.avatar_url : undefined;

  if (role === 'PROFESSIONAL') {
    const { data: professional } = await supabase
      .from('Professional')
      .select('name, profilePhoto')
      .eq('userId', user.id)
      .maybeSingle();

    displayName = professional?.name || displayName;
    avatarUrl = professional?.profilePhoto || avatarUrl;
  } else if (role === 'CUSTOMER') {
    const { data: customer } = await supabase
      .from('Customer')
      .select('name')
      .eq('userId', user.id)
      .maybeSingle();

    displayName = customer?.name || displayName;
  }

  return {
    user,
    role,
    displayName,
    email,
    avatarUrl,
    isDocumentVerified: user.app_metadata?.document_verified === true,
  };
}
