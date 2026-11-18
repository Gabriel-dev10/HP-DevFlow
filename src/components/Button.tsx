import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';

import { colors, spacing } from '../theme';
import { useTheme } from '../data/theme-context';

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: 'plus' | 'none';
};

export function Button({ title, onPress, icon = 'none' }: ButtonProps) {
  const { cores } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [styles.button, { backgroundColor: cores.primary }, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon === 'plus' && <Plus size={18} color={cores.surface} />}
      <Text style={[styles.text, { color: cores.surface }]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  pressed: {
    opacity: 0.8,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  text: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});