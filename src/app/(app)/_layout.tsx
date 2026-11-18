import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ title: 'Detalhes do usuario' }} />
      <Stack.Screen name="task-details" options={{ title: 'Detalhes da issue' }} />
      <Stack.Screen name="new-task" options={{ title: 'Nova demanda' }} />
    </Stack>
  );
}