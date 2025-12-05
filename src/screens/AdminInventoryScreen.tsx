// src/screens/AdminInventoryScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const AdminInventoryScreen = () => {
    
    // Lista de productos simulada para el panel de control
    const mockInventory = [
        {id: '1', name: 'Empanada Pino', stock: 50, price: 1750, local: 'Casino'},
        {id: '2', name: 'Coca-Cola Lata', stock: 120, price: 1000, local: 'Kiosko Central'},
        {id: '3', name: 'Almuerzo del Día', stock: 30, price: 3500, local: 'Cafetería B'},
    ];

    const renderItem = ({item}: {item: any}) => (
        <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => Alert.alert('Editar', `Modificar precio y stock de ${item.name} en ${item.local}`)}
        >
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                <Icon name="settings-outline" size={24} color="#FFA500" style={{marginRight: 15}} />
                <View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemLocal}>{item.local}</Text>
                </View>
            </View>
            <View style={styles.statusBox}>
                <Text style={styles.itemStock}>STOCK: {item.stock}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.title}>Inventario Maestro (Admin)</Text>
                <FlatList
                    data={mockInventory}
                    renderItem={renderItem}
                    keyExtractor={item => item.id + item.local}
                />
                <Text style={styles.footerNote}>*Presiona un item para editar.</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1c1c1c' },
    container: { flex: 1, padding: 10 },
    title: { fontSize: 20, fontWeight: 'bold', color: '#fff', margin: 10, textAlign: 'center' },
    footerNote: { color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 10 },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    itemName: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
    itemLocal: { fontSize: 12, color: '#aaa' },
    statusBox: { alignItems: 'flex-end' },
    itemStock: { fontSize: 14, color: '#fff' },
    itemPrice: { fontSize: 16, color: '#FFA500', fontWeight: 'bold' },
});

export default AdminInventoryScreen;