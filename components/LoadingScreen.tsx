// components/LoadingScreen.tsx
import React from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/5379217 (1).png')} // Cambia el path al logo de tu proyecto
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#87CEEB" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Color de fondo de la pantalla de carga
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});

export default LoadingScreen;
