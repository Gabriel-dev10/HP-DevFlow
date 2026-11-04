import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../../data/auth-context';

export default function LoginScreen() {
  const { signIn } = useAuth();

  function handleLogin() {
    signIn('aluno@studyflow.com', 'studyflow');
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>StudyFlow</Text>
      <Text style={styles.subtitle}>Entre para acompanhar suas atividades.</Text>
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#667085',
    fontSize: 16,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#7A271A',
    borderRadius: 8,
    paddingHorizontal: 48,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});