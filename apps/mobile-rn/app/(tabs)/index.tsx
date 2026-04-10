import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../../contexts/AuthContext';
import { UserHeader } from '../../components/UserHeader';

const { width } = Dimensions.get('window');

const GAMES = [
  {
    id: 'tien-len',
    name: 'Tiến Lên',
    description: 'Vietnamese Climbing Card Game',
    emoji: '🃏',
    players: '2-4 players',
    color: ['#1a6b3a', '#0d5c2e'],
    available: true,
  },
  {
    id: 'mau-binh',
    name: 'Mậu Binh',
    description: 'Chinese Poker',
    emoji: '🀄',
    players: '2-4 players',
    color: ['#8b0000', '#5c0000'],
    available: true,
  },
  {
    id: 'phom',
    id: 'phom',
    name: 'Phỏm',
    description: 'Rummy-style Game',
    emoji: '🎴',
    players: '2-4 players',
    color: ['#2c3e50', '#1a252f'],
    available: false,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const handleGamePress = (gameId: string, available: boolean) => {
    if (!available) return;
    router.push(`/lobby?game=${gameId}` as any);
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <LinearGradient colors={['#0d5c2e', '#083d1e', '#0d4d3a']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Header with Currency */}
        <UserHeader showCurrency size="large" />

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back,</Text>
          <Text style={styles.welcomeName}>
            {profile?.displayName || user?.displayName || 'Player'}
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.totalGames || 0}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.totalWins || 0}</Text>
            <Text style={styles.statLabel}>Wins</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile?.leagueTier || 'Bronze'}</Text>
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
          {GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, !game.available && styles.gameCardDisabled]}
              onPress={() => handleGamePress(game.id, game.available)}
              activeOpacity={game.available ? 0.8 : 1}
              disabled={!game.available}
            >
              <LinearGradient
                colors={game.color as [string, string]}
                style={styles.gameCardGradient}
              >
                {!game.available && (
                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>Soon</Text>
                  </View>
                )}
                <Text style={styles.gameEmoji}>{game.emoji}</Text>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameDescription}>{game.description}</Text>
                {game.players && (
                  <View style={styles.playersInfo}>
                    <FontAwesome name="users" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.playersText}>{game.players}</Text>
                  </View>
                )}
                {game.available && (
                  <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>PLAY</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Bonus */}
        <TouchableOpacity style={styles.bonusCard}>
          <LinearGradient
            colors={['#b8860b', '#8b6914']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.bonusGradient}
          >
            <View style={styles.bonusContent}>
              <Text style={styles.bonusEmoji}>🎁</Text>
              <View style={styles.bonusText}>
                <Text style={styles.bonusTitle}>Daily Bonus</Text>
                <Text style={styles.bonusSubtitle}>Claim your free gold!</Text>
              </View>
            </View>
            <View style={styles.bonusButton}>
              <Text style={styles.bonusButtonText}>CLAIM</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Vietnamese Cultural Note */}
        <View style={styles.culturalFooter}>
          <Text style={styles.culturalText}>
            Traditional Vietnamese Rules
          </Text>
          <Text style={styles.culturalSubtext}>
            Authentic gameplay, premium experience
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gameCard: {
    width: (width - 60) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gameCardDisabled: {
    opacity: 0.7,
  },
  gameCardGradient: {
    padding: 16,
    minHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  comingSoonBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  comingSoonText: {
    fontSize: 10,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  gameEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  gameDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 8,
  },
  playersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  playersText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
  playButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 4,
  },
  playButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0d4d3a',
  },
  bonusCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 20,
  },
  bonusGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  bonusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  bonusText: {},
  bonusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  bonusSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  bonusButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bonusButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8b6914',
  },
  culturalFooter: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  culturalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4af37',
  },
  culturalSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
});
