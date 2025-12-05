// src/screens/QRScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useCart} from '../context/CartContext';
// --- NUEVO: Importamos el hook de ruta para leer el parámetro ---
import {useRoute} from '@react-navigation/native'; 

const QRScreen = () => {
  const {carts} = useCart();
  const route = useRoute(); // Hook para acceder a la ruta

  // 1. Obtenemos el parámetro 'localName' que nos envió la pantalla anterior
  const {localName} = route.params as {localName: string}; 

  // 2. Buscamos el carrito específico
  const currentCart = carts[localName] || [];

  // 3. Calculamos el total de ese carrito
  const total = currentCart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  
  // Preparamos la información para el QR
  const qrData = JSON.stringify({ local: localName, total: total }); 

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Pago en {localName}</Text>
      <Text style={styles.text}>¡Tu código QR está listo!</Text>
      
      {/* 4. Mostramos el QR Placeholder */}
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrText}>
          {qrData} 
          {/* Aquí iría el componente de código QR real */}
        </Text>
      </View>

      <Text style={styles.text}>Muestra este código en {localName} para pagar.</Text>
      <Text style={styles.totalText}>Total a pagar: ${total.toLocaleString('es-CL')}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1c1c1c', alignItems: 'center', justifyContent: 'center', padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10},
  text: {fontSize: 18, color: '#aaa', marginBottom: 20, textAlign: 'center'},
  qrPlaceholder: { width: 250, height: 250, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginVertical: 20 },
  qrText: {color: '#1c1c1c', fontSize: 14},
  totalText: {fontSize: 28, fontWeight: 'bold', color: '#FFA500', marginTop: 20},
});

export default QRScreen;