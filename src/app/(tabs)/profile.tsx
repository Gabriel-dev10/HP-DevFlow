import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { colors, spacing } from '../../theme';
import { useTheme } from '../../data/theme-context';
import { useAuth } from '../../data/auth-context';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Bell, ChevronRight, Palette, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  const { tema, alternarTema, cores } = useTheme();
  const { usuario, sair } = useAuth();

  async function handleLogout() {
    await sair();
    router.replace('/login' as Href);
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <Text style={[styles.eyebrow, { color: cores.textSecondary }]}>CONTA</Text>
      <Text style={[styles.title, { color: cores.text }]}>Perfil</Text>
      <View style={[styles.avatar, { backgroundColor: cores.primary }]}><Text style={styles.avatarText}>GS</Text></View>
      <Text style={[styles.name, { color: cores.text }]}>{usuario?.name ?? 'Gabriel Silva'}</Text>
      <Text style={[styles.email, { color: cores.textSecondary }]}>{usuario?.email ?? 'gabriel.silva@hp.dev'}</Text>
      <Text style={[styles.role, { color: cores.primary }]}>Desenvolvedor · 2 projetos associados</Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: cores.text }]}>Preferências</Text>
        <Pressable style={[styles.option, { backgroundColor: cores.surface, borderColor: cores.border }]}><Bell size={18} color={cores.textSecondary} /><Text style={[styles.optionText, { color: cores.text }]}>Notificações</Text><Text style={[styles.optionValue, { color: cores.textSecondary }]}>Ativadas</Text><ChevronRight size={17} color={cores.border} /></Pressable>
        <View style={[styles.option, { backgroundColor: cores.surface, borderColor: cores.border }]}>
          <Palette size={18} color={cores.textSecondary} />
          <Text style={[styles.optionText, { color: cores.text }]}>Modo escuro</Text>
          <Switch
            value={tema === 'escuro'}
            onValueChange={alternarTema}
            accessibilityLabel="Modo escuro"
          />
        </View>
        <Pressable style={[styles.option, { backgroundColor: cores.surface, borderColor: cores.border }]}><Settings size={18} color={cores.textSecondary} /><Text style={[styles.optionText, { color: cores.text }]}>Configurações</Text><ChevronRight size={17} color={cores.border} /></Pressable>
        <View style={[styles.summary, { backgroundColor: cores.primarySoft }]}><Text style={[styles.summaryValue, { color: cores.primary }]}>12</Text><Text style={[styles.summaryLabel, { color: cores.primaryDark }]}>demandas concluídas neste ciclo</Text></View>
        <Pressable style={styles.logout} onPress={() => void handleLogout()}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.screenBottom, alignItems: 'center' },
  title: { alignSelf: 'flex-start', color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: spacing.xl },
  eyebrow: { alignSelf: 'flex-start', color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: spacing.xs },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.surface, fontSize: 28, fontWeight: '700' },
  name: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: spacing.md },
  email: { color: colors.textSecondary, marginTop: spacing.xs },
  role: { color: colors.primary, fontSize: 12, fontWeight: '700', marginTop: spacing.sm },
  section: { width: '100%', marginTop: spacing.xl },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing.sm },
  option: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  optionText: { color: colors.text, fontWeight: '600', flex: 1 },
  optionValue: { color: colors.textSecondary },
  summary: { backgroundColor: colors.primarySoft, borderRadius: 12, padding: spacing.md, marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryValue: { color: colors.primary, fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: colors.primaryDark, fontSize: 12, fontWeight: '700', flex: 1 },
  logout: { alignItems: 'center', backgroundColor: colors.danger, borderRadius: 12, marginTop: spacing.md, padding: spacing.md },
  logoutText: { color: colors.surface, fontWeight: '700' },
});
