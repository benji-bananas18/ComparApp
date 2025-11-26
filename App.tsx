// App.tsx
import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CartProvider} from './src/context/CartContext';

// Importamos TODAS nuestras pantallas
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import QRScreen from './src/screens/QRScreen';
import ProfileScreen from './src/screens/ProfileScreen'; // <-- NUEVO

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  // --- AHORA SÍ: El estado de login empieza en 'false' ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Funciones para cambiar el estado
  const handleLoginSuccess = () => {
    setIsLoggedIn(true); // ¡El usuario ha entrado!
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // ¡El usuario ha salido!
  };

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {backgroundColor: '#1c1c1c'},
            headerTintColor: '#FFA500',
            headerTitleStyle: {color: '#fff'},
          }}>
          {isLoggedIn ? (
            // --- Pantallas de la App (SI está logueado) ---
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen
                name="CartScreen"
                component={CartScreen}
                options={{title: 'Mi Carrito'}}
              />
              <Stack.Screen
                name="QRScreen"
                component={QRScreen}
                options={{title: 'Pagar'}}
              />
              <Stack.Screen name="Profile" options={{title: 'Mi Cuenta'}}>
                {/* Le pasamos la función 'handleLogout' a ProfileScreen */}
                {props => <ProfileScreen {...props} onLogout={handleLogout} />}
              </Stack.Screen>
            </>
          ) : (
            // --- Pantallas de Autenticación (NO está logueado) ---
            <>
              <Stack.Screen name="Login" options={{headerShown: false}}>
                {/* Le pasamos la función 'handleLoginSuccess' a LoginScreen */}
                {props => (
                  <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
                )}
              </Stack.Screen>
              <Stack.Screen
                name="Register"
                options={{title: 'Crear Cuenta'}}
              >
                 {/* Le pasamos la función 'handleLoginSuccess' a RegisterScreen */}
                {props => (
                  <RegisterScreen 
                    {...props} 
                    onRegisterSuccess={handleLoginSuccess} 
                  />
                )}
              </Stack.Screen>
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

export default App;