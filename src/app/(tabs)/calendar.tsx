import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';
import { CalendarDays, CheckCircle2, Circle } from 'lucide-react-native';

export default function CalendarScreen() {
  const { tasks } = useTasks();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>PLANEJAMENTO</Text><Text style={styles.title}>Agenda</Text></View>
        <CalendarDays size={24} color={colors.primary} />
      </View>
      <Text style={styles.subtitle}>Suas atividades organizadas por data.</Text>
      <FlatList
        data={[...tasks].sort((first, second) => first.date.localeCompare(second.date))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.dateBlock}><Text style={styles.date}>{item.date.split('/')[0]}</Text><Text style={styles.month}>SET</Text></View>
            <View style={styles.itemContent}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.status}>{item.completed ? 'Concluída' : 'Pendente'}</Text>
            </View>
            {item.completed ? <CheckCircle2 size={18} color={colors.success} /> : <Circle size={18} color={colors.border} />}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma atividade agendada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  eyebrow: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  title: { color: colors.text, fontSize: 30, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  item: { flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  dateBlock: { width: 48, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.border, marginRight: spacing.sm },
  date: { color: colors.primary, fontSize: 22, fontWeight: '800' },
  month: { color: colors.textSecondary, fontSize: 10, fontWeight: '700' },
  itemContent: { flex: 1 },
  taskTitle: { color: colors.text, fontWeight: '600' },
  status: { color: colors.textSecondary, marginTop: spacing.xs, textTransform: 'capitalize' },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
});
