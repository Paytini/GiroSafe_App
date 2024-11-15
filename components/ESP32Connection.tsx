// src/components/ESP32ConnectionHandler.js

import React, { useEffect, useState } from 'react';
import { AppState, Alert } from 'react-native';

function ESP32ConnectionHandler() {
  const [isConnected, setIsConnected] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  // Función que verifica el estado de emergencia en el ESP32
  const fetchDataFromESP32 = async () => {
    try {
      const response = await fetch('http://192.168.4.1/status');
      if (response.ok) {
        const result = await response.json();

        // Verifica si el ESP32 envía un estado de emergencia
        if (result.emergency) {
          sendEmergencyMessage();
        }
        setIsConnected(true);
      } else {
        setIsConnected(false);
        console.log('No se pudo conectar con el ESP32');
      }
    } catch (error) {
      setIsConnected(false);
      console.error('Error de conexión:', error);
    }
  };

  const sendEmergencyMessage = () => {
    Alert.alert(
      '¡Emergencia!',
      'El ciclista ha activado el botón de emergencia. Enviando alerta...',
      [{ text: 'Aceptar' }]
    );
    // Lógica para enviar la alerta a los contactos de emergencia
  };

  useEffect(() => {
    // Configura un intervalo para verificar el estado del ESP32 cada 10 segundos
    const interval = setInterval(() => {
      if (appState === 'active') {
        fetchDataFromESP32();
      }
    }, 10000);

    // Observa cambios en el estado de la aplicación
    const handleAppStateChange = (nextAppState) => {
      setAppState(nextAppState);
    };

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      clearInterval(interval);
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [appState]);

  return null;
}

export default ESP32ConnectionHandler;
