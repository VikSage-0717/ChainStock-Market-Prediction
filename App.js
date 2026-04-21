import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text } from 'react-native';

import MarketsScreen from './src/screens/MarketsScreen';
import PredictScreen from './src/screens/PredictScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SignalsScreen from './src/screens/SignalsScreen';
import { COLORS } from './src/constants/theme';

const Tab = createBottomTabNavigator();

const TabIcon = ({ label, focused }) => (
  <Text style={{
    fontSize: 18,
    opacity: focused ? 1 : 0.5,
  }}>
    {label === 'Markets' ? '📈' : label === 'AI Predict' ? '🤖' : label === 'History' ? '📚' : '📡'}
  </Text>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
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
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
