import { Redirect } from 'expo-router';
import type { Href } from 'expo-router';

export default function LegacyAppRedirect() {
  return <Redirect href={'/(tabs)' as Href} />;
}
