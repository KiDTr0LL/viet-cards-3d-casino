import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { unityBridge } from '../../services/unityBridge';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
};

export default function MauBinhScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { state, enterGame, leaveGame, setBet } = useGame();
  const { updateBalance } = useCurrency();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initGame = async () => {
      try {
        await unityBridge.initialize();
        await enterGame('MAUBINH');
        await updateBalance();
      } catch (error) {
        console.error('Failed to initialize game:', error);
        Alert.alert('Error', 'Failed to load game. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initGame();

    return () => {
      leaveGame();
    };
  }, []);

  const handleBack = () => {
    leaveGame();
    router.back();
  };

  const handleQuickPlay = () => {
    unityBridge.setGameMode('MAUBINH_QUICKPLAY');
  };

  const handleCreateRoom = () => {
    unityBridge.setGameMode('MAUBINH_ROOM');
  };

  if (loading) {
    return (
      <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingEmoji}>🀄</Text>
          <Text style={styles.loadingText}>Loading Mậu Binh...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Mậu Binh</Text>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceText}>🪙 {user?.gold || 0}</Text>
        </View>
      </View>

      {/* Game Mode Selection */}
      <View style={styles.modeSelection}>
        <Text style={styles.sectionTitle}>Choose Your Mode</Text>

        <TouchableOpacity style={[styles.modeCard, styles.quickPlayCard]} onPress={handleQuickPlay}>
          <LinearGradient
            colors={['#1a6b3a', '#0d5c2e']}
            style={styles.modeCardGradient}
          >
            <Text style={styles.modeEmoji}>⚡</Text>
            <Text style={styles.modeName}>Quick Play</Text>
            <Text style={styles.modeDesc}>Jump into a public game</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.modeCard, styles.roomCard]} onPress={handleCreateRoom}>
          <LinearGradient
            colors={['#8b0000', '#5c0000']}
            style={styles.modeCardGradient}
          >
            <Text style={styles.modeEmoji}>🏠</Text>
            <Text style={styles.modeName}>Create Room</Text>
            <Text style={styles.modeDesc}>Play with friends</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Bet Selection */}
      <View style={styles.betSection}>
        <Text style={styles.sectionTitle}>Bet Amount</Text>
        <View style={styles.betOptions}>
          {[100, 500, 1000, 5000].map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.betButton,
                state.currentBet === amount && styles.betButtonActive,
              ]}
              onPress={() => setBet(amount)}
            >
              <Text style={[
                styles.betText,
                state.currentBet === amount && styles.betTextActive,
              ]}>
                {amount} 🪙
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Game Info */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Rules</Text>
        <Text style={styles.infoText}>
          • Arrange 13 cards into 3 limbs (3-5-5)
        </Text>
        <Text style={styles.infoText}>
          • Front < Middle < Back (no fouls)
        </Text>
        <Text style={styles.infoText}>
          • Special hands: Dragon, 6 Pairs, Scoop
        </Text>
        <Text style={styles.infoText}>
          • Compare each limb against opponents
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: { fontSize: 80, marginBottom: 20 },
  loadingText: { color: '#fff', fontSize: 18, fontWeight: '600' },
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
  modeSelection: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { color: THEME.secondary, fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  modeCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 12, elevation: 4 },
  modeCardGradient: { padding: 20, alignItems: 'center' },
  modeEmoji: { fontSize: 40, marginBottom: 8 },
  modeName: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  modeDesc: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12 },
  betSection: { paddingHorizontal: 20, marginBottom: 20 },
  betOptions: { flexDirection: 'row', justifyContent: 'space-around' },
  betButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  betButtonActive: { backgroundColor: THEME.secondary },
  betText: { color: '#d4af37', fontWeight: 'bold' },
  betTextActive: { color: THEME.primary },
  infoSection: { paddingHorizontal: 20, paddingBottom: 20 },
  infoTitle: { color: THEME.secondary, fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  infoText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 12, marginBottom: 4 },
});
