import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StarlightBackground from '../../components/StarlightBackground';
import { useStore } from '../../store/useStore';
import { eventsAPI } from '../../services/api';

const { width } = Dimensions.get('window');

interface Event {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  coverImage: string;
  price: number;
  status: string;
}

export default function HomeScreen({ navigation }: any) {
  const user = useStore((state) => state.user);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getEvents({
        page: 1,
        pageSize: 10,
      });
      
      const allEvents = response.events || [];
      setFeaturedEvents(allEvents.slice(0, 3));
      setUpcomingEvents(allEvents.slice(3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const renderFeaturedEvent = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={styles.featuredCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.coverImage || 'https://via.placeholder.com/400x250' }}
        style={styles.featuredImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.9)']}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredInfo}>
          <Text style={styles.featuredCategory}>{event.category.toUpperCase()}</Text>
          <Text style={styles.featuredTitle}>{event.name}</Text>
          <View style={styles.featuredMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#f5dd4b" />
              <Text style={styles.metaText}>{formatDate(event.date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color="#f5dd4b" />
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={styles.priceValue}>₦{event.price.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderUpcomingEvent = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={styles.upcomingCard}
      onPress={() => navigation.navigate('EventDetails', { eventId: event.id })}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: event.coverImage || 'https://via.placeholder.com/150' }}
        style={styles.upcomingImage}
      />
      <View style={styles.upcomingInfo}>
        <Text style={styles.upcomingCategory}>{event.category}</Text>
        <Text style={styles.upcomingTitle} numberOfLines={2}>
          {event.name}
        </Text>
        <View style={styles.upcomingMeta}>
          <Ionicons name="calendar-outline" size={12} color="#888" />
          <Text style={styles.upcomingDate}>{formatDate(event.date)}</Text>
        </View>
        <View style={styles.upcomingMeta}>
          <Ionicons name="location-outline" size={12} color="#888" />
          <Text style={styles.upcomingLocation} numberOfLines={1}>
            {event.location}
          </Text>
        </View>
        <Text style={styles.upcomingPrice}>₦{event.price.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StarlightBackground />
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f5dd4b" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey {user?.name?.split(' ')[0] || 'There'}! 👋</Text>
            <Text style={styles.subtitle}>Discover tonight's hottest events</Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Actions - UPDATED with Apartments & Cars */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Discover')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="search" size={20} color="#f5dd4b" />
            </View>
            <Text style={styles.actionText}>Search</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('ApartmentList')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="home" size={20} color="#f5dd4b" />
            </View>
            <Text style={styles.actionText}>Apartments</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('CarList')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="car" size={20} color="#f5dd4b" />
            </View>
            <Text style={styles.actionText}>Cars</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton} 
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Bookings')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="calendar" size={20} color="#f5dd4b" />
            </View>
            <Text style={styles.actionText}>Bookings</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Events */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {featuredEvents.map(renderFeaturedEvent)}
          </ScrollView>
        </View>

        {/* Upcoming Events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming This Week</Text>
          {upcomingEvents.map(renderUpcomingEvent)}
        </View>

        {/* Quick Access Cards - NEW */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          
          {/* Apartments Card */}
          <TouchableOpacity 
            style={styles.quickAccessCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ApartmentList')}
          >
            <LinearGradient
              colors={['#4a148c', '#7b1fa2']}
              style={styles.quickAccessGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.quickAccessContent}>
                <Ionicons name="home" size={32} color="#fff" />
                <View style={styles.quickAccessText}>
                  <Text style={styles.quickAccessTitle}>Apartments</Text>
                  <Text style={styles.quickAccessSubtitle}>
                    Find your perfect stay
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Car Rental Card */}
          <TouchableOpacity 
            style={styles.quickAccessCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CarList')}
          >
            <LinearGradient
              colors={['#01579b', '#0277bd']}
              style={styles.quickAccessGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.quickAccessContent}>
                <Ionicons name="car-sport" size={32} color="#fff" />
                <View style={styles.quickAccessText}>
                  <Text style={styles.quickAccessTitle}>Car Rentals</Text>
                  <Text style={styles.quickAccessSubtitle}>
                    Drive in style
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ff4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 221, 75, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAll: {
    color: '#f5dd4b',
    fontSize: 14,
  },
  featuredScroll: {
    paddingLeft: 20,
  },
  featuredCard: {
    width: width * 0.85,
    height: 300,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  featuredInfo: {},
  featuredCategory: {
    color: '#f5dd4b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    color: '#888',
    fontSize: 12,
    marginRight: 4,
  },
  priceValue: {
    color: '#f5dd4b',
    fontSize: 20,
    fontWeight: 'bold',
  },
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
  },
  upcomingImage: {
    width: 120,
    height: 120,
  },
  upcomingInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  upcomingCategory: {
    color: '#f5dd4b',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  upcomingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  upcomingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  upcomingDate: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
  upcomingLocation: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  upcomingPrice: {
    color: '#f5dd4b',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  quickAccessCard: {
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickAccessGradient: {
    padding: 20,
  },
  quickAccessContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickAccessText: {
    flex: 1,
    marginLeft: 16,
  },
  quickAccessTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickAccessSubtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  bottomSpacer: {
    height: 40,
  },
});