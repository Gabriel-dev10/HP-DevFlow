import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Plus } from 'lucide-react-native';

import { colors, spacing } from '../theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  icon?: 'plus' | 'none';
};

export function Button({ title, onPress, icon = 'none' }: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.content}>
        {icon === 'plus' && <Plus size={18} color={colors.surface} />}
      <Text style={styles.text}>{title}</Text>
      </View>
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