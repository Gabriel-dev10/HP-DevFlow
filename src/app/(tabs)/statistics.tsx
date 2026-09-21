import { StyleSheet, Text, View } from 'react-native';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';

export default function StatisticsScreen() {
  const { tasks } = useTasks();
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.length - completed;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estatísticas</Text>
      <Text style={styles.subtitle}>Acompanhe seu desempenho nos estudos.</Text>

      <View style={styles.hero}>
        <Text style={styles.heroValue}>{progress}%</Text>
        <Text style={styles.heroLabel}>do planejamento concluído</Text>
      </View>

      <View style={styles.row}>
        <View style={styles.card}><Text style={styles.value}>{tasks.length}</Text><Text style={styles.label}>Total</Text></View>
        <View style={styles.card}><Text style={styles.value}>{completed}</Text><Text style={styles.label}>Concluídas</Text></View>
        <View style={styles.card}><Text style={styles.value}>{pending}</Text><Text style={styles.label}>Pendentes</Text></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  hero: { backgroundColor: colors.primary, borderRadius: 16, padding: spacing.lg, marginBottom: spacing.md },
  heroValue: { color: colors.surface, fontSize: 40, fontWeight: '700' },
  heroLabel: { color: colors.surface, marginTop: spacing.xs },
  row: { flexDirection: 'row', gap: spacing.sm },
  card: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md },
  value: { color: colors.text, fontSize: 24, fontWeight: '700' },
  label: { color: colors.textSecondary, marginTop: spacing.xs },
});
