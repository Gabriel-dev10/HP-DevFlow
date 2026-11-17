import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { apagar, salvar, SECURE_KEYS } from '../services/seguro';
import { get, remove, set, STORAGE_KEYS } from '../services/storage';
import type { AuthUser } from '../types/api';

type AuthContextValue = {
  usuario: AuthUser | null;
  pronto: boolean;
  entrar: (email: string, senha: string) => Promise<void>;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let ativo = true;

    void get<AuthUser | null>(STORAGE_KEYS.sessao, null).then((sessao) => {
      if (ativo) {
        setUsuario(sessao);
        setPronto(true);
      }
    });

    return () => {
      ativo = false;
    };
  }, []);

  async function entrar(email: string, _senha: string) {
    const novoUsuario = { name: email.split('@')[0] || 'Usuário', email };
    await set(STORAGE_KEYS.sessao, novoUsuario);
    await salvar(SECURE_KEYS.token, 'studyflow-session-token');
    setUsuario(novoUsuario);
  }

  async function sair() {
    await remove(STORAGE_KEYS.sessao);
    await apagar(SECURE_KEYS.token);
    await remove(STORAGE_KEYS.usersCache);
    setUsuario(null);
  }

  const value = useMemo(
    () => ({ usuario, pronto, entrar, sair }),
    [usuario, pronto],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}