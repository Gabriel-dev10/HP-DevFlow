import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export function useOnline(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((estado) => {
      setOnline(estado.isConnected !== false);
    });

    return unsubscribe;
  }, []);

  return online;
}
