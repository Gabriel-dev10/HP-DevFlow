import { Redirect, Stack, useSegments } from 'expo-router';
import type { Href } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';

import { AuthProvider, useAuth } from '../data/auth-context';
import { TaskProvider } from '../data/task-context';
import { ThemeProvider, useTheme } from '../data/theme-context';
import { OfflineBanner } from '../components/OfflineBanner';
import { useOnline } from '../hooks/useOnline';

void SplashScreen.preventAutoHideAsync();

function StatusBarDoTema() {
  const { tema } = useTheme();
  return <StatusBar style={tema === 'escuro' ? 'light' : 'dark'} />;
}

function Guarda({ children }: { children: React.ReactNode }) {
  const { usuario, pronto } = useAuth();
  const { pronto: temaPronto } = useTheme();
  const segmentos = useSegments();
  const online = useOnline();

  useEffect(() => {
    if (pronto && temaPronto) {
      void SplashScreen.hideAsync();
    }
  }, [pronto, temaPronto]);

  if (!pronto || !temaPronto) {
    return null;
  }

  const conteudo = (
    <View style={{ flex: 1 }}>
      {!online && <OfflineBanner />}
      {children}
    </View>
  );

  if (!usuario) {
    const primeiraRota = segmentos[0];
    if (primeiraRota !== 'login' && primeiraRota !== '(auth)') {
      return <Redirect href={'/login' as Href} />;
    }
    return conteudo;
  }

  if (segmentos[0] === 'login' || segmentos[0] === '(auth)') {
    return <Redirect href={'/' as Href} />;
  }

  return conteudo;
}

function RootStack() {
  const { cores } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: cores.background },
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBarDoTema />
      <AuthProvider>
        <TaskProvider>
          <Guarda>
            <RootStack />
          </Guarda>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}