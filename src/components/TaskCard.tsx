import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors, spacing } from '../theme';
import { Task } from '../types/task';

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/task-details',
          params: { taskId: task.id },
        })
      }
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>

        <Text style={styles.description}>
          {task.description}
        </Text>

        <Text style={styles.date}>
          {task.date}
        </Text>
      </View>

      <Text style={styles.priority}>
        {task.priority}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  cardPressed: {
    opacity: 0.75,
  },

  content: {
    gap: spacing.xs,
  },

  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  description: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  date: {
    color: colors.primary,
    fontSize: 13,
    marginTop: spacing.sm,
  },

  priority: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
});