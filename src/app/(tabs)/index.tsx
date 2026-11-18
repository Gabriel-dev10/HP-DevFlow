import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { OfflineBanner } from '../../components/OfflineBanner';
import { useFetch } from '../../hooks/useFetch';
import { useOnline } from '../../hooks/useOnline';
import { api } from '../../services/api';
import { comCache } from '../../services/cache';
import { colors, spacing } from '../../theme';
import type { User } from '../../types/api';

export default function HomeScreen() {
  const router = useRouter();
  const buscarUsers = useCallback(
    () => comCache('app:v1:cache:users', api.users),
    [],
  );
  const { dados, loading, erro, recarregar } = useFetch<User[]>(buscarUsers);
  const online = useOnline();
  const estavaOffline = useRef(!online);

  useEffect(() => {
    if (!online) {
      estavaOffline.current = true;
    } else if (estavaOffline.current) {
      estavaOffline.current = false;
      void recarregar();
    }
  }, [online, recarregar]);

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

  if (!dados || dados.length === 0) {
    return <Text style={styles.empty}>Nenhum usuario encontrado.</Text>;
  }

  return (
    <View style={styles.container}>
      {!online && <OfflineBanner />}
      <Text style={styles.title}>Usuarios</Text>
      <FlatList
        data={dados}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => void recarregar()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum usuario encontrado.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.userCard, pressed && styles.pressed]}
            onPress={() => router.push({ pathname: '/user/[id]', params: { id: String(item.id) } })}
          >
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.screenBottom },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginBottom: spacing.md },
  error: { color: colors.danger, textAlign: 'center', marginBottom: spacing.md },
  retry: { backgroundColor: colors.primary, borderRadius: 8, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  retryText: { color: colors.surface, fontWeight: '700' },
  empty: { color: colors.textSecondary, textAlign: 'center', padding: spacing.lg },
  separator: { height: spacing.sm },
  userCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md },
  pressed: { opacity: 0.76 },
  userName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  userEmail: { color: colors.textSecondary, marginTop: 4 },
});
