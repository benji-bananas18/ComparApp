import React, {useState, useRef} from 'react'; 
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
// Asegúrate de tener instalada la librería react-native-vector-icons
import Icon from 'react-native-vector-icons/Ionicons'; 

// --- CONFIGURACIÓN DE LA CONEXIÓN REAL A AWS ---
// ¡URL DE TU FUNCIÓN LAMBDA! (URL pública para el frontend)
const API_URL = 'https://6tovqd2evjygkj6ljoriw2hoa40mireg.lambda-url.us-east-2.on.aws/'; 
// La conexión irá aquí. Tu Lambda debe estar configurada con CORS y el código para consultar Aurora/RDS.

// Definición de las propiedades que el componente espera
type LoginScreenProps = {
  // El objeto navigation de React Navigation
  navigation: any; 
  // Función para manejar el éxito del login, requiere un rol ('user' o 'admin')
  onLoginSuccess: (role: 'user' | 'admin') => void; 
};

const LoginScreen = ({navigation, onLoginSuccess}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Estado para mostrar errores/mensajes al usuario
  
  // Referencia para saltar al campo de contraseña al presionar 'next'
  const passwordRef = useRef<TextInput>(null); 

  // --- FUNCIÓN DE INICIO DE SESIÓN (Conexión fetch a Lambda) ---
  const handleLogin = async () => { // <--- FUNCIÓN CONVERTIDA A ASÍNCRONA
    if (!email || !password) {
      Alert.alert('Error', 'Debes ingresar email y contraseña.'); 
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      // 1. Envía las credenciales a la URL pública de la Función Lambda
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envía el email y password a la función Lambda
        body: JSON.stringify({ email, password }),
      });

      // 2. Procesa la respuesta de la API
      if (response.ok) {
        const data = await response.json(); 
        
        // La Lambda debe devolver un objeto con el rol del usuario (ej. { role: "admin" })
        // Nota: Asegúrate de que tu Lambda devuelva este campo 'role'
        let role = data.role || 'user'; 

        Alert.alert('¡Conexión Exitosa!', `Iniciando sesión como ${role}.`);
        onLoginSuccess(role); 
        
      } else {
        // La Lambda devolvió un error (ej. 401 Unauthorized)
        const errorText = await response.text(); 
        Alert.alert('Error de Login', `Credenciales inválidas. Estado: ${response.status}`);
        setMessage('Credenciales inválidas o error de servidor.');
        console.error('API Response Error:', errorText);
      }
      
    } catch (error) {
      // Error de red, fallo de CORS, o la URL no está activa
      console.error('Error de conexión con la API:', error);
      Alert.alert('Error de Conexión', 'No se pudo contactar al servidor AWS. Verifica la URL y CORS.');
      setMessage('Error de red. Verifica la conexión a internet.');
    } finally {
      setLoading(false);
    }
  };
  // --- FIN FUNCIÓN CONEXIÓN AWS ---

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.logo}>ComparApp</Text>
        <Text style={styles.title}>Iniciar Sesión</Text>
        
        {/* Muestra mensaje de error/estado */}
        {message ? (
            <Text style={styles.errorMessage}>{message}</Text>
        ) : null}

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
          onPress={handleLogin} // Llama a la función de conexión real
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
          // 🛑 CAMBIO CRÍTICO AQUÍ: Navega a la pantalla 'Register' que ya tienes.
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

// --- ESTILOS ---
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
  errorMessage: { color: '#FF4444', textAlign: 'center', marginBottom: 10, fontWeight: '600' },
}); 

export default LoginScreen;