import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />

      <Stack.Screen
        name="tasks"
        options={{
          title: 'Tarefas',
        }}
      />

      <Stack.Screen
        name="calendar"
        options={{
          title: 'Agenda',
        }}
      />

      <Stack.Screen
        name="statistics"
        options={{
          title: 'Estatísticas',
        }}
      />

      <Stack.Screen
        name="profile"
        options={{
          title: 'Perfil',
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