import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import CurrencyDisplay from '../components/CurrencyDisplay';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
};

export default function LobbyScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    // Simulate loading rooms
    setTimeout(() => {
      setRooms([
        { id: '1', game: 'Tiến Lên', host: 'DragonKing', players: '2/4', bet: '500', status: 'Waiting' },
        { id: '2', game: 'Mậu Binh', host: 'PhoenixQueen', players: '3/4', bet: '1000', status: 'Playing' },
        { id: '3', game: 'Tiến Lên', host: 'TigerStrike', players: '1/4', bet: '200', status: 'Waiting' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
        <ActivityIndicator size="large" color={THEME.secondary} />
        <Text style={styles.loadingText}>Loading lobby...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Game Lobby</Text>
        <View style={styles.balanceContainer}>
          <CurrencyDisplay gold={user?.gold || 0} diamonds={user?.diamonds || 0} size="small" />
        </View>
      </View>

      {/* Quick Play Button */}
      <TouchableOpacity style={styles.quickPlayButton}>
        <LinearGradient
          colors={['#d4af37', '#b8860b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.quickPlayGradient}
        >
          <Text style={styles.quickPlayText}>⚡ Quick Play</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Available Rooms */}
      <View style={styles.roomsSection}>
        <Text style={styles.sectionTitle}>Available Rooms</Text>
        {rooms.map((room) => (
          <View key={room.id} style={styles.roomCard}>
            <View style={styles.roomInfo}>
              <Text style={styles.roomGame}>{room.game}</Text>
              <Text style={styles.roomHost}>Host: {room.host}</Text>
              <View style={styles.roomMeta}>
                <Text style={styles.roomPlayers}>{room.players} players</Text>
                <Text style={styles.roomBet}>Bet: {room.bet} 🪙</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Join</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  balanceContainer: { padding: 8, backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: 12 },
  loadingText: { color: 'rgba(255, 255, 255, 0.7)', marginTop: 10, textAlign: 'center' },
  quickPlayButton: { margin: 20, borderRadius: 16, overflow: 'hidden' },
  quickPlayGradient: { padding: 20, alignItems: 'center' },
  quickPlayText: { fontSize: 18, fontWeight: 'bold', color: '#0d4d3a' },
  roomsSection: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: THEME.secondary, marginBottom: 12 },
  roomCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomInfo: { flex: 1 },
  roomGame: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  roomHost: { fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 6 },
  roomMeta: { flexDirection: 'row', gap: 12 },
  roomPlayers: { fontSize: 11, color: 'rgba(255, 255, 255, 0.6)' },
  roomBet: { fontSize: 11, color: '#d4af37' },
  joinButton: {
    backgroundColor: THEME.secondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinButtonText: { color: THEME.primary, fontWeight: 'bold', fontSize: 14 },
});
