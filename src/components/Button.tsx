import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, spacing } from '../theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export function Button({ title, onPress }: ButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },

  text: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});