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
        </Stack>
      </TaskProvider>
    </AuthProvider>
  );
}