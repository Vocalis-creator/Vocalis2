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

type TourPlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TourPlayer'>;
type TourPlayerScreenRouteProp = RouteProp<RootStackParamList, 'TourPlayer'>;

export const TourPlayerScreen = () => {
  const navigation = useNavigation<TourPlayerScreenNavigationProp>();
  const route = useRoute<TourPlayerScreenRouteProp>();
  
  const { title, distance, duration, rating } = route.params;

  // Audio state
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Mock transcript data
  const transcript = [
    `Welcome to the ${title} audio tour.`,
    "Let's begin exploring this fascinating historical site.",
    "As we walk through, you'll discover the rich history and hidden stories.",
    "Listen carefully to the detailed explanations of each landmark.",
    "This guided experience will bring the past to life before your eyes."
  ];

  // Calculate progress percentage
  const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  // Sample audio URL (public domain test file)
  const audioUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav';

  useEffect(() => {
    setupAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

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
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: false }
      );
      
      setSound(newSound);
      
      // Set up status update callback
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setCurrentTime(status.positionMillis || 0);
          setTotalDuration(status.durationMillis || 0);
          setIsPlaying(status.isPlaying || false);
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

  const formatTime = (timeInMs: number) => {
    const totalSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentTranscriptIndex = () => {
    return Math.floor(progress / 20); // Mock: each transcript line represents ~20% of audio
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
        <Text style={styles.headerTitle}>{title}</Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.minimizeButton}
        >
          <Feather name="minimize-2" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Audio Transcript */}
        <View style={styles.transcriptContainer}>
          <Text style={styles.transcriptTitle}>Audio Transcript</Text>
          {transcript.map((line, index) => (
            <Text 
              key={index} 
              style={[
                styles.transcriptLine,
                index === getCurrentTranscriptIndex() && styles.activeTranscriptLine
              ]}
            >
              {line}
            </Text>
          ))}
        </View>

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
            <Feather name="mouse-pointer" size={20} color="#D4B46E" />
            <Text style={styles.interactionText}>Double Click</Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    textAlign: 'center',
    flex: 1,
  },
  minimizeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  transcriptContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 16,
  },
  transcriptLine: {
    fontSize: 16,
    color: '#9CA3AF',
    fontFamily: 'Arial',
    lineHeight: 24,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeTranscriptLine: {
    color: '#D4B46E',
    backgroundColor: 'rgba(212, 180, 110, 0.1)',
    borderRadius: 8,
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