import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';

const Reportes = () => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [reports, setReports] = useState([]);

  const handleAddReport = async () => {
    // Solicitar permisos de ubicación
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso denegado para acceder a la ubicación.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const newReport = {
      id: Date.now(),
      description,
      location: {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      },
    };

    setReports([...reports, newReport]);
    setDescription(''); // Limpiar el campo de descripción
  };

  const renderReport = ({ item }) => (
    <TouchableOpacity style={styles.reportItem}>
      <Text style={styles.reportText}>Incidencia: {item.description}</Text>
      <Text style={styles.reportText}>
        Ubicación: {item.location.latitude.toFixed(6)}, {item.location.longitude.toFixed(6)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportar Incidencia</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe el problema..."
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Agregar Reporte" onPress={handleAddReport} />

      <Text style={styles.subtitle}>Reportes Recientes</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReport}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  list: {
    paddingBottom: 20,
  },
  reportItem: {
    padding: 15,
    backgroundColor: '#e9ecef',
    borderRadius: 10,
    marginBottom: 10,
  },
  reportText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Reportes;
