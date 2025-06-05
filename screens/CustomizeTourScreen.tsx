import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Switch,
  Modal,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { createTourRequest, validateTourRequest, type TourRequestDTO } from '../types';
import { generateMockTour } from '../services';
import { useAuth } from '../contexts/AuthContext';

type CustomizeTourScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomizeTour'>;
type CustomizeTourScreenRouteProp = RouteProp<RootStackParamList, 'CustomizeTour'>;

interface InterestTag {
  id: string;
  name: string;
  icon: string;
}

interface TooltipInfo {
  id: string | null;
  text: string;
  position: {
    x: number;
    y: number;
  };
}

const { width: screenWidth } = Dimensions.get('window');

export const CustomizeTourScreen = () => {
  const navigation = useNavigation<CustomizeTourScreenNavigationProp>();
  const route = useRoute<CustomizeTourScreenRouteProp>();
  const { user } = useAuth();
  
  // Duration options as discrete intervals
  const durationOptions = [15, 30, 45, 60, 90, 120]; // in minutes
  
  // Form state
  const [location, setLocation] = useState('Sistine Chapel');
  const [durationIndex, setDurationIndex] = useState(2); // Default to 45min (index 2)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [includeRoute, setIncludeRoute] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Tooltip state
  const [tooltip, setTooltip] = useState<TooltipInfo>({
    id: null,
    text: '',
    position: { x: 0, y: 0 }
  });

  // Tooltip data
  const tooltipData = {
    location: 'Enter the specific location you want to learn about',
    duration: 'Set how long you want your audio tour to be',
    topics: "Select topics you're interested in learning about",
    route: 'If selected, tour will include guidance on where to walk'
  };

  // Interest topics based on design prototype
  const interestTags: InterestTag[] = [
    { id: 'war', name: 'War', icon: '⚔️' },
    { id: 'mythology', name: 'Mythology', icon: '🏛️' },
    { id: 'politics', name: 'Politics', icon: '🏛️' },
    { id: 'innovation', name: 'Innovation', icon: '💡' },
    { id: 'art', name: 'Renaissance Art', icon: '🎨' },
    { id: 'architecture', name: 'Architecture', icon: '🏗️' },
    { id: 'history', name: 'History', icon: '📚' },
    { id: 'culture', name: 'Culture', icon: '🎭' },
    { id: 'religion', name: 'Religion', icon: '⛪' },
    { id: 'science', name: 'Science', icon: '🔬' },
  ];

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const showTooltip = (id: string, event: any) => {
    event.target?.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
      const tooltipText = tooltipData[id as keyof typeof tooltipData] || '';
      
      // Calculate tooltip position
      let tooltipX = pageX + width + 10; // 10px to the right of the icon
      const tooltipY = pageY - 10; // Slightly above the icon
      
      // Ensure tooltip doesn't go off screen
      if (tooltipX + 250 > screenWidth) {
        tooltipX = pageX - 260; // Show to the left if not enough space on right
      }
      
      setTooltip({
        id,
        text: tooltipText,
        position: { x: tooltipX, y: tooltipY }
      });
    });
  };

  const hideTooltip = () => {
    setTooltip({
      id: null,
      text: '',
      position: { x: 0, y: 0 }
    });
  };

  /**
   * Creates a tour request DTO from the current form state
   * This will later be sent to the AI backend for tour generation
   */
  const buildTourRequest = (): TourRequestDTO => {
    return createTourRequest({
      location,
      durationIndex,
      selectedTopics,
      includeRoute,
      // Use authenticated user ID
      userId: user?.id || null,
      // TODO: Get user's preferred language from settings when implemented
      language: 'en'
    });
  };

  const handleCreateTour = async () => {
    try {
      setIsLoading(true);
      
      // Build the tour request DTO
      const tourRequest = buildTourRequest();
      
      // Validate the request
      validateTourRequest(tourRequest);
      
      // Log the DTO for development purposes
      console.log('🎧 Tour Request DTO:', {
        ...tourRequest,
        timestamp: new Date().toISOString(),
        screen: 'CustomizeTourScreen'
      });
      
      // Generate the mock tour using the new service
      const generatedTour = await generateMockTour(tourRequest);
      
      console.log('✅ Tour generated successfully:', {
        title: generatedTour.title,
        segments: generatedTour.segments.length,
        location: generatedTour.location
      });
      
      setIsLoading(false);
      
      // Navigate to TourPlayerScreen with the generated tour data
      navigation.navigate('TourPlayer', {
        tourData: generatedTour,
      });
      
    } catch (error) {
      console.error('❌ Error creating tour request:', error);
      setIsLoading(false);
      
      // TODO: Show user-friendly error message
      // For now, just log the error
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to create tour'}`);
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  const getCurrentDuration = () => durationOptions[durationIndex];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A1929" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={24} color="#D4B46E" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{location}</Text>
          <Text style={styles.headerSubtitle}>Customize your tour experience</Text>
        </View>
      </View>

      {/* Form Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Location Input */}
        <View style={styles.formSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Location</Text>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={(event) => showTooltip('location', event)}
            >
              <Feather name="help-circle" size={16} color="#D4B46E" />
            </TouchableOpacity>
          </View>
          <View style={styles.locationInputContainer}>
            <TextInput
              style={styles.locationInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Enter a location"
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.locationButton}>
              <Feather name="map-pin" size={20} color="#D4B46E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration Slider */}
        <View style={styles.formSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Tour Duration: {formatDuration(getCurrentDuration())}</Text>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={(event) => showTooltip('duration', event)}
            >
              <Feather name="help-circle" size={16} color="#D4B46E" />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderContainer}>
            {/* Custom discrete slider track */}
            <View style={styles.sliderTrack}>
              {/* Active track portion */}
              <View 
                style={[
                  styles.sliderTrackActive,
                  { width: `${(durationIndex / (durationOptions.length - 1)) * 100}%` }
                ]} 
              />
            </View>
            
            {/* Slider markers/dots */}
            <View style={styles.sliderMarkers}>
              {durationOptions.map((duration, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.sliderMarker,
                    index === durationIndex && styles.sliderMarkerActive
                  ]}
                  onPress={() => setDurationIndex(index)}
                >
                  <View style={[
                    styles.sliderDot,
                    index === durationIndex && styles.sliderDotActive
                  ]} />
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Labels */}
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>15m</Text>
              <Text style={styles.sliderLabel}>2h</Text>
            </View>
          </View>
        </View>

        {/* Interest Topics */}
        <View style={styles.formSection}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>Tour Focus</Text>
            <TouchableOpacity 
              style={styles.helpButton}
              onPress={(event) => showTooltip('topics', event)}
            >
              <Feather name="help-circle" size={16} color="#D4B46E" />
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            {interestTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.interestTag,
                  selectedTopics.includes(tag.id) && styles.interestTagSelected
                ]}
                onPress={() => toggleTopic(tag.id)}
              >
                <Text style={styles.tagEmoji}>{tag.icon}</Text>
                <Text style={[
                  styles.tagText,
                  selectedTopics.includes(tag.id) && styles.tagTextSelected
                ]}>
                  {tag.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Route Guidance Toggle */}
        <View style={styles.formSection}>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleLeft}>
              <Text style={styles.toggleLabel}>Include route recommendation</Text>
              <TouchableOpacity 
                style={styles.helpButton}
                onPress={(event) => showTooltip('route', event)}
              >
                <Feather name="help-circle" size={16} color="#D4B46E" />
              </TouchableOpacity>
            </View>
            <Switch
              value={includeRoute}
              onValueChange={setIncludeRoute}
              trackColor={{ false: '#14385C', true: '#D4B46E' }}
              thumbColor={includeRoute ? '#0A1929' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Create Tour Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.createButton, isLoading && styles.createButtonDisabled]}
            onPress={handleCreateTour}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Feather name="loader" size={20} color="#0A1929" style={styles.loadingIcon} />
                <Text style={styles.createButtonText}>Generating Your Tour...</Text>
              </View>
            ) : (
              <Text style={styles.createButtonText}>Create Tour</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tooltip Modal */}
      <Modal
        visible={tooltip.id !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={hideTooltip}
      >
        <TouchableOpacity 
          style={styles.tooltipOverlay}
          activeOpacity={1}
          onPress={hideTooltip}
        >
          <View 
            style={[
              styles.tooltipContainer,
              {
                left: tooltip.position.x,
                top: tooltip.position.y,
              }
            ]}
          >
            <Text style={styles.tooltipText}>{tooltip.text}</Text>
            <View style={styles.tooltipArrow} />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1929', // navy-900
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#14385C', // navy-600
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Arial',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formSection: {
    marginTop: 32,
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginRight: 8,
  },
  helpButton: {
    padding: 4,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationInput: {
    flex: 1,
    backgroundColor: '#0F2942', // navy-800
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    borderColor: '#14385C',
    borderRightWidth: 0,
    fontSize: 16,
    fontFamily: 'Arial',
  },
  locationButton: {
    backgroundColor: '#0F2942',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#14385C',
    borderLeftWidth: 0,
  },
  sliderContainer: {
    paddingVertical: 20,
    position: 'relative',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#14385C',
    borderRadius: 2,
    position: 'relative',
  },
  sliderTrackActive: {
    height: 4,
    backgroundColor: '#D4B46E',
    borderRadius: 2,
  },
  sliderMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    paddingHorizontal: 0,
  },
  sliderMarker: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  sliderMarkerActive: {
    // Active marker styles can be added here if needed
  },
  sliderDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#14385C',
    borderWidth: 2,
    borderColor: '#0A1929',
  },
  sliderDotActive: {
    backgroundColor: '#D4B46E',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderColor: '#0A1929',
    borderWidth: 2,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 6,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Arial',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F2942',
    borderWidth: 1,
    borderColor: '#14385C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  interestTagSelected: {
    backgroundColor: '#D4B46E',
    borderColor: '#D4B46E',
  },
  tagEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#D1D5DB',
    fontFamily: 'Arial',
  },
  tagTextSelected: {
    color: '#0A1929',
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginRight: 8,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: 40,
  },
  createButton: {
    backgroundColor: '#D4B46E',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0A1929',
    fontFamily: 'Arial',
  },
  // Tooltip styles
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  tooltipContainer: {
    position: 'absolute',
    backgroundColor: '#0F2942', // navy-800
    borderWidth: 1,
    borderColor: '#14385C', // navy-600
    borderRadius: 8,
    padding: 12,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Arial',
    lineHeight: 18,
  },
  tooltipArrow: {
    position: 'absolute',
    left: -6,
    top: 12,
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderRightWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRightColor: '#0F2942',
  },
}); 