# 🚀 Autonomous Trading Floor

An AI-powered multi-agent trading system built with **Swarms framework**, **Next.js**, and **FastAPI**. This system orchestrates 12+ specialized AI agents across a three-tier architecture to analyze markets, manage risk, and execute trading strategies in real-time.

![Trading Floor Preview](https://img.shields.io/badge/Status-MVP_Complete-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-blue)
![Swarms](https://img.shields.io/badge/Swarms-6.7.7-purple)

## 🏗️ Architecture Overview

### Three-Tier Agent System

**🔍 Tier 1: Intelligence Gathering**
- **Market Data Agent**: Real-time price feeds and volume analysis
- **Sentiment Agent**: Social media and news sentiment scoring
- **On-Chain Agent**: Whale movements and DeFi protocol monitoring

**📊 Tier 2: Analysis & Processing**
- **Technical Analyst**: RSI, MACD, Bollinger Bands, pattern recognition
- **Risk Calculator**: VaR, Kelly Criterion, portfolio stress testing
- **Correlation Analyzer**: Inter-market relationships and arbitrage detection

**⚡ Tier 3: Strategy & Execution**
- **Strategy Synthesizer**: Multi-agent consensus and ensemble decisions
- **Portfolio Optimizer**: Modern Portfolio Theory and dynamic rebalancing
- **Trade Executor**: Optimal routing and execution algorithms

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with TypeScript
- **shadcn/ui** component library
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **WebSocket** for real-time updates

### Backend
- **FastAPI** with async/await patterns
- **Swarms framework** for multi-agent orchestration
- **WebSocket** for bi-directional communication
- **Pydantic** for data validation

### AI/ML
- **Google Gemini Pro** (free tier) for agent reasoning
- **Swarms** concurrent and sequential workflows
- **Custom technical analysis** algorithms

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- Google AI Studio API key (free)

### 1. Clone and Setup Frontend

```bash
cd swarms-multi-agent

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```
The frontend will be available at `http://localhost:3001`

### 2. Setup Backend

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Add your Google AI Studio API key to .env
echo "GOOGLE_API_KEY=your_api_key_here" >> .env
```

### 3. Start Backend Server

```bash
# Option 1: Using the start script
python start.py

# Option 2: Direct uvicorn
cd src && uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- WebSocket: `ws://localhost:8000/ws/trading-floor`

## 📱 Features

### Real-time Dashboard
- **Live Agent Status**: Monitor all 12 agents across 3 tiers
- **Trading Decisions**: Real-time recommendations with reasoning
- **Performance Analytics**: Latency, consensus, and risk metrics
- **Interactive Charts**: Price movements and technical indicators

### Multi-Agent Coordination
- **Concurrent Processing**: Tier 1 agents gather intelligence in parallel
- **Sequential Strategy**: Tier 3 agents build on analysis results
- **Consensus Voting**: Weighted ensemble decision-making
- **Risk Management**: Automated position sizing and risk limits

### WebSocket Integration
- **Bi-directional Communication**: Frontend ↔ Backend real-time sync
- **Market Data Triggers**: Automatic analysis on price movements
- **Agent Querying**: Direct communication with specific agents
- **Status Broadcasting**: Live updates on agent activities

## 🔧 Configuration

### Environment Variables

Create `backend/.env` with:

```env
# AI Models
GOOGLE_API_KEY=your_google_ai_studio_api_key
OPENAI_API_KEY=your_openai_key_optional

# Application
APP_ENV=development
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:3000", "http://localhost:3001"]

# Data Sources (for future integration)
COINGECKO_API_KEY=your_key
BINANCE_API_KEY=your_key
```

### Customizing Agents

Agents are defined in `backend/src/agents/`:
- `tier1.py`: Intelligence gathering agents
- `tier2.py`: Analysis and processing agents
- `tier3.py`: Strategy and execution agents

Each agent can be customized with:
- Custom system prompts
- Specific tools and data sources
- Different AI models
- Adjusted confidence thresholds

## 📊 API Endpoints

### REST API
- `GET /` - Health check
- `GET /agents/status` - Get all agent statuses
- `POST /trading/execute` - Execute trading cycle
- `GET /health` - Detailed system health

### WebSocket
- `ws://localhost:8000/ws/trading-floor` - Main trading floor connection

WebSocket message types:
- `market_data` - Trigger analysis with market data
- `agent_query` - Query specific agent
- `trading_decision` - Receive trading recommendations
- `agents_update` - Agent status updates

## 🎯 Roadmap

### Immediate (MVP)
- [x] Three-tier agent architecture
- [x] WebSocket real-time communication
- [x] Basic trading dashboard
- [x] Mock data integration

### Short-term
- [ ] Real crypto data integration (Binance, CoinGecko)
- [ ] Advanced charting with TradingView
- [ ] Portfolio management features
- [ ] Redis caching layer
- [ ] Clerk authentication

### Medium-term
- [ ] Paper trading integration
- [ ] Advanced risk management
- [ ] Custom agent creation UI
- [ ] Performance backtesting
- [ ] Multi-exchange support

### Long-term
- [ ] Live trading capabilities
- [ ] Machine learning model training
- [ ] Mobile application
- [ ] Multi-asset class support
- [ ] Institutional features

## 🔒 Security & Risk

### Current Implementation
- **Paper Trading Only**: No real money at risk
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Pydantic schemas
- **Mock Data**: Simulated market conditions

### Production Considerations
- Implement proper authentication (Clerk)
- Add API key management
- Set up monitoring and alerts
- Implement circuit breakers
- Add audit logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Swarms Framework** for multi-agent orchestration
- **shadcn/ui** for beautiful React components
- **Recharts** for data visualization
- **FastAPI** for high-performance backend

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Check the [API documentation](http://localhost:8000/docs)
- Review the agent implementation examples

---

**⚠️ Disclaimer**: This is a demonstration system for educational purposes. Not intended for live trading. Always do your own research and never invest more than you can afford to lose.
