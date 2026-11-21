import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../data/theme-context';

export function OfflineBanner() {
  const { cores } = useTheme();
  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: cores.danger }]}
    >
      <Text style={[styles.text, { color: cores.surface }]}>Sem internet no momento</Text>
      <Text style={[styles.subtitle, { color: cores.surface }]}>
        Você ainda pode usar os dados já carregados.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    minHeight: 40,
  },
  text: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },
});
