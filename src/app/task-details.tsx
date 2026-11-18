import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CalendarDays, CheckCircle2, Circle, ExternalLink, Flag, GitBranch, UserRound } from 'lucide-react-native';

import { Button } from '../components/Button';
import { useTasks } from '../data/task-context';
import { colors, spacing } from '../theme';
import { TaskStatus } from '../types/task';
import { useTheme } from '../data/theme-context';

export default function TaskDetailsScreen() {
  const { cores } = useTheme();
  const { id, taskId } = useLocalSearchParams<{ id?: string; taskId?: string }>();
  const router = useRouter();
  const { getTask, updateStatus } = useTasks();
  const taskIdParam = id ?? taskId;
  const task = taskIdParam ? getTask(taskIdParam) : undefined;

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: cores.background }]}>
        <Text style={styles.title}>Issue não encontrada</Text>
        <Button title="Voltar" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.background }]}>
      <View style={[styles.statusPill, { backgroundColor: cores.primarySoft }]}>
        {task.completed ? <CheckCircle2 size={15} color={colors.success} /> : <Circle size={15} color={colors.primary} />}
        <Text style={styles.statusPillText}>{task.completed ? 'Concluída' : task.status === 'revisao' ? 'Em revisão' : task.status === 'desenvolvimento' ? 'Em desenvolvimento' : 'Backlog'}</Text>
      </View>
      <Text style={[styles.title, { color: cores.text }]}>
        {task.title}
      </Text>

      <Text style={[styles.label, { color: cores.textSecondary }]}>Descrição</Text>

      <Text style={[styles.description, { color: cores.text }]}>
        {task.description}
      </Text>

      <View style={[styles.projectBlock, { backgroundColor: cores.surface, borderColor: cores.border }]}>
        <Text style={styles.projectKey}>{task.projectKey}</Text>
        <Text style={[styles.projectName, { color: cores.text }]}>{task.project}</Text>
        <Text style={styles.issueRef}>Issue #{task.issue}</Text>
      </View>

      <View style={styles.infoRow}>
        <CalendarDays size={17} color={cores.textSecondary} />
        <View>
          <Text style={[styles.label, { color: cores.textSecondary }]}>Data</Text>
          <Text style={[styles.value, { color: cores.text }]}>{task.dueDate}</Text>
        </View>
      </View>

      <Text style={[styles.label, { color: cores.textSecondary }]}>Status do fluxo</Text>
      <View style={styles.statusOptions}>
        {(['backlog', 'desenvolvimento', 'revisao', 'concluido'] as TaskStatus[]).map((option) => (
          <Pressable key={option} onPress={() => updateStatus(task.id, option)} style={[styles.statusOption, { backgroundColor: cores.surface, borderColor: cores.border }, task.status === option && { backgroundColor: cores.primary, borderColor: cores.primary }]}>
            <Text style={[styles.statusOptionText, { color: cores.textSecondary }, task.status === option && { color: cores.surface }]}>{option === 'desenvolvimento' ? 'Em dev' : option === 'revisao' ? 'Revisão' : option === 'concluido' ? 'Concluído' : 'Backlog'}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.infoRow}>
        <UserRound size={17} color={cores.textSecondary} />
        <View><Text style={[styles.label, { color: cores.textSecondary }]}>Responsável</Text><Text style={[styles.value, { color: cores.text }]}>{task.assignee}</Text></View>
      </View>

      <View style={styles.gitlabRow}><GitBranch size={16} color={cores.primary} /><Text style={[styles.gitlabText, { color: cores.primary }]}>GitLab · Issue #{task.issue}</Text><ExternalLink size={15} color={cores.primary} /></View>

      <View style={styles.infoRow}>
        <Flag size={17} color={cores.warning} />
        <View>
          <Text style={[styles.label, { color: cores.textSecondary }]}>Prioridade</Text>
          <Text style={[styles.priority, { color: cores.warning }]}>{task.priority}</Text>
        </View>
      </View>

      <View style={styles.button}>
        <Button
          title={task.completed ? 'Reabrir issue' : 'Mover para concluído'}
          onPress={() => updateStatus(task.id, task.completed ? 'desenvolvimento' : 'concluido')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.screenBottom,
  },

  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },

  statusPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primarySoft,
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
    marginTop: spacing.md,
  },

  projectBlock: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.md, marginTop: spacing.md },
  projectKey: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  projectName: { color: colors.text, fontSize: 16, fontWeight: '800', marginTop: spacing.xs },
  issueRef: { color: colors.textSecondary, fontSize: 12, marginTop: spacing.xs },
  gitlabRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.lg },
  gitlabText: { color: colors.primary, fontSize: 13, fontWeight: '700', flex: 1 },
  statusOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statusOption: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 18, paddingHorizontal: spacing.sm, paddingVertical: 7 },
  statusOptionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  statusOptionText: { color: colors.textSecondary, fontSize: 11, fontWeight: '700' },
  statusOptionTextActive: { color: colors.surface },

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
    marginTop: spacing.lg,
  },
});