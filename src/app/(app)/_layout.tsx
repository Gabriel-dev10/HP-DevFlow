import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';

import { useAuth } from '../../data/auth-context';

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="task-details" options={{ title: 'Detalhes da issue' }} />
      <Stack.Screen name="new-task" options={{ title: 'Nova demanda' }} />
    </Stack>
  );
}