// components/LocationPermissionScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as Location from 'expo-location';

const LocationPermissionScreen = ({ onLocationGranted }: { onLocationGranted: (location: any) => void }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Solicitar permisos al cargar el componente
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permiso de ubicación denegado');
        Alert.alert('Permiso requerido', 'La aplicación necesita acceso a tu ubicación para funcionar correctamente.');
        return;
      }

      // Si se concede el permiso, obtener la ubicación actual
      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);
      onLocationGranted(userLocation); // Llamar al callback para pasar la ubicación a la app principal
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GiroSAFE necesita acceso a tu ubicación</Text>
      {location ? (
        <Text style={styles.locationText}>
          Ubicación obtenida: {`Latitud: ${location.coords.latitude}, Longitud: ${location.coords.longitude}`}
        </Text>
      ) : (
        <Text style={styles.errorText}>{errorMsg || 'Obteniendo ubicación...'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
  },
});

export default LocationPermissionScreen;
