# GitStake - Decentralized Developer Rewards Platform

GitStake is a comprehensive platform that combines GitHub contribution tracking with AVAX staking rewards, gamified challenges, and AI-powered code analysis.

## 🚀 Features

### 🔐 Authentication & Wallet
- **RainbowKit Integration**: Seamless Avalanche wallet connection
- **GitHub OAuth**: Connect your GitHub account with animated progress
- **Onboarding Flow**: Interactive checklist with Framer Motion animations

### 📊 Dashboard
- **Wallet Bar**: Real-time AVAX balance and wallet status
- **Staking Overview**: Glass card with animated APY meter
- **Yield Timeline**: Interactive charts with Framer Motion reveals
- **GitHub Activity Grid**: Contribution heatmap with hover tooltips
- **Active Quests**: Animated progress rings for ongoing challenges
- **Leaderboard Snapshot**: Top 5 developers with mini 3D podium

### 💰 Staking Flow
- **Amount Slider**: Real-time APY updates with visual feedback
- **3D Spinning AVAX Coin**: Three.js animation that spins when adjusting amount
- **Confirmation Modal**: Framer Motion scale-in with transaction simulation

### 🏆 Challenges & Boss Battles
- **Challenge List**: Filter buttons with smooth transitions
- **Monaco Code Editor**: Full-featured code editor with syntax highlighting
- **Reactive 3D Background**: Pulses on success/failure
- **Boss Battle System**: Animated boss avatar that changes states
- **Real-time Test Results**: Animated feedback for code execution

### 🥇 Leaderboard & Rewards
- **3D Podium**: Interactive Three.js podium with animated confetti
- **Filter Controls**: Slide-in animations for different time periods
- **Claim Rewards**: Glowing glass card with pulsing claim button
- **Live Rankings**: Real-time updates with smooth transitions

### 📈 Contributions & Scoring
- **GitHub Activity Timeline**: Horizontal scroll with activity cards
- **AI Scorecard**: Animated radial progress gauges for code quality
- **Code Quality Heatmap**: Color transitions showing metrics across languages

### 🗳️ DAO Proposals (Placeholder)
- **Proposal List**: Accordion expand animations
- **AI Summary Cards**: Fade-in effects
- **Vote Panel**: Live number animations
- **Simulation Tool**: Interactive slider with result previews

### 💬 Social & Chat (Placeholder)
- **Hackathon Rooms**: Animated join buttons
- **Team Creation**: Glassmorphic input fields
- **Karma Feed**: Real-time updates with emoji particle bursts

### 👤 Profile (Placeholder)
- **Profile Card**: Animated avatar border effects
- **Streak Tracker**: Flame animation for active streaks
- **Connected Repos**: Repository icons with hover effects
- **Achievements Grid**: Hover tilt animations

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Animations**: Framer Motion, React Spring
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Wallet Integration**: RainbowKit, Wagmi, Viem
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: React Icons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gitstake-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_WALLET_CONNECT_PROJECT_ID=your-wallet-connect-project-id
   VITE_GITHUB_CLIENT_ID=your-github-client-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Backend Integration

The frontend is designed to work with the GitStake backend API. Ensure your backend is running and accessible at the URL specified in `VITE_API_BASE_URL`.

### API Endpoints Used

- **User Analytics**: `/api/users/*` - User data and leaderboards
- **GitHub Integration**: `/api/github/*` - GitHub profile and repository data
- **AI Chat**: `/api/chat/*` - AI assistant interactions
- **Email Notifications**: `/api/email/*` - Notification system
- **Authentication**: `/api/auth/*` - User authentication

## 🎨 Key Components

### Animation Components
- `TypingText`: Typewriter effect with customizable speed
- `AnimatedCounter`: Smooth number transitions
- `GlassCard`: Glassmorphic cards with hover effects
- `ProgressRing`: Animated circular progress indicators

### 3D Components
- `SpinningCoin`: Interactive AVAX coin with Three.js
- `Podium3D`: 3D leaderboard podium with animations

### Interactive Features
- Real-time wallet balance updates
- Animated staking calculations
- Interactive code challenges
- Live leaderboard updates

## 🔐 Wallet Configuration

The app supports Avalanche mainnet and testnet through RainbowKit:

```javascript
const { chains, publicClient } = configureChains(
  [avalanche, avalancheFuji],
  [publicProvider()]
);
```

## 📱 Responsive Design

All components are fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🚀 Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for the developer community
