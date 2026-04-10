import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  FadeIn,
} from 'react-native-reanimated';

interface CurrencyDisplayProps {
  gold: number;
  diamonds: number;
  size?: 'small' | 'medium' | 'large';
}

export function CurrencyDisplay({ gold, diamonds, size = 'medium' }: CurrencyDisplayProps) {
  const [displayGold, setDisplayGold] = useState(gold);
  const [displayDiamonds, setDisplayDiamonds] = useState(diamonds);

  // Animate gold when it changes
  useEffect(() => {
    if (gold !== displayGold) {
      const duration = 500;
      const steps = 20;
      const stepSize = Math.round((gold - displayGold) / steps);

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayGold(gold);
          clearInterval(interval);
        } else {
          setDisplayGold(displayGold + stepSize);
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [gold]);

  // Animate diamonds when it changes
  useEffect(() => {
    if (diamonds !== displayDiamonds) {
      setDisplayDiamonds(diamonds);
    }
  }, [diamonds]);

  const formatAmount = (amount: number): string => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  const sizes = {
    small: { container: 24, icon: 12, text: 12 },
    medium: { container: 32, icon: 16, text: 14 },
    large: { container: 40, icon: 20, text: 16 },
  };

  const currentSize = sizes[size];

  return (
    <Animated.View style={[styles.container, { flexDirection: 'row' }]} entering={FadeIn}>
      {/* Gold */}
      <View style={[styles.currencyItem, { width: currentSize.container }]}>
        <Text style={[styles.icon, { fontSize: currentSize.icon }]}>🪙</Text>
        <Text style={[styles.text, { fontSize: currentSize.text, color: '#d4af37' }]}>
          {formatAmount(displayGold)}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Diamonds */}
      <View style={[styles.currencyItem, { width: currentSize.container }]}>
        <Text style={[styles.icon, { fontSize: currentSize.icon }]}>💎</Text>
        <Text style={[styles.text, { fontSize: currentSize.text, color: '#00a8e8' }]}>
          {formatAmount(displayDiamonds)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 8,
  },
});

export default CurrencyDisplay;
