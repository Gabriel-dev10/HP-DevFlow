import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors, spacing } from '../../theme';
import { useTasks } from '../../data/task-context';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks } = useTasks();
  const nextTask = tasks.find((task) => !task.completed) ?? tasks[0];
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = tasks.length
    ? Math.round((completedTasks / tasks.length) * 100)
    : 0;

  function handleOpenTask() {
    router.push({
      pathname: '/task-details',
      params: {
        taskId: nextTask?.id ?? '1',
      },
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, estudante! 👋</Text>

      <Text style={styles.title}>Seu progresso hoje</Text>

      <View style={styles.progressCard}>
        <Text style={styles.progressValue}>{progress}%</Text>

        <Text style={styles.progressLabel}>
          das tarefas concluídas
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Próxima tarefa</Text>

      {nextTask ? <Pressable
        style={({ pressed }) => [
          styles.taskCard,
          pressed && styles.taskCardPressed,
        ]}
        onPress={handleOpenTask}
      >
        <Text style={styles.taskTitle}>{nextTask.title}</Text>

        <Text style={styles.taskDescription}>{nextTask.description}</Text>

        <Text style={styles.taskDate}>{nextTask.date} • Prioridade {nextTask.priority}</Text>

        <Text style={styles.actionText}>
          Toque para ver detalhes
        </Text>
      </Pressable> : <Text style={styles.emptyText}>Você concluiu todas as tarefas.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },

  greeting: {
    color: colors.textSecondary,
    fontSize: 16,
    marginBottom: spacing.sm,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },

  progressCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  progressValue: {
    color: colors.surface,
    fontSize: 36,
    fontWeight: '700',
  },

  progressLabel: {
    color: colors.surface,
    fontSize: 15,
    marginTop: spacing.xs,
  },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },

  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  taskCardPressed: {
    opacity: 0.7,
  },

  taskTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },

  taskDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
  },

  taskDate: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.md,
  },

  actionText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.md,
  },

  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});
