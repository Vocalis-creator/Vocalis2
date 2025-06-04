import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface TourCardProps {
  title: string;
  distance: string;
  duration: string;
  imageUrl: string;
  rating: number;
  onPress?: () => void;
}

export const TourCard = ({
  title,
  distance,
  duration,
  imageUrl,
  rating,
  onPress
}: TourCardProps) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Image Section */}
      <ImageBackground 
        source={{ uri: imageUrl }} 
        style={styles.imageSection}
        imageStyle={styles.image}
      >
        {/* Optional overlay for better image contrast */}
        <View style={styles.imageOverlay} />
      </ImageBackground>
      
      {/* Content Section */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{title}</Text>
        
        {/* Bottom Row: Distance & Duration on left, Rating on right */}
        <View style={styles.bottomRow}>
          <View style={styles.leftInfo}>
            <Text style={styles.distance}>{distance}</Text>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.duration}>{duration}</Text>
          </View>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>★</Text>
            <Text style={styles.rating}>{rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: '#0F2942', // navy-800 from prototype
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#14385C', // navy-600 from prototype
    marginRight: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageSection: {
    height: 144, // h-36 from prototype (slightly taller)
    justifyContent: 'flex-end',
  },
  image: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '400', // font-serif equivalent
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 4,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: '#D1D5DB', // gray-300 from prototype
    fontFamily: 'Arial',
  },
  bullet: {
    fontSize: 14,
    color: '#D1D5DB', // gray-300 from prototype
    marginHorizontal: 8,
    fontFamily: 'Arial',
  },
  duration: {
    fontSize: 14,
    color: '#D1D5DB', // gray-300 from prototype
    fontFamily: 'Arial',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    color: '#D4B46E', // gold-400 from prototype
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#D1D5DB', // gray-300 from prototype
    fontFamily: 'Arial',
  },
}); 