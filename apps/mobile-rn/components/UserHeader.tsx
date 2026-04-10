import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';

interface UserHeaderProps {
  showCurrency?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function UserHeader({ showCurrency = true, size = 'medium' }: UserHeaderProps) {
  const { user, profile } = useAuth();
  const { formatGold, formatDiamonds, currency } = React.useContext(
    require('../contexts/CurrencyContext').CurrencyContext || {}
  ) || { formatGold: (n: number) => n.toString(), formatDiamonds: (n: number) => n.toString(), currency: { gold: 0, diamonds: 0 } };

  const sizes = {
    small: {
      container: styles.smallContainer,
      avatar: 32,
      name: 12,
      currency: 10,
    },
    medium: {
      container: styles.mediumContainer,
      avatar: 44,
      name: 14,
      currency: 11,
    },
    large: {
      container: styles.largeContainer,
      avatar: 60,
      name: 16,
      currency: 12,
    },
  };

  const currentSize = sizes[size];

  return (
    <LinearGradient
      colors={['rgba(13, 77, 58, 0.8)', 'rgba(8, 61, 30, 0.9)']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={[styles.container, currentSize.container]}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={[styles.avatar, { width: currentSize.avatar, height: currentSize.avatar }]} />
          ) : (
            <View style={[styles.avatarPlaceholder, { width: currentSize.avatar, height: currentSize.avatar }]}>
              <Text style={[styles.avatarText, { fontSize: currentSize.avatar * 0.5 }]}>
                {(profile?.displayName || user?.displayName || 'U')[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.onlineIndicator} />
        </View>

        {/* Name and Currency */}
        <View style={styles.info}>
          <Text style={[styles.name, { fontSize: currentSize.name }]}>
            {profile?.displayName || user?.displayName || 'Player'}
          </Text>

          {showCurrency && (
            <View style={styles.currencyRow}>
              <View style={styles.currencyItem}>
                <Text style={styles.currencyIcon}>🪙</Text>
                <Text style={[styles.currencyValue, { fontSize: currentSize.currency, color: '#d4af37' }]}>
                  {formatGold(currency.gold)}
                </Text>
              </View>
              <View style={styles.currencyDivider} />
              <View style={styles.currencyItem}>
                <Text style={styles.currencyIcon}>💎</Text>
                <Text style={[styles.currencyValue, { fontSize: currentSize.currency, color: '#00a8e8' }]}>
                  {formatDiamonds(currency.diamonds)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallContainer: {
    paddingVertical: 4,
  },
  mediumContainer: {
    paddingVertical: 6,
  },
  largeContainer: {
    paddingVertical: 8,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#d4af37',
  },
  avatarPlaceholder: {
    borderRadius: 22,
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    borderWidth: 2,
    borderColor: '#d4af37',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#083d1e',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyIcon: {
    marginRight: 3,
  },
  currencyValue: {
    fontWeight: 'bold',
  },
  currencyDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 6,
  },
});

export default UserHeader;
