import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TopNavigationBar } from '../components/TopNavigationBar';
import { TourCard } from '../components/TourCard';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { TourResponse } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserTours } from '../services/tourService';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = useAuth();
  const [userTours, setUserTours] = useState<TourResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTourPress = (tour: TourResponse) => {
    navigation.navigate('TourPlayer', {
      tourData: tour,
    });
  };

  const handleSampleTourPress = (tour: { title: string; distance: string; duration: string; rating: number }) => {
    // Create a mock TourResponse for the hardcoded sample tours
    const mockTourData: TourResponse = {
      title: tour.title,
      location: tour.title.split(' ')[0], // Extract location from title
      duration_minutes: parseInt(tour.duration.split(' ')[0]), // Extract minutes from duration string
      interests: ['history', 'architecture'], // Default interests for sample tours
      segments: [
        {
          title: `Welcome to ${tour.title}`,
          content: `Welcome to your audio tour of ${tour.title}. This historic site offers incredible insights into the past. As you explore, you'll discover fascinating stories and learn about the cultural significance of this remarkable location. Listen carefully as we guide you through the most important highlights and hidden details that make this place truly special.`,
          audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
          duration_seconds: 120,
          order_index: 1,
        },
        {
          title: 'Historical Context',
          content: `The history of ${tour.title} spans many centuries. From its ancient origins to its modern significance, this location has witnessed countless events that shaped our world. The architecture you see today reflects the artistic and engineering achievements of past civilizations.`,
          audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
          duration_seconds: 180,
          order_index: 2,
        },
        {
          title: 'Architectural Highlights',
          content: `Notice the incredible architectural details surrounding you. Each element has been carefully crafted and preserved to maintain the authentic character of ${tour.title}. These structures represent the pinnacle of historical craftsmanship and design.`,
          audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
          duration_seconds: 150,
          order_index: 3,
        },
      ],
    };

    navigation.navigate('TourPlayer', {
      tourData: mockTourData,
    });
  };

  const handleStartTour = () => {
    navigation.navigate('CustomizeTour');
  };

  // Fetch user tours when component mounts or user changes
  useFocusEffect(
    React.useCallback(() => {
      const loadUserTours = async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
          const tours = await fetchUserTours(user.id);
          setUserTours(tours);
        } catch (err) {
          console.error('Error fetching user tours:', err);
          setError('Failed to load your tours. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      loadUserTours();
    }, [user?.id])
  );

  // Sample tour data (hardcoded for Phase 2)
  const sampleTours = [
    {
      title: "Roman Forum Ruins",
      distance: '0.3 miles',
      duration: '45 min',
      imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1000',
      rating: 4.8
    },
    {
      title: 'Medieval Castle Tour',
      distance: '1.2 miles',
      duration: '60 min',
      imageUrl: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=1000',
      rating: 4.6
    },
    {
      title: 'Ancient Harbor Walk',
      distance: '0.8 miles',
      duration: '30 min',
      imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?q=80&w=1000',
      rating: 4.3
    }
  ];

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <TopNavigationBar currentScreen="Home" />

      {/* Main Content */}
      <SafeAreaView style={styles.content}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome, Explorer</Text>
            <Text style={styles.subtitleText}>Discover history around you</Text>
          </View>
          
          <View style={styles.startTourSection}>
            <TouchableOpacity style={styles.startTourButton} onPress={handleStartTour}>
              <View style={styles.buttonContent}>
                <Feather 
                  name="headphones" 
                  size={20} 
                  color="#0A1929" 
                  style={styles.buttonIcon}
                />
                <Text style={styles.startTourButtonText}>Start a Tour</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* User Tours Section */}
          {user && (
            <View style={styles.userToursSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Tours</Text>
                <View style={styles.tourCountIndicator}>
                  <Feather 
                    name="bookmark" 
                    size={16} 
                    color="#D4B46E" 
                    style={styles.bookmarkIcon}
                  />
                  <Text style={styles.tourCountText}>{userTours.length}</Text>
                </View>
              </View>

              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#D4B46E" />
                  <Text style={styles.loadingText}>Loading your tours...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity 
                    style={styles.retryButton}
                    onPress={() => {
                      if (user?.id) {
                        const loadUserTours = async () => {
                          setLoading(true);
                          setError(null);
                          try {
                            const tours = await fetchUserTours(user.id);
                            setUserTours(tours);
                          } catch (err) {
                            setError('Failed to load your tours. Please try again.');
                          } finally {
                            setLoading(false);
                          }
                        };
                        loadUserTours();
                      }
                    }}
                  >
                    <Text style={styles.retryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              ) : userTours.length > 0 ? (
                <ScrollView style={styles.userToursList}>
                  {userTours.map((tour, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.userTourItem}
                      onPress={() => handleTourPress(tour)}
                    >
                      <View style={styles.userTourInfo}>
                        <Text style={styles.userTourTitle}>{tour.title}</Text>
                        <Text style={styles.userTourDetails}>
                          {tour.location} • {tour.duration_minutes} min • {tour.segments.length} stops
                        </Text>
                        <View style={styles.userTourInterests}>
                          {tour.interests.slice(0, 3).map((interest, i) => (
                            <Text key={i} style={styles.interestTag}>
                              {interest}
                            </Text>
                          ))}
                        </View>
                      </View>
                      <Feather name="chevron-right" size={20} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Feather name="map" size={48} color="#6B7280" style={styles.emptyStateIcon} />
                  <Text style={styles.emptyStateTitle}>No tours yet</Text>
                  <Text style={styles.emptyStateText}>
                    You haven't created any tours yet. Start a new tour to explore!
                  </Text>
                </View>
              )}
            </View>
          )}
          
          <View style={styles.nearbySitesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Sites</Text>
              <View style={styles.locationIndicator}>
                <Feather 
                  name="map-pin" 
                  size={16} 
                  color="#D4B46E" 
                  style={styles.locationIcon}
                />
                <Text style={styles.locationText}>Current Location</Text>
              </View>
            </View>
            
            {/* Tour Cards Section */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tourCardsContainer}
              contentContainerStyle={styles.tourCardsContent}
            >
              {sampleTours.map((tour, index) => (
                <TourCard
                  key={index}
                  title={tour.title}
                  distance={tour.distance}
                  duration={tour.duration}
                  imageUrl={tour.imageUrl}
                  rating={tour.rating}
                  onPress={() => handleSampleTourPress(tour)}
                />
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1929', // navy-900 from prototype
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: '#9CA3AF', // gray-400
    fontFamily: 'Arial',
  },
  startTourSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  startTourButton: {
    backgroundColor: '#D4B46E', // gold-500 from prototype
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#D4B46E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  startTourButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A1929', // navy-900 for contrast
    fontFamily: 'Arial',
  },
  userToursSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 12,
    fontFamily: 'Arial',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Arial',
  },
  retryButton: {
    backgroundColor: '#D4B46E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A1929',
    fontFamily: 'Arial',
  },
  userToursList: {
    maxHeight: 300,
  },
  userTourItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  userTourInfo: {
    flex: 1,
  },
  userTourTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Arial',
  },
  userTourDetails: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
    fontFamily: 'Arial',
  },
  userTourInterests: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    fontSize: 12,
    color: '#D4B46E',
    backgroundColor: '#D4B46E20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
    fontFamily: 'Arial',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateIcon: {
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: 'Arial',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 24,
    fontFamily: 'Arial',
  },
  tourCountIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkIcon: {
    marginRight: 4,
  },
  tourCountText: {
    fontSize: 14,
    color: '#D4B46E',
    fontFamily: 'Arial',
  },
  nearbySitesSection: {
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Arial',
  },
  locationIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#D4B46E', // gold-400
    fontFamily: 'Arial',
  },
  tourCardsContainer: {
    paddingLeft: 24,
  },
  tourCardsContent: {
    paddingRight: 24,
  },
}); 