import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Platform, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AlertModal from './components/AlertModal';

interface AlertItem {
  id: number;
  title: string;
  message: string;
  timestamp: string;
}

export default function App() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Alert App</Text>
      </View>
      
      <ScrollView style={styles.alertList}>
        {loading ? (
          <Text style={styles.loadingText}>Loading alerts...</Text>
        ) : alerts.length === 0 ? (
          <Text style={styles.noAlertsText}>No alerts found</Text>
        ) : (
          alerts.map((alert) => (
            <View key={alert.id} style={styles.alertItem}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTimestamp}>
                {new Date(alert.timestamp).toLocaleString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ New Alert</Text>
      </TouchableOpacity>

      <AlertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={async (title, message) => {
          try {
            const response = await fetch('http://localhost:8000/api/alerts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ title, message }),
            });

            if (!response.ok) {
              throw new Error('Failed to create alert');
            }

            const newAlert = await response.json();
            setAlerts(prevAlerts => [...prevAlerts, newAlert]);
            setModalVisible(false);
          } catch (error) {
            Alert.alert('Error', 'Failed to create alert. Please try again.');
            console.error('Error creating alert:', error);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#000',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  alertList: {
    flex: 1,
    padding: 20,
  },
  alertItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  alertTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  noAlertsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#000',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
