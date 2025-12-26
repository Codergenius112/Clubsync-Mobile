import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarlightBackground from '../../components/StarlightBackground';

export default function DiscoverScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StarlightBackground />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#888" />
          <Text style={styles.searchPlaceholder}>Search events, apartments, cars...</Text>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Category</Text>
          
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('DiscoverMain')}
          >
            <Ionicons name="musical-notes" size={32} color="#f5dd4b" />
            <Text style={styles.categoryTitle}>Events</Text>
            <Text style={styles.categorySubtitle}>Parties, concerts & nightlife</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('ApartmentList')}
          >
            <Ionicons name="home" size={32} color="#f5dd4b" />
            <Text style={styles.categoryTitle}>Apartments</Text>
            <Text style={styles.categorySubtitle}>Short-term rentals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => navigation.navigate('CarList')}
          >
            <Ionicons name="car-sport" size={32} color="#f5dd4b" />
            <Text style={styles.categoryTitle}>Car Rentals</Text>
            <Text style={styles.categorySubtitle}>Drive in style</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Ionicons name="compass-outline" size={64} color="#f5dd4b" />
          <Text style={styles.title}>Discover</Text>
          <Text style={styles.subtitle}>Full search & filters coming soon...</Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  searchPlaceholder: {
    color: '#888',
    fontSize: 14,
    marginLeft: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    flex: 1,
  },
  categorySubtitle: {
    color: '#888',
    fontSize: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
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
    fontSize: 16,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 40,
  },
});