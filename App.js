import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Text, View, StyleSheet, Platform } from 'react-native';

import LandingScreen from './src/screens/LandingScreen';
import MarketsScreen from './src/screens/MarketsScreen';
import PredictScreen from './src/screens/PredictScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SignalsScreen from './src/screens/SignalsScreen';
import { COLORS } from './src/constants/theme';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

const ICONS = {
  'Markets': '📈',
  'AI Predict': '🤖',
  'History': '📚',
  'Signals': '📡',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarStyle: {
        backgroundColor: COLORS.headerBg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        elevation: 0,
        shadowOpacity: 0,
        height: 50,
        paddingTop: 0,
      },
      tabBarIndicatorStyle: {
        backgroundColor: COLORS.accent,
        height: 3,
        marginBottom: 0,
      },
      tabBarIndicatorContainerStyle: {
        borderBottomWidth: 0,
      },
      tabBarActiveTintColor: COLORS.accent,
      tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'none',
        margin: 0,
        padding: 0,
      },
      tabBarIconStyle: {
        marginBottom: -2,
      },
      tabBarItemStyle: {
        paddingVertical: 0,
      },
    })}
  >
    <Tab.Screen
      name="Markets"
      component={MarketsScreen}
      options={{
        tabBarLabel: '📈 Markets',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 14, opacity: focused ? 1 : 0.5 }}>📈</Text>
        ),
      }}
    />
    <Tab.Screen
      name="AI Predict"
      component={PredictScreen}
      options={{
        tabBarLabel: '🤖 AI Predict',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 14, opacity: focused ? 1 : 0.5 }}>🤖</Text>
        ),
      }}
    />
    <Tab.Screen
      name="History"
      component={HistoryScreen}
      options={{
        tabBarLabel: '📚 History',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 14, opacity: focused ? 1 : 0.5 }}>📚</Text>
        ),
      }}
    />
    <Tab.Screen
      name="Signals"
      component={SignalsScreen}
      options={{
        tabBarLabel: '📡 Signals',
        tabBarIcon: ({ focused }) => (
          <Text style={{ fontSize: 14, opacity: focused ? 1 : 0.5 }}>📡</Text>
        ),
      }}
    />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 16,
    opacity: 0.5,
  },
  tabIconActive: {
    opacity: 1,
  },
});

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
