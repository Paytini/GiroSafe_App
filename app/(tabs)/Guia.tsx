// components/SetupGuideScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const SetupGuideScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Guía de Primeros Pasos</Text>

      {/* Paso 1 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>1. Carga Inicial del Dispositivo</Text>
        <Text style={styles.stepDescription}>
          Conecta el dispositivo de control y las tiras LED a un cargador compatible. Asegúrate de que esté completamente cargado (aproximadamente 2-3 horas).
        </Text>
      </View>

      {/* Paso 2 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>2. Instalación de las Tiras LED en el Casco</Text>
        <Text style={styles.stepDescription}>
          Limpia la superficie del casco y adhiere las tiras LED en la parte trasera. Asegúrate de que estén bien visibles y firmemente colocadas.
        </Text>
      </View>

      {/* Paso 3 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>3. Montaje del Control en el Manubrio</Text>
        <Text style={styles.stepDescription}>
          Coloca el control en el manubrio, asegurando que sea accesible sin interferir con el manejo. Asegúrate de que esté bien fijado.
        </Text>
      </View>

      {/* Paso 4 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>4. Sincronización con la App</Text>
        <Text style={styles.stepDescription}>
          Enciende el dispositivo y empareja con la app de GiroSAFE desde el menú de configuración. Asegúrate de que el Bluetooth esté activado en tu teléfono.
        </Text>
      </View>

      {/* Paso 5 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>5. Configuración de Contactos de Emergencia</Text>
        <Text style={styles.stepDescription}>
          En la app, ve a Configuración de Emergencia y agrega los contactos de emergencia. Puedes hacer una prueba de notificación para confirmar.
        </Text>
      </View>

      {/* Paso 6 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>6. Prueba de los Botones de Dirección y Emergencia</Text>
        <Text style={styles.stepDescription}>
          Presiona los botones de dirección y emergencia para asegurarte de que las luces y notificaciones funcionen correctamente.
        </Text>
      </View>

      {/* Paso 7 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>7. Personalización de la Iluminación</Text>
        <Text style={styles.stepDescription}>
          En la app, ajusta el brillo y el patrón de las luces LED según tus preferencias y condiciones de visibilidad.
        </Text>
      </View>

      {/* Paso 8 */}
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>8. Consejos de Uso y Mantenimiento</Text>
        <Text style={styles.stepDescription}>
          Limpia el dispositivo regularmente, carga la batería después de cada uso prolongado, y realiza pruebas periódicas de los botones.
        </Text>
      </View>
    </ScrollView>
  );
};

export default SetupGuideScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
  },
  stepContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E90FF',
    marginBottom: 5,
  },
  stepDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
});
