import { Redirect, Stack } from 'expo-router';

import { useAuth } from '../../data/auth-context';

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="new-task"
        options={{
          title: 'Nova demanda',
        }}
      />
      <Stack.Screen
        name="tasks/[id]"
        options={{
          title: 'Detalhes da issue',
        }}
      />
    </Stack>
  );
}
