# ChainStock 📈

**AI-powered Crypto & Stock Market Prediction App**
Built with React Native (Expo) + Claude AI + CoinGecko Live API

---

## Features

| Screen | What It Does |
|--------|-------------|
| **Markets** | Live crypto prices (BTC, ETH, SOL, XRP) via CoinGecko API. 7-day chart. Auto-refreshes every 30s. |
| **AI Predict** | Claude AI generates BUY/SELL/HOLD signals with confidence, support/resistance, and key catalysts. |
| **History** | Interactive timeline from WW1 → COVID-19 showing how world events shaped markets. Expandable cards. |
| **Signals** | Fear & Greed index, sentiment tags, live news feed, and quick market stats. |

---

## Quick Start

### 1. Install Prerequisites

```bash
# Install Node.js (if not installed): https://nodejs.org
# Install Expo CLI
npm install -g expo-cli

# Install dependencies
cd ChainStock
npm install
```

### 2. Add Your Anthropic API Key

Open `src/services/aiService.js` and replace:
```js
const ANTHROPIC_API_KEY = 'YOUR_ANTHROPIC_API_KEY_HERE';
```
With your real key from: https://console.anthropic.com

> ⚠️ For production apps, NEVER hardcode API keys. Use environment variables or a backend proxy.

### 3. Run the App

```bash
# Start Expo development server
npx expo start

# Then press:
# i → Open iOS Simulator (Mac only)
# a → Open Android Emulator
# w → Open in Web Browser
# Scan QR code → Run on your physical phone (Expo Go app)
```

### 4. Run on Physical Device

1. Install **Expo Go** from App Store / Play Store
2. Run `npx expo start`
3. Scan the QR code with your phone camera (iOS) or Expo Go app (Android)

---

## Project Structure

```
ChainStock/
├── App.js                          # Root navigation setup
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── src/
    ├── constants/
    │   ├── theme.js                # Colors, fonts, spacing
    │   └── data.js                 # Assets list, history events
    ├── services/
    │   ├── marketService.js        # CoinGecko API calls
    │   └── aiService.js            # Anthropic Claude API
    ├── components/
    │   └── index.js                # Shared UI components
    └── screens/
        ├── MarketsScreen.js        # Live prices + chart
        ├── PredictScreen.js        # AI prediction engine
        ├── HistoryScreen.js        # World events timeline
        └── SignalsScreen.js        # Sentiment + news feed
```

---

## APIs Used

| API | Purpose | Key Required? |
|-----|---------|--------------|
| [CoinGecko](https://www.coingecko.com/api) | Live crypto prices & charts | No (free tier) |
| [Anthropic Claude](https://console.anthropic.com) | AI predictions & analysis | Yes (free credits) |
| Alpha Vantage *(optional)* | Real stock prices (AAPL, TSLA) | Yes (free) |

---

## Adding Real Stock Data (Optional)

1. Get a free key at https://www.alphavantage.co/support/#api-key
2. Open `src/services/marketService.js`
3. Add this function:

```js
export async function fetchStockPrice(symbol) {
  const key = 'YOUR_ALPHA_VANTAGE_KEY';
  const res = await fetch(
    `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`
  );
  const data = await res.json();
  const q = data['Global Quote'];
  return {
    price:     parseFloat(q['05. price']),
    change24h: parseFloat(q['10. change percent']),
    high:      parseFloat(q['03. high']),
    low:       parseFloat(q['04. low']),
    volume:    parseFloat(q['06. volume']),
  };
}
```

---

## Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Build for Android (APK)
eas build -p android --profile preview

# Build for iOS (requires Apple Developer account)
eas build -p ios
```

---

## Customisation Ideas

- Add more assets (DOGE, AVAX, MSFT, GOOGL)
- Add portfolio tracking with local storage
- Add price alerts with push notifications
- Add candlestick charts with `react-native-wagmi-charts`
- Connect to a WebSocket for real-time tick data
- Add user login + cloud sync

---

## Disclaimer

ChainStock is for **educational and informational purposes only**. AI predictions are not financial advice. Always do your own research before investing.

---

*Built with ❤️ using React Native + Expo + Claude AI*
