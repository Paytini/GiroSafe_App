// components/EmergencyAlertHandler.tsx
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../constants/vercel';

const ESP32_URL = 'http://192.168.4.1'; // Reemplaza con la dirección IP o URL de tu ESP32

const EmergencyAlertHandler = ({ selectedContacts }) => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Consulta el estado de alerta en el ESP32
        const response = await axios.get(`${ESP32_URL}/alert`);
        if (response.data && response.data.alert === 1) {
          // Si hay una alerta activa, envía correos
          sendEmergencyEmails();
        }
      } catch (error) {
        console.error('Error al consultar la alerta:', error.message);
      }
    }, 5000); // Consulta cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, []);

  const sendEmergencyEmails = async () => {
    try {
      // Construir el mensaje de alerta
      const location = await getLocation();
      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
      const message = `🚨 ¡Alerta de emergencia! 🚨\n\nEstoy usando GiroSAFE y me encuentro en una situación de peligro.\nMi ubicación actual es:\n${googleMapsLink}`;

      const emails = selectedContacts.map(contact => contact.emails[0].email);

      // Enviar correos
      await axios.post(`${BASE_URL}/api/mandar-email`, {
        email: emails.join(', '),
        message,
      });

      Alert.alert('Alerta enviada', 'Los correos se enviaron a los contactos de emergencia.');
    } catch (error) {
      console.error('Error al enviar los correos:', error.message);
      Alert.alert('Error', 'Hubo un problema al enviar la alerta.');
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permiso de ubicación denegado.');
    }
    const location = await Location.getCurrentPositionAsync({});
    return location.coords;
  };

  return null; // Este componente no necesita renderizar nada
};

export default EmergencyAlertHandler;
