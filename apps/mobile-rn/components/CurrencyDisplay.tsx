import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCurrency } from '../contexts/CurrencyContext';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  FadeIn,
} from 'react-native-reanimated';

interface CurrencyDisplayProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  avatarUrl?: string;
  displayName?: string;
}

export function CurrencyDisplay({
  size = 'medium',
  showLabel = false,
  avatarUrl,
  displayName,
}: CurrencyDisplayProps) {
  const { currency, formatGold, formatDiamonds } = useCurrency();
  const [displayGold, setDisplayGold] = useState(currency.gold);
  const [displayDiamonds, setDisplayDiamonds] = useState(currency.diamonds);

  // Animation for counting effect
  useEffect(() => {
    if (currency.pendingGold !== 0) {
      // Animate gold counter
      const target = currency.gold;
      const start = displayGold;
      const duration = 500;
      const steps = 20;
      const stepSize = (target - start) / steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayGold(target);
          clearInterval(interval);
        } else {
          setDisplayGold(Math.round(start + stepSize * currentStep));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [currency.pendingGold]);

  useEffect(() => {
    if (currency.pendingDiamonds !== 0) {
      const target = currency.diamonds;
      setDisplayDiamonds(target);
    }
  }, [currency.pendingDiamonds]);

  const sizes = {
    small: {
      container: styles.smallContainer,
      goldText: { fontSize: 12 },
      diamondText: { fontSize: 12 },
      label: { fontSize: 10 },
    },
    medium: {
      container: styles.mediumContainer,
      goldText: { fontSize: 14 },
      diamondText: { fontSize: 14 },
      label: { fontSize: 11 },
    },
    large: {
      container: styles.largeContainer,
      goldText: { fontSize: 18 },
      diamondText: { fontSize: 18 },
      label: { fontSize: 14 },
    },
  };

  const currentSize = sizes[size];

  return (
    <Animated.View style={[styles.container, { flexDirection: 'row', alignItems: 'center' }]} entering={FadeIn}>
      {displayName && (
        <Text style={[styles.displayName, currentSize.label]}>{displayName}</Text>
      )}

      <View style={[styles.currencyContainer, currentSize.container]}>
        {/* Gold Display */}
        <View style={styles.currencyItem}>
          <Text style={styles.goldIcon}>🪙</Text>
          <Text style={[styles.currencyText, currentSize.goldText, styles.goldText]}>
            {formatGold(displayGold)}
          </Text>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Diamond Display */}
        <View style={styles.currencyItem}>
          <Text style={styles.diamondIcon}>💎</Text>
          <Text style={[styles.currencyText, currentSize.diamondText, styles.diamondText]}>
            {formatDiamonds(displayDiamonds)}
          </Text>
        </View>
      </View>

      {showLabel && (
        <View style={styles.addButton}>
          <Text style={styles.addIcon}>+</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    color: '#f5f5f0',
    fontWeight: '600',
    marginRight: 8,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyText: {
    fontWeight: 'bold',
    marginLeft: 2,
  },
  goldIcon: {
    fontSize: 16,
  },
  goldText: {
    color: '#d4af37',
  },
  diamondIcon: {
    fontSize: 14,
  },
  diamondText: {
    color: '#00a8e8',
  },
  divider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 6,
  },
  addButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  addIcon: {
    color: '#d4af37',
    fontSize: 16,
    fontWeight: 'bold',
  },
  smallContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  mediumContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  largeContainer: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});

export default CurrencyDisplay;
