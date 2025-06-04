import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
};

export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Home');
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <Text style={styles.title}>Vocalis</Text>
        <View style={styles.goldLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1929', // navy-900 from prototype
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '400', // Normal weight for serif feel
    color: '#FFFFFF',
    fontFamily: 'Arial',
    marginBottom: 16,
    textAlign: 'center',
  },
  goldLine: {
    width: 64, // w-16 from prototype
    height: 4,  // h-1 from prototype  
    backgroundColor: '#D4B46E', // gold-500 from prototype
  },
}); 