import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useUnityBridge } from '../hooks/useUnityBridge';

interface UnityGameViewProps {
  gameMode: 'TIENLEN' | 'MAUBINH';
  cardSkinId?: string;
  tableSkinId?: string;
  onGameEnd?: (results: any) => void;
}

export function UnityGameView({
  gameMode,
  cardSkinId,
  tableSkinId,
  onGameEnd,
}: UnityGameViewProps) {
  const { isReady, setGameMode, setSkins, triggerEffect } = useUnityBridge();
  const [gameState, setGameState] = useState<'LOADING' | 'READY' | 'PLAYING'>('LOADING');

  useEffect(() => {
    if (isReady) {
      setGameState('READY');
      setGameMode(gameMode);
    }
  }, [isReady, gameMode]);

  useEffect(() => {
    if (cardSkinId || tableSkinId) {
      setSkins(cardSkinId || '', tableSkinId || '');
    }
  }, [cardSkinId, tableSkinId]);

  // Trigger win effect when game ends
  useEffect(() => {
    if (onGameEnd) {
      // This would be called when Unity signals game end
      triggerEffect('WIN');
    }
  }, [onGameEnd]);

  if (!isReady || gameState === 'LOADING') {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Loading 3D game...</Text>
      </View>
    );
  }

  // In production, this would be the actual Unity view
  // For now, render a placeholder that represents the Unity container
  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && (
        // Android Unity view would go here
        <View style={styles.unityPlaceholder} />
      )}
      {Platform.OS === 'ios' && (
        // iOS Unity view would go here
        <View style={styles.unityPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0d4d3a',
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: '#d4af37',
    borderStyle: 'dashed',
  },
  loadingText: {
    color: '#fff',
    marginTop: 20,
    fontSize: 16,
  },
  unityPlaceholder: {
    flex: 1,
    backgroundColor: '#1a6b3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UnityGameView;
