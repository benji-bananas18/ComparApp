// src/screens/ProfileScreen.tsx
import React, {useState} from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView, TextInput, Alert } from 'react-native';

// Definimos las props que va a recibir (la función para cerrar sesión)
type ProfileScreenProps = {
  navigation: any;
  onLogout: () => void; // Esta es la función que nos "saca" de la app
};

const ProfileScreen = ({ navigation, onLogout }: ProfileScreenProps) => {
  // Datos de prueba para el perfil
  const [nombre, setNombre] = useState('Benjamín Valenzuela'); 
  const [email, setEmail] = useState('b.valenzuela@correo.com'); 

  const handleUpdateProfile = () => {
    // Aquí iría la lógica para llamar a la API y actualizar los datos
    console.log('Datos a actualizar:', nombre, email);
    Alert.alert('Perfil Actualizado', 'Tus datos se guardaron (simulación).');
  };

  const handleLogout = () => {
    // Llama a la función 'onLogout' que recibimos de App.tsx
    onLogout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Mi Cuenta</Text>

        <Text style={styles.label}>Nombre:</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
          placeholderTextColor="#999"
        />
        
        <Text style={styles.label}>Correo Electrónico:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Tu correo"
          placeholderTextColor="#999"
        />

        <View style={styles.buttonContainer}>
          <Button title="Actualizar Perfil" onPress={handleUpdateProfile} color="#FFA500" />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Cerrar Sesión" onPress={handleLogout} color="#FF4500" />
        </View>
      </View>
    </SafeAreaView>
  );
};

// Estilos (Tema Oscuro)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1c1c1c' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 30, textAlign: 'center' },
  label: { fontSize: 16, color: '#aaa', marginBottom: 5 },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 20,
  }
});

export default ProfileScreen;