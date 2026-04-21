import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity,
  StyleSheet, RefreshControl, Dimensions, ActivityIndicator,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, RADIUS, FONTS, SHADOW } from '../constants/theme';
import { ASSETS, MOCK_STOCKS } from '../constants/data';
import { fetchCryptoPrice, fetchSparkline, formatLarge, formatPrice } from '../services/marketService';
import { AssetChip, MetricCard, ChangeText, LoadingDots } from '../components';

const { width: SCREEN_W } = Dimensions.get('window');

export default function MarketsScreen() {
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [priceData, setPriceData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const [clock, setClock] = useState('');
  const timerRef = useRef(null);

  // Clock
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const loadData = useCallback(async (asset = selectedAsset) => {
    try {
      if (asset.type === 'crypto') {
        const [price, spark] = await Promise.all([
          fetchCryptoPrice(asset.id),
          fetchSparkline(asset.id),
        ]);
        setPriceData(price);
        if (spark.prices.length > 1) setChartData(spark);
      } else {
        const mock = MOCK_STOCKS[asset.symbol] || MOCK_STOCKS.AAPL;
        setPriceData({ ...mock, name: asset.name, symbol: asset.symbol, change24h: mock.change });
        setChartData({
          prices: Array.from({ length: 7 }, () => mock.price * (0.97 + Math.random() * 0.06)),
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        });
      }
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (e) {
      console.warn('Market fetch error:', e.message);
      const mock = MOCK_STOCKS[asset.symbol] || { price: 50000, change: 2.1, high: 52000, low: 49000, vol: 10e9, cap: 1e12 };
      setPriceData({ ...mock, name: asset.name, symbol: asset.symbol, change24h: mock.change });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedAsset]);

  useEffect(() => {
    setLoading(true);
    loadData(selectedAsset);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => loadData(selectedAsset), 30000);
    return () => clearInterval(timerRef.current);
  }, [selectedAsset]);

  const onRefresh = () => { setRefreshing(true); loadData(); };
  const isUp = (priceData?.change24h ?? 0) >= 0;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
    >
      {/* Clock */}
      <View style={styles.clockRow}>
        <Text style={styles.clockText}>⏱ {clock}</Text>
        <Text style={styles.updateText}>{lastUpdate ? `Updated ${lastUpdate}` : 'Auto-refreshes 30s'}</Text>
      </View>

      {/* Asset Chips */}
      <FlatList
        data={ASSETS}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        keyExtractor={a => a.id}
        renderItem={({ item }) => (
          <AssetChip
            asset={item}
            selected={item.id === selectedAsset.id}
            onPress={() => setSelectedAsset(item)}
          />
        )}
      />

      {/* Price Hero Card */}
      <View style={[styles.heroCard, SHADOW.card]}>
        <View style={styles.heroTop}>
          <Text style={styles.heroName}>{priceData?.name ?? selectedAsset.name}</Text>
          <Text style={styles.heroSymbol}>{selectedAsset.symbol}</Text>
        </View>
        {loading ? (
          <ActivityIndicator color={COLORS.accent} style={{ marginVertical: 16 }} />
        ) : (
          <>
            <Text style={styles.heroPrice}>{formatPrice(priceData?.price)}</Text>
            <View style={styles.heroBottom}>
              <ChangeText value={priceData?.change24h} style={styles.heroChange} />
              <Text style={styles.heroPeriod}> · 24h · USD</Text>
            </View>
          </>
        )}
      </View>

      {/* Sparkline Chart */}
      {chartData && !loading && (
        <View style={styles.chartCard}>
          <Text style={styles.chartLabel}>7-Day Price</Text>
          <LineChart
            data={{
              labels: chartData.labels,
              datasets: [{ data: chartData.prices, strokeWidth: 2.5 }],
            }}
            width={SCREEN_W - 32}
            height={160}
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            chartConfig={{
              backgroundColor: COLORS.cardBg,
              backgroundGradientFrom: COLORS.cardBg,
              backgroundGradientTo: COLORS.cardBg,
              color: () => (isUp ? COLORS.accentGreen : COLORS.accentRed),
              labelColor: () => COLORS.textMuted,
              propsForLabels: { fontSize: 10 },
            }}
            bezier
            style={{ borderRadius: RADIUS.md }}
          />
        </View>
      )}

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        <MetricCard label="24h High"    value={formatPrice(priceData?.high)} />
        <MetricCard label="24h Low"     value={formatPrice(priceData?.low)} />
      </View>
      <View style={[styles.metricsGrid, { marginTop: 8 }]}>
        <MetricCard label="Volume"      value={formatLarge(priceData?.volume)} />
        <MetricCard label="Market Cap"  value={formatLarge(priceData?.marketCap ?? priceData?.cap)} />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  clockRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  clockText: { fontSize: 12, color: COLORS.accent, ...FONTS.medium },
  updateText: { fontSize: 11, color: COLORS.textMuted },
  chipRow: { paddingHorizontal: 16, paddingVertical: 8 },
  heroCard: {
    margin: 16, marginTop: 4,
    backgroundColor: COLORS.headerBg,
    borderRadius: RADIUS.lg,
    padding: 20,
    borderWidth: 1, borderColor: 'rgba(79,195,247,0.2)',
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  heroName: { fontSize: 14, color: COLORS.accent, ...FONTS.medium },
  heroSymbol: {
    fontSize: 12, color: COLORS.headerBg,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    ...FONTS.bold,
  },
  heroPrice: { fontSize: 36, color: COLORS.textPrimary, ...FONTS.bold, marginBottom: 6 },
  heroBottom: { flexDirection: 'row', alignItems: 'center' },
  heroChange: { fontSize: 15, ...FONTS.semibold },
  heroPeriod: { fontSize: 13, color: COLORS.textMuted },
  chartCard: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1, borderColor: COLORS.cardBorder,
  },
  chartLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 8 },
  metricsGrid: { flexDirection: 'row', gap: 8, marginHorizontal: 16 },
});
