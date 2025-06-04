import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import type { TourResponse, TourSegment } from '../types';

type TourPlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TourPlayer'>;
type TourPlayerScreenRouteProp = RouteProp<RootStackParamList, 'TourPlayer'>;

export const TourPlayerScreen = () => {
  const navigation = useNavigation<TourPlayerScreenNavigationProp>();
  const route = useRoute<TourPlayerScreenRouteProp>();
  
  const { tourData } = route.params;

  // Audio state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Tour state
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  
  // Get current segment
  const currentSegment = tourData.segments[currentSegmentIndex] || tourData.segments[0];

  // Calculate progress percentage
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Reload audio when segment changes
  useEffect(() => {
    if (currentSegment) {
      loadAudio();
    }
  }, [currentSegmentIndex]);

  const setupAudio = async () => {
    try {
      // Set audio mode for playback
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      await loadAudio();
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      
      // Unload previous audio if exists
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      
      console.log('🎵 Loading audio for segment:', currentSegment.title);
      console.log('🎵 Audio URL:', currentSegment.audio_url);
      
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentSegment.audio_url },
        { shouldPlay: false }
      );
      
      setSound(newSound);
      
      // Set up status update callback
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis || 0);
          setTotalDuration(status.durationMillis || 0);
          setIsPlaying(status.isPlaying || false);
          
          // Auto-advance to next segment when current one finishes
          if (status.didJustFinish && currentSegmentIndex < tourData.segments.length - 1) {
            setCurrentSegmentIndex(prev => prev + 1);
          }
        }
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const seekTo = async (percentage: number) => {
    if (!sound || totalDuration === 0) return;
    
    try {
      const seekTime = (percentage / 100) * totalDuration;
      await sound.setPositionAsync(seekTime);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const skipBackward = async () => {
    const newTime = Math.max(0, currentTime - 15000); // 15 seconds back
    await sound?.setPositionAsync(newTime);
  };

  const skipForward = async () => {
    const newTime = Math.min(totalDuration, currentTime + 15000); // 15 seconds forward
    await sound?.setPositionAsync(newTime);
  };

  const goToPreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex(prev => prev - 1);
    }
  };

  const goToNextSegment = () => {
    if (currentSegmentIndex < tourData.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    }
  };

  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Split transcript into sentences for better highlighting
  const transcriptSentences = currentSegment.text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const getCurrentSentenceIndex = () => {
    if (transcriptSentences.length === 0) return 0;
    const progressRatio = totalDuration > 0 ? currentTime / totalDuration : 0;
    return Math.floor(progressRatio * transcriptSentences.length);
  };

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
          <Text style={styles.headerTitle}>{tourData.title}</Text>
          <Text style={styles.headerSubtitle}>
            Segment {currentSegmentIndex + 1} of {tourData.segments.length}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.minimizeButton}
        >
          <Feather name="minimize-2" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Current Segment Info */}
        <View style={styles.segmentContainer}>
          <Text style={styles.segmentTitle}>{currentSegment.title}</Text>
          <View style={styles.segmentMeta}>
            <Text style={styles.segmentLocation}>{tourData.location}</Text>
            <Text style={styles.segmentDuration}>
              ~{Math.ceil(currentSegment.duration / 60)} min
            </Text>
          </View>
        </View>

        {/* Audio Transcript */}
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptTitle}>Audio Content</Text>
          <View style={styles.transcriptContent}>
            {transcriptSentences.map((sentence, index) => (
              <Text 
                key={index} 
                style={[
                  styles.transcriptSentence,
                  index === getCurrentSentenceIndex() && styles.activeTranscriptSentence
                ]}
              >
                {sentence.trim()}.
              </Text>
            ))}
          </View>
        </View>

        {/* Segment Navigation */}
        {tourData.segments.length > 1 && (
          <View style={styles.segmentNavigation}>
            <TouchableOpacity 
              style={[styles.segmentNavButton, currentSegmentIndex === 0 && styles.segmentNavButtonDisabled]}
              onPress={goToPreviousSegment}
              disabled={currentSegmentIndex === 0}
            >
              <Feather name="chevron-left" size={20} color={currentSegmentIndex === 0 ? "#14385C" : "#D4B46E"} />
              <Text style={[styles.segmentNavText, currentSegmentIndex === 0 && styles.segmentNavTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.segmentIndicators}>
              {tourData.segments.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.segmentIndicator,
                    index === currentSegmentIndex && styles.segmentIndicatorActive
                  ]}
                  onPress={() => setCurrentSegmentIndex(index)}
                />
              ))}
            </View>

            <TouchableOpacity 
              style={[
                styles.segmentNavButton, 
                currentSegmentIndex === tourData.segments.length - 1 && styles.segmentNavButtonDisabled
              ]}
              onPress={goToNextSegment}
              disabled={currentSegmentIndex === tourData.segments.length - 1}
            >
              <Text style={[
                styles.segmentNavText, 
                currentSegmentIndex === tourData.segments.length - 1 && styles.segmentNavTextDisabled
              ]}>
                Next
              </Text>
              <Feather 
                name="chevron-right" 
                size={20} 
                color={currentSegmentIndex === tourData.segments.length - 1 ? "#14385C" : "#D4B46E"} 
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Audio Interactions */}
        <View style={styles.interactionsContainer}>
          <TouchableOpacity style={styles.interactionButton}>
            <Feather name="help-circle" size={20} color="#D4B46E" />
            <Text style={styles.interactionText}>Ask Question</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interactionButton}>
            <Feather name="shuffle" size={20} color="#D4B46E" />
            <Text style={styles.interactionText}>Change Topic</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.interactionButton}>
            <Feather name="bookmark" size={20} color="#D4B46E" />
            <Text style={styles.interactionText}>Save Tour</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Audio Controls */}
      <View style={styles.controlsContainer}>
        {/* Progress Bar */}
        <TouchableOpacity 
          style={styles.progressBarContainer}
          onPress={(event) => {
            const { locationX } = event.nativeEvent;
            const containerWidth = 300; // approximate width
            const percentage = (locationX / containerWidth) * 100;
            seekTo(Math.max(0, Math.min(100, percentage)));
          }}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </TouchableOpacity>

        {/* Time Display */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(totalDuration)}</Text>
        </View>

        {/* Playback Controls */}
        <View style={styles.playbackControls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={skipBackward}
          >
            <Feather name="rewind" size={32} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.playPauseButton}
            onPress={togglePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <Feather name="loader" size={32} color="#0A1929" />
            ) : (
              <Feather 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color="#0A1929" 
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={skipForward}
          >
            <Feather name="fast-forward" size={32} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#14385C', // navy-600
  },
  backButton: {
    padding: 4,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Arial',
    marginTop: 2,
  },
  minimizeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  segmentContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  segmentTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 8,
  },
  segmentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentLocation: {
    fontSize: 16,
    color: '#D4B46E',
    fontFamily: 'Arial',
  },
  segmentDuration: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Arial',
  },
  transcriptContainer: {
    marginBottom: 24,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 16,
  },
  transcriptContent: {
    backgroundColor: 'rgba(15, 41, 66, 0.5)', // navy-800 with opacity
    borderRadius: 12,
    padding: 16,
  },
  transcriptSentence: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Arial',
    lineHeight: 24,
    marginBottom: 8,
  },
  activeTranscriptSentence: {
    color: '#D4B46E',
    backgroundColor: 'rgba(212, 180, 110, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  segmentNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
  },
  segmentNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  segmentNavButtonDisabled: {
    opacity: 0.5,
  },
  segmentNavText: {
    fontSize: 14,
    color: '#D4B46E',
    fontFamily: 'Arial',
    marginHorizontal: 4,
  },
  segmentNavTextDisabled: {
    color: '#14385C',
  },
  segmentIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#14385C',
    marginHorizontal: 3,
  },
  segmentIndicatorActive: {
    backgroundColor: '#D4B46E',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  interactionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  interactionButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  interactionText: {
    fontSize: 12,
    color: '#D4B46E',
    fontFamily: 'Arial',
    marginTop: 4,
  },
  controlsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#14385C',
    backgroundColor: '#0F2942', // navy-800
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#14385C',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4B46E',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  timeText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Arial',
  },
  playbackControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  controlButton: {
    padding: 8,
  },
  playPauseButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D4B46E',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 