// app/(tabs)/_layout.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedTabBar from '../..//components/TaskBar';
import LoadingScreen from '../../components/LoadingScreen';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          tabBar={(props) => <AnimatedTabBar {...props} />} // Pasamos props a AnimatedTabBar
        >
          <Tabs.Screen
            name="PaginaPrincipal"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Mapa"
            options={{
              title: 'Mapa',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Guia"
            options={{
              title: 'Guía de Pasos',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="book-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Perfil"
            options={{
              title: 'Perfil',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="Reportes"
            options={{
              title: 'Reportes',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="alert-circle-outline" size={size} color={color} />
              ),
            }}
          />

        </Tabs>
      )}
    </View>
  );
}
