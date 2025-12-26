import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import StarlightBackground from '../../components/StarlightBackground';
import { useStore } from '../../store/useStore';
import { eventsAPI } from '../../services/api';

const { width, height } = Dimensions.get('window');

interface EventDetails {
  id: string;
  name: string;
  date: string;
  location: string;
  category: string;
  description: string;
  coverImage: string;
  price: number;
  capacity: number;
  currentAttendees: number;
  status: string;
  dressCode?: string;
  ageRestriction?: string;
  amenities?: string[];
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface AmbienceMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
}

export default function EventDetailsScreen({ route, navigation }: any) {
  const { eventId } = route.params;
  const favoriteEvents = useStore((state) => state.favoriteEvents);
  const addFavoriteEvent = useStore((state) => state.addFavoriteEvent);
  const removeFavoriteEvent = useStore((state) => state.removeFavoriteEvent);

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [ambience, setAmbience] = useState<AmbienceMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'menu' | 'ambience'>('about');

  const isFavorite = favoriteEvents.includes(eventId);

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const [eventData, menuData, ambienceData] = await Promise.all([
        eventsAPI.getEventById(eventId),
        eventsAPI.getEventMenu(eventId),
        eventsAPI.getEventAmbience(eventId),
      ]);

      setEvent(eventData);
      setMenu(menuData.items || []);
      setAmbience(ambienceData.media || []);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      removeFavoriteEvent(eventId);
    } else {
      addFavoriteEvent(eventId);
    }
  };

  const shareEvent = async () => {
    try {
      await Share.share({
        message: `Check out ${event?.name} on ClubSync! 🎉`,
        url: `https://clubsync.app/events/${eventId}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCapacityPercentage = () => {
    if (!event) return 0;
    return (event.currentAttendees / event.capacity) * 100;
  };

  const getCapacityColor = () => {
    const percentage = getCapacityPercentage();
    if (percentage >= 80) return '#ff4444';
    if (percentage >= 50) return '#f5dd4b';
    return '#00C851';
  };

  const renderAboutTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.description}>{event?.description}</Text>

      {/* Info Cards */}
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Ionicons name="calendar" size={24} color="#f5dd4b" />
          <Text style={styles.infoLabel}>Date</Text>
          <Text style={styles.infoValue}>{formatDate(event?.date || '')}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="location" size={24} color="#f5dd4b" />
          <Text style={styles.infoLabel}>Location</Text>
          <Text style={styles.infoValue}>{event?.location}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Ionicons name="shirt" size={24} color="#f5dd4b" />
          <Text style={styles.infoLabel}>Dress Code</Text>
          <Text style={styles.infoValue}>{event?.dressCode || 'Smart Casual'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="people" size={24} color="#f5dd4b" />
          <Text style={styles.infoLabel}>Age</Text>
          <Text style={styles.infoValue}>{event?.ageRestriction || '18+'}</Text>
        </View>
      </View>

      {/* Capacity Bar */}
      <View style={styles.capacityContainer}>
        <View style={styles.capacityHeader}>
          <Text style={styles.capacityTitle}>Venue Capacity</Text>
          <Text style={styles.capacityValue}>
            {event?.currentAttendees || 0} / {event?.capacity || 0}
          </Text>
        </View>
        <View style={styles.capacityBar}>
          <View
            style={[
              styles.capacityFill,
              {
                width: `${getCapacityPercentage()}%`,
                backgroundColor: getCapacityColor(),
              },
            ]}
          />
        </View>
      </View>

      {/* Amenities */}
      {event?.amenities && event.amenities.length > 0 && (
        <View style={styles.amenitiesContainer}>
          <Text style={styles.amenitiesTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {event.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityChip}>
                <Ionicons name="checkmark-circle" size={16} color="#00C851" />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderMenuTab = () => (
    <View style={styles.tabContent}>
      {menu.length > 0 ? (
        menu.map((item) => (
          <View key={item.id} style={styles.menuItem}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.menuImage} />
            )}
            <View style={styles.menuInfo}>
              <Text style={styles.menuCategory}>{item.category}</Text>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>₦{item.price.toLocaleString()}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>Menu not available for this event</Text>
      )}
    </View>
  );

  const renderAmbienceTab = () => (
    <View style={styles.tabContent}>
      {ambience.length > 0 ? (
        <View style={styles.ambienceGrid}>
          {ambience.map((media) => (
            <TouchableOpacity key={media.id} style={styles.ambienceItem} activeOpacity={0.8}>
              <Image source={{ uri: media.url }} style={styles.ambienceImage} />
              {media.type === 'video' && (
                <View style={styles.playButton}>
                  <Ionicons name="play" size={24} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No photos or videos available</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StarlightBackground />
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StarlightBackground />
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: event?.coverImage || 'https://via.placeholder.com/400x300' }}
            style={styles.headerImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.headerGradient}
          />

          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={shareEvent}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#ff4444' : '#fff'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Title */}
        <View style={styles.titleContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{event?.category.toUpperCase()}</Text>
          </View>
          <Text style={styles.eventTitle}>{event?.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.priceValue}>₦{event?.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'about' && styles.activeTab]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'menu' && styles.activeTab]}
            onPress={() => setActiveTab('menu')}
          >
            <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>
              Menu
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ambience' && styles.activeTab]}
            onPress={() => setActiveTab('ambience')}
          >
            <Text style={[styles.tabText, activeTab === 'ambience' && styles.activeTabText]}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'about' && renderAboutTab()}
        {activeTab === 'menu' && renderMenuTab()}
        {activeTab === 'ambience' && renderAmbienceTab()}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('BookingFlow', { eventId })}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#f5dd4b', '#d4a017']}
            style={styles.bookGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#111" />
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    width: width,
    height: height * 0.4,
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
  actionButtons: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  titleContainer: {
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 221, 75, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    color: '#f5dd4b',
    fontSize: 12,
    fontWeight: '600',
  },
  eventTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceLabel: {
    color: '#888',
    fontSize: 14,
    marginRight: 8,
  },
  priceValue: {
    color: '#f5dd4b',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f5dd4b',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#f5dd4b',
  },
  tabContent: {
    padding: 20,
  },
  description: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 8,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  capacityContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  capacityTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  capacityValue: {
    color: '#888',
    fontSize: 14,
  },
  capacityBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 4,
  },
  amenitiesContainer: {
    marginTop: 24,
  },
  amenitiesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
  menuItem: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  menuImage: {
    width: 100,
    height: 100,
  },
  menuInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  menuCategory: {
    color: '#888',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  menuName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  menuPrice: {
    color: '#f5dd4b',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  ambienceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ambienceItem: {
    width: (width - 52) / 2,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  ambienceImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -24 }],
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  bookButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  bookButtonText: {
    color: '#111',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});