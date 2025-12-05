// src/screens/AdminDashboardScreen.tsx
import React from 'react';
import {View, Text, StyleSheet, SafeAreaView, Button, TouchableOpacity, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const AdminDashboardScreen = ({onLogout}: {onLogout: () => void}) => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Panel de Administración</Text>
        <Text style={styles.subtitle}>Supervisión y Gestión Global</Text>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => navigation.navigate('AdminInventory' as never)}
        >
          <Icon name="cube-outline" size={30} color="#FFA500" />
          <Text style={styles.cardTitle}>Inventario Global</Text>
          <Text style={styles.cardSubtitle}>Modificar precios y stock de todos los locales.</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.card}
          onPress={() => Alert.alert('KPIs', 'Métricas de CloudWatch (Simulación)')}
        >
          <Icon name="bar-chart-outline" size={30} color="#FFA500" />
          <Text style={styles.cardTitle}>Métricas (KPIs)</Text>
          <Text style={styles.cardSubtitle}>Revisión de rendimiento del servidor.</Text>
        </TouchableOpacity>

        <View style={{marginTop: 40}}>
            <Button title="Cerrar Sesión" onPress={onLogout} color="#FF4500" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#1c1c1c' },
    container: { flex: 1, padding: 20 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    subtitle: { fontSize: 16, color: '#aaa', marginBottom: 30 },
    card: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginLeft: 15 },
    cardSubtitle: { fontSize: 12, color: '#bbb', marginLeft: 15, position: 'absolute', top: 40, left: 50 },
});

export default AdminDashboardScreen;