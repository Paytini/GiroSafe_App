// components/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Image, Button, SafeAreaView, ScrollView,ImageBackground} from 'react-native';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import EmergencyAlertHandler from '../../components/ESP32Connection';
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

      await axios.post(`${BASE_URL}/api/mandar-email`, { 
        email: emails.join(', '), 
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
    if (!contact.emails || contact.emails.length === 0) {
      Alert.alert("Sin correo electrónico", `${contact.name} no tiene un correo asignado.`);
      return;
    }
  
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
    <ImageBackground source={require('../../assets/images/SL_092320_35480_11.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
         <EmergencyAlertHandler selectedContacts={selectedContacts} />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Ionicons name="save" size={28} color="#fff" />
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

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Ejemplo: Juan"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
              placeholderTextColor={'#999'}
            />
            <TextInput
              placeholder="Ejemplo: Pérez"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
              placeholderTextColor={'#999'}
            />
            <TextInput
              placeholder="Ejemplo: correo@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              placeholderTextColor={'#999'}
            />
            <TextInput
              placeholder="Ejemplo: O+, A-"
              value={bloodType}
              onChangeText={setBloodType}
              style={styles.input}
              placeholderTextColor={'#999'}
            />
          </View>

          <Text style={styles.subtitle}>Selecciona tus contactos de emergencia:</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#ccc" style={styles.searchIcon} />
            <TextInput
              placeholder="Buscar contacto"
              value={searchQuery}
              onChangeText={handleSearch}
              style={styles.searchInput}
            />
          </View>

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
            contentContainerStyle={styles.contactListContainer}
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
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ajusta cómo se muestra la imagen
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo semitransparente para el contenido
  },
  scrollContainer: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
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
    color: '#ccc',
    marginBottom: 20,
  },
  inputContainer: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
  },
  contactListContainer: {
    alignItems: 'stretch',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    width: '90%',
    alignSelf: 'flex-start',
  },
  contactText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  selectedContactsContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: 'rgba(30,144,255,0.3)', // Fondo semitransparente
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  selectedContact: {
    fontSize: 16,
    color: '#fff',
    paddingVertical: 5,
  },
  saveButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#1E90FF', // Color del botón
    width: 60, // Ancho del botón
    height: 60, // Alto del botón (igual al ancho para hacerlo circular)
    borderRadius: 30, // Radio para que sea circular
    justifyContent: 'center', // Centrar el contenido verticalmente
    alignItems: 'center', // Centrar el contenido horizontalmente
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 4 }, // Desplazamiento de la sombra
    shadowOpacity: 0.3, // Opacidad de la sombra
    shadowRadius: 4, // Difusión de la sombra
    elevation: 5, // Elevación para sombras en Android
  },
  saveButtonText: {
    color: '#fff', // Color del texto
    fontSize: 20, // Tamaño del texto
    fontWeight: 'bold', // Negrita para el texto
  },
});