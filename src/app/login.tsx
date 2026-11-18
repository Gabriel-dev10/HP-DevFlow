import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Href } from 'expo-router';

import { useAuth } from '../data/auth-context';
import { useTheme } from '../data/theme-context';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const { cores } = useTheme();

  async function handleLogin() {
    await entrar('aluno@studyflow.com', 'studyflow');
    router.replace('/' as Href);
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <Text style={[styles.title, { color: cores.text }]}>StudyFlow</Text>
      <Text style={[styles.subtitle, { color: cores.textSecondary }]}>Entre para acompanhar suas atividades.</Text>
      <Pressable style={styles.button} onPress={() => void handleLogin()}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#667085', fontSize: 16, marginBottom: 32, textAlign: 'center' },
  button: { alignItems: 'center', backgroundColor: '#7A271A', borderRadius: 8, paddingHorizontal: 48, paddingVertical: 14 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
