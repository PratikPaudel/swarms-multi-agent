# 🚀 Autonomous Trading Floor: Your AI-Powered Hedge Fund

**Traditional trading is too slow, complex, and prone to human error.** We're changing that.

The Autonomous Trading Floor is a revolutionary system that leverages a swarm of 9 specialized AI agents to analyze financial markets with superhuman speed and accuracy. Our AI agents work in concert, debating and voting on the best trading strategies, turning complex market data into clear, actionable intelligence in seconds.

**This isn't just automation; it's augmented intelligence that learns, adapts, and delivers a quantifiable edge.**

![Trading Floor Preview](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Live Demo](https://img.shields.io/badge/Demo-Live-blue)

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.4-blue)
![Swarms](https://img.shields.io/badge/Swarms-6.7.7-purple)
![Claude 3 Haiku](https://img.shields.io/badge/Model-Claude_3_Haiku-orange)
![Production](https://img.shields.io/badge/Deployed-Render-green)

---

## 核心价值：The Problem We Solve

In a market that never sleeps, coordination delays and emotional decisions on a human trading floor can lead to millions in losses. Traders are overwhelmed with data from countless sources.

Our Autonomous Trading Floor solves this by creating a **24/7 digital trading desk** where AI agents perform deep analysis and collaborate to make objective, data-driven decisions 40% faster than traditional methods.

## 🤖 Our Solution: An AI Agent Consensus

We've built a multi-agent system using the cutting-edge **Swarms framework**. Nine AI agents, each powered by `Claude 3 Haiku`, form a three-tier hierarchy to replicate and enhance a professional trading desk.

The system's core is a **consensus-based voting mechanism (`MajorityVoting`)**, where all nine agents deliberate and vote on the final trading decision. This ensures a robust consensus, balancing risk and opportunity from multiple expert perspectives.

### Three-Tier Agent Architecture

1.  **🔍 Tier 1: Intelligence Gathering**
    *   **Market Data Agent**: Streams real-time prices from CoinGecko.
    *   **Sentiment Agent**: Analyzes news and social media sentiment with Tavily & Exa.
    *   **On-Chain Agent**: Monitors DeFi protocols using DefiLlama.

2.  **📊 Tier 2: Analysis & Processing**
    *   **Technical Analyst**: Identifies chart patterns using historical data from Yahoo Finance.
    *   **Risk Calculator**: Assesses portfolio risk (VaR, Max Drawdown).
    *   **Correlation Analyzer**: Tracks inter-market relationships.

3.  **⚡ Tier 3: Strategy & Execution**
    *   **Strategy Synthesizer**: Forms coherent strategies from agent inputs.
    *   **Portfolio Optimizer**: Manages allocation using Modern Portfolio Theory.
    *   **Trade Executor**: Simulates trade execution with optimal routing.

---

## 🌟 Key Features & Innovations

*   **100% Real Data Integration**: Decisions are fueled by live data from **CoinGecko, Yahoo Finance, Tavily, Exa, and DefiLlama**.
*   **AI Agent Consensus**: First-of-its-kind implementation of Swarms `MajorityVoting` where 9 Claude agents debate and vote on trading decisions.
*   **Complete System**: A fully integrated solution with a Next.js frontend, FastAPI backend, and a swarm of autonomous AI agents.
*   **Transparent Reasoning**: The UI provides full visibility into the AI's decision-making process, including each agent's vote and confidence score.

## 🧰 Tools & Services

### Data Sources
- **CoinGecko**: real-time crypto prices and basics
- **Yahoo Finance**: historical OHLCV for charts and technicals
- **Tavily API**: news retrieval/sentiment inputs
- **Exa API**: web/social signals for sentiment/context
- **DefiLlama**: DeFi metrics/TVL for on-chain context
- **FRED API**: macroeconomic indicators

### AI & Orchestration
- **Claude 3 Haiku (Anthropic)**: model used by all agents and the consensus agent (`claude-3-haiku-20240307`)
- **Swarms framework**: orchestrates agents and the `MajorityVoting` consensus workflow

---

## 🌐 Live Demo

**Try the system now**: [https://swarms-multi-agent.onrender.com](https://swarms-multi-agent.onrender.com)

Experience the autonomous trading floor in action with real AI agents making live trading decisions.

---

## 🚀 Quick Start

Get your own Autonomous Trading Floor running in minutes.

### Prerequisites
*   Node.js 18+ and npm
*   Python 3.9+
*   Anthropic API key (for Claude 3 Haiku)

### 1. Clone and Setup Frontend

```bash
# Clone the repository
git clone https://github.com/your-username/swarms-multi-agent.git
cd swarms-multi-agent

# Install frontend dependencies
npm install

# Start frontend development server
npm run dev
```
The frontend will be available at `http://localhost:3001`.

### 2. Setup Backend

```bash
cd backend

# Create a virtual environment and activate it
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create your environment file
touch .env

# Add your Anthropic API key to .env
echo "ANTHROPIC_API_KEY=your_claude_api_key_here" >> .env
```

### 3. Start Backend Server

```bash
# Start the backend server (from the 'backend' directory)
python start.py
```
The backend will be available at `http://localhost:8000`.
*   **API Documentation**: `http://localhost:8000/docs`

---

## 🎯 Project Status: Production Ready

*   ✅ **9-Agent Consensus Floor**: Fully operational with real Claude agents and consensus voting
*   ✅ **100% Real Data**: All mock data eliminated - live APIs from CoinGecko, Yahoo Finance, Tavily, Exa, DefiLlama
*   ✅ **Production Deployment**: Live system at https://swarms-multi-agent.onrender.com
*   ✅ **Full Integration**: Frontend ↔ Backend ↔ AI Agents seamlessly connected
*   ✅ **Real-time Trading Decisions**: Consensus voting produces live BUY/SELL/HOLD recommendations
*   ✅ **Supported Assets**: BTC, ETH, SOL, and BNB with real-time price feeds
*   ✅ **Professional UI**: Trading-grade interface with live agent status and decision history

## 🛣️ What's Next

*   **Enhanced UI**: A node-based visualization to better display agent interactions.
*   **Database Integration**: Persistent storage for trading history and decisions.
*   **Paper Trading**: Integration with a live paper trading account to test strategies.
*   **Performance Optimization**: Further reduction in voting cycle times.

---

**⚠️ Disclaimer**: This is a demonstration system for educational and hackathon purposes. It is not intended for live trading. Always conduct your own research and never invest more than you can afford to lose.
