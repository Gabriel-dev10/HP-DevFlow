import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../components/Button';
import { colors, spacing } from '../theme';

export default function TaskDetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Estudar Engenharia de Software
      </Text>

      <Text style={styles.label}>Descrição</Text>

      <Text style={styles.description}>
        Revisar os conteúdos da disciplina e preparar o
        material para a próxima aula.
      </Text>

      <Text style={styles.label}>Data</Text>

      <Text style={styles.value}>
        20/09/2026
      </Text>

      <Text style={styles.label}>Prioridade</Text>

      <Text style={styles.priority}>
        Alta
      </Text>

      <View style={styles.button}>
        <Button
          title="Marcar como concluída"
          onPress={() => {}}
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

  button: {
    marginTop: spacing.xl,
  },
});