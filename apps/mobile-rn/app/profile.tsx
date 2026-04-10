import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '../services/api';
import CurrencyDisplay from '../components/CurrencyDisplay';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
  text: '#f5f5f0',
};

export default function ProfileScreen() {
  const { user, setUser, sessionId, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const profile = await getUserProfile(sessionId);
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
        <Text style={styles.text}>Not logged in</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {user.avatarUrl ? (
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: THEME.secondary }]}>
                <Text style={styles.avatarText}>{user.displayName[0].toUpperCase()}</Text>
              </View>
            )}
          </View>
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={styles.subtext}>{user.isGuest ? 'Guest Account' : 'Member'}</Text>
        </View>

        {/* Currency */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance</Text>
          <View style={[styles.card, { backgroundColor: 'rgba(0, 0, 0, 0.2)' }]}>
            <CurrencyDisplay gold={user.gold} diamonds={user.diamonds} size="large" />
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.totalGames || 0}</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.totalWins || 0}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{user.leagueTier || 'BRONZE'}</Text>
              <Text style={styles.statLabel}>Rank</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {user.totalGames ? Math.round((user.totalWins / user.totalGames) * 100) : 0}%
              </Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={[styles.button, styles.refreshButton]} onPress={handleRefresh} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Refreshing...' : 'Refresh Profile'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={signOut}>
            <Text style={[styles.buttonText, { color: '#ff6b6b' }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  avatarSection: {
    alignItems: 'center',
    padding: 30,
  },
  avatarContainer: { marginBottom: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: THEME.secondary },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 32, color: '#fff', fontWeight: 'bold' },
  name: { fontSize: 20, fontWeight: 'bold', color: THEME.text },
  subtext: { fontSize: 14, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: THEME.secondary, marginBottom: 12 },
  card: { padding: 20, borderRadius: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: THEME.secondary },
  statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.6)', marginTop: 4 },
  actions: { paddingHorizontal: 20, paddingBottom: 30 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  refreshButton: { backgroundColor: THEME.secondary },
  logoutButton: { backgroundColor: 'rgba(255, 107, 107, 0.2)', borderWidth: 1, borderColor: '#ff6b6b' },
  buttonText: { color: THEME.primary, fontSize: 16, fontWeight: 'bold' },
  text: { color: THEME.text, fontSize: 18, textAlign: 'center', marginTop: 50 },
});
