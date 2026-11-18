import { Stack } from 'expo-router';
import { useTheme } from '../../data/theme-context';

export default function AppLayout() {
  const { cores } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: cores.surface,
        },
        headerTintColor: cores.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: cores.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ title: 'Detalhes do usuário' }} />
      <Stack.Screen name="task-details" options={{ title: 'Detalhes da issue' }} />
      <Stack.Screen name="new-task" options={{ title: 'Nova demanda' }} />
    </Stack>
  );
}