import { FlatList, StyleSheet, Text, View } from 'react-native';

import { TaskCard } from '../components/TaskCard';
import { tasks } from '../data/tasks';
import { colors, spacing } from '../theme';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas tarefas</Text>

      <Text style={styles.subtitle}>
        Organize suas atividades de estudo.
      </Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },

  list: {
    paddingBottom: spacing.xl,
  },
});