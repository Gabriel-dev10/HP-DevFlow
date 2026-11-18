import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  sessao: 'app:v1:sessao',
  tema: 'app:v1:tema',
  usersCache: 'app:v1:cache:users',
  tasks: 'app:v1:tasks',
};

export async function get<T>(chave: string, padrao: T): Promise<T> {
  try {
    const valor = await AsyncStorage.getItem(chave);
    if (valor === null) {
      return padrao;
    }
    return JSON.parse(valor) as T;
  } catch {
    return padrao;
  }
}

export async function set<T>(chave: string, valor: T): Promise<void> {
  await AsyncStorage.setItem(chave, JSON.stringify(valor));
}

export async function remove(chave: string): Promise<void> {
  await AsyncStorage.removeItem(chave);
}
