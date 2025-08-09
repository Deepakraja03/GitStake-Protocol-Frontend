# GitStake - Advanced GitHub Analytics & Developer Recognition Platform

GitStake is a comprehensive platform that combines GitHub contribution tracking with AVAX staking rewards, gamified quests, AI-powered code analysis, and an intelligent assistant named Zyra.

## 🚀 Features

### 🔐 Authentication & Integration
- **RainbowKit Integration**: Seamless Avalanche wallet connection
- **GitHub OAuth**: Connect your GitHub account with automated analysis
- **Firebase Auth**: Secure user authentication and session management
- **Onboarding Flow**: Interactive checklist with Framer Motion animations

### 🤖 AI Assistant - Zyra
- **Intelligent Chat**: AI-powered assistant for development questions
- **Deep Search**: Web-enhanced search capabilities for technical queries
- **Context Awareness**: Understands your GitStake profile and GitHub data
- **Always Available**: Floating assistant accessible from any page

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

### 🎯 Quest System
- **AI-Generated Quests**: Dynamic challenges based on your skill level
- **8 Difficulty Levels**: From Beginner to Legend
- **AVAX Rewards**: Earn cryptocurrency for completing quests
- **Staking Mechanism**: Stake AVAX to participate in quests
- **Leaderboards**: Compete with other developers
- **Progress Tracking**: Monitor your quest history and achievements

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

### 📈 GitHub Analytics & Scoring
- **Comprehensive Analysis**: 50+ metrics from your GitHub profile
- **Developer Levels**: 8-tier progression system (Beginner to Legend)
- **AI Insights**: Intelligent analysis of your coding patterns
- **Real-time Sync**: Automatic updates when you analyze your profile
- **Multi-metric Scoring**: Proficiency, innovation, and collaboration scores
- **Language Analysis**: Detailed breakdown of your programming languages

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

### API Integration

The frontend integrates with a comprehensive backend API system:

#### Core Endpoints

- **User Analytics**: `/api/users/*` - User data, analytics, and leaderboards
- **GitHub Integration**: `/api/github/*` - Complete GitHub API coverage
- **AI Chat Assistant**: `/api/chat/*` - Zyra AI interactions
- **Deep Search**: `/api/deep-search/*` - Web-enhanced AI search
- **Quest System**: `/api/quests/*` - Quest management and rewards
- **Email Notifications**: `/api/email/*` - Notification system
- **Cron Jobs**: `/api/cron/*` - Background task management
- **Authentication**: `/api/auth/*` - User authentication

#### Key Features
- **GitHub Analysis**: POST `/api/users/analyze` - Comprehensive profile analysis
- **Quest Generation**: POST `/api/quests/generate` - AI-powered quest creation
- **Deep Search**: POST `/api/deep-search/search` - Enhanced web search
- **Real-time Analytics**: GET `/api/users/:username/analytics` - Live metrics

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
