import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
};

export default function MauBinhScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mậu Binh</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>🪙 {user?.gold || 0}</Text>
        </View>
      </View>

      {/* Game Area Placeholder */}
      <View style={styles.gameArea}>
        <Text style={styles.placeholderText}>🀄</Text>
        <Text style={styles.placeholderTitle}>Game Table</Text>
        <Text style={styles.placeholderSubtext}>
          Unity 3D game view will load here
        </Text>
      </View>

      {/* Game Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlButton, styles.playButton]}>
          <Text style={styles.controlButtonText}>Play Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.settingsButton]}>
          <Text style={styles.controlButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  backButton: { color: THEME.secondary, fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  balanceContainer: { padding: 8, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 12 },
  balanceText: { color: '#d4af37', fontWeight: 'bold' },
  gameArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 80, marginBottom: 20 },
  placeholderTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  placeholderSubtext: { color: 'rgba(255, 255, 255, 0.6)', fontSize: 14, textAlign: 'center' },
  controls: { flexDirection: 'row', justifyContent: 'center', gap: 20, padding: 20 },
  controlButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  playButton: { backgroundColor: THEME.secondary },
  settingsButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  controlButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
