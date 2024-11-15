// AnimatedTabBar.tsx
import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useNavigationState } from '@react-navigation/native';

const tabs = [
  { name: 'Inicio', icon: 'home', route: 'PaginaPrincipal' },
  { name: 'Mapa', icon: 'map-outline', route: 'Mapa' },
  { name: 'Guia', icon: 'book-outline', route: 'Guia' },
  { name: 'Perfil', icon: 'person-outline', route: 'Perfil' },
  { name: 'Reportes', icon: 'settings-outline', route: 'Reportes' },
];

const AnimatedTabBar = ({ navigation }: any) => {
  // Mueve el hook useSharedValue fuera del mapa para asegurar consistencia en el número de hooks
  const selectedTab = useSharedValue(0);

  // Utilizar un listener para actualizar el tab seleccionado cuando cambie la ruta
  const navState = useNavigationState((state) => state);
  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.route === navState.routes[navState.index].name);
    selectedTab.value = index;
  }, [navState.index]);

  const handleTabPress = (index: number, route: string) => {
    selectedTab.value = index;
    navigation.navigate(route);
  };

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = selectedTab.value === index;

        const circleStyle = useAnimatedStyle(() => ({
          transform: [{ scale: withTiming(isFocused ? 1 : 0, { duration: 300 }) }],
          opacity: withTiming(isFocused ? 1 : 0, { duration: 300 }),
        }));

        return (
          <TouchableOpacity key={index} onPress={() => handleTabPress(index, tab.route)} style={styles.tab}>
            <View style={styles.iconContainer}>
              {/* Fondo circular animado */}
              <Animated.View style={[styles.circleBackground, circleStyle]} />
              <Ionicons name={tab.icon} size={24} color={isFocused ? '#000000' : '#999'} />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 35,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleBackground: {
    position: 'absolute',
    width: 75,
    height: 62,
    borderRadius: 24,
    backgroundColor: '#87CEEB',
    zIndex: -1, // Detrás del icono
  },
});

export default AnimatedTabBar;
