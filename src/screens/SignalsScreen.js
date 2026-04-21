import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, RefreshControl, ActivityIndicator,
} from 'react-native';
import { COLORS, RADIUS, FONTS, SHADOW } from '../constants/theme';

const SENTIMENT_TAGS = [
  { label: '📈 Bullish BTC',  bg: 'rgba(102,187,106,0.15)', color: '#66bb6a' },
  { label: '📉 Bearish Tech', bg: 'rgba(239,83,80,0.15)',   color: '#ef5350' },
  { label: '⚖️ Neutral Oil',  bg: 'rgba(255,167,38,0.15)',  color: '#ffa726' },
  { label: '🥇 Bullish Gold', bg: 'rgba(102,187,106,0.15)', color: '#66bb6a' },
  { label: '😰 Fear: 42',     bg: 'rgba(255,167,38,0.15)',  color: '#ffa726' },
  { label: '📊 Greed: 61',    bg: 'rgba(102,187,106,0.15)', color: '#66bb6a' },
];

const NEWS_FEED = [
  { title: 'Bitcoin ETF inflows surpass $500M — institutional demand accelerating', time: '2 min ago', color: '#66bb6a', tag: 'BULLISH' },
  { title: 'Fed signals possible rate cuts in Q3 2026 — equities rally on the news', time: '18 min ago', color: '#66bb6a', tag: 'BULLISH' },
  { title: 'Tesla Q1 deliveries miss estimates by 12%, shares drop pre-market', time: '45 min ago', color: '#ef5350', tag: 'BEARISH' },
  { title: 'Ethereum L2 transactions reach all-time high of 12M daily', time: '1h ago', color: '#66bb6a', tag: 'BULLISH' },
  { title: 'SEC reviews new crypto custody rules for commercial banks', time: '2h ago', color: '#ffa726', tag: 'NEUTRAL' },
  { title: 'Apple services revenue grows 14% YoY, analysts raise price targets', time: '3h ago', color: '#66bb6a', tag: 'BULLISH' },
  { title: 'Global inflation data comes in hotter than expected — bond yields rise', time: '4h ago', color: '#ef5350', tag: 'BEARISH' },
  { title: 'Solana DeFi TVL crosses $8B for the first time', time: '5h ago', color: '#66bb6a', tag: 'BULLISH' },
  { title: 'China manufacturing PMI contracts for third straight month', time: '6h ago', color: '#ef5350', tag: 'BEARISH' },
  { title: 'BlackRock expands crypto fund offerings to retail investors', time: '8h ago', color: '#66bb6a', tag: 'BULLISH' },
];

const FEAR_GREED = { value: 52, label: 'Neutral', color: '#ffa726' };

function TagPill({ item }) {
  return (
    <View style={[styles.tagPill, { backgroundColor: item.bg, borderColor: item.color + '55' }]}>
      <Text style={[styles.tagText, { color: item.color }]}>{item.label}</Text>
    </View>
  );
}

function NewsItem({ item }) {
  const tagColors = {
    BULLISH: { bg: 'rgba(102,187,106,0.15)', color: '#66bb6a' },
    BEARISH: { bg: 'rgba(239,83,80,0.15)',   color: '#ef5350' },
    NEUTRAL: { bg: 'rgba(255,167,38,0.15)',  color: '#ffa726' },
  };
  const tc = tagColors[item.tag] || tagColors.NEUTRAL;

  return (
    <View style={styles.newsItem}>
      <View style={[styles.newsDot, { backgroundColor: item.color }]} />
      <View style={styles.newsBody}>
        <Text style={styles.newsTitle}>{item.title}</Text>
        <View style={styles.newsMeta}>
          <Text style={styles.newsTime}>{item.time}</Text>
          <View style={[styles.newsTag, { backgroundColor: tc.bg }]}>
            <Text style={[styles.newsTagText, { color: tc.color }]}>{item.tag}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function FearGreedGauge({ value, label, color }) {
  const pct = value / 100;
  const w = 200;
  const h = 110;
  const cx = w / 2, cy = h - 10;
  const r = 80;
  const startAngle = Math.PI;
  const endAngle = startAngle + pct * Math.PI;
  const x = cx + r * Math.cos(endAngle);
  const y = cy + r * Math.sin(endAngle);

  return (
    <View style={styles.gaugeCard}>
      <Text style={styles.gaugeTitle}>Fear & Greed Index</Text>
      <View style={styles.gaugeArc}>
        <Text style={[styles.gaugeValue, { color }]}>{value}</Text>
        <Text style={[styles.gaugeLabel, { color }]}>{label}</Text>
      </View>
      <View style={styles.gaugeScale}>
        {['Extreme Fear', 'Fear', 'Neutral', 'Greed', 'Extreme Greed'].map((l, i) => (
          <Text key={i} style={styles.gaugeScaleText}>{l}</Text>
        ))}
      </View>
    </View>
  );
}

export default function SignalsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [news, setNews] = useState(NEWS_FEED);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setNews([...NEWS_FEED].sort(() => Math.random() - 0.5));
      setRefreshing(false);
    }, 1200);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
    >
      {/* Fear & Greed */}
      <FearGreedGauge {...FEAR_GREED} />

      {/* Sentiment Pills */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Market Sentiment</Text>
        <View style={styles.tagRow}>
          {SENTIMENT_TAGS.map((t, i) => <TagPill key={i} item={t} />)}
        </View>
      </View>

      {/* News Feed */}
      <View style={styles.section}>
        <View style={styles.feedHeader}>
          <Text style={styles.sectionLabel}>Live Signal Feed</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
            <Text style={styles.refreshText}>↻ Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.feedCard}>
          {news.map((item, i) => <NewsItem key={i} item={item} />)}
        </View>
      </View>

      {/* Market Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          {[
            { label: 'BTC Dominance', value: '54.3%', color: COLORS.accentGreen },
            { label: 'Total Crypto Cap', value: '$2.8T', color: COLORS.accent },
            { label: 'DeFi TVL', value: '$98B', color: COLORS.accentGreen },
            { label: '24h Volume', value: '$142B', color: COLORS.accent },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 8, ...FONTS.medium, letterSpacing: 0.5, textTransform: 'uppercase' },

  gaugeCard: {
    margin: 16,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  gaugeTitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 12, ...FONTS.medium },
  gaugeArc: { alignItems: 'center', marginVertical: 8 },
  gaugeValue: { fontSize: 48, ...FONTS.bold },
  gaugeLabel: { fontSize: 16, ...FONTS.semibold, marginTop: -4 },
  gaugeScale: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 12 },
  gaugeScaleText: { fontSize: 9, color: COLORS.textMuted, flex: 1, textAlign: 'center' },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, borderWidth: 1 },
  tagText: { fontSize: 12, ...FONTS.medium },

  feedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  refreshBtn: { backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 5, borderRadius: RADIUS.full },
  refreshText: { fontSize: 12, color: COLORS.accent, ...FONTS.medium },

  feedCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  newsItem: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder,
    gap: 12,
  },
  newsDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  newsBody: { flex: 1 },
  newsTitle: { fontSize: 13, color: COLORS.textPrimary, lineHeight: 19, marginBottom: 6 },
  newsMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  newsTime: { fontSize: 11, color: COLORS.textMuted },
  newsTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: RADIUS.full },
  newsTagText: { fontSize: 10, ...FONTS.bold },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: 14,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
  statValue: { fontSize: 18, ...FONTS.bold },
});
