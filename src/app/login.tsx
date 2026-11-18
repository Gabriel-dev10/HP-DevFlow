import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Href } from 'expo-router';

import { useAuth } from '../data/auth-context';
import { useTheme } from '../data/theme-context';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleLogin() {
    setErro(null);

    if (!email.trim() || !senha) {
      setErro('Informe e-mail e senha.');
      return;
    }

    if (!email.includes('@')) {
      setErro('Informe um e-mail valido.');
      return;
    }

    setCarregando(true);
    try {
      await entrar(email.trim(), senha);
      router.replace('/' as Href);
    } catch {
      setErro('Nao foi possivel entrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: Math.max(insets.top, 24),
              paddingBottom: Math.max(insets.bottom, 24),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.cardContainer}>
            <Text style={[styles.title, { color: cores.text }]}>StudyFlow</Text>
            <Text style={[styles.subtitle, { color: cores.textSecondary }]}>
              Entre para acompanhar suas atividades.
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              placeholderTextColor={cores.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!carregando}
              style={[
                styles.input,
                {
                  backgroundColor: cores.surface,
                  borderColor: cores.border,
                  color: cores.text,
                },
              ]}
            />
            <TextInput
              value={senha}
              onChangeText={setSenha}
              placeholder="Senha"
              placeholderTextColor={cores.textSecondary}
              secureTextEntry
              editable={!carregando}
              style={[
                styles.input,
                {
                  backgroundColor: cores.surface,
                  borderColor: cores.border,
                  color: cores.text,
                },
              ]}
            />
            {erro && <Text style={[styles.erro, { color: cores.danger }]}>{erro}</Text>}
            <Pressable
              style={[
                styles.button,
                { backgroundColor: cores.primaryDark },
                carregando && styles.buttonDisabled,
              ]}
              onPress={() => void handleLogin()}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color={cores.surface} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  cardContainer: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, marginBottom: 32, textAlign: 'center' },
  input: {
    width: '100%',
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  erro: { width: '100%', marginBottom: 12, textAlign: 'center', fontSize: 14 },
  button: {
    alignItems: 'center',
    borderRadius: 8,
    width: '100%',
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
