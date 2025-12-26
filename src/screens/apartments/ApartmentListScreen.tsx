import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarlightBackground from '../../components/StarlightBackground';

const { width } = Dimensions.get('window');

interface Apartment {
  id: string;
  name: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
  rating: number;
}

export default function ApartmentListScreen({ navigation }: any) {
  const [apartments, setApartments] = useState<Apartment[]>([
    {
      id: '1',
      name: 'Luxury Loft Downtown',
      location: 'Victoria Island, Lagos',
      price: 150000,
      bedrooms: 3,
      bathrooms: 2,
      image: 'https://via.placeholder.com/400x250',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Modern Studio Apartment',
      location: 'Ikoyi, Lagos',
      price: 80000,
      bedrooms: 1,
      bathrooms: 1,
      image: 'https://via.placeholder.com/400x250',
      rating: 4.5,
    },
  ]);

  const renderApartment = (apartment: Apartment) => (
    <TouchableOpacity
      key={apartment.id}
      style={styles.apartmentCard}
      onPress={() => navigation.navigate('ApartmentDetails', { apartmentId: apartment.id })}
      activeOpacity={0.8}
    >
      <Image source={{ uri: apartment.image }} style={styles.apartmentImage} />
      <View style={styles.apartmentInfo}>
        <View style={styles.apartmentHeader}>
          <Text style={styles.apartmentName} numberOfLines={1}>
            {apartment.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#f5dd4b" />
            <Text style={styles.rating}>{apartment.rating}</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#888" />
          <Text style={styles.location}>{apartment.location}</Text>
        </View>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="bed-outline" size={16} color="#f5dd4b" />
            <Text style={styles.detailText}>{apartment.bedrooms} Beds</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="water-outline" size={16} color="#f5dd4b" />
            <Text style={styles.detailText}>{apartment.bathrooms} Baths</Text>
          </View>
        </View>
        
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Per Night</Text>
          <Text style={styles.price}>₦{apartment.price.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StarlightBackground />
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apartments</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Available Apartments</Text>
        {apartments.map(renderApartment)}
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
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  apartmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    overflow: 'hidden',
  },
  apartmentImage: {
    width: '100%',
    height: 200,
  },
  apartmentInfo: {
    padding: 16,
  },
  apartmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  apartmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 221, 75, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    color: '#f5dd4b',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    color: '#888',
    fontSize: 14,
    marginLeft: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    color: '#888',
    fontSize: 12,
  },
  price: {
    color: '#f5dd4b',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 40,
  },
});