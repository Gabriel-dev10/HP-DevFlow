import { useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '../components/Button';
import { useTasks } from '../data/task-context';
import { colors, spacing } from '../theme';
import { TaskPriority } from '../types/task';
import { useRouter } from 'expo-router';

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('21/09/2026');
  const [priority, setPriority] = useState<TaskPriority>('media');
  const { addTask } = useTasks();
  const router = useRouter();

  function handleCreateTask() {
    if (!title.trim() || !description.trim() || !date.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha título, descrição e data.');
      return;
    }

    addTask({
      title: title.trim(),
      description: description.trim(),
      date: date.trim(),
      priority,
    });
    router.replace('/(tabs)/tasks');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Nova tarefa
      </Text>

      <Text style={styles.label}>
        Título
      </Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ex.: Estudar para a prova"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />

      <Text style={styles.label}>
        Descrição
      </Text>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva sua tarefa"
        placeholderTextColor={colors.textSecondary}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <Text style={styles.label}>Data</Text>

      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="Ex.: 25/09/2026"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />

      <Text style={styles.label}>Prioridade</Text>

      <View style={styles.priorityRow}>
        {(['baixa', 'media', 'alta'] as TaskPriority[]).map((option) => (
          <Pressable
            key={option}
            onPress={() => setPriority(option)}
            style={[styles.priorityButton, priority === option && styles.priorityButtonActive]}
          >
            <Text style={[styles.priorityText, priority === option && styles.priorityTextActive]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button
        title="Adicionar tarefa"
        onPress={handleCreateTask}
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
    marginBottom: spacing.lg,
  },

  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    marginBottom: spacing.lg,
  },

  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },

  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },

  priorityButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },

  priorityButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  priorityText: {
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  priorityTextActive: {
    color: colors.surface,
  },
});