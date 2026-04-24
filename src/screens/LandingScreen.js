import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');

const FEATURES = [
  { icon: '🤖', title: 'AI Predictions', desc: 'Advanced machine learning for market analysis' },
  { icon: '📈', title: 'Real-Time Markets', desc: 'Live cryptocurrency and stock data' },
  { icon: '📡', title: 'Smart Signals', desc: 'Buy/Sell/Hold recommendations' },
  { icon: '📚', title: 'History Tracking', desc: 'Monitor your performance over time' },
];

const FeatureCard = ({ item, index }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const delay = index * 150;
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.featureItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.featureTouch}
      >
        <Text style={styles.featureIcon}>{item.icon}</Text>
        <View style={styles.featureText}>
          <Text style={styles.featureTitle}>{item.title}</Text>
          <Text style={styles.featureDesc}>{item.desc}</Text>
        </View>
        <Text style={styles.featureArrow}>›</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const LandingScreen = ({ navigation }) => {
  const [buttonPressed, setButtonPressed] = useState(false);
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous logo pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Subtle rotation animation
    Animated.loop(
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleGetStarted = () => {
    navigation.replace('Main');
  };

  const handleButtonPressIn = () => {
    setButtonPressed(true);
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    setButtonPressed(false);
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light" />
      <LinearGradient
        colors={['#0a0f1e', '#111827', '#0a0f1e']}
        style={styles.gradient}
      >
        {/* Logo/Brand Area */}
        <View style={styles.logoContainer}>
          <Animated.View
            style={[
              styles.logoCircle,
              {
                transform: [
                  { scale: logoScale },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <Text style={styles.logoIcon}>📊</Text>
          </Animated.View>
          <Text style={styles.logoText}>ChainStock</Text>
          <Text style={styles.tagline}>AI-Powered Market Intelligence</Text>
          
          {/* Animated dots */}
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((i) => (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  {
                    opacity: new Animated.Value(0.3),
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Features List */}
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.featuresContainer}
        >
          {FEATURES.map((item, index) => (
            <FeatureCard key={index} item={item} index={index} />
          ))}
        </ScrollView>

        {/* CTA Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={handleGetStarted}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
          >
            <Animated.View
              style={[
                styles.button,
                { transform: [{ scale: buttonScale }] },
              ]}
            >
              <LinearGradient
                colors={buttonPressed ? ['#29b6f6', '#0288d1'] : ['#4fc3f7', '#29b6f6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Text style={styles.buttonArrow}>→</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleGetStarted}
          >
            <Text style={styles.skipText}>Skip →</Text>
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
    paddingTop: 60,
  },
  logoContainer: {
    alignItems: 'center',
    paddingBottom: 20,
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
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
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
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
    marginHorizontal: 4,
  },
  scrollView: {
    flex: 1,
  },
  featuresContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  featureItem: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  featureTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
  featureArrow: {
    fontSize: 24,
    color: COLORS.textMuted,
    fontWeight: '300',
  },
  buttonContainer: {
    width: width - 48,
    alignItems: 'center',
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  button: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
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
  skipButton: {
    marginTop: 16,
    padding: 8,
  },
  skipText: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  versionText: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 12,
  },
});

export default LandingScreen;