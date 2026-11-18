import { useCallback, useEffect, useRef, useState } from 'react';
import { get, set } from '../services/storage';

export function usePersistedState<T>(
  chave: string,
  inicial: T,
  debounceMs = 0,
): [T, (valor: T | ((atual: T) => T)) => void, boolean] {
  const [valor, setValor] = useState<T>(inicial);
  const [pronto, setPronto] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hidratado = useRef(false);
  const inicialRef = useRef(inicial);

  useEffect(() => {
    let ativo = true;

    void get(chave, inicialRef.current).then((salvo) => {
      if (ativo) {
        setValor(salvo);
        hidratado.current = true;
        setPronto(true);
      }
    });

    return () => {
      ativo = false;
    };
  }, [chave]);

  useEffect(() => {
    if (!pronto || !hidratado.current) {
      return;
    }

    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (debounceMs > 0) {
      timeout.current = setTimeout(() => {
        void set(chave, valor);
      }, debounceMs);
    } else {
      void set(chave, valor);
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [chave, debounceMs, pronto, valor]);

  const atualizar = useCallback((proximo: T | ((atual: T) => T)) => {
    setValor((atual) => (
      typeof proximo === 'function'
        ? (proximo as (valorAtual: T) => T)(atual)
        : proximo
    ));
  }, []);

  return [valor, atualizar, pronto];
}
