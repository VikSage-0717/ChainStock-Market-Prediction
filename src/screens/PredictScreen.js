import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Animated,
} from 'react-native';
import { COLORS, RADIUS, FONTS, SHADOW } from '../constants/theme';
import { ASSETS } from '../constants/data';
import { fetchCryptoPrice, MOCK_STOCKS, formatPrice } from '../services/marketService';
import { generateAIPrediction } from '../services/aiService';
import { AssetChip, SignalBadge, MetricCard, InfoPill } from '../components';

export default function PredictScreen() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(pulseAnim, { toValue: 0.97, duration: 600, useNativeDriver: true }),
      Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true }),
    ]).start(({ finished }) => { if (finished) pulse(); });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPrediction(null);
    try {
      let priceData = null;
      if (selectedAsset.type === 'crypto') {
        priceData = await fetchCryptoPrice(selectedAsset.id).catch(() => null);
      } else {
        const mock = MOCK_STOCKS[selectedAsset.symbol];
        priceData = mock ? { ...mock, change24h: mock.change } : null;
      }
      const pred = await generateAIPrediction(selectedAsset, priceData);
      setPrediction(pred);
      pulse();
    } catch (e) {
      setError('Could not generate prediction. Check your API key in aiService.js and try again.');
      console.error('Prediction error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Asset selector */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Select Asset</Text>
        <FlatList
          data={ASSETS}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={a => a.id}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <AssetChip
              asset={item}
              selected={item.id === selectedAsset.id}
              onPress={() => { setSelectedAsset(item); setPrediction(null); }}
            />
          )}
        />
      </View>

      {/* AI Status Card */}
      <View style={[styles.aiCard, SHADOW.card]}>
        <View style={styles.aiHeader}>
          <View style={styles.aiDotRow}>
            <Animated.View style={[styles.aiDot, !loading && { opacity: pulseAnim }]} />
            <Text style={styles.aiTitle}>ChainStock AI</Text>
          </View>
          <Text style={styles.aiModel}>claude-sonnet</Text>
        </View>

        {!prediction && !loading && !error && (
          <Text style={styles.aiPlaceholder}>
            Select an asset above and tap Generate Prediction to get AI-powered market analysis with real-time data.
          </Text>
        )}

        {loading && (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={COLORS.accent} />
            <Text style={styles.loadingMsg}>Analyzing {selectedAsset.symbol} patterns...</Text>
          </View>
        )}

        {error !== '' && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {prediction && (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text style={styles.predSummary}>{prediction.summary}</Text>
            <Text style={styles.predReasoning}>{prediction.reasoning}</Text>

            <View style={styles.badgeRow}>
              <SignalBadge signal={prediction.signal} />
              <InfoPill label={`Confidence: ${prediction.confidence}`} />
              <InfoPill label={`Risk: ${prediction.riskLevel}`} />
            </View>

            {prediction.catalysts?.length > 0 && (
              <View style={styles.catalystsBox}>
                <Text style={styles.catalystsLabel}>Key Catalysts</Text>
                {prediction.catalysts.map((c, i) => (
                  <Text key={i} style={styles.catalyst}>· {c}</Text>
                ))}
              </View>
            )}
          </Animated.View>
        )}
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateBtn, loading && { opacity: 0.6 }]}
        onPress={handleGenerate}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading
          ? <ActivityIndicator color={COLORS.headerBg} />
          : <Text style={styles.generateBtnText}>Generate AI Prediction</Text>
        }
      </TouchableOpacity>

      {/* Prediction Metrics */}
      {prediction && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Price Forecast</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              label="24h Change"
              value={prediction.change_24h}
              valueColor={prediction.change_24h?.startsWith('+') ? COLORS.accentGreen : COLORS.accentRed}
            />
            <MetricCard
              label="7d Change"
              value={prediction.change_7d}
              valueColor={prediction.change_7d?.startsWith('+') ? COLORS.accentGreen : COLORS.accentRed}
            />
          </View>
          <View style={[styles.metricsGrid, { marginTop: 8 }]}>
            <MetricCard label="Support"    value={prediction.support} />
            <MetricCard label="Resistance" value={prediction.resistance} />
          </View>
        </View>
      )}

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️  AI predictions are for educational and informational purposes only. This is not financial advice. Always do your own research before investing.
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4, ...FONTS.medium, letterSpacing: 0.5 },

  aiCard: {
    margin: 16, marginTop: 8,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.2)',
  },
  aiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  aiDotRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accentGreen },
  aiTitle: { fontSize: 14, color: COLORS.textPrimary, ...FONTS.semibold },
  aiModel: { fontSize: 11, color: COLORS.textMuted, backgroundColor: COLORS.surface, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, overflow: 'hidden' },

  aiPlaceholder: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  loadingBlock: { alignItems: 'center', paddingVertical: 16, gap: 10 },
  loadingMsg: { fontSize: 13, color: COLORS.textSecondary },
  errorText: { fontSize: 13, color: COLORS.accentRed, lineHeight: 20 },

  predSummary: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 22, marginBottom: 8 },
  predReasoning: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 12, fontStyle: 'italic' },

  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },

  catalystsBox: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, padding: 12 },
  catalystsLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 6, ...FONTS.medium },
  catalyst: { fontSize: 12, color: COLORS.textSecondary, lineHeight: 20 },

  generateBtn: {
    marginHorizontal: 16, marginTop: 4,
    backgroundColor: COLORS.accent,
    borderRadius: RADIUS.md, padding: 15,
    alignItems: 'center',
  },
  generateBtnText: { fontSize: 15, color: COLORS.headerBg, ...FONTS.bold },

  metricsGrid: { flexDirection: 'row', gap: 8 },

  disclaimer: {
    margin: 16, marginTop: 12,
    backgroundColor: 'rgba(255,167,38,0.08)',
    borderRadius: RADIUS.md, padding: 12,
    borderWidth: 1, borderColor: 'rgba(255,167,38,0.2)',
  },
  disclaimerText: { fontSize: 11, color: COLORS.textMuted, lineHeight: 17 },
});
