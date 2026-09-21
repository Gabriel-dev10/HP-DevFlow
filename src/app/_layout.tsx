import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="task-details"
        options={{
          title: 'Detalhes da tarefa',
        }}
      />

      <Stack.Screen
        name="new-task"
        options={{
          title: 'Nova tarefa',
        }}
      />
    </Stack>
  );
}