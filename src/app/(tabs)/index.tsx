import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Clock3,
  GitBranch,
  Plus,
} from 'lucide-react-native';

import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';

const statusLabels = {
  backlog: 'Backlog',
  desenvolvimento: 'Em desenvolvimento',
  revisao: 'Em revisão',
  concluido: 'Concluído',
};

export default function HomeScreen() {
  const router = useRouter();
  const { tasks } = useTasks();
  const completed = tasks.filter((task) => task.completed).length;
  const inProgress = tasks.filter((task) => task.status === 'desenvolvimento').length;
  const dueSoon = tasks.filter((task) => !task.completed).slice(0, 2);
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>HP DEVFLOW</Text>
          <Text style={styles.greeting}>Bom dia, Gabriel</Text>
        </View>
        <View style={styles.avatar}>
          <Image source={require('../../../assets/images/images.png')} style={styles.brandMark} />
        </View>
      </View>

      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Acompanhe suas entregas de hoje.</Text>
        </View>
        <Pressable style={styles.addButton} onPress={() => router.push('/new-task')}>
          <Plus size={19} color={colors.surface} />
        </Pressable>
      </View>

      <View style={styles.metricsRow}>
        <Metric value={String(tasks.length)} label="Issues atribuídas" icon={<GitBranch size={18} color={colors.primary} />} />
        <Metric value={String(inProgress)} label="Em desenvolvimento" icon={<Clock3 size={18} color={colors.warning} />} />
        <Metric value={`${progress}%`} label="Entregas concluídas" icon={<CheckCircle2 size={18} color={colors.success} />} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Próximas entregas</Text>
        <Pressable onPress={() => router.push('/(tabs)/tasks')}><Text style={styles.link}>Ver todas</Text></Pressable>
      </View>

      {dueSoon.map((task) => (
        <Pressable
          key={task.id}
          onPress={() => router.push({ pathname: '/task-details', params: { taskId: task.id } })}
          style={({ pressed }) => [styles.issueCard, pressed && styles.pressed]}
        >
          <View style={styles.issueMain}>
            <View style={styles.issueIcon}><CircleDot size={18} color={colors.primary} /></View>
            <View style={styles.issueCopy}>
              <Text style={styles.issueId}>#{task.issue} · {task.projectKey}</Text>
              <Text style={styles.issueTitle}>{task.title}</Text>
              <Text style={styles.issueMeta}>{task.assignee} · prazo {task.dueDate}</Text>
            </View>
          </View>
          <View style={styles.issueFooter}>
            <Text style={styles.status}>{statusLabels[task.status]}</Text>
            <ArrowRight size={17} color={colors.textSecondary} />
          </View>
        </Pressable>
      ))}

      <View style={styles.progressPanel}>
        <View style={styles.progressHeader}><Text style={styles.sectionTitle}>Progresso do ciclo</Text><Text style={styles.progressValue}>{progress}%</Text></View>
        <View style={styles.progressTrack}><View style={[styles.progressBar, { width: `${progress}%` }]} /></View>
        <Text style={styles.progressHint}>{completed} de {tasks.length} issues concluídas no ciclo atual</Text>
      </View>
    </ScrollView>
  );
}

function Metric({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return <View style={styles.metric}><View style={styles.metricIcon}>{icon}</View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, paddingHorizontal: spacing.screen, paddingTop: spacing.md, paddingBottom: spacing.screenBottom },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  greeting: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing.xs },
  avatar: { width: 40, height: 40, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  brandMark: { width: 40, height: 40, resizeMode: 'cover' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { color: colors.text, fontSize: 30, fontWeight: '800' },
  subtitle: { color: colors.textSecondary, fontSize: 14, marginTop: spacing.xs },
  addButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  metricsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  metric: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: spacing.sm },
  metricIcon: { marginBottom: spacing.sm },
  metricValue: { color: colors.text, fontSize: 20, fontWeight: '800' },
  metricLabel: { color: colors.textSecondary, fontSize: 11, lineHeight: 15, marginTop: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  link: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  issueCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 13, padding: spacing.md, marginBottom: spacing.sm },
  pressed: { opacity: 0.76 },
  issueMain: { flexDirection: 'row', alignItems: 'flex-start' },
  issueIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
  issueCopy: { flex: 1 },
  issueId: { color: colors.primary, fontSize: 11, fontWeight: '800' },
  issueTitle: { color: colors.text, fontSize: 15, fontWeight: '700', marginTop: 3 },
  issueMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 6 },
  issueFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: colors.border, marginTop: spacing.sm, paddingTop: spacing.sm },
  status: { color: colors.warning, fontSize: 12, fontWeight: '700' },
  progressPanel: { backgroundColor: colors.primarySoft, borderRadius: 13, padding: spacing.md, marginTop: spacing.md },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressValue: { color: colors.primary, fontWeight: '800' },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.primaryMuted, marginTop: spacing.md, overflow: 'hidden' },
  progressBar: { height: '100%', borderRadius: 4, backgroundColor: colors.primary },
  progressHint: { color: colors.primaryDark, fontSize: 12, marginTop: spacing.sm },
});
