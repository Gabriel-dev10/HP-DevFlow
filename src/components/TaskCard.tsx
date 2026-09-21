import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays, ChevronRight, Circle } from 'lucide-react-native';

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
        <View style={styles.titleRow}>
          <Circle size={18} color={colors.textSecondary} strokeWidth={1.7} />
          <Text style={styles.title}>{task.title}</Text>
        </View>

        <Text style={styles.description}>
          {task.description}
        </Text>

        <View style={styles.metaRow}>
          <CalendarDays size={14} color={colors.textSecondary} />
          <Text style={styles.date}>{task.dueDate}</Text>
          <Text style={styles.priority}>{task.priority}</Text>
        </View>
      </View>

      <ChevronRight size={18} color={colors.textSecondary} />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardPressed: {
    opacity: 0.75,
  },

  content: {
    gap: spacing.xs,
    flex: 1,
    marginRight: spacing.sm,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
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
    color: colors.textSecondary,
    fontSize: 13,
  },

  priority: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '600',
    marginTop: spacing.sm,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
});