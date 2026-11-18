import { Tabs } from 'expo-router';
import {
  BarChart3,
  CalendarDays,
  Home,
  ListTodo,
  UserRound,
} from 'lucide-react-native';

import { useTheme } from '../../data/theme-context';

export default function TabsLayout() {
  const { cores } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.primary,
        tabBarInactiveTintColor: cores.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: cores.surface,
          borderTopColor: cores.border,
          height: 72,
          paddingTop: 5,
          paddingBottom: 7,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Issues',
          tabBarIcon: ({ color, size }) => <ListTodo color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Projetos',
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Atividades',
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
