// src/screens/RegisterScreen.tsx
import React, {useState, useRef} from 'react'; 
import {
  View, Text, TextInput, Button, StyleSheet,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform,
  TouchableOpacity, ActivityIndicator,
  ScrollView, // <-- ¡ESTO ES LO QUE FALTABA!
} from 'react-native'; 
import Icon from 'react-native-vector-icons/Ionicons'; 
// ... (el resto del código)
type RegisterScreenProps = {
  navigation: any;
  onRegisterSuccess: () => void;
};

const RegisterScreen = ({navigation, onRegisterSuccess}: RegisterScreenProps) => {
  // --- NUEVO ESTADO: Teléfono y Dirección ---
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // <-- NUEVO
  const [address, setAddress] = useState(''); // <-- NUEVO
  const [loading, setLoading] = useState(false); 
  
  const textColor = '#000000';
  const placeholderColor = '#888888';

  // --- NUEVO: Creamos referencias para 4 campos ---
  const emailRef = useRef<TextInput>(null); 
  const passwordRef = useRef<TextInput>(null); 
  const phoneRef = useRef<TextInput>(null); 
  const addressRef = useRef<TextInput>(null);

  const handleRegister = () => {
    // 1. Validamos que TODOS los campos no estén vacíos
    if (!nombre || !email || !password || !phone || !address) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    
    setLoading(true);

    // 2. Simulación de la llamada a la API (1.5 segundos de retraso)
    setTimeout(() => {
      setLoading(false); 
      
      console.log('--- Datos de Registro Completos ---');
      console.log('Nombre:', nombre);
      console.log('Email:', email);
      console.log('Teléfono:', phone); // <-- NUEVO
      console.log('Dirección:', address); // <-- NUEVO

      Alert.alert(
        'Registro Exitoso (Simulado)',
        `¡Bienvenido, ${nombre}!`,
        [
          {
            text: 'OK',
            onPress: onRegisterSuccess, // Entra a la app
          },
        ],
      );
    }, 1500); 
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <Text style={[styles.title, {color: textColor}]}>Crear Cuenta</Text>

            {/* CAMPO: NOMBRE -> SALTA A EMAIL */}
            <View style={styles.inputContainer}>
              <Icon name="person-outline" size={24} color="#FFA500" style={styles.inputIcon} />
              <TextInput
                style={[styles.inputField, {color: textColor}]}
                placeholder="Tu nombre"
                placeholderTextColor={placeholderColor}
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                editable={!loading}
                returnKeyType="next" 
                onSubmitEditing={() => emailRef.current?.focus()} 
              />
            </View>

            {/* CAMPO: EMAIL -> SALTA A CONTRASEÑA */}
            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={24} color="#FFA500" style={styles.inputIcon} />
              <TextInput
                ref={emailRef} 
                style={[styles.inputField, {color: textColor}]}
                placeholder="Tu correo electrónico"
                placeholderTextColor={placeholderColor}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                returnKeyType="next" 
                onSubmitEditing={() => passwordRef.current?.focus()} 
              />
            </View>
            
            {/* CAMPO: CONTRASEÑA -> SALTA A TELÉFONO */}
            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={24} color="#FFA500" style={styles.inputIcon} />
              <TextInput
                ref={passwordRef} 
                style={[styles.inputField, {color: textColor}]}
                placeholder="Contraseña"
                placeholderTextColor={placeholderColor}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                returnKeyType="next" 
                onSubmitEditing={() => phoneRef.current?.focus()} 
              />
            </View>

            {/* --- NUEVO CAMPO: TELÉFONO -> SALTA A DIRECCIÓN --- */}
            <View style={styles.inputContainer}>
              <Icon name="call-outline" size={24} color="#FFA500" style={styles.inputIcon} />
              <TextInput
                ref={phoneRef} // <-- Asignamos la referencia
                style={[styles.inputField, {color: textColor}]}
                placeholder="Teléfono (ej: 9XXXXXXXX)"
                placeholderTextColor={placeholderColor}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad" // Muestra teclado numérico
                editable={!loading}
                returnKeyType="next" 
                onSubmitEditing={() => addressRef.current?.focus()} 
              />
            </View>
            
            {/* --- NUEVO CAMPO: DIRECCIÓN -> REGISTRARSE --- */}
            <View style={styles.inputContainer}>
              <Icon name="location-outline" size={24} color="#FFA500" style={styles.inputIcon} />
              <TextInput
                ref={addressRef} // <-- Asignamos la referencia
                style={[styles.inputField, {color: textColor}]}
                placeholder="Dirección (Calle y Número)"
                placeholderTextColor={placeholderColor}
                value={address}
                onChangeText={setAddress}
                autoCapitalize="words"
                editable={!loading}
                returnKeyType="done" 
                onSubmitEditing={handleRegister} // Finaliza y registra
              />
            </View>
            

            {/* --- Botón de Registro --- */}
            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#1c1c1c" /> 
              ) : (
                <Text style={styles.registerButtonText}>Registrarse</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#1c1c1c' },
  scrollContent: { 
    flexGrow: 1,
    justifyContent: 'center', // Centra el contenido si la pantalla no se llena
    paddingVertical: 40, // Espacio superior/inferior para que no quede pegado
  },
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFA500', textAlign: 'center', marginBottom: 30 },
  // Estilos de Input (sin cambios estructurales)
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
  },
  inputIcon: {
    paddingHorizontal: 15,
  },
  inputField: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingRight: 15, 
  },
  // Estilos de Botón
  registerButton: { 
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#1c1c1c', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;