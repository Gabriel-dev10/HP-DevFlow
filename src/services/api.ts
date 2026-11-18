import type { User } from '../types/api';

const BASE = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://jsonplaceholder.typicode.com';

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  if (!BASE) {
    throw new Error('EXPO_PUBLIC_API_URL nao configurada');
  }

  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Usuario nao encontrado');
    }
    throw new Error(`Falha na requisicao (status ${response.status})`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  users: () => req<User[]>('/users'),
  user: (id: number | string) => req<User>(`/users/${encodeURIComponent(String(id))}`),
};
