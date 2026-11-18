import { Redirect } from 'expo-router';
import type { Href } from 'expo-router';

import { useAuth } from '../data/auth-context';

export default function LegacyHomeRedirect() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Redirect href={'/login' as Href} />;
  }

  return <Redirect href={'/(tabs)' as Href} />;
}