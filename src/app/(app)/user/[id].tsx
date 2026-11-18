import { useCallback } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useFetch } from '../../../hooks/useFetch';
import { api } from '../../../services/api';
import { colors, spacing } from '../../../theme';
import type { User } from '../../../types/api';

export default function UserDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const buscarUsuario = useCallback(
    () => api.user(id ?? ''),
    [id],
  );
  const { dados, loading, erro, recarregar } = useFetch<User>(buscarUsuario);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{erro}</Text>
        <Pressable style={styles.retry} onPress={() => void recarregar()}>
          <Text style={styles.retryText}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  if (!dados) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{dados.name}</Text>
      <Text style={styles.label}>E-mail</Text>
      <Text style={styles.value}>{dados.email}</Text>
      <Text style={styles.label}>Cidade</Text>
      <Text style={styles.value}>{dados.address.city}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.screen },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: spacing.lg },
  label: { color: colors.textSecondary, marginTop: spacing.md },
  value: { color: colors.text, fontSize: 16, fontWeight: '600', marginTop: spacing.xs },
  error: { color: colors.danger, textAlign: 'center' },
  retry: { backgroundColor: colors.primary, borderRadius: 8, marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  retryText: { color: colors.surface, fontWeight: '700' },
});
