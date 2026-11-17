import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const SECURE_KEYS = {
  token: 'app_v1_token',
};

function validarChave(chave: string): void {
  if (!/^[A-Za-z0-9._-]+$/.test(chave)) {
    throw new Error('Chave segura invalida');
  }
}

export async function salvar(chave: string, valor: string): Promise<void> {
  validarChave(chave);
  if (Platform.OS === 'web') {
    return;
  }
  await SecureStore.setItemAsync(chave, valor);
}

export async function ler(chave: string): Promise<string | null> {
  validarChave(chave);
  if (Platform.OS === 'web') {
    return null;
  }
  return SecureStore.getItemAsync(chave);
}

export async function apagar(chave: string): Promise<void> {
  validarChave(chave);
  if (Platform.OS === 'web') {
    return;
  }
  await SecureStore.deleteItemAsync(chave);
}
