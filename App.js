import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';

import LandingScreen from './src/screens/LandingScreen';
import MarketsScreen from './src/screens/MarketsScreen';
import PredictScreen from './src/screens/PredictScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SignalsScreen from './src/screens/SignalsScreen';
import { COLORS } from './src/constants/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({ label, focused }) => (
  <Text style={{
    fontSize: 18,
    opacity: focused ? 1 : 0.5,
  }}>
    {label === 'Markets' ? '📈' : label === 'AI Predict' ? '🤖' : label === 'History' ? '📚' : '📡'}
  </Text>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerStyle: { backgroundColor: COLORS.headerBg },
      headerTintColor: COLORS.headerText,
      headerTitleStyle: { fontWeight: '600', letterSpacing: 0.5 },
      tabBarStyle: {
        backgroundColor: COLORS.headerBg,
        borderTopColor: 'rgba(255,255,255,0.1)',
        paddingBottom: 8,
        paddingTop: 8,
        height: 65,
      },
      tabBarActiveTintColor: COLORS.accent,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      tabBarLabelStyle: { fontSize: 10, marginTop: 2 },
      tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
    })}
  >
    <Tab.Screen
      name="Markets"
      component={MarketsScreen}
      options={{ title: 'ChainStock — Markets' }}
    />
    <Tab.Screen
      name="AI Predict"
      component={PredictScreen}
      options={{ title: 'AI Prediction Engine' }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{ title: 'Market History' }}
    />
    <Tab.Screen
      name="Signals"
      component={SignalsScreen}
      options={{ title: 'Market Signals' }}
    />
  </Tab.Navigator>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: COLORS.headerBg },
            headerTintColor: COLORS.headerText,
            headerTitleStyle: { fontWeight: '600', letterSpacing: 0.5 },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="Landing"
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ title: 'ChainStock' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
