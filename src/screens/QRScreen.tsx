import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Alert, ActivityIndicator, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg'; 
import { useCart } from '../context/CartContext'; 

// --- ⚠️ URL DE TU API DE DJANGO PARA PROCESAR LA ORDEN ⚠️ ---
// ¡REEMPLAZA ESTO CON LA URL CORRECTA!
const API_ORDER_ENDPOINT = 'TU_URL_DEL_ENDPOINT_DE_DJANGO_PROCESAR_ORDEN'; 

// Definición de las propiedades esperadas
type QRScreenProps = {
    navigation: any;
    route: { params: { localName: string } }; 
};

// Componente QRScreen
const QRScreen = ({ navigation, route }: QRScreenProps) => {
    // 🟢 Obtención de datos del contexto real 
    const { carts, clearCart } = useCart();
    const localName = route.params?.localName || 'ERROR_LOCAL';

    // Obtenemos el carrito específico y calculamos el total
    const currentCart = carts[localName] || [];
    const total = currentCart.reduce((sum, item) => sum + (item.precio * item.quantity), 0); 
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderCode, setOrderCode] = useState<string | null>(null); 
    const [statusMessage, setStatusMessage] = useState('Conectando con el Backend...');

    // Función que transforma el ID de la orden en el contenido del QR
    const generateQRData = (orderIdFromBackend: number, isSimulated: boolean = false) => {
        const orderDetails = {
            id: orderIdFromBackend,
            local: localName,
            total: total,
            // Si es simulado, mostramos una advertencia dentro del JSON
            status: isSimulated ? 'SIMULACION_LOCAL' : 'REGISTRADA_OK',
            items: currentCart.map(item => ({
                name: item.nombre,
                qty: item.quantity,
                price: item.precio
            })),
            timestamp: new Date().toISOString()
        };
        return JSON.stringify(orderDetails); 
    };

    // --- FUNCIÓN PARA PROCESAR EL PEDIDO Y OBTENER EL ID DEL BACKEND ---
    const handleCheckout = async () => {
        if (currentCart.length === 0) {
            Alert.alert('Error', 'El carrito está vacío. Regresa a la pantalla principal.');
            navigation.goBack(); 
            return;
        }

        setIsProcessing(true);
        setStatusMessage('Registrando orden en el Backend (Django/AWS)...');
        
        const orderData = { 
            local_name: localName, 
            total: total, 
            carrito_items: currentCart
        };

        try {
            // 1. INTENTO DE CONEXIÓN REAL A LA API DE DJANGO
            const response = await fetch(API_ORDER_ENDPOINT, {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify(orderData),
            });
            
            const result = await response.json();

            if (response.ok && result.order_id) {
                // ÉXITO REAL
                const qrContent = generateQRData(result.order_id); 
                setOrderCode(qrContent); 
                setStatusMessage('Orden registrada exitosamente en RDS. QR listo.');
                
            } else {
                // FALLO DE LA API (Ej. 400 Bad Request o mensaje de error del servidor)
                throw new Error(result.message || 'Error del servidor, código no 200.');
            }

        } catch (error) {
            // 2. 🚨 SIMULACIÓN DE FALLO DE CONEXIÓN/SERVIDOR 🚨
            console.error('Fallo al conectar con la API real, activando modo SIMULACIÓN:', error);
            
            const simulatedId = Math.floor(Math.random() * 9000) + 1000;
            const qrContent = generateQRData(simulatedId, true); 

            setOrderCode(qrContent); 
            setStatusMessage('⚠️ Falla de conexión API: QR generado con ID SIMULADO para fines de demostración. ⚠️');
            
        } finally {
            setIsProcessing(false);
        }
    };
    
    // Se ejecuta SOLAMENTE al montar la pantalla
    useEffect(() => {
        handleCheckout();
    }, []); 

    // ----------------------------------------------------
    // Componente Modal para mostrar el QR
    // ----------------------------------------------------
    const QRModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={!!orderCode && !isProcessing} // Visible si hay código y no está procesando
            onRequestClose={() => setOrderCode(null)}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Código de Pago ({localName})</Text>
                    <Text style={styles.modalSubtitle}>Muestra este código al comerciante para acelerar la compra.</Text>
                    
                    {/* --- GENERADOR DE CÓDIGO QR --- */}
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={orderCode || 'ERROR'} 
                            size={250}
                            color="#1c1c1c"
                            backgroundColor="white"
                        />
                    </View>

                    <Text style={styles.orderCodeText}>Total: ${total.toLocaleString('es-CL')}</Text>
                    <Text style={[styles.statusNote, {color: orderCode && orderCode.includes('SIMULACION') ? '#FF4500' : '#3CB371'}]}>
                        {statusMessage}
                    </Text>
                    
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            clearCart(localName); 
                            navigation.popToTop(); 
                        }}
                    >
                        <Text style={styles.closeButtonText}>Cerrar y Regresar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    // ----------------------------------------------------
    // Renderizado Principal de la Pantalla (Muestra carga o el modal)
    // ----------------------------------------------------
    if (isProcessing || orderCode === null) {
        // Muestra el indicador de carga y el mensaje de estado
        return (
            <SafeAreaView style={[styles.safeArea, {justifyContent: 'center', alignItems: 'center'}]}>
                <ActivityIndicator size="large" color="#FFA500" />
                <Text style={{color: '#ccc', marginTop: 10, fontSize: 16}}>{statusMessage}</Text>
                
                <ScrollView style={{flexGrow: 0, height: 200, padding: 20}}>
                     {currentCart.map((item: any) => (
                        <View key={item.id} style={styles.cartItem}>
                            <Text style={styles.itemName}>{item.nombre}</Text>
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                                <Text style={styles.itemPrice}>${(item.precio * item.quantity).toLocaleString('es-CL')}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        );
    }
    
    // Si orderCode tiene un valor, renderiza el modal y la pantalla de fondo
    return (
        <SafeAreaView style={styles.safeArea}>
            <QRModal /> 

            {/* Muestra la pantalla de fondo con la confirmación de la orden */}
            <View style={styles.header}>
                 <Text style={styles.headerTitle}>¡Orden Registrada! ✅</Text>
                 <Icon name="checkmark-circle-outline" size={30} color="#3CB371" />
            </View>
            <ScrollView style={styles.listContainer}>
                 {currentCart.map((item: any) => (
                    <View key={item.id} style={styles.cartItem}>
                        <Text style={styles.itemName}>{item.nombre}</Text>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                            <Text style={styles.itemPrice}>${(item.precio * item.quantity).toLocaleString('es-CL')}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalPrice}>${total.toLocaleString('es-CL')}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1c1c1c' },
    header: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 15,
        backgroundColor: '#2c2c2c',
        borderBottomWidth: 1,
        borderBottomColor: '#444'
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
    listContainer: { flex: 1, padding: 15 },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    itemName: { fontSize: 16, color: '#FFFFFF', flex: 2 },
    itemDetails: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', flex: 1 },
    itemQuantity: { fontSize: 16, color: '#ccc', marginRight: 15 },
    itemPrice: { fontSize: 16, fontWeight: 'bold', color: '#FFA500' },

    footer: { padding: 20, backgroundColor: '#2c2c2c', borderTopWidth: 1, borderTopColor: '#444' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    totalLabel: { fontSize: 18, color: '#FFFFFF', fontWeight: 'bold' },
    totalPrice: { fontSize: 20, color: '#FFA500', fontWeight: '900' },
    
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalView: {
        width: '90%',
        backgroundColor: '#2c2c2c',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFA500', marginBottom: 10 },
    modalSubtitle: { fontSize: 14, color: '#ccc', marginBottom: 20, textAlign: 'center' },
    qrContainer: { padding: 10, backgroundColor: 'white', borderRadius: 10, marginBottom: 20 },
    orderCodeText: { fontSize: 18, color: '#FFFFFF', marginTop: 10, textAlign: 'center', fontWeight: 'bold' },
    statusNote: { fontSize: 14, fontWeight: 'bold', marginTop: 5, textAlign: 'center' },
    closeButton: {
        backgroundColor: '#FF4500',
        borderRadius: 8,
        padding: 15,
        marginTop: 20,
    },
    closeButtonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default QRScreen;