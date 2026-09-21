import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../../theme';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, estudante! 👋</Text>

      <Text style={styles.title}>Seu progresso hoje</Text>

      <View style={styles.progressCard}>
        <Text style={styles.progressValue}>75%</Text>

        <Text style={styles.progressLabel}>
          das tarefas concluídas
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Próxima tarefa</Text>

      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>
          Estudar Engenharia de Software
        </Text>

        <Text style={styles.taskDescription}>
          Revisar os conteúdos da disciplina.
        </Text>

        <Text style={styles.taskDate}>Hoje • Prioridade alta</Text>
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
});
