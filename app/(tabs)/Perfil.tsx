// components/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Button, SafeAreaView } from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../constants/vercel';

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  // Función para enviar mensaje de emergencia
  const sendEmergencyMessage = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación para enviar la alerta.');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const latitude = location.coords.latitude;
    const longitude = location.coords.longitude;
    const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    const message = `🚨 ¡Alerta de emergencia! 🚨\n\nEstoy usando GiroSAFE y me encuentro en una situación de peligro.\nMi ubicación actual es:\n${googleMapsLink}`;

    try {
      const emails = selectedContacts
        .filter(contact => contact.emails && contact.emails[0])
        .map(contact => contact.emails[0].email);

      if (emails.length === 0) {
        Alert.alert("Error", "No se seleccionaron contactos con correos electrónicos.");
        return;
      }

      await axios.post('https://giro-safe-app.vercel.app/api/mandar-email', { 
        email: emails.join(', '), // Concatenamos los correos en una sola cadena
        message 
      });

      Alert.alert("Alerta Enviada", "La alerta de emergencia ha sido enviada a tus contactos de emergencia.");
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      Alert.alert("Error", "Hubo un problema al enviar la alerta: " + error.message);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });
        if (data.length > 0) {
          setEmergencyContacts(data);
          setFilteredContacts(data);
        }
      }

      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }
    })();
  }, []);

  const handleSelectContact = (contact) => {
    // Verificar si el contacto tiene un correo electrónico
    if (!contact.emails || contact.emails.length === 0) {
      Alert.alert("Sin correo electrónico", `${contact.name} no tiene un correo asignado.`);
      return; // Salir de la función si no tiene correo
    }
  
    // Continuar agregando o quitando de la lista de seleccionados
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter((c) => c.id !== contact.id));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await AsyncStorage.setItem('firstName', firstName);
      await AsyncStorage.setItem('lastName', lastName);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('bloodType', bloodType);
      Alert.alert("Perfil guardado", "La información de tu perfil se ha guardado exitosamente.");
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredContacts(emergencyContacts);
    } else {
      const filtered = emergencyContacts.filter(contact =>
        contact.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permiso denegado", "Se necesita acceso a la galería para seleccionar una imagen.");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setProfileImage(selectedImage.uri);
        await AsyncStorage.setItem('profileImage', selectedImage.uri);
      } else {
        Alert.alert("Selección cancelada", "No se seleccionó ninguna imagen.");
      }
    } catch (error) {
      console.error("Error al seleccionar la imagen:", error);
      Alert.alert("Error", "Hubo un problema al seleccionar la imagen.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Perfil de Usuario</Text>

      <Button title="Enviar Alerta de Emergencia" onPress={sendEmergencyMessage} />

      <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <Ionicons name="camera" size={50} color="#ccc" />
        )}
      </TouchableOpacity>
      <Text style={styles.imageInstructions}>Toca para seleccionar una foto de perfil</Text>

      <TextInput
        placeholder="Nombre"
        value={firstName}
        onChangeText={setFirstName}
        style={styles.input}
      />
      <TextInput
        placeholder="Apellidos"
        value={lastName}
        onChangeText={setLastName}
        style={styles.input}
      />
      <TextInput
        placeholder="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Tipo de sangre (Ej. O+, A-)"
        value={bloodType}
        onChangeText={setBloodType}
        style={styles.input}
      />

      <Text style={styles.subtitle}>Selecciona tus contactos de emergencia:</Text>
      <TextInput
        placeholder="Buscar contacto"
        value={searchQuery}
        onChangeText={handleSearch}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleSelectContact(item)}
          >
            <Ionicons
              name={selectedContacts.includes(item) ? "checkbox-outline" : "square-outline"}
              size={24}
              color={selectedContacts.includes(item) ? "#1E90FF" : "#ccc"}
            />
            <Text style={styles.contactText}>
              {item.name} {item.emails ? `(${item.emails[0].email})` : ''}
            </Text>
          </TouchableOpacity>
        )}
        style={{ flex: 1 }}
      />

      {selectedContacts.length > 0 && (
        <View style={styles.selectedContactsContainer}>
          <Text style={styles.subtitle}>Contactos de emergencia seleccionados:</Text>
          {selectedContacts.map((contact, index) => (
            <Text key={index} style={styles.selectedContact}>
              {contact.name} ({contact.emails[0].email})
            </Text>
          ))}
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImageContainer: {
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imageInstructions: {
    textAlign: 'center',
    color: '#888',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderColor: '#1E90FF',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  contactText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  selectedContactsContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#e6f7ff',
    borderRadius: 8,
  },
  selectedContact: {
    fontSize: 16,
    color: '#1E90FF',
    paddingVertical: 5,
  },
  saveButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#1E90FF',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
