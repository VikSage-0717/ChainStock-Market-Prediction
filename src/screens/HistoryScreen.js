import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, LayoutAnimation, UIManager, Platform,
} from 'react-native';
import { COLORS, RADIUS, FONTS, SHADOW } from '../constants/theme';
import { HISTORY_EVENTS } from '../constants/data';
import { ImpactBar } from '../components';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

function HistoryCard({ event }) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(e => !e);
  };

  return (
    <TouchableOpacity
      style={[styles.card, SHADOW.card]}
      onPress={toggle}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Text style={styles.cardIcon}>{event.icon}</Text>
          <View>
            <Text style={styles.cardEra}>{event.era}</Text>
            <Text style={styles.cardPeriod}>{event.period}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.impactNum, { color: event.color }]}>{event.impact}%</Text>
          <Text style={styles.expandHint}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </View>

      <View style={styles.barRow}>
        <Text style={styles.barLabel}>Impact</Text>
        <ImpactBar pct={event.impact} color={event.color} />
      </View>

      {expanded && (
        <View style={styles.expandedBody}>
          <Text style={styles.expandedText}>{event.text}</Text>

          <View style={styles.statsRow}>
            {event.keyStats.map((s, i) => (
              <View key={i} style={[styles.statChip, { borderColor: event.color + '44' }]}>
                <Text style={[styles.statText, { color: event.color }]}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.introCard}>
        <Text style={styles.introTitle}>How World Events Shaped Markets</Text>
        <Text style={styles.introText}>
          From WWI to COVID-19 — every major world event left a fingerprint on global markets. Tap any event to explore its full impact.
        </Text>
      </View>

      <View style={styles.list}>
        {HISTORY_EVENTS.map((ev, i) => (
          <HistoryCard key={i} event={ev} />
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  introCard: {
    margin: 16,
    backgroundColor: COLORS.headerBg,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.15)',
  },
  introTitle: { fontSize: 15, color: COLORS.accent, ...FONTS.semibold, marginBottom: 6 },
  introText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },

  list: { paddingHorizontal: 16, gap: 10 },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  cardIcon: { fontSize: 22 },
  cardEra: { fontSize: 14, color: COLORS.textPrimary, ...FONTS.semibold },
  cardPeriod: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  cardRight: { alignItems: 'flex-end', gap: 2 },
  impactNum: { fontSize: 16, ...FONTS.bold },
  expandHint: { fontSize: 10, color: COLORS.textMuted },

  barRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  barLabel: { fontSize: 10, color: COLORS.textMuted, width: 36 },

  expandedBody: { marginTop: 14, borderTopWidth: 1, borderTopColor: COLORS.cardBorder, paddingTop: 14 },
  expandedText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 21, marginBottom: 12 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statChip: {
    borderWidth: 1, borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  statText: { fontSize: 11, ...FONTS.medium },
});
