// src/screens/CartScreen.tsx
import React from 'react';
import {View, Text, FlatList, StyleSheet, Button, TouchableOpacity, ScrollView} from 'react-native';
import {useCart} from '../context/CartContext'; 
import Icon from 'react-native-vector-icons/Ionicons';

const CartScreen = ({navigation}: {navigation: any}) => {
  // Obtenemos el estado de Multi-Carts
  const {carts, addToCart, decreaseQuantity, clearCart} = useCart(); 
  
  // Obtenemos un array de los nombres de los locales que tienen ítems
  const localNames = Object.keys(carts);

  // Calculamos el total de todos los carritos (el gran total)
  const grandTotal = localNames.reduce((acc, local) => {
    const localTotal = carts[local].reduce((sum, item) => sum + item.precio * item.quantity, 0);
    return acc + localTotal;
  }, 0);


  // Renderiza un item individual (dentro del carrito de un local)
  const renderItem = ({item}: {item: any}) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNombre}>{item.nombre}</Text>
        <Text style={styles.itemPrecioUnitario}>${item.precio} c/u</Text>
      </View>
      <View style={styles.quantityControls}>
        {/* Botón Restar */}
        <TouchableOpacity style={styles.controlButton} onPress={() => decreaseQuantity(item.id, item.local)}>
          <Text style={styles.controlText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        {/* Botón Sumar (Usa el ID y Local para que funcione correctamente) */}
        <TouchableOpacity style={styles.controlButton} 
          onPress={() => addToCart({id: item.productId, nombre: item.nombre}, {local: item.local, precio: item.precio})}>
          <Text style={styles.controlText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemTotal}>
        ${(item.precio * item.quantity).toLocaleString('es-CL')}
      </Text>
    </View>
  );

  // Renderiza el carrito completo de un solo local
// src/screens/CartScreen.tsx
// ... (resto del código y imports) ...

  // Renderiza el carrito completo de un solo local
  const renderLocalCart = (localName: string) => {
    const cartItems = carts[localName];
    const localTotal = cartItems.reduce((sum, item) => sum + item.precio * item.quantity, 0);

    return (
      <View key={localName} style={styles.localCart}>
        <View style={styles.localHeader}>
          <Text style={styles.localTitle}>{localName}</Text>
          <TouchableOpacity onPress={() => clearCart(localName)}>
             <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
          </TouchableOpacity>
        </View>
        
        {/* Lista de productos para este local */}
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          scrollEnabled={false} 
        />
        
        <View style={styles.localFooter}>
            <Text style={styles.localTotalText}>Subtotal {localName}: ${localTotal.toLocaleString('es-CL')}</Text>
            <Button
                title={`Pagar en ${localName} (Generar QR)`}
                // --- CAMBIO CLAVE AQUÍ: Pasamos el nombre del local ---
                onPress={() => navigation.navigate('QRScreen', { localName: localName })} 
                color="#FFA500"
            />
        </View>
      </View>
    );
  };
// ... (resto del código y estilos) ...


  return (
    <ScrollView style={{flex: 1, backgroundColor: '#1c1c1c'}}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Carritos de Compra ({localNames.length})</Text>

        {localNames.length === 0 ? (
             <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
        ) : (
            <>
                {/* Mapeamos y mostramos todos los carritos individuales */}
                {localNames.map(renderLocalCart)}

                <View style={styles.grandFooter}>
                    <Text style={styles.grandTotalText}>TOTAL PEDIDO: ${grandTotal.toLocaleString('es-CL')}</Text>
                    <Text style={styles.noteText}>*Debes pagar cada carrito por separado.</Text>
                </View>
            </>
        )}
      </View>
    </ScrollView>
  );
};

// --- Estilos ---
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1c1c1c', paddingBottom: 20},
  mainTitle: {fontSize: 28, fontWeight: 'bold', color: '#fff', padding: 20},
  localCart: {
    backgroundColor: '#333',
    marginHorizontal: 10,
    marginBottom: 20,
    borderRadius: 10,
    paddingBottom: 10,
  },
  localHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  localTitle: {fontSize: 18, fontWeight: 'bold', color: '#FFA500'},
  itemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15 },
  itemInfo: { flex: 2.5 },
  itemNombre: {fontSize: 14, color: '#fff', fontWeight: 'bold'},
  itemPrecioUnitario: {fontSize: 14, color: '#aaa'},
  quantityControls: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  controlButton: { backgroundColor: '#555', borderRadius: 15, width: 25, height: 25, justifyContent: 'center', alignItems: 'center', marginHorizontal: 5 },
  controlText: { color: '#FFA500', fontSize: 18, fontWeight: 'bold' },
  quantityText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  itemTotal: {fontSize: 14, fontWeight: 'bold', color: '#FFA500', flex: 1.5, textAlign: 'right'},
  localFooter: {padding: 15, borderTopWidth: 1, borderTopColor: '#555', marginTop: 10},
  localTotalText: {fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 10, textAlign: 'right'},
  grandFooter: { padding: 20, borderTopWidth: 2, borderTopColor: '#FFA500', marginTop: 10, marginHorizontal: 20 },
  grandTotalText: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5, textAlign: 'right' },
  noteText: { fontSize: 12, color: '#aaa', textAlign: 'right' },
  emptyText: {color: '#999', textAlign: 'center', marginTop: 50, fontSize: 16},
  clearButtonText: { color: '#aaa', fontSize: 14, textDecorationLine: 'underline' },
});

export default CartScreen;