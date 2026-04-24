import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const LandingScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light" />
      <LinearGradient
        colors={['#0a0f1e', '#111827', '#0a0f1e']}
        style={styles.gradient}
      >
        {/* Logo/Brand Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>📊</Text>
          </View>
          <Text style={styles.logoText}>ChainStock</Text>
          <Text style={styles.tagline}>AI-Powered Market Intelligence</Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🤖</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>AI Predictions</Text>
              <Text style={styles.featureDesc}>
                Advanced machine learning for market analysis
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📈</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Real-Time Markets</Text>
              <Text style={styles.featureDesc}>
                Live cryptocurrency and stock data
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📡</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Smart Signals</Text>
              <Text style={styles.featureDesc}>
                Buy/Sell/Hold recommendations
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📚</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>History Tracking</Text>
              <Text style={styles.featureDesc}>
                Monitor your performance over time
              </Text>
            </View>
          </View>
        </View>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4fc3f7', '#29b6f6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Get Started</Text>
              <Text style={styles.buttonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.headerBg,
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.accent,
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 48,
  },
  logoText: {
    ...FONTS.bold,
    fontSize: 36,
    color: COLORS.textPrimary,
    letterSpacing: 1,
  },
  tagline: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  featuresContainer: {
    width: width - 48,
    paddingHorizontal: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    ...FONTS.semibold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    ...FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  buttonContainer: {
    width: width - 48,
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  buttonText: {
    ...FONTS.semibold,
    fontSize: 18,
    color: COLORS.headerBg,
    letterSpacing: 0.5,
  },
  buttonArrow: {
    fontSize: 20,
    color: COLORS.headerBg,
    marginLeft: 8,
    fontWeight: '700',
  },
  versionText: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 20,
  },
});

export default LandingScreen;