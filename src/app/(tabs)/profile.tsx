import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../../theme';
import { Bell, ChevronRight, Palette, Settings } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>CONTA</Text>
      <Text style={styles.title}>Perfil</Text>
      <View style={styles.avatar}><Text style={styles.avatarText}>GS</Text></View>
      <Text style={styles.name}>Gabriel Silva</Text>
      <Text style={styles.email}>gabriel.silva@hp.dev</Text>
      <Text style={styles.role}>Desenvolvedor · 2 projetos associados</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferências</Text>
        <Pressable style={styles.option}><Bell size={18} color={colors.textSecondary} /><Text style={styles.optionText}>Notificações</Text><Text style={styles.optionValue}>Ativadas</Text><ChevronRight size={17} color={colors.border} /></Pressable>
        <Pressable style={styles.option}><Palette size={18} color={colors.textSecondary} /><Text style={styles.optionText}>Tema</Text><Text style={styles.optionValue}>Automático</Text><ChevronRight size={17} color={colors.border} /></Pressable>
        <Pressable style={styles.option}><Settings size={18} color={colors.textSecondary} /><Text style={styles.optionText}>Configurações</Text><ChevronRight size={17} color={colors.border} /></Pressable>
        <View style={styles.summary}><Text style={styles.summaryValue}>12</Text><Text style={styles.summaryLabel}>demandas concluídas neste ciclo</Text></View>
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
  optionText: { color: colors.text, fontWeight: '600' },
  optionValue: { color: colors.textSecondary },
  summary: { backgroundColor: colors.primarySoft, borderRadius: 12, padding: spacing.md, marginTop: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  summaryValue: { color: colors.primary, fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: colors.primaryDark, fontSize: 12, fontWeight: '700', flex: 1 },
});
