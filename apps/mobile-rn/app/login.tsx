import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { devLogin, guestLogin } from '../services/api';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
};

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, sessionId, setSessionId } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDevLogin = async () => {
    setLoading(true);
    try {
      const result = await devLogin();
      setSessionId(result.sessionId);
      setUser(result.user);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to login as dev user');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const result = await guestLogin();
      setSessionId(result.sessionId);
      setUser(result.user);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to login as guest');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[THEME.primary, THEME.background]} style={styles.container}>
      {/* Logo/Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Vietnamese Card Games</Text>
        <Text style={styles.subtitle}>Premium Casino Experience</Text>
      </View>

      {/* Decorative Element */}
      <View style={styles.decorativeSection}>
        <Text style={styles.decorativeEmoji}>🃏</Text>
        <Text style={styles.decorativeEmoji}>🀄</Text>
        <Text style={styles.decorativeEmoji}>🎴</Text>
      </View>

      {/* Login Options */}
      <View style={styles.loginSection}>
        <TouchableOpacity
          style={[styles.button, styles.devButton]}
          onPress={handleDevLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={THEME.primary} />
          ) : (
            <Text style={[styles.buttonText, { color: THEME.primary }]}>
              Continue as Dev User
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.divider}>— OR —</Text>

        <TouchableOpacity
          style={[styles.button, styles.guestButton]}
          onPress={handleGuestLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Play as Guest</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>1000 gold bonus on first login!</Text>
        <Text style={styles.footerSubtext}>Local testing mode - Firebase optional</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 60 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  subtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)' },
  decorativeSection: { flexDirection: 'row', justifyContent: 'center', marginBottom: 60 },
  decorativeEmoji: { fontSize: 60, marginHorizontal: 20, opacity: 0.3 },
  loginSection: { marginBottom: 40 },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  devButton: { backgroundColor: THEME.secondary },
  guestButton: { backgroundColor: 'rgba(255, 255, 255, 0.2)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.3)' },
  buttonText: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  divider: { textAlign: 'center', color: 'rgba(255, 255, 255, 0.5)', marginVertical: 20 },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
  footerSubtext: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)' },
});
