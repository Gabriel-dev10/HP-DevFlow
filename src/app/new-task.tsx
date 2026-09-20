import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Button } from '../components/Button';
import { colors, spacing } from '../theme';

export default function NewTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  function handleCreateTask() {
    console.log({
      title,
      description,
    });
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
});