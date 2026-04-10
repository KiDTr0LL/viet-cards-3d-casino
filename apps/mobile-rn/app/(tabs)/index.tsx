import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import CurrencyDisplay from '../components/CurrencyDisplay';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
  text: '#f5f5f0',
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { state } = useGame();

  const games = [
    {
      id: 'tien-len',
      name: 'Tiến Lên',
      description: 'Vietnamese Climbing Card Game',
      emoji: '🃏',
      route: '/game/tienlen',
      color: ['#1a6b3a', '#0d5c2e'],
      available: true,
    },
    {
      id: 'mau-binh',
      name: 'Mậu Binh',
      description: 'Chinese Poker',
      emoji: '🀄',
      route: '/game/maubinh',
      color: ['#8b0000', '#5c0000'],
      available: true,
    },
  ];

  return (
    <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
      {/* Header with User Info */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{user?.displayName?.[0].toUpperCase() || 'P'}</Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userName}>{user?.displayName || 'Player'}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.balanceButton}
          onPress={() => router.push('/profile')}
        >
          <CurrencyDisplay gold={user?.gold || 0} diamonds={user?.diamonds || 0} size="small" />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.totalGames || 0}</Text>
          <Text style={styles.statLabel}>Games</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.totalWins || 0}</Text>
          <Text style={styles.statLabel}>Wins</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{user?.leagueTier || 'BRONZE'}</Text>
          <Text style={styles.statLabel}>Rank</Text>
        </View>
      </View>

      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Choose Your Game</Text>
        <View style={styles.sectionLine} />
      </View>

      {/* Game Cards */}
      <View style={styles.gamesGrid}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { backgroundColor: game.color[0] }]}
            onPress={() => router.push(game.route as any)}
            disabled={!game.available}
          >
            <LinearGradient
              colors={game.color as [string, string]}
              style={styles.gameCardGradient}
            >
              <Text style={styles.gameEmoji}>{game.emoji}</Text>
              <Text style={styles.gameName}>{game.name}</Text>
              <Text style={styles.gameDescription}>{game.description}</Text>
              <View style={styles.playButton}>
                <Text style={styles.playButtonText}>PLAY</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.bottomButton, styles.storeButton]}
          onPress={() => router.push('/store')}
        >
          <Text style={styles.bottomButtonText}>🛒 Store</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.bottomButton, styles.profileButton]}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.bottomButtonText}>👤 Profile</Text>
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
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  userDetails: { marginLeft: 12 },
  welcomeText: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)' },
  userName: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  balanceButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: 'bold', color: THEME.secondary },
  statLabel: { fontSize: 11, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginHorizontal: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginRight: 12 },
  sectionLine: { flex: 1, height: 1, backgroundColor: 'rgba(212, 175, 55, 0.3)' },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  gameCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gameCardGradient: {
    padding: 16,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameEmoji: { fontSize: 40, marginBottom: 8 },
  gameName: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4, textAlign: 'center' },
  gameDescription: { fontSize: 11, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 8 },
  playButton: {
    backgroundColor: THEME.secondary,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  playButtonText: { fontSize: 12, fontWeight: 'bold', color: THEME.primary },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  bottomButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  storeButton: { backgroundColor: THEME.secondary },
  profileButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  bottomButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
});
