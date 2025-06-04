import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import type { NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
};

interface TopNavigationBarProps {
  currentScreen: string;
}

export const TopNavigationBar = ({ currentScreen }: TopNavigationBarProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleHomePress = () => {
    if (currentScreen !== 'Home') {
      navigation.navigate('Home');
    }
  };

  const getIconColor = (screen: string, isCurrentScreen: boolean) => {
    return isCurrentScreen ? '#D4B46E' : '#9CA3AF'; // gold when active, gray when inactive
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={handleHomePress}
        disabled={currentScreen === 'Home'}
      >
        <Feather 
          name="home" 
          size={20} 
          color={getIconColor('Home', currentScreen === 'Home')}
          style={styles.iconStyle}
        />
        <Text style={currentScreen === 'Home' ? styles.activeText : styles.inactiveText}>
          Home
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={handleProfilePress}>
        <Feather 
          name="user" 
          size={20} 
          color={getIconColor('Profile', currentScreen === 'Profile')}
          style={styles.iconStyle}
        />
        <Text style={currentScreen === 'Profile' ? styles.activeText : styles.inactiveText}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0F2942', // navy-800 from prototype
    borderBottomWidth: 1,
    borderBottomColor: '#14385C', // navy-600 from prototype
    paddingVertical: 8,
    paddingTop: 50, // Account for status bar
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  iconStyle: {
    marginBottom: 2,
  },
  activeText: {
    fontSize: 12,
    color: '#D4B46E', // gold-500 from prototype
    fontFamily: 'Arial',
  },
  inactiveText: {
    fontSize: 12,
    color: '#9CA3AF', // gray-400
    fontFamily: 'Arial',
  },
}); 