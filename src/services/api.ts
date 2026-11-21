import type { DummyJsonUser, DummyJsonUsersResponse, User } from '../types/api';

const BASE = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') || 'https://dummyjson.com';

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
  users: async () => {
    const resposta = await req<DummyJsonUsersResponse>('/users');
    return resposta.users.map(mapearUsuario);
  },
  user: async (id: number | string) => {
    const usuario = await req<DummyJsonUser>(`/users/${encodeURIComponent(String(id))}`);
    return mapearUsuario(usuario);
  },
};

function mapearUsuario(usuario: DummyJsonUser): User {
  return {
    id: usuario.id,
    name: `${usuario.firstName} ${usuario.lastName}`,
    email: usuario.email,
    address: {
      city: usuario.address.city,
    },
  };
}
