import { FlatList, StyleSheet, Text, View } from 'react-native';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';

export default function CalendarScreen() {
  const { tasks } = useTasks();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda</Text>
      <Text style={styles.subtitle}>Suas atividades organizadas por data.</Text>
      <FlatList
        data={[...tasks].sort((first, second) => first.date.localeCompare(second.date))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.date}>{item.date}</Text>
            <View style={styles.itemContent}>
              <Text style={styles.taskTitle}>{item.title}</Text>
              <Text style={styles.status}>{item.completed ? 'Concluída' : 'Pendente'}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma atividade agendada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { color: colors.text, fontSize: 28, fontWeight: '700' },
  subtitle: { color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  item: { flexDirection: 'row', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm },
  date: { color: colors.primary, fontWeight: '700', width: 92 },
  itemContent: { flex: 1 },
  taskTitle: { color: colors.text, fontWeight: '600' },
  status: { color: colors.textSecondary, marginTop: spacing.xs, textTransform: 'capitalize' },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.lg },
});
