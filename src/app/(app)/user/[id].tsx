import { useCallback } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useFetch } from '../../../hooks/useFetch';
import { api } from '../../../services/api';
import { comCache } from '../../../services/cache';
import { colors, spacing } from '../../../theme';
import type { User } from '../../../types/api';
import { useTheme } from '../../../data/theme-context';

export default function UserDetailScreen() {
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const buscarUsuario = useCallback(
    () => comCache(`app:v1:cache:user:${id ?? ''}`, () => api.user(id ?? '')),
    [id],
  );
  const { dados, loading, erro, recarregar } = useFetch<User>(buscarUsuario);

  if (loading) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: cores.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <ActivityIndicator size="large" color={cores.primary} />
      </View>
    );
  }

  if (erro) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: cores.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
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

  if (!dados) {
    return (
      <View
        style={[
          styles.center,
          {
            backgroundColor: cores.background,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}
      >
        <Text style={[styles.error, { color: cores.textSecondary }]}>
          Usuário não encontrado.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingBottom: Math.max(insets.bottom, spacing.screenBottom),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.border }]}>
        <Text
          style={[styles.title, { color: cores.text }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {dados.name}
        </Text>
        <Text style={[styles.label, { color: cores.textSecondary }]}>E-mail</Text>
        <Text
          style={[styles.value, { color: cores.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {dados.email}
        </Text>
        <Text style={[styles.label, { color: cores.textSecondary }]}>Cidade</Text>
        <Text
          style={[styles.value, { color: cores.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {dados.address.city}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.screen,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
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
    fontSize: 26,
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.md,
  },
  value: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    fontSize: 15,
  },
  retry: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginTop: spacing.md,
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
});
