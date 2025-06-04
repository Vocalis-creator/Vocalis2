import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/SplashScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomizeTourScreen } from '../screens/CustomizeTourScreen';
import { TourPlayerScreen } from '../screens/TourPlayerScreen';
import type { TourResponse } from '../types';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Profile: undefined;
  CustomizeTour: undefined;
  TourPlayer: {
    tourData: TourResponse;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false, // Hide default headers since we have custom nav
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="CustomizeTour" component={CustomizeTourScreen} />
        <Stack.Screen name="TourPlayer" component={TourPlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 