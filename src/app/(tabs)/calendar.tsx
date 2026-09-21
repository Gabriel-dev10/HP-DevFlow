import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FolderKanban, GitBranch } from 'lucide-react-native';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';

export default function ProjectsScreen() {
  const { tasks } = useTasks();
  const projects = Array.from(new Map(tasks.map((task) => [task.project, task])).values());

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>ORGANIZAÇÃO</Text>
      <Text style={styles.title}>Projetos</Text>
      <Text style={styles.subtitle}>Visão geral dos projetos do seu time.</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.project}
        renderItem={({ item }) => {
          const projectTasks = tasks.filter((task) => task.project === item.project);
          const done = projectTasks.filter((task) => task.completed).length;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.icon}><FolderKanban size={19} color={colors.primary} /></View>
                <View style={styles.copy}><Text style={styles.key}>{item.projectKey}</Text><Text style={styles.project}>{item.project}</Text></View>
                <Text style={styles.count}>{projectTasks.length} issues</Text>
              </View>
              <View style={styles.progressTrack}><View style={[styles.progress, { width: `${projectTasks.length ? (done / projectTasks.length) * 100 : 0}%` }]} /></View>
              <View style={styles.footer}><Text style={styles.meta}><GitBranch size={13} color={colors.textSecondary} /> {projectTasks.filter((task) => !task.completed).length} abertas</Text><Text style={styles.meta}>{done}/{projectTasks.length} concluídas</Text></View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum projeto associado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.screen, paddingTop: spacing.md },
  eyebrow: { color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: spacing.xs },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, padding: spacing.md, marginBottom: spacing.sm },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  icon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, marginLeft: spacing.sm },
  key: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  project: { color: colors.text, fontSize: 15, fontWeight: '800', marginTop: 2 },
  count: { color: colors.textSecondary, fontSize: 11 },
  progressTrack: { height: 7, backgroundColor: colors.border, borderRadius: 4, overflow: 'hidden', marginTop: spacing.md },
  progress: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm },
  meta: { color: colors.textSecondary, fontSize: 11 },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl },
});
