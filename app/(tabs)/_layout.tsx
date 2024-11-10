// app/(tabs)/_layout.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AnimatedTabBar from '../../components/TaskBar'; // Asegúrate de que la ruta sea correcta
import LoadingScreen from '../../components/LoadingScreen';
import Perfil from './Perfil';

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula un tiempo de carga inicial
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        // Pantalla de carga
        <LoadingScreen />
      ) : (
        // Barra de pestañas principal
        <Tabs
          screenOptions={{
            headerShown: false, // Oculta el encabezado en todas las pantallas
          }}
          tabBar={(props) => <AnimatedTabBar {...props} />} // Barra de pestañas animada personalizada
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
            name="explore"
            options={{
              title: 'Estadísticas',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="stats-chart-outline" size={size} color={color} />
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
        </Tabs>
      )}
    </View>
  );
}
