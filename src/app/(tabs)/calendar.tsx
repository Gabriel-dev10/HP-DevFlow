import { FlatList, StyleSheet, Text, View } from 'react-native';
import { FolderKanban, GitBranch } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';
import { useTheme } from '../../data/theme-context';

export default function ProjectsScreen() {
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();
  const { tasks } = useTasks();
  const projects = Array.from(new Map(tasks.map((task) => [task.project, task])).values());

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cores.background,
          paddingTop: Math.max(insets.top, spacing.md),
        },
      ]}
    >
      <Text style={[styles.eyebrow, { color: cores.primary }]}>ORGANIZAÇÃO</Text>
      <Text style={[styles.title, { color: cores.text }]}>Projetos</Text>
      <Text style={[styles.subtitle, { color: cores.textSecondary }]}>
        Visão geral dos projetos do seu time.
      </Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.project}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Math.max(insets.bottom, spacing.screenBottom) },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const projectTasks = tasks.filter((task) => task.project === item.project);
          const done = projectTasks.filter((task) => task.completed).length;
          return (
            <View
              style={[
                styles.card,
                { backgroundColor: cores.surface, borderColor: cores.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.icon, { backgroundColor: cores.primarySoft }]}>
                  <FolderKanban size={19} color={cores.primary} />
                </View>
                <View style={styles.copy}>
                  <Text style={[styles.key, { color: cores.primary }]}>{item.projectKey}</Text>
                  <Text
                    style={[styles.project, { color: cores.text }]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.project}
                  </Text>
                </View>
                <Text style={[styles.count, { color: cores.textSecondary }]}>
                  {projectTasks.length} issues
                </Text>
              </View>
              <View style={[styles.progressTrack, { backgroundColor: cores.border }]}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${projectTasks.length ? (done / projectTasks.length) * 100 : 0}%`,
                      backgroundColor: cores.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.footer}>
                <Text style={[styles.meta, { color: cores.textSecondary }]}>
                  <GitBranch size={13} color={cores.textSecondary} />{' '}
                  {projectTasks.filter((task) => !task.completed).length} abertas
                </Text>
                <Text style={[styles.meta, { color: cores.textSecondary }]}>
                  {done}/{projectTasks.length} concluídas
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: cores.textSecondary }]}>
            Nenhum projeto associado.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
  },
  list: {
    paddingBottom: spacing.screenBottom,
  },
  eyebrow: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    marginTop: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  key: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  project: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 2,
  },
  count: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  progressTrack: {
    height: 7,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: spacing.md,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  empty: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: 15,
  },
});
