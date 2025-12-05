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
import ProfileScreen from './src/screens/ProfileScreen'; 
// --- NUEVOS IMPORTS DE ADMIN ---
import AdminDashboardScreen from './src/screens/AdminDashboardScreen'; 
import AdminInventoryScreen from './src/screens/AdminInventoryScreen'; 

const Stack = createNativeStackNavigator();

// --- FUNCIÓN PARA EL STACK DE USUARIO (Home, Cart, Profile) ---
const UserStack = (handleLogout: () => void) => (
  <>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="CartScreen" component={CartScreen} options={{title: 'Mi Carrito'}} />
    <Stack.Screen name="QRScreen" component={QRScreen} options={{title: 'Pagar'}} />
    {/* Se pasa onLogout al componente ProfileScreen */}
    <Stack.Screen name="Profile" options={{title: 'Mi Cuenta'}}>
      {props => <ProfileScreen {...props} onLogout={handleLogout} />}
    </Stack.Screen>
  </>
);

// --- FUNCIÓN PARA EL STACK DE ADMIN (Dashboard, Inventory) ---
const AdminStack = (handleLogout: () => void) => (
  <>
    <Stack.Screen name="AdminDashboard" options={{headerShown: false}}>
      {/* Se pasa onLogout al Dashboard */}
      {props => <AdminDashboardScreen {...props} onLogout={handleLogout} />}
    </Stack.Screen>
    <Stack.Screen name="AdminInventory" component={AdminInventoryScreen} options={{title: 'Gestión de Inventario'}} />
    
    {/* Incluimos las pantallas de usuario para que el admin pueda comprar/ver */}
    {UserStack(handleLogout)} 
  </>
);
// ----------------------------------------------------------------------

function App(): React.JSX.Element {
  // --- ESTADO DE LOGIN Y ROL DEL USUARIO ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user'); 

  // Funciones para cambiar el estado
  const handleLoginSuccess = (role: 'user' | 'admin') => {
    setIsLoggedIn(true); 
    setUserRole(role); // Guardamos el rol
  };

  const handleLogout = () => {
    setIsLoggedIn(false); 
    setUserRole('user'); // Reiniciamos el rol
  };

  const screenOptions = {
    headerStyle: {backgroundColor: '#1c1c1c'},
    headerTintColor: '#FFA500',
    headerTitleStyle: {color: '#fff'},
  };

  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={screenOptions}>
          {isLoggedIn ? (
            // --- Pantallas de la App (SI está logueado) ---
            userRole === 'admin' ? AdminStack(handleLogout) : UserStack(handleLogout)
          ) : (
            // --- Autenticación ---
            <>
              <Stack.Screen name="Login" options={{headerShown: false}}>
                {props => (
                  <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />
                )}
              </Stack.Screen>
              <Stack.Screen name="Register" options={{title: 'Crear Cuenta'}}>
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