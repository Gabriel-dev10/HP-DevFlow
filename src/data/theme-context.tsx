import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { usePersistedState } from '../hooks/usePersistedState';
import { STORAGE_KEYS } from '../services/storage';
import type { ThemeName } from '../types/api';
import { colors, darkColors } from '../theme/colors';

type ThemeContextValue = {
  tema: ThemeName;
  alternarTema: () => void;
  pronto: boolean;
  cores: typeof colors;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, atualizarTema, pronto] = usePersistedState<ThemeName>(
    STORAGE_KEYS.tema,
    'claro',
  );

  const valor = useMemo<ThemeContextValue>(() => ({
    tema,
    pronto,
    cores: tema === 'escuro' ? darkColors : colors,
    alternarTema: () => atualizarTema((atual) => atual === 'claro' ? 'escuro' : 'claro'),
  }), [atualizarTema, pronto, tema]);

  if (!pronto) {
    return null;
  }

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  }
  return contexto;
}
