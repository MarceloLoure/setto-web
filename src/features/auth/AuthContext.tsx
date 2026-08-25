'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from './api';
import type { CurrentUser, ArenaRef } from './types';

interface AuthContextData {
  user: CurrentUser | null;
  /** true enquanto a sessão ainda está sendo validada contra o servidor no primeiro load */
  isLoading: boolean;
  isAuthenticated: boolean;
  activeArenaId: string | null;
  activeArena: ArenaRef | null;
  managedArenas: ArenaRef[];
  setActiveArenaId: (arenaId: string) => void;
  refreshUser: () => Promise<void>;
  loginUser: (user: CurrentUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const ACTIVE_ARENA_STORAGE_KEY = 'bsc_active_arena_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeArenaId, setActiveArenaIdState] = useState<string | null>(null);
  const router = useRouter();

  const managedArenas = user ? [...user.arenasManaged, ...user.arenasEmployed] : [];

  const applyUser = useCallback((nextUser: CurrentUser | null) => {
    setUser(nextUser);
    const arenas = nextUser ? [...nextUser.arenasManaged, ...nextUser.arenasEmployed] : [];
    if (arenas.length === 0) {
      setActiveArenaIdState(null);
      return;
    }
    // Preferência de última arena escolhida, se ainda for válida pra este usuário;
    // isto é só uma conveniência de UI (não-sensível), nunca a fonte de identidade.
    const storedArenaId =
      typeof window !== 'undefined' ? window.localStorage.getItem(ACTIVE_ARENA_STORAGE_KEY) : null;
    const stillValid = arenas.find((a) => a.id === storedArenaId);
    setActiveArenaIdState(stillValid ? stillValid.id : arenas[0].id);
  }, []);

  // Única fonte de verdade da sessão: pergunta pro servidor. Roda no mount e
  // sempre que refreshUser() for chamado (ex: depois de trocar de arena ativa
  // no backend, ou como reação a um 401 vindo de qualquer chamada de API).
  const refreshUser = useCallback(async () => {
    const currentUser = await authApi.getCurrentUser();
    applyUser(currentUser);
  }, [applyUser]);

  useEffect(() => {
    setIsLoading(true);
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const setActiveArenaId = (arenaId: string) => {
    setActiveArenaIdState(arenaId);
    window.localStorage.setItem(ACTIVE_ARENA_STORAGE_KEY, arenaId);
  };

  const loginUser = (nextUser: CurrentUser) => {
    applyUser(nextUser);
    router.push('/dashboard');
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setActiveArenaIdState(null);
      window.localStorage.removeItem(ACTIVE_ARENA_STORAGE_KEY);
      router.push('/login');
    }
  };

  const activeArena = managedArenas.find((a) => a.id === activeArenaId) ?? managedArenas[0] ?? null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        activeArenaId: activeArena?.id ?? null,
        activeArena,
        managedArenas,
        setActiveArenaId,
        refreshUser,
        loginUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa ser usado dentro de um <AuthProvider>.');
  return ctx;
};
