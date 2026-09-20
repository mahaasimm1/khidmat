import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/home/HomeScreen';
import CauseDetailScreen from '../screens/causes/CauseDetailScreen';
import DonationScreen from '../screens/donations/DonationScreen';
import DonationSuccessScreen from '../screens/donations/DonationSuccessScreen';
import MyDonationsScreen from '../screens/donations/MyDonationsScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator initialRouteName={user ? 'Home' : 'Login'} screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="CauseDetail" component={CauseDetailScreen} />
          <Stack.Screen name="Donation" component={DonationScreen} />
          <Stack.Screen name="DonationSuccess" component={DonationSuccessScreen} />
          <Stack.Screen name="MyDonations" component={MyDonationsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
