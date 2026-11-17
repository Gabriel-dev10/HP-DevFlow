import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { AuthProvider } from '../data/auth-context';
import { TaskProvider } from '../data/task-context';
import { ThemeProvider, useTheme } from '../data/theme-context';
import { useAuth } from '../data/auth-context';

void SplashScreen.preventAutoHideAsync();

function Guarda({ children }: { children: React.ReactNode }) {
  const { usuario, pronto } = useAuth();
  const { pronto: temaPronto } = useTheme();

  useEffect(() => {
    if (pronto && temaPronto) {
      void SplashScreen.hideAsync();
    }
  }, [pronto, temaPronto]);

  if (!pronto || !temaPronto) {
    return null;
  }

  if (!usuario) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <Guarda>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
          </Guarda>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}