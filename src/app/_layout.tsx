import { Stack } from 'expo-router';

import { TaskProvider } from '../data/task-context';

export default function RootLayout() {
  return (
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
  );
}