import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TaskCard } from '../../components/TaskCard';
import { tasks } from '../../data/tasks';
import { colors, spacing } from '../../theme';

type Filter = 'todas' | 'pendentes' | 'concluidas';

export default function TasksScreen() {
  const [filter, setFilter] = useState<Filter>('todas');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pendentes') {
      return !task.completed;
    }

    if (filter === 'concluidas') {
      return task.completed;
    }

    return true;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas tarefas</Text>

      <Text style={styles.subtitle}>
        Organize suas atividades de estudo.
      </Text>

      <View style={styles.filters}>
        <FilterButton
          title="Todas"
          active={filter === 'todas'}
          onPress={() => setFilter('todas')}
        />

        <FilterButton
          title="Pendentes"
          active={filter === 'pendentes'}
          onPress={() => setFilter('pendentes')}
        />

        <FilterButton
          title="Concluídas"
          active={filter === 'concluidas'}
          onPress={() => setFilter('concluidas')}
        />
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

type FilterButtonProps = {
  title: string;
  active: boolean;
  onPress: () => void;
};

function FilterButton({
  title,
  active,
  onPress,
}: FilterButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterButton,
        active && styles.filterButtonActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {title}
      </Text>
    </Pressable>
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
    marginBottom: spacing.md,
  },

  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },

  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  filterText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },

  filterTextActive: {
    color: colors.surface,
  },

  list: {
    paddingBottom: spacing.xl,
  },
});
