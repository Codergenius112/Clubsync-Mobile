import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StarlightBackground from '../../components/StarlightBackground';

const { width, height } = Dimensions.get('window');

export default function ApartmentDetailsScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <StarlightBackground />
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/400x300' }}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}
          />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Luxury Loft Downtown</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#f5dd4b" />
            <Text style={styles.location}>Victoria Island, Lagos</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailCard}>
              <Ionicons name="bed" size={24} color="#f5dd4b" />
              <Text style={styles.detailLabel}>Bedrooms</Text>
              <Text style={styles.detailValue}>3</Text>
            </View>
            <View style={styles.detailCard}>
              <Ionicons name="water" size={24} color="#f5dd4b" />
              <Text style={styles.detailLabel}>Bathrooms</Text>
              <Text style={styles.detailValue}>2</Text>
            </View>
            <View style={styles.detailCard}>
              <Ionicons name="resize" size={24} color="#f5dd4b" />
              <Text style={styles.detailLabel}>Size</Text>
              <Text style={styles.detailValue}>120m²</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            Beautiful luxury loft in the heart of Victoria Island. Fully furnished with modern amenities, 
            stunning city views, and 24/7 security. Perfect for short or long-term stays.
          </Text>

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {['WiFi', 'AC', 'Kitchen', 'Parking', 'Pool', 'Gym'].map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <Ionicons name="checkmark-circle" size={16} color="#00C851" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Per Night</Text>
          <Text style={styles.priceValue}>₦150,000</Text>
        </View>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('ApartmentBooking')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#f5dd4b', '#d4a017']}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </LinearGradient>
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
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    width: width,
    height: height * 0.35,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  location: {
    color: '#888',
    fontSize: 14,
    marginLeft: 4,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  detailCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  detailLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
  detailValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  description: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 200, 81, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: {
    color: '#00C851',
    fontSize: 12,
    marginLeft: 4,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#222',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    color: '#888',
    fontSize: 12,
  },
  priceValue: {
    color: '#f5dd4b',
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  bookButtonText: {
    color: '#111',
    fontSize: 16,
    fontWeight: 'bold',
  },
});