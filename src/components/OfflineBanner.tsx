import { StyleSheet, Text, View } from 'react-native';

export function OfflineBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>Voce esta offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#D95B58', paddingVertical: 8, alignItems: 'center' },
  text: { color: '#FFFFFF', fontWeight: '700' },
});
