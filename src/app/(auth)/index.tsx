import { Redirect } from 'expo-router';
import type { Href } from 'expo-router';

export default function LegacyAuthRedirect() {
  return <Redirect href={'/login' as Href} />;
}