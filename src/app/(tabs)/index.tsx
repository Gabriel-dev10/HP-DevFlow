import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight, CalendarDays, CheckCircle2, Plus } from 'lucide-react-native';

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

  function handleCreateTask() {
    router.push('/new-task');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SEGUNDA, 21 DE SETEMBRO</Text>
          <Text style={styles.greeting}>Olá, estudante</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>JS</Text></View>
      </View>

      <Text style={styles.title}>Hoje</Text>

      <View style={styles.progressCard}>
        <View style={styles.progressIcon}><CheckCircle2 size={22} color={colors.primary} /></View>
        <View style={styles.progressCopy}>
          <Text style={styles.progressLabel}>Seu progresso</Text>
          <Text style={styles.progressValue}>{progress}% concluído</Text>
        </View>
        <Text style={styles.progressCount}>{completedTasks}/{tasks.length}</Text>
      </View>

      <Pressable style={styles.addTaskButton} onPress={handleCreateTask}>
        <View style={styles.addIcon}><Plus size={18} color={colors.primary} /></View>
        <Text style={styles.addTaskText}>Adicionar tarefa</Text>
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próxima tarefa</Text>
        <Text style={styles.sectionHint}>Em foco</Text>
      </View>

      {nextTask ? <Pressable
        style={({ pressed }) => [
          styles.taskCard,
          pressed && styles.taskCardPressed,
        ]}
        onPress={handleOpenTask}
      >
        <View style={styles.taskTitleRow}>
          <View style={styles.taskDot} />
          <Text style={styles.taskTitle}>{nextTask.title}</Text>
          <ArrowRight size={18} color={colors.textSecondary} />
        </View>

        <Text style={styles.taskDescription}>{nextTask.description}</Text>

        <View style={styles.taskMeta}>
          <CalendarDays size={14} color={colors.textSecondary} />
          <Text style={styles.taskDate}>{nextTask.date}</Text>
          <Text style={styles.priority}>{nextTask.priority}</Text>
        </View>

        <Text style={styles.actionText}>
          Toque para ver detalhes
        </Text>
      </Pressable> : <Text style={styles.emptyText}>Você concluiu todas as tarefas.</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.screenBottom,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  eyebrow: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  greeting: {
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontSize: 17,
    fontWeight: '600',
  },

  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#F7C6BE', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.primaryDark, fontSize: 12, fontWeight: '800' },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
    marginBottom: spacing.md,
  },

  progressCard: {
    backgroundColor: '#FFF0ED',
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  progressIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  progressCopy: { flex: 1, marginLeft: spacing.sm },
  progressValue: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 2 },

  progressLabel: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '600',
  },
  progressCount: { color: colors.primaryDark, fontSize: 14, fontWeight: '700' },

  addTaskButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, marginBottom: spacing.xl },
  addIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFF0ED', alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  addTaskText: { color: colors.primary, fontSize: 14, fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing.md,
  },

  sectionHint: { color: colors.textSecondary, fontSize: 12 },

  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  taskCardPressed: {
    opacity: 0.78,
  },

  taskTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
  },

  taskTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  taskDot: { width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: colors.primary },

  taskDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.sm,
  },

  taskDate: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: spacing.sm,
  },

  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.sm },
  priority: { color: colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'capitalize', marginLeft: spacing.sm },

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
