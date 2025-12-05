import React, {useState, useRef} from 'react'; 
import {
  View, Text, TextInput, Button, StyleSheet,
  SafeAreaView, Alert, KeyboardAvoidingView, Platform,
  TouchableOpacity, ActivityIndicator, ScrollView,
} from 'react-native'; 
import Icon from 'react-native-vector-icons/Ionicons'; 

// --- CONFIGURACIÓN DE LA CONEXIÓN REAL A AWS ---
// ¡URL DE TU FUNCIÓN LAMBDA! (URL pública para el frontend)
const API_URL_REGISTER = 'https://6tovqd2evjygkj6ljoriw2hoa40mireg.lambda-url.us-east-2.on.aws/'; 
// La conexión irá aquí. Tu Lambda debe estar configurada con CORS y el código para consultar Aurora/RDS.

type RegisterScreenProps = {
  navigation: any;
  onRegisterSuccess: (role: 'user' | 'admin') => void; // Acepta el rol
};

const RegisterScreen = ({navigation, onRegisterSuccess}: RegisterScreenProps) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); 
  const [address, setAddress] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(''); // Nuevo estado para mensajes de error
  
  const textColor = '#FFFFFF'; // Cambiado a blanco para mejor contraste con el fondo oscuro
  const placeholderColor = '#888888';

  // Creamos referencias para el flujo de teclado
  const emailRef = useRef<TextInput>(null); 
  const passwordRef = useRef<TextInput>(null); 
  const phoneRef = useRef<TextInput>(null); 
  const addressRef = useRef<TextInput>(null);

  // --- FUNCIÓN DE REGISTRO (Conexión fetch a Lambda) ---
  const handleRegister = async () => { // <--- Convertida a asíncrona
    if (!nombre || !email || !password || !phone || !address) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      // 1. Prepara los datos a enviar (payload)
      const payload = {
        nombre,
        email,
        password,
        phone,
        address,
        role: 'user' // Asumimos que el registro por defecto es 'user'
      };

      // 2. Envía la solicitud a la URL de la Función Lambda
      const response = await fetch(API_URL_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // 3. Procesa la respuesta
      if (response.ok) {
        // Asumimos que un 200/201 significa que la Lambda guardó los datos en Aurora/RDS
        Alert.alert(
          '¡Registro Exitoso!',
          `Bienvenido, ${nombre}. Tu cuenta ha sido creada y guardada en AWS.`,
          [
            {
              text: 'Iniciar Sesión',
              onPress: () => onRegisterSuccess('user'), // Navega como usuario
            },
          ],
        );
      } else {
        // La Lambda devolvió un error (ej. 409 Conflict, 500 Internal Server Error, etc.)
        const status = response.status;
        let errorData: any = {}; // Declaramos como 'any' para evitar errores de tipado en lectura de JSON
        let serverMessage = 'Error desconocido del servidor. (Sin cuerpo de respuesta)';

        try {
          // Intentamos leer el cuerpo de la respuesta, que puede contener detalles
          errorData = await response.json();
          // Intentamos usar el campo 'message' o el cuerpo completo si no existe 'message'
          // CORRECCIÓN: Usamos indexación segura y convertimos a string si es necesario
          serverMessage = errorData?.message || String(errorData) || JSON.stringify(errorData); 
        } catch (jsonError) {
          // El cuerpo de la respuesta no es JSON o está vacío (común en 500s)
          console.error('El cuerpo de la respuesta NO es JSON. Esto es un error grave de la Lambda.', jsonError);
          serverMessage = `El servidor devolvió un error HTTP ${status} sin detalles.`;
        }
        
        // 🚨 Esto es CLAVE para la depuración en AWS:
        console.error('--- ERROR DE REGISTRO EN LAMBDA ---');
        console.error('Status Code:', status);
        console.error('Cuerpo de la Respuesta de AWS:', errorData);
        console.error('------------------------------------');

        Alert.alert('Fallo de Registro', `Código HTTP: ${status}. Mensaje del Servidor: ${serverMessage}`);
        setMessage(`Error ${status}. Revisa la consola (Console) para el cuerpo completo del error.`);
      }
    } catch (error) {
      // Error de red, fallo de CORS, o la URL no está activa
      console.error('Error de conexión al registrar:', error);
      Alert.alert('Error de Conexión', 'No se pudo contactar al servidor AWS. Revisa la URL.');
      setMessage('Error de red. Verifica la conexión a internet.');
    } finally {
      setLoading(false);
    }
  };
  // --- FIN FUNCIÓN DE REGISTRO CONEXIÓN AWS ---

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <Text style={[styles.title, {color: '#FFA500'}]}>Crear Cuenta</Text>
            
            {/* Mensaje de estado/error */}
            {message ? (
                <Text style={styles.errorMessage}>{message}</Text>
            ) : null}

            {/* CAMPO: NOMBRE */}
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

            {/* CAMPO: EMAIL */}
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
            
            {/* CAMPO: CONTRASEÑA */}
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

            {/* CAMPO: TELÉFONO */}
            <View style={styles.inputContainer}>
              <Icon name="call-outline" size={24} color="#FFA500" style={styles.inputIcon} />
              <TextInput
                ref={phoneRef} 
                style={[styles.inputField, {color: textColor}]}
                placeholder="Teléfono (ej: 9XXXXXXXX)"
                placeholderTextColor={placeholderColor}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad" 
                editable={!loading}
                returnKeyType="next" 
                onSubmitEditing={() => addressRef.current?.focus()} 
              />
            </View>
            
            {/* CAMPO: DIRECCIÓN */}
            <View style={styles.inputContainer}>
              <Icon name="location-outline" size={24} color="#FFA500" style={styles.inputIcon} />
              <TextInput
                ref={addressRef} 
                style={[styles.inputField, {color: textColor}]}
                placeholder="Dirección (Calle y Número)"
                placeholderTextColor={placeholderColor}
                value={address}
                onChangeText={setAddress}
                autoCapitalize="words"
                editable={!loading}
                returnKeyType="done" 
                onSubmitEditing={handleRegister} 
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
            
            {/* Enlace para volver a Iniciar Sesión */}
             <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')} // Asume que tienes una ruta 'Login'
              disabled={loading}
            >
              <Text style={styles.loginLinkText}>
                ¿Ya tienes cuenta?{' '}
                <Text style={styles.loginActionText}>
                  Inicia Sesión
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#1c1c1c' }, // Fondo oscuro para contraste
  scrollContent: { 
    flexGrow: 1,
    justifyContent: 'center', 
    paddingVertical: 40, 
  },
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#333', // Fondo del campo oscuro
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
  registerButton: { 
    width: '100%',
    height: 50,
    backgroundColor: '#FFA500', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: '#1c1c1c', 
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: { color: '#FF4444', textAlign: 'center', marginBottom: 10, fontWeight: '600' },
  loginLink: { marginTop: 15, alignItems: 'center' },
  loginLinkText: { fontSize: 16, color: '#ccc', },
  loginActionText: { color: '#FFA500', fontWeight: 'bold', textDecorationLine: 'underline' },
});

export default RegisterScreen;