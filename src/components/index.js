import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SHADOW, FONTS } from '../constants/theme';

// ── Asset Ticker Chip ────────────────────────────────────────────────────────
export function AssetChip({ asset, selected, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {asset.symbol}
      </Text>
      {asset.type === 'stock' && (
        <Text style={[styles.chipBadge, selected && styles.chipBadgeSelected]}>S</Text>
      )}
    </TouchableOpacity>
  );
}

// ── Metric Card ──────────────────────────────────────────────────────────────
export function MetricCard({ label, value, valueColor }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={[styles.metricValue, valueColor && { color: valueColor }]}>{value || '—'}</Text>
    </View>
  );
}

// ── Section Header ───────────────────────────────────────────────────────────
export function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ── Signal Badge ─────────────────────────────────────────────────────────────
export function SignalBadge({ signal }) {
  const map = {
    BUY:  { bg: 'rgba(102,187,106,0.15)', text: COLORS.accentGreen, label: '▲ BUY'  },
    SELL: { bg: 'rgba(239,83,80,0.15)',   text: COLORS.accentRed,   label: '▼ SELL' },
    HOLD: { bg: 'rgba(255,167,38,0.15)',  text: COLORS.accentAmber, label: '◆ HOLD' },
  };
  const s = map[signal] || map.HOLD;
  return (
    <View style={[styles.signalBadge, { backgroundColor: s.bg }]}>
      <Text style={[styles.signalText, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

// ── Info Pill ────────────────────────────────────────────────────────────────
export function InfoPill({ label }) {
  return (
    <View style={styles.infoPill}>
      <Text style={styles.infoPillText}>{label}</Text>
    </View>
  );
}

// ── Change Text ──────────────────────────────────────────────────────────────
export function ChangeText({ value, style }) {
  if (value === undefined || value === null) return <Text style={style}>—</Text>;
  const isUp = value >= 0;
  return (
    <Text style={[style, { color: isUp ? COLORS.accentGreen : COLORS.accentRed }]}>
      {isUp ? '▲' : '▼'} {Math.abs(value).toFixed(2)}%
    </Text>
  );
}

// ── Loading Spinner Text ─────────────────────────────────────────────────────
export function LoadingDots({ message = 'Loading' }) {
  return (
    <View style={styles.loadingRow}>
      <Text style={styles.loadingText}>{message}...</Text>
    </View>
  );
}

// ── Impact Bar ───────────────────────────────────────────────────────────────
export function ImpactBar({ pct, color }) {
  return (
    <View style={styles.impactBarBg}>
      <View style={[styles.impactBarFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 7,
    marginRight: 8,
  },
  chipSelected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  chipText: { fontSize: 13, color: COLORS.textSecondary, ...FONTS.medium },
  chipTextSelected: { color: COLORS.headerBg },
  chipBadge: {
    fontSize: 9, marginLeft: 4, color: COLORS.textMuted,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 4, paddingVertical: 1,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  chipBadgeSelected: { backgroundColor: 'rgba(0,0,0,0.2)', color: COLORS.headerBg },

  metricCard: {
    flex: 1, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md, padding: 12,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  metricLabel: { fontSize: 11, color: COLORS.textMuted, marginBottom: 4 },
  metricValue: { fontSize: 15, color: COLORS.textPrimary, ...FONTS.semibold },

  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 16, color: COLORS.textPrimary, ...FONTS.semibold },
  sectionSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  signalBadge: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  signalText: { fontSize: 13, ...FONTS.bold },

  infoPill: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.cardBorder,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  infoPillText: { fontSize: 12, color: COLORS.textSecondary },

  loadingRow: { alignItems: 'center', paddingVertical: 12 },
  loadingText: { fontSize: 13, color: COLORS.textSecondary },

  impactBarBg: {
    flex: 1, height: 5, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.full, overflow: 'hidden',
  },
  impactBarFill: { height: '100%', borderRadius: RADIUS.full },
});
