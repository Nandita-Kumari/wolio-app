import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform, ActivityIndicator, Text } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <View style={[styles.container, Platform.OS === 'web' && styles.containerWeb]}>
          <AppNavigator />
          <StatusBar style="auto" />
        </View>
      </UserProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  containerWeb: {
    minHeight: '100vh',
    height: '100%',
  },
});
