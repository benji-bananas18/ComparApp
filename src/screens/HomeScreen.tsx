// src/screens/HomeScreen.tsx
import React, {useState, useMemo, useLayoutEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal, // Importamos el Modal
  Button, // Para el botón de cerrar
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useCart} from '../context/CartContext'; // <-- Importación
import Icon from 'react-native-vector-icons/Ionicons';

// --- (Datos de prueba y Categorías sin cambios) ---
const PRODUCTOS_CON_PRECIOS = [
  {id: '1', nombre: 'Empanada de Pino', categoria: 'Empanadas', precios: [{local: 'Kiosko Central', precio: 1800}, {local: 'Casino', precio: 1750}, {local: 'Cafetería B', precio: 1800},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '3', nombre: 'Coca-Cola en Lata', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 1000}, {local: 'Casino', precio: 1000}, {local: 'Cafetería B', precio: 1100},], image: require('../assets/images/coca_cola.jpg'), },
  {id: '6', nombre: 'Brownie de Chocolate', categoria: 'Dulceria', precios: [{local: 'Kiosko Central', precio: 1300}, {local: 'Casino', precio: 1200},], image: require('../assets/images/brownie_chocolate.jpg'), },
  {id: '2', nombre: 'Almuerzo del Día', categoria: 'Almuerzos', precios: [{local: 'Casino', precio: 3500}, {local: 'Cafetería B', precio: 3800},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '5', nombre: 'Sandwich Jamón Queso', categoria: 'Sandwich', precios: [{local: 'Kiosko Central', precio: 2000}, {local: 'Cafetería B', precio: 2100},], image: require('../assets/images/jamon_queso.jpg'), },
  {id: '7', nombre: 'Empanada Queso', categoria: 'Empanadas', precios: [{local: 'Kiosko Central', precio: 1500}, {local: 'Casino', precio: 1500},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '8', nombre: 'Jugo Natural Naranja', categoria: 'Bebestibles', precios: [{local: 'Casino', precio: 1300}, {local: 'Cafetería B', precio: 1350},], image: require('../assets/images/coca_cola.jpg'), },
  {id: '9', nombre: 'Kuchen de Manzana', categoria: 'Dulceria', precios: [{local: 'Casino', precio: 1600}, {local: 'Cafetería B', precio: 1500},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '10', nombre: 'Sandwich Pollo Pimentón', categoria: 'Sandwich', precios: [{local: 'Kiosko Central', precio: 2200}, {local: 'Cafetería B', precio: 2200},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '11', nombre: 'Coca-Cola Zero 500ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 1200}, {local: 'Casino', precio: 1250},], image: require('../assets/images/coca_zero.jpg'), },
  {id: '12', nombre: 'Lasaña Bolognesa', categoria: 'Almuerzos', precios: [{local: 'Casino', precio: 4000},], image: require('../assets/images/empanada_pino.jpg'), },
];
const CATEGORIAS = ['Todo', 'Empanadas', 'Almuerzos', 'Bebestibles', 'Sandwich', 'Dulceria'];

const HomeScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const navigation = useNavigation();
  // --- ACTUALIZADO: Obtenemos el contador total ---
  const {carts, addToCart, totalItemsCount} = useCart(); 
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // --- useLayoutEffect ACTUALIZADO ---
  useLayoutEffect(() => {
    // Ya no necesitamos calcular el total, lo obtenemos de totalItemsCount
    navigation.setOptions({
      title: 'ComparApp',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('CartScreen' as never)}>
          <Icon name="cart-outline" size={28} color="#FFA500" />
          {/* USAMOS EL CONTADOR GLOBAL DEL CONTEXTO */}
          {totalItemsCount > 0 && ( 
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItemsCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('Profile' as never)}
        >
          <Icon name="person-circle-outline" size={30} color="#FFA500" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, totalItemsCount]); // Dependencia actualizada

  // (Lógica de filtrado - sin cambios)
  const filteredProducts = useMemo(() => {
    let productos = PRODUCTOS_CON_PRECIOS;
    if (selectedCategory !== 'Todo') {
      productos = productos.filter(p => p.categoria === selectedCategory);
    }
    if (searchText.length > 0) {
      productos = productos.filter(p =>
        p.nombre.toLowerCase().includes(searchText.toLowerCase()),
      );
    }
    return productos;
  }, [selectedCategory, searchText]);


  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  // El modal ya llama a la nueva función addToCart que usa el local
  const handleAddToCart = (chosenPrice: {local: string; precio: number}) => {
    addToCart(selectedProduct, chosenPrice); 
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // (renderItem - sin cambios)
  const renderItem = ({item}: {item: any}) => {
    const lowestPrice = Math.min(...item.precios.map((p: any) => p.precio));

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => handleProductPress(item)} // Abre el modal
      >
        <Image source={item.image} style={styles.itemImagen} />
        
        {/* Contenedor para texto y lista de precios */}
        <View style={styles.itemTextoContainer}>
          <Text style={styles.itemNombre}>{item.nombre}</Text>
          <Text style={styles.itemCategoria}>{item.categoria}</Text>
          <Text style={styles.lowestPriceText}>
            Desde: ${lowestPrice.toLocaleString('es-CL')}
          </Text>
        </View>
        <Icon name="chevron-forward-outline" size={22} color="#555" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* (Barra de búsqueda y categorías sin cambios) */}
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar producto..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={{marginBottom: 20}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIAS.map(categoria => (
              <TouchableOpacity
                key={categoria}
                style={[
                  styles.categoryButton,
                  selectedCategory === categoria && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(categoria)}>
                <Text style={styles.categoryText}>{categoria}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.title}>Productos</Text>
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron productos.</Text>
          }
        />
      </View>

      {/* --- EL MODAL PARA ELEGIR PRECIO --- */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{selectedProduct?.nombre}</Text>
            <Text style={styles.modalSubtitle}>Selecciona un local:</Text>
            
            {/* Lista de precios/locales */}
            {selectedProduct?.precios.map((priceOption: any) => (
              <TouchableOpacity
                key={priceOption.local}
                style={styles.modalOption}
                onPress={() => handleAddToCart(priceOption)}
              >
                <Text style={styles.modalOptionLocal}>{priceOption.local}</Text>
                <Text style={styles.modalOptionPrecio}>
                  ${priceOption.precio.toLocaleString('es-CL')}
                </Text>
              </TouchableOpacity>
            ))}
            
            <Button title="Cancelar" onPress={() => setIsModalVisible(false)} color="#FF4500" />
          </View>
        </View>
      </Modal>
      {/* --- FIN DEL MODAL --- */}

    </SafeAreaView>
  );
};

// --- ESTILOS (sin cambios) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1c1c1c' },
  container: { flex: 1, padding: 20 },
  headerButton: { paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -5, right: 0, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  searchBar: { width: '100%', height: 50, backgroundColor: '#333', borderColor: '#555', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, fontSize: 16, color: '#FFFFFF' },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#333', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#555' },
  categoryButtonActive: { backgroundColor: '#FFA500', borderColor: '#FFA500' },
  categoryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#FFFFFF' },
  list: { flex: 1 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  itemImagen: { width: 60, height: 60, borderRadius: 8, marginRight: 15, backgroundColor: '#555' },
  itemTextoContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemNombre: { fontSize: 18, fontWeight: '500', color: '#FFFFFF' },
  itemCategoria: { fontSize: 14, color: '#aaa', marginBottom: 5 },
  lowestPriceText: { 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
    marginTop: 4,
  },
  emptyText: { color: '#999', textAlign: 'center', marginTop: 50, fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalOptionLocal: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalOptionPrecio: {
    fontSize: 18,
    color: '#FFA500',
    fontWeight: 'bold',
  },
});

export default HomeScreen;