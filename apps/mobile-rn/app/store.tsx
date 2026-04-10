import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { getSkinCatalog, getSkinInventory, purchaseSkin, equipSkin, Skin, OwnedSkin } from '../services/api';
import CurrencyDisplay from '../components/CurrencyDisplay';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
  text: '#f5f5f0',
};

export default function StoreScreen() {
  const { user, sessionId } = useAuth();
  const [skins, setSkins] = useState<Skin[]>([]);
  const [ownedSkins, setOwnedSkins] = useState<OwnedSkin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      loadData();
    }
  }, [sessionId]);

  const loadData = async () => {
    try {
      const [catalog, inventory] = await Promise.all([
        getSkinCatalog(),
        getSkinInventory(sessionId!),
      ]);
      setSkins(catalog);
      setOwnedSkins(inventory.ownedSkins || []);
    } catch (error) {
      console.error('Failed to load store:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (skin: Skin) => {
    if (!user || !sessionId) return;

    try {
      const result = await purchaseSkin(sessionId, skin.id);
      if (result.success) {
        Alert.alert('Success', `Purchased ${skin.name}!`);
        loadData(); // Refresh inventory
      } else {
        Alert.alert('Error', result.transaction?.error || 'Purchase failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Purchase failed');
    }
  };

  const handleEquip = async (skin: Skin) => {
    if (!sessionId) return;

    try {
      await equipSkin(sessionId, skin.id, skin.type as 'CARD' | 'TABLE');
      Alert.alert('Success', `Equipped ${skin.name}!`);
      loadData();
    } catch (error) {
      Alert.alert('Error', 'Failed to equip skin');
    }
  };

  const ownedSkinIds = new Set(ownedSkins.map((os) => os.skinId));

  if (loading) {
    return (
      <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
        <Text style={styles.loadingText}>Loading store...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[THEME.background, THEME.primary]} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Skin Store</Text>
        {user && (
          <CurrencyDisplay gold={user.gold} diamonds={user.diamonds} size="large" />
        )}
      </View>

      {/* Categories */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card Skins */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Skins</Text>
          {skins
            .filter((s) => s.type === 'CARD')
            .map((skin) => (
              <SkinCard
                key={skin.id}
                skin={skin}
                owned={ownedSkinIds.has(skin.id)}
                equipped={ownedSkinIds.has(skin.id)}
                onPurchase={() => handlePurchase(skin)}
                onEquip={() => handleEquip(skin)}
              />
            ))}
        </View>

        {/* Table Skins */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Table Skins</Text>
          {skins
            .filter((s) => s.type === 'TABLE')
            .map((skin) => (
              <SkinCard
                key={skin.id}
                skin={skin}
                owned={ownedSkinIds.has(skin.id)}
                equipped={ownedSkinIds.has(skin.id)}
                onPurchase={() => handlePurchase(skin)}
                onEquip={() => handleEquip(skin)}
              />
            ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

interface SkinCardProps {
  skin: Skin;
  owned: boolean;
  equipped: boolean;
  onPurchase: () => void;
  onEquip: () => void;
}

function SkinCard({ skin, owned, equipped, onPurchase, onEquip }: SkinCardProps) {
  const rarityColors = {
    COMMON: '#999',
    RARE: '#00a8e8',
    EPIC: '#9b59b6',
    LEGENDARY: '#f1c40f',
  };

  return (
    <LinearGradient
      colors={[skin.type === 'CARD' ? ['#1a6b3a', '#0d5c2e'] : ['#8b0000', '#5c0000']]}
      style={styles.skinCard}
    >
      <View style={styles.skinInfo}>
        <Text style={styles.skinName}>{skin.name}</Text>
        <Text style={styles.skinDescription}>{skin.description}</Text>
        <View style={[styles.rarityBadge, { backgroundColor: rarityColors[skin.rarity] }]}>
          <Text style={styles.rarityText}>{skin.rarity}</Text>
        </View>
      </View>

      <View style={styles.skinActions}>
        {owned ? (
          <TouchableOpacity
            style={[styles.equipButton, equipped && styles.equipButtonActive]}
            onPress={onEquip}
          >
            <Text style={styles.equipButtonText}>
              {equipped ? 'Equipped' : 'Equip'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buyButton} onPress={onPurchase}>
            <Text style={styles.buyButtonText}>
              💎 {skin.price}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME.secondary,
    marginBottom: 10,
  },
  loadingText: {
    color: THEME.text,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  content: { flex: 1 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.secondary,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  skinCard: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  skinInfo: { flex: 1 },
  skinName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.text,
  },
  skinDescription: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  rarityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 6,
  },
  rarityText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  skinActions: { marginLeft: 10 },
  equipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  equipButtonActive: {
    backgroundColor: THEME.secondary,
  },
  equipButtonText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  buyButton: {
    backgroundColor: THEME.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyButtonText: {
    color: THEME.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
