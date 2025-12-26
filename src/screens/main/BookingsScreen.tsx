import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarlightBackground from '../../components/StarlightBackground';

export default function BookingsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StarlightBackground />

      <View style={styles.content}>
        <Ionicons name="ticket-outline" size={64} color="#f5dd4b" />
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Coming Soon...</Text>
        <Text style={styles.description}>
          View and manage your event bookings
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    color: '#f5dd4b',
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});