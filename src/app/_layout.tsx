import { Stack } from 'expo-router';

import { AuthProvider } from '../data/auth-context';
import { TaskProvider } from '../data/task-context';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="(app)"
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
            name="task-details"
            options={{
              title: 'Detalhes da issue',
            }}
          />
        </Stack>
      </TaskProvider>
    </AuthProvider>
  );
}