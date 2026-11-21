import { useCallback, useEffect, useRef } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFetch } from '../../hooks/useFetch';
import { useOnline } from '../../hooks/useOnline';
import { api } from '../../services/api';
import { comCache } from '../../services/cache';
import { STORAGE_KEYS } from '../../services/storage';
import { colors, spacing } from '../../theme';
import { useTheme } from '../../data/theme-context';
import type { User } from '../../types/api';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cores } = useTheme();
  const buscarUsers = useCallback(
    () => comCache(STORAGE_KEYS.usersCache, api.users),
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

  if (loading && !dados) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: cores.background,
            paddingTop: Math.max(insets.top, spacing.md),
            paddingBottom: Math.max(insets.bottom, spacing.screenBottom),
          },
        ]}
      >
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (erro && !dados) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: cores.background,
            paddingTop: Math.max(insets.top, spacing.md),
            paddingBottom: Math.max(insets.bottom, spacing.screenBottom),
          },
        ]}
      >
        <Text style={[styles.error, { color: cores.danger }]}>{erro}</Text>
        <Pressable
          style={[styles.retry, { backgroundColor: cores.primary }]}
          onPress={() => void recarregar()}
        >
          <Text style={[styles.retryText, { color: cores.surface }]}>Tentar de novo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cores.background,
          paddingTop: Math.max(insets.top, spacing.md),
        },
      ]}
    >
      <Text style={[styles.title, { color: cores.text }]}>Usuários</Text>
      <FlatList
        data={dados ?? []}
        keyExtractor={(item) => String(item.id)}
        refreshing={loading}
        onRefresh={() => void recarregar()}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Math.max(insets.bottom, spacing.screenBottom) },
          (!dados || dados.length === 0) && styles.emptyList,
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.empty, { color: cores.textSecondary }]}>
              Nenhum usuário encontrado.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.userCard,
              { backgroundColor: cores.surface, borderColor: cores.border },
              pressed && styles.pressed,
            ]}
            onPress={() =>
              router.push({
                pathname: '/user/[id]' as never,
                params: { id: String(item.id) },
              })
            }
          >
            <Text
              style={[styles.userName, { color: cores.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
            <Text
              style={[styles.userEmail, { color: cores.textSecondary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.email}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
  },
  list: {
    paddingBottom: spacing.screenBottom,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontSize: 15,
  },
  retry: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryText: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 15,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
  },
  separator: {
    height: spacing.sm,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 56,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.76,
  },
  userName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  userEmail: {
    color: colors.textSecondary,
    marginTop: 4,
    fontSize: 14,
  },
});
