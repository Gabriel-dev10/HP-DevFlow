import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarDays, CheckCircle2, Circle, Flag } from 'lucide-react-native';

import { Button } from '../components/Button';
import { useTasks } from '../data/task-context';
import { colors, spacing } from '../theme';

export default function TaskDetailsScreen() {
  const { taskId } = useLocalSearchParams<{ taskId: string }>();
  const router = useRouter();
  const { getTask, toggleTask } = useTasks();
  const task = getTask(taskId);

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tarefa não encontrada</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusPill}>
        {task.completed ? <CheckCircle2 size={15} color={colors.success} /> : <Circle size={15} color={colors.primary} />}
        <Text style={styles.statusPillText}>{task.completed ? 'Concluída' : 'Em andamento'}</Text>
      </View>
      <Text style={styles.title}>
        {task.title}
      </Text>

      <Text style={styles.label}>Descrição</Text>

      <Text style={styles.description}>
        {task.description}
      </Text>

      <View style={styles.infoRow}>
        <CalendarDays size={17} color={colors.textSecondary} />
        <View>
          <Text style={styles.label}>Data</Text>
          <Text style={styles.value}>{task.date}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Flag size={17} color={colors.warning} />
        <View>
          <Text style={styles.label}>Prioridade</Text>
          <Text style={styles.priority}>{task.priority}</Text>
        </View>
      </View>

      <View style={styles.button}>
        <Button
          title={task.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
          onPress={() => toggleTask(task.id)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: spacing.xl,
  },

  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: '#FFF0ED',
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    marginBottom: spacing.md,
  },

  statusPillText: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },

  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 0,
    marginBottom: spacing.xs,
  },

  description: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 24,
  },

  value: {
    color: colors.text,
    fontSize: 16,
  },

  priority: {
    color: colors.warning,
    fontSize: 16,
    fontWeight: '700',
  },

  status: {
    color: colors.success,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 0,
  },

  button: {
    marginTop: spacing.xl,
  },
});