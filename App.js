import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './src/context/UserContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <UserProvider>
        <View style={[styles.container, Platform.OS === 'web' && styles.containerWeb]}>
          <AppNavigator />
          <StatusBar style="auto" />
        </View>
      </UserProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
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
