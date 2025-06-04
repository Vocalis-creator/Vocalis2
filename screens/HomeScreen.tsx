import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TopNavigationBar } from '../components/TopNavigationBar';
import { TourCard } from '../components/TourCard';
import type { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleTourPress = (tour: { title: string; distance: string; duration: string; rating: number }) => {
    navigation.navigate('TourPlayer', {
      title: tour.title,
      distance: tour.distance,
      duration: tour.duration,
      rating: tour.rating,
    });
  };

  const handleStartTour = () => {
    navigation.navigate('CustomizeTour');
  };

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
                  onPress={() => handleTourPress(tour)}
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