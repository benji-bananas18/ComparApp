// src/screens/QRScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useCart} from '../context/CartContext';

const QRScreen = () => {
  const {cart} = useCart();
  const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  
  // (En el futuro, aquí pondríamos el JSON real para el QR)
  const qrData = `Pagar:${total}`; 

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Generar QR de Compra</Text>
      <Text style={styles.text}>¡Tu pedido está listo!</Text>
      <View style={styles.qrPlaceholder}>
        <Text style={styles.qrText}>(Aquí se mostraría el código QR)</Text>
      </View>
      <Text style={styles.text}>Muestra este código en caja para pagar</Text>
      <Text style={styles.totalText}>Total: ${total.toLocaleString('es-CL')}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1c1c1c', alignItems: 'center', justifyContent: 'center', padding: 20},
  title: {fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 30},
  text: {fontSize: 18, color: '#aaa', marginBottom: 20, textAlign: 'center'},
  qrPlaceholder: { width: 250, height: 250, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderRadius: 10, marginVertical: 20 },
  qrText: {color: '#1c1c1c', fontSize: 16},
  totalText: {fontSize: 28, fontWeight: 'bold', color: '#FFA500', marginTop: 20},
});

export default QRScreen;