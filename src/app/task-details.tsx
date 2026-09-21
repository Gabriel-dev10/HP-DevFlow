import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

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
      <Text style={styles.title}>
        {task.title}
      </Text>

      <Text style={styles.label}>Descrição</Text>

      <Text style={styles.description}>
        {task.description}
      </Text>

      <Text style={styles.label}>Data</Text>

      <Text style={styles.value}>
        {task.date}
      </Text>

      <Text style={styles.label}>Prioridade</Text>

      <Text style={styles.priority}>
        {task.priority}
      </Text>

      <Text style={styles.status}>
        {task.completed ? 'Concluída' : 'Pendente'}
      </Text>

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

  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: spacing.lg,
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
    marginTop: spacing.lg,
  },

  button: {
    marginTop: spacing.xl,
  },
});