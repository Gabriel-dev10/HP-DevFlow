import { Redirect, Stack, useSegments } from 'expo-router';
import type { Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '../data/auth-context';
import { TaskProvider } from '../data/task-context';
import { ThemeProvider, useTheme } from '../data/theme-context';

void SplashScreen.preventAutoHideAsync();

function StatusBarDoTema() {
  const { tema } = useTheme();
  return <StatusBar style={tema === 'escuro' ? 'light' : 'dark'} />;
}

function Guarda({ children }: { children: React.ReactNode }) {
  const { usuario, pronto } = useAuth();
  const { pronto: temaPronto } = useTheme();
  const segmentos = useSegments();

  useEffect(() => {
    if (pronto && temaPronto) {
      void SplashScreen.hideAsync();
    }
  }, [pronto, temaPronto]);

  if (!pronto || !temaPronto) {
    return null;
  }

  if (!usuario) {
    const primeiraRota = segmentos[0];
    if (primeiraRota !== 'login' && primeiraRota !== '(auth)') {
      return <Redirect href={'/login' as Href} />;
    }
    return <>{children}</>;
  }

  if (segmentos[0] === 'login' || segmentos[0] === '(auth)') {
    return <Redirect href={'/' as Href} />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBarDoTema />
      <AuthProvider>
        <TaskProvider>
          <Guarda>
            <Stack>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(app)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
            </Stack>
          </Guarda>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}