import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
