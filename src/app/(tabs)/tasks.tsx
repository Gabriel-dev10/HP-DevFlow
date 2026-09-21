import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CircleDot, Filter, Plus } from 'lucide-react-native';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';
import { TaskStatus } from '../../types/task';

type FilterType = 'todas' | TaskStatus;

const statusLabels: Record<FilterType, string> = {
  todas: 'Todas',
  backlog: 'Backlog',
  desenvolvimento: 'Em dev',
  revisao: 'Revisão',
  concluido: 'Concluídas',
};

export default function IssuesScreen() {
  const [filter, setFilter] = useState<FilterType>('todas');
  const { tasks } = useTasks();
  const router = useRouter();
  const filteredTasks = filter === 'todas' ? tasks : tasks.filter((task) => task.status === filter);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View><Text style={styles.eyebrow}>DEMANDAS DE DESENVOLVIMENTO</Text><Text style={styles.title}>Issues</Text></View>
        <Filter size={21} color={colors.textSecondary} />
      </View>
      <Text style={styles.subtitle}>Acompanhe as issues atribuídas ao seu time.</Text>

      <View style={styles.filters}>
        {(Object.keys(statusLabels) as FilterType[]).map((option) => (
          <Pressable key={option} onPress={() => setFilter(option)} style={[styles.filterButton, filter === option && styles.filterButtonActive]}>
            <Text style={[styles.filterText, filter === option && styles.filterTextActive]}>{statusLabels[option]}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.newButton} onPress={() => router.push('/new-task')}>
        <Plus size={18} color={colors.surface} /><Text style={styles.newButtonText}>Nova demanda</Text>
      </Pressable>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [styles.issueCard, pressed && styles.pressed]} onPress={() => router.push({ pathname: '/task-details', params: { taskId: item.id } })}>
            <View style={styles.issueHeader}><Text style={styles.issueNumber}>#{item.issue}</Text><Text style={styles.project}>{item.projectKey}</Text><Text style={[styles.priority, item.priority === 'alta' && styles.highPriority]}>{item.priority}</Text></View>
            <View style={styles.issueTitleRow}><CircleDot size={18} color={item.status === 'concluido' ? colors.success : colors.primary} /><Text style={styles.issueTitle}>{item.title}</Text></View>
            <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            <View style={styles.issueFooter}><Text style={styles.assignee}>{item.assignee}</Text><Text style={styles.dueDate}>Prazo {item.dueDate}</Text></View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma issue neste status.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.screen, paddingTop: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.7 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: spacing.xs },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.md },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  filterButton: { paddingVertical: 7, paddingHorizontal: spacing.sm, borderRadius: 18, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  filterButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { color: colors.textSecondary, fontSize: 12, fontWeight: '700' },
  filterTextActive: { color: colors.surface },
  newButton: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 11, padding: spacing.md, marginBottom: spacing.md },
  newButtonText: { color: colors.surface, fontWeight: '800' },
  list: { paddingBottom: spacing.screenBottom },
  issueCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, padding: spacing.md, marginBottom: spacing.sm },
  pressed: { opacity: 0.75 },
  issueHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  issueNumber: { color: colors.primary, fontSize: 12, fontWeight: '800' },
  project: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', flex: 1 },
  priority: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  highPriority: { color: colors.danger },
  issueTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  issueTitle: { color: colors.text, fontSize: 15, fontWeight: '800', flex: 1 },
  description: { color: colors.textSecondary, fontSize: 13, lineHeight: 18, marginTop: spacing.sm },
  issueFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.md, paddingTop: spacing.sm },
  assignee: { color: colors.text, fontSize: 12, fontWeight: '600' },
  dueDate: { color: colors.textSecondary, fontSize: 12 },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
