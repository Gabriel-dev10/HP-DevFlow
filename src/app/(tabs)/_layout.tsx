import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tarefas',
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Agenda',
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Estatísticas',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
        }}
      />
    </Tabs>
  );
}
