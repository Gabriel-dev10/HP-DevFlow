import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button } from '../../components/Button';
import { useAuth } from '../../data/auth-context';
import { colors, spacing } from '../../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  function handleLogin() {
    login();
    router.replace('/');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>HP DEVFLOW</Text>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Acesse sua área para acompanhar as demandas.</Text>
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
    gap: spacing.md,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
});
