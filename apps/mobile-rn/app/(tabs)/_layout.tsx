import React from 'react';
import { Tabs } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const THEME = {
  primary: '#0d4d3a',
  secondary: '#d4af37',
  background: '#083d1e',
  text: '#f5f5f0',
};

export default function TabLayout() {
  return (
    <LinearGradient colors={[THEME.background, THEME.primary]} style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: THEME.primary,
          },
          headerTintColor: THEME.secondary,
          tabBarStyle: {
            backgroundColor: THEME.background,
            borderTopColor: THEME.secondary,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: THEME.secondary,
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color} />
            ),
            headerTitle: 'Vietnamese Card Games',
            header: () => (
              <LinearGradient
                colors={[THEME.primary, THEME.background]}
                style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}
              >
                <FontAwesome name="cards" size={32} color={THEME.secondary} />
                <Text style={{ color: THEME.text, fontSize: 24, fontWeight: 'bold', marginTop: 8 }}>
                  Casino
                </Text>
              </LinearGradient>
            ),
          }}
        />
        <Tabs.Screen
          name="lobby"
          options={{
            title: 'Lobby',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="users" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-circle" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </LinearGradient>
  );
}
