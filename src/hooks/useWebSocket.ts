"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

interface UseWebSocketReturn {
  messages: WebSocketMessage[];
  connectionStatus: 'Connecting' | 'Connected' | 'Disconnected' | 'Error';
  sendMessage: (message: any) => void;
  clearMessages: () => void;
  reconnect: () => void;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnectAttempts = 5,
  reconnectInterval = 3000
}: UseWebSocketProps): UseWebSocketReturn {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'Connecting' | 'Connected' | 'Disconnected' | 'Error'>('Disconnected');

  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimeoutId = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    // Prevent duplicate connections
    if (ws.current && (ws.current.readyState === WebSocket.CONNECTING || ws.current.readyState === WebSocket.OPEN)) {
      console.log('WebSocket already connecting/connected, skipping duplicate connection attempt');
      return;
    }

    try {
      setConnectionStatus('Connecting');
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('Connected');
        reconnectCount.current = 0;
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          setMessages(prev => [...prev, message]);
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected - Code:', event.code, 'Reason:', event.reason);
        setConnectionStatus('Disconnected');
        onDisconnect?.();

        // Only attempt to reconnect if it wasn't a clean closure and we have attempts left
        if (event.code !== 1000 && reconnectCount.current < reconnectAttempts) {
          reconnectTimeoutId.current = setTimeout(() => {
            reconnectCount.current++;
            console.log(`Reconnection attempt ${reconnectCount.current}/${reconnectAttempts}`);
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
        onError?.(error);
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionStatus('Error');
    }
  }, [url, onConnect, onMessage, onDisconnect, onError, reconnectAttempts, reconnectInterval]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutId.current) {
      clearTimeout(reconnectTimeoutId.current);
      reconnectTimeoutId.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        const messageString = typeof message === 'string' ? message : JSON.stringify(message);
        ws.current.send(messageString);
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
      }
    } else {
      console.warn('WebSocket is not connected. Cannot send message.');
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const reconnect = useCallback(() => {
    disconnect();
    reconnectCount.current = 0;
    setTimeout(() => connect(), 100);
  }, [connect, disconnect]);

  useEffect(() => {
    // Prevent multiple connections in development mode
    if (!ws.current || ws.current.readyState === WebSocket.CLOSED) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    messages,
    connectionStatus,
    sendMessage,
    clearMessages,
    reconnect
  };
}

// Custom hook specifically for the trading floor WebSocket
export function useTradingFloorWebSocket() {
  const [agentUpdates, setAgentUpdates] = useState<any[]>([]);
  const [tradingDecisions, setTradingDecisions] = useState<any[]>([]);
  const [marketUpdates, setMarketUpdates] = useState<any[]>([]);

  const WS_BASE = (typeof window !== 'undefined' && window.location.hostname.includes('localhost'))
    ? 'ws://localhost:8000/ws/trading-floor'
    : 'wss://swarms-multi-agent.onrender.com/ws/trading-floor';

  const handleMessage = useCallback((message: WebSocketMessage) => {
    switch (message.type) {
      case 'connection_confirmed':
      case 'system_status':
        console.log('WebSocket connection confirmed:', message.data || (message as any).message);
        break;
      case 'agents_update':
        setAgentUpdates(prev => [...prev.slice(-10), message.data]); // Keep last 10
        break;
      case 'trading_decision':
        setTradingDecisions(prev => [...prev.slice(-20), message.data]); // Keep last 20
        break;
      case 'market_update':
        setMarketUpdates(prev => [...prev.slice(-50), message.data]); // Keep last 50
        break;
      case 'echo':
        console.log('Echo received:', message.data || message);
        break;
      default:
        console.log('Unknown message type:', message.type, message);
    }
  }, []);

  const { connectionStatus, sendMessage, reconnect } = useWebSocket({
    url: WS_BASE,
    onMessage: handleMessage,
    onConnect: () => console.log('Trading Floor WebSocket connected'),
    onDisconnect: () => console.log('Trading Floor WebSocket disconnected'),
    onError: (error) => console.error('Trading Floor WebSocket error:', error),
    reconnectAttempts: 0, // Disable automatic reconnection to prevent loops
    reconnectInterval: 5000
  });

  const triggerMarketAnalysis = useCallback((marketData: any) => {
    sendMessage({
      type: 'market_data',
      data: marketData,
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  const queryAgent = useCallback((agentId: string, query: string) => {
    sendMessage({
      type: 'agent_query',
      data: { agent_id: agentId, query },
      timestamp: new Date().toISOString()
    });
  }, [sendMessage]);

  return {
    connectionStatus,
    agentUpdates,
    tradingDecisions,
    marketUpdates,
    triggerMarketAnalysis,
    queryAgent,
    reconnect
  };
}