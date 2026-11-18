import { StyleSheet, Text, View } from 'react-native';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';
import { BarChart3, CheckCircle2, ListChecks, Target } from 'lucide-react-native';
import { useTheme } from '../../data/theme-context';

export default function StatisticsScreen() {
  const { cores } = useTheme();
  const { tasks } = useTasks();
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <View style={styles.header}><View><Text style={[styles.eyebrow, { color: cores.textSecondary }]}>VISÃO GERAL</Text><Text style={[styles.title, { color: cores.text }]}>Estatísticas</Text></View><BarChart3 size={24} color={cores.primary} /></View>
      <Text style={[styles.subtitle, { color: cores.textSecondary }]}>Histórico das alterações nas demandas.</Text>

      <View style={[styles.hero, { backgroundColor: cores.primary }]}>
        <Target size={24} color={cores.surface} />
        <Text style={[styles.heroValue, { color: cores.surface }]}>{progress}%</Text>
          <Text style={[styles.heroLabel, { color: cores.surface }]}>das entregas concluídas</Text>
      </View>

      <View style={styles.row}>
          <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.border }]}><ListChecks size={18} color={cores.primary} /><Text style={[styles.value, { color: cores.text }]}>{tasks.length}</Text><Text style={[styles.label, { color: cores.textSecondary }]}>Alterações</Text></View>
        <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.border }]}><CheckCircle2 size={18} color={cores.success} /><Text style={[styles.value, { color: cores.text }]}>{completed}</Text><Text style={[styles.label, { color: cores.textSecondary }]}>Concluídas</Text></View>
        <View style={[styles.card, { backgroundColor: cores.surface, borderColor: cores.border }]}><Target size={18} color={cores.warning} /><Text style={[styles.value, { color: cores.text }]}>{pending}</Text><Text style={[styles.label, { color: cores.textSecondary }]}>Pendentes</Text></View>
      </View>

      <Text style={[styles.activityTitle, { color: cores.text }]}>Atividade recente</Text>
      {tasks.slice(0, 3).map((task) => (
        <View key={task.id} style={[styles.activity, { backgroundColor: cores.surface, borderColor: cores.border }]}>
          <View style={[styles.activityDot, { backgroundColor: cores.primary }]} />
          <View style={styles.activityCopy}>
            <Text style={[styles.activityText, { color: cores.text }]}>Issue #{task.issue} está em {task.status === 'desenvolvimento' ? 'desenvolvimento' : task.status === 'revisao' ? 'revisão' : task.status === 'concluido' ? 'concluído' : 'backlog'}</Text>
            <Text style={[styles.activityMeta, { color: cores.textSecondary }]}>{task.projectKey} · {task.assignee}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.screenBottom },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  eyebrow: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  title: { color: colors.text, fontSize: 30, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  hero: { backgroundColor: colors.primary, borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md },
  heroValue: { color: colors.surface, fontSize: 40, fontWeight: '700' },
  heroLabel: { color: colors.surface, marginTop: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  card: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md },
  value: { color: colors.text, fontSize: 24, fontWeight: '700' },
  label: { color: colors.textSecondary, marginTop: spacing.xs },
  activityTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: spacing.xl, marginBottom: spacing.sm },
  activity: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  activityDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, marginTop: 4, marginRight: spacing.sm },
  activityCopy: { flex: 1 },
  activityText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  activityMeta: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
});
