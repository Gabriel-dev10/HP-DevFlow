import { useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { TaskCard } from '../../components/TaskCard';
import { useTasks } from '../../data/task-context';
import { colors, spacing } from '../../theme';
import { useRouter } from 'expo-router';
import { ListFilter, Plus } from 'lucide-react-native';

type Filter = 'todas' | 'pendentes' | 'concluidas';

export default function TasksScreen() {
  const [filter, setFilter] = useState<Filter>('todas');
  const { tasks } = useTasks();
  const router = useRouter();

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
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>SEU PLANEJAMENTO</Text>
          <Text style={styles.title}>Tarefas</Text>
        </View>
        <ListFilter size={22} color={colors.textSecondary} />
      </View>

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

      <Pressable
        style={styles.newTaskButton}
        onPress={() => router.push('/new-task')}
      >
        <Plus size={18} color={colors.surface} />
        <Text style={styles.newTaskButtonText}>Nova tarefa</Text>
      </Pressable>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Nenhuma tarefa nesta categoria.
          </Text>
        }
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
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
  },

  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '700',
  },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.xs },
  eyebrow: { color: colors.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },

  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
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

  newTaskButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  newTaskButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: '700',
  },

  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
