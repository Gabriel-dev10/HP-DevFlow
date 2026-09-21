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
import { AlignLeft, CalendarDays, Flag } from 'lucide-react-native';

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('22/09/2026');
  const [project, setProject] = useState('Sistema Interno HP');
  const [assignee, setAssignee] = useState('Gabriel Silva');
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
      dueDate: date.trim(),
      priority,
      project: project.trim(),
      projectKey: project.trim().split(' ').map((word) => word[0]).join('').toUpperCase(),
      assignee: assignee.trim(),
    });
    router.replace('/(tabs)/tasks');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>CRIAR</Text>
      <Text style={styles.title}>Nova demanda</Text>

      <View style={styles.labelRow}><AlignLeft size={16} color={colors.textSecondary} /><Text style={styles.label}>Título</Text></View>

      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Ex.: Corrigir validação do formulário"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />

      <View style={styles.labelRow}><AlignLeft size={16} color={colors.textSecondary} /><Text style={styles.label}>Descrição</Text></View>

      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Descreva a demanda técnica"
        placeholderTextColor={colors.textSecondary}
        multiline
        style={[styles.input, styles.textArea]}
      />

      <View style={styles.labelRow}><CalendarDays size={16} color={colors.textSecondary} /><Text style={styles.label}>Data</Text></View>

      <TextInput
        value={date}
        onChangeText={setDate}
        placeholder="Ex.: 25/09/2026"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />

      <Text style={styles.label}>Projeto</Text>
      <TextInput
        value={project}
        onChangeText={setProject}
        placeholder="Ex.: Sistema Interno HP"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />

      <Text style={styles.label}>Responsável</Text>
      <TextInput
        value={assignee}
        onChangeText={setAssignee}
        placeholder="Ex.: Gabriel Silva"
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
      />

      <View style={styles.labelRow}><Flag size={16} color={colors.textSecondary} /><Text style={styles.label}>Prioridade</Text></View>

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
        title="Criar demanda"
        onPress={handleCreateTask}
        icon="plus"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.md,
    paddingBottom: spacing.screenBottom,
  },

  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.md,
  },

  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, marginBottom: spacing.xs },

  label: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },

  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text,
    marginBottom: spacing.md,
  },

  textArea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },

  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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