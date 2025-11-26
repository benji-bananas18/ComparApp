// src/screens/LoginScreen.tsx
import React, {useState, useRef} from 'react'; 
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import axios from 'axios'; // <-- NUEVO: Importamos Axios

// --- ¡¡IMPORTANTE!! CAMBIA ESTA IP POR LA IP REAL DE TU COMPUTADOR ---
// Revisa con 'ipconfig' para asegurarte de que esta IP sea correcta.
const API_URL = 'http://192.168.1.10:8000'; 

type LoginScreenProps = {
  navigation: any;
  onLoginSuccess: () => void;
};

const LoginScreen = ({navigation, onLoginSuccess}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null); 
  

  // --- FUNCIÓN ACTUALIZADA CON LLAMADA A LA API ---
 const handleLogin = () => { // <--- Ya no es 'async'
    if (!email || !password) {
      Alert.alert('Error', 'Debes ingresar email y contraseña.');
      return;
    }
    
    setLoading(true); // 1. Inicia la carga

    // 2. Simulación de la llamada a la API (1.5 segundos de retraso para el efecto visual)
    setTimeout(() => {
      setLoading(false); // 3. Detiene la carga

      // Lógica de validación simulada: si es 'test/test', el login es exitoso
      if (email.toLowerCase() === 'test' && password.toLowerCase() === 'test') {
        Alert.alert('Simulación Exitosa', 'El login fue correcto.');
        
        // LLAMAMOS AL CONTROLADOR DE NAVEGACIÓN
        onLoginSuccess(); 
      } else {
        Alert.alert('Error', 'Simulación: Email o contraseña incorrectos.');
      }
    }, 1500); // Simula el tiempo de red
  };
  // --- FIN FUNCIÓN ACTUALIZADA ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>ComparApp</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>

        {/* CAMPO PARA EL EMAIL */}
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={24} color="#FFA500" style={styles.inputIcon} />
          <TextInput
            style={[styles.inputField, {color: '#FFFFFF'}]}
            placeholder="Correo electrónico" 
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            returnKeyType="next" 
            onSubmitEditing={() => passwordRef.current?.focus()} 
          />
        </View>

        {/* CAMPO PARA LA CONTRASEÑA */}
        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={24} color="#FFA500" style={styles.inputIcon} />
          <TextInput
            style={[styles.inputField, {color: '#FFFFFF'}]}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
            ref={passwordRef}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />
        </View>

        {/* Botón Estilizado y Dinámico */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#1c1c1c" /> 
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        {/* Enlace de Registro Mejorado */}
        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => navigation.navigate('Register')}
          disabled={loading}
        >
          <Text style={styles.registerText}>
            ¿No tienes cuenta?{' '}
            <Text style={styles.registerActionText}>
              Regístrate aquí
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- ESTILOS (sin cambios) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1c1c1c' }, 
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  logo: { fontSize: 40, fontWeight: '900', color: '#FFA500', textAlign: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 40, color: '#FFFFFF' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', width: '100%', height: 50, backgroundColor: '#333', borderColor: '#555', borderWidth: 1, borderRadius: 8, marginBottom: 20 },
  inputIcon: { paddingHorizontal: 15 },
  inputField: { flex: 1, height: '100%', fontSize: 16, paddingRight: 15 },
  loginButton: { width: '100%', height: 50, backgroundColor: '#FFA500', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  loginButtonText: { color: '#1c1c1c', fontSize: 18, fontWeight: 'bold' },
  registerLink: { marginTop: 25, alignItems: 'center' },
  registerText: { fontSize: 16, color: '#ccc', },
  registerActionText: { color: '#FFA500', fontWeight: 'bold', textDecorationLine: 'underline' },
});

export default LoginScreen;