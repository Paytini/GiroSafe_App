// components/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(null); // null para el estado inicial

  useEffect(() => {
    (async () => {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermissionGranted(true);
      } else {
        setLocationPermissionGranted(false);
        Alert.alert(
          'Permiso requerido',
          'La aplicación necesita acceso a tu ubicación para mejorar la experiencia.',
          [{ text: 'Aceptar' }]
        );
      }
    })();
  }, []);

  return (
    <ImageBackground source={require('../../assets/images/STUDIO PC 2085-01.jpg')} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Logo y título */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/5379217 (1).png')} style={styles.logo} />
          <Text style={styles.title}>Bienvenido a GiroSAFE!</Text>
        </View>

        {/* Descripción del Proyecto */}
        <Text style={styles.description}>
          GiroSAFE es una iniciativa innovadora destinada a mejorar la seguridad de las mujeres ciclistas en sus desplazamientos nocturnos.
          Nuestro casco con luces LED y sistema automático basado en giroscopio proporciona una experiencia segura y adaptativa.
        </Text>

        {/* Beneficios del Dispositivo */}
        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitTitle}>Beneficios del Dispositivo:</Text>
          <Text style={styles.benefitItem}>• Mejora la visibilidad nocturna con luces LED brillantes.</Text>
          <Text style={styles.benefitItem}>• Fácil control de dirección con botones en el manubrio.</Text>
          <Text style={styles.benefitItem}>• Botón de emergencia para situaciones críticas.</Text>
          <Text style={styles.benefitItem}>• Adaptable y fácil de instalar en cualquier casco.</Text>
          <Text style={styles.benefitItem}>• Diseño compacto y resistente para condiciones adversas.</Text>
        </View>

        {/* Botón de Navegación */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Guia")}>
          <Text style={styles.buttonText}>Descubre más sobre GiroSAFE</Text>
        </TouchableOpacity>
      </ScrollView>
    </ImageBackground>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fondo semi-transparente más oscuro para mejorar la legibilidad
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#EEEEEE',
    textAlign: 'justify',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginVertical: 15,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  benefitsContainer: {
    marginVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo ligeramente transparente
    borderRadius: 10,
    padding: 15,
    textAlign: 'justify',
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  benefitItem: {
    fontSize: 16,
    color: '#DDDDDD',
    marginBottom: 5,
    lineHeight: 22,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3.5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
