import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarlightBackground from '../../components/StarlightBackground';

export default function OnboardingScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StarlightBackground />

      <View style={styles.content}>
        <Ionicons name="sparkles" size={64} color="#f5dd4b" />
        <Text style={styles.title}>Welcome to ClubSync</Text>
        <Text style={styles.subtitle}>Your Nightlife Companion</Text>
        <Text style={styles.description}>
          Discover events, book tables, and enjoy VIP experiences
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  subtitle: {
    color: '#f5dd4b',
    fontSize: 18,
    marginBottom: 16,
  },
  description: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#f5dd4b',
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});