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
import {useCart} from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';

// --- (Datos de prueba - Lista completa) ---
// NOTA: Los paths de imagen usan solo archivos .jpg existentes para evitar errores.
const PRODUCTOS_CON_PRECIOS = [
  {id: '1', nombre: 'Empanada de Pino', categoria: 'Empanadas', precios: [{local: 'Kiosko Central', precio: 1800}, {local: 'Casino', precio: 1750}, {local: 'Cafetería B', precio: 1800},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '3', nombre: 'Coca-Cola en Lata', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 1000}, {local: 'Casino', precio: 1000}, {local: 'Cafetería B', precio: 1100},], image: require('../assets/images/coca_cola.jpg'), },
  {id: '6', nombre: 'Brownie de Chocolate', categoria: 'Dulceria', precios: [{local: 'Kiosko Central', precio: 1300}, {local: 'Casino', precio: 1200},], image: require('../assets/images/brownie_chocolate.jpg'), },
  {id: '5', nombre: 'Sandwich Jamón Queso', categoria: 'Sandwich', precios: [{local: 'Kiosko Central', precio: 2000}, {local: 'Cafetería B', precio: 2100},], image: require('../assets/images/jamon_queso.jpg'), },
  {id: '8', nombre: 'Jugo Natural', categoria: 'Bebestibles', precios: [{local: 'Casino', precio: 1300}, {local: 'Cafetería B', precio: 1350},], image: require('../assets/images/jugo_natural.jpg'), },
  {id: '9', nombre: 'Kuchen de Manzana', categoria: 'Dulceria', precios: [{local: 'Casino', precio: 1600}, {local: 'Cafetería B', precio: 1500},], image: require('../assets/images/kuchen_manzana.jpg'), },
  {id: '10', nombre: 'Sandwich Pollo Pimentón', categoria: 'Sandwich', precios: [{local: 'Kiosko Central', precio: 2200}, {local: 'Cafetería B', precio: 2200},], image: require('../assets/images/pollo_pimenton.jpg'), },
  {id: '11', nombre: 'Coca-Cola Zero 500ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 1200}, {local: 'Casino', precio: 1250},], image: require('../assets/images/coca_zero.jpg'), },
  {id: '12', nombre: 'Lasaña Bolognesa', categoria: 'Almuerzos', precios: [{local: 'Casino', precio: 4000},], image: require('../assets/images/Lasaña_boloñesa.jpg'), },
  {id: '13', nombre: 'Chaparrita (Mechada)', categoria: 'Sandwich', precios: [{local: 'Kiosko Central', precio: 2500}, {local: 'Cafetería B', precio: 2600},], image: require('../assets/images/chaparrita.jpg'), },
  {id: '14', nombre: 'Agua con Gas 600ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 900}, {local: 'Casino', precio: 1000}, {local: 'Cafetería B', precio: 900},], image: require('../assets/images/agua_cg_vital.jpg'), },
  {id: '23', nombre: 'Agua con Gas 600ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 900}, {local: 'Casino', precio: 1000}, {local: 'Cafetería B', precio: 900},], image: require('../assets/images/benedictino_cg.jpg'), },
  {id: '24', nombre: 'Agua con Gas 600ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 900}, {local: 'Casino', precio: 1000}, {local: 'Cafetería B', precio: 900},], image: require('../assets/images/cachantun_cg.jpg'), },
  {id: '25', nombre: 'Agua con Gas 600ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 900}, {local: 'Casino', precio: 1000}, {local: 'Cafetería B', precio: 900},], image: require('../assets/images/strongas.jpg'), },
  {id: '15', nombre: 'Agua sin Gas 600ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 850}, {local: 'Casino', precio: 950},], image: require('../assets/images/coca_cola.jpg'), },
  {id: '16', nombre: 'Media Luna', categoria: 'Dulceria', precios: [{local: 'Casino', precio: 800}, {local: 'Cafetería B', precio: 750},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '17', nombre: 'Dona Glaseada', categoria: 'Dulceria', precios: [{local: 'Kiosko Central', precio: 1100}, {local: 'Casino', precio: 1100},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '18', nombre: 'Mendozino Italiano', categoria: 'Sandwich', precios: [{local: 'Cafetería B', precio: 3100},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '19', nombre: 'Almuerzo Vegetariano', categoria: 'Almuerzos', precios: [{local: 'Casino', precio: 3700}, {local: 'Cafetería B', precio: 3900},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '20', nombre: 'Té/Infusión', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 600}, {local: 'Casino', precio: 700}, {local: 'Cafetería B', precio: 650},], image: require('../assets/images/coca_cola.jpg'), },
  {id: '21', nombre: 'Barra de Cereal', categoria: 'Dulceria', precios: [{local: 'Kiosko Central', precio: 950},], image: require('../assets/images/empanada_pino.jpg'), },
  {id: '22', nombre: 'Bebida Isotónica 500ml', categoria: 'Bebestibles', precios: [{local: 'Kiosko Central', precio: 1400}, {local: 'Casino', precio: 1500},], image: require('../assets/images/coca_cola.jpg'), },
];
const CATEGORIAS = ['Todo', 'Empanadas', 'Almuerzos', 'Bebestibles', 'Sandwich', 'Dulceria'];

const HomeScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todo');
  const navigation = useNavigation();
  const {carts, addToCart, totalItemsCount} = useCart();
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);


  // (Hook del Header - sin cambios)
  useLayoutEffect(() => {
    const totalItems = totalItemsCount;
    navigation.setOptions({
      title: 'ComparApp',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.navigate('CartScreen' as never)}>
          <Icon name="cart-outline" size={28} color="#FFA500" />
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
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
  }, [navigation, totalItemsCount]);

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

  const handleAddToCart = (chosenPrice: {local: string; precio: number}) => {
    addToCart(selectedProduct, chosenPrice);
    setIsModalVisible(false);
    setSelectedProduct(null);
  };

  // --- renderItem para el diseño de tarjetas (Cuadrícula) ---
  const renderItem = ({item}: {item: any}) => {
    const lowestPrice = Math.min(...item.precios.map((p: any) => p.precio));
    return (
      <TouchableOpacity
        style={styles.cardContainer} // Usamos CardContainer
        onPress={() => handleProductPress(item)} // Abre el modal
      >
        <View style={styles.imageWrapper}>
            <Image source={item.image} style={styles.cardImage} />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardNombre}>{item.nombre}</Text>
          <Text style={styles.cardCategoria}>{item.categoria}</Text>
          <Text style={styles.cardPriceTag}>
            Desde: 
            <Text style={styles.cardPriceValue}>
                ${lowestPrice.toLocaleString('es-CL')}
            </Text>
          </Text>
        </View>
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
        {/* --- FlatList MODIFICADO para Cuadrícula de 2 columnas --- */}
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2} // <-- Clave para la cuadrícula
          columnWrapperStyle={styles.row} // Estilo para la fila
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron productos.</Text>
          }
        />
      </View>

      {/* --- EL MODAL PARA ELEGIR PRECIO (sin cambios) --- */}
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
    </SafeAreaView>
  );
};

// --- ESTILOS MEJORADOS PARA DISEÑO DE TARJETAS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1c1c1c' },
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 20 },
  headerButton: { paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -5, right: 0, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  searchBar: { width: '100%', height: 50, backgroundColor: '#333', borderColor: '#555', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 20, fontSize: 16, color: '#FFFFFF' },
  categoryButton: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#333', borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: '#555' },
  categoryButtonActive: { backgroundColor: '#FFA500', borderColor: '#FFA500' },
  categoryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#FFFFFF', paddingHorizontal: 5 },
  
  row: { 
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  cardContainer: {
    width: '48%', 
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imageWrapper: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  cardImage: {
    width: 140, 
    height: 140,
    resizeMode: 'cover', // Asegura que la imagen cubra el espacio
  },
  cardTextContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  cardNombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardCategoria: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 5,
  },
  cardPriceTag: {
    fontSize: 14,
    color: '#ccc',
  },
  cardPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500', 
  },

  emptyText: { color: '#999', textAlign: 'center', marginTop: 50, fontSize: 16 },
  // Estilos del Modal (sin cambios, pero necesarios)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#333', borderRadius: 15, padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
  modalSubtitle: { fontSize: 16, color: '#aaa', textAlign: 'center', marginTop: 5, marginBottom: 20 },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#444', padding: 15, borderRadius: 8, marginBottom: 10 },
  modalOptionLocal: { fontSize: 18, color: '#FFFFFF', fontWeight: '600' },
  modalOptionPrecio: { fontSize: 18, color: '#FFA500', fontWeight: 'bold' },
});

export default HomeScreen;