import { get, set } from './storage';

type CacheEntry<T> = {
  valor: T;
  salvoEm: number;
};

export async function comCache<T>(
  chave: string,
  buscar: () => Promise<T>,
  ttlMs = 5 * 60_000,
): Promise<T> {
  const entradaPadrao: CacheEntry<T> | null = null;
  const entrada = await get<CacheEntry<T> | null>(chave, entradaPadrao);
  const agora = Date.now();

  if (entrada && agora - entrada.salvoEm < ttlMs) {
    return entrada.valor;
  }

  try {
    const valor = await buscar();
    await set<CacheEntry<T>>(chave, { valor, salvoEm: agora });
    return valor;
  } catch (error) {
    if (entrada) {
      return entrada.valor;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Cache nao disponivel');
  }
}
