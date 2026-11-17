import { useCallback, useEffect, useState } from 'react';

type UseFetchResult<T> = {
  dados: T | null;
  loading: boolean;
  erro: string | null;
  recarregar: () => Promise<void>;
};

export function useFetch<T>(buscar: () => Promise<T>): UseFetchResult<T> {
  const [dados, setDados] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const recarregar = useCallback(async () => {
    setLoading(true);
    setErro(null);

    try {
      const resultado = await buscar();
      setDados(resultado);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Nao foi possivel carregar os dados');
    } finally {
      setLoading(false);
    }
  }, [buscar]);

  useEffect(() => {
    void recarregar();
  }, [recarregar]);

  return { dados, loading, erro, recarregar };
}
