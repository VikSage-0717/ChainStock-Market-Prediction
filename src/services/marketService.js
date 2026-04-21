const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

export async function fetchCryptoPrice(coinId) {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
  if (!res.ok) throw new Error('CoinGecko fetch failed');
  const data = await res.json();
  const md = data.market_data;
  return {
    price:     md.current_price.usd,
    change24h: md.price_change_percentage_24h,
    high:      md.high_24h.usd,
    low:       md.low_24h.usd,
    volume:    md.total_volume.usd,
    marketCap: md.market_cap.usd,
    name:      data.name,
    symbol:    data.symbol.toUpperCase(),
  };
}

export async function fetchSparkline(coinId) {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`
  );
  if (!res.ok) throw new Error('Sparkline fetch failed');
  const data = await res.json();
  return {
    prices: data.prices.map(p => p[1]),
    labels: data.prices.map(p => {
      const d = new Date(p[0]);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
  };
}

export async function fetchTopCryptos() {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`
  );
  if (!res.ok) throw new Error('Top cryptos fetch failed');
  return res.json();
}

export function formatLarge(n) {
  if (!n && n !== 0) return '—';
  if (n >= 1e12) return '$' + (n / 1e12).toFixed(2) + 'T';
  if (n >= 1e9)  return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6)  return '$' + (n / 1e6).toFixed(2) + 'M';
  return '$' + n.toLocaleString();
}

export function formatPrice(p) {
  if (!p && p !== 0) return '—';
  if (p >= 1000) return '$' + p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return '$' + p.toFixed(p < 1 ? 6 : 2);
}
