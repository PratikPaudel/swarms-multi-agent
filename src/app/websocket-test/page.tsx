"use client";

import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WebSocketTest() {
  const [status, setStatus] = useState<'Disconnected' | 'Connecting' | 'Connected' | 'Error'>('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);
  const ws = useRef<WebSocket | null>(null);

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setStatus('Connecting');
    ws.current = new WebSocket('ws://localhost:8000/ws/trading-floor');

    ws.current.onopen = () => {
      setStatus('Connected');
      addMessage('✅ Connected to WebSocket server');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        addMessage(`📥 Received: ${JSON.stringify(data, null, 2)}`);
      } catch (e) {
        addMessage(`📥 Received: ${event.data}`);
      }
    };

    ws.current.onclose = (event) => {
      setStatus('Disconnected');
      addMessage(`❌ Disconnected (Code: ${event.code})`);
    };

    ws.current.onerror = () => {
      setStatus('Error');
      addMessage('💥 WebSocket error occurred');
    };
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  };

  const sendTestMessage = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      const testMessage = {
        type: 'test',
        message: 'Hello from frontend!',
        timestamp: new Date().toISOString()
      };
      ws.current.send(JSON.stringify(testMessage));
      addMessage(`📤 Sent: ${JSON.stringify(testMessage, null, 2)}`);
    }
  };

  const addMessage = (message: string) => {
    setMessages(prev => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">WebSocket Test Page</h1>
          <Badge variant={status === 'Connected' ? 'default' : status === 'Error' ? 'destructive' : 'secondary'}>
            {status}
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>WebSocket Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={connect} disabled={status === 'Connected'}>
                Connect
              </Button>
              <Button onClick={disconnect} disabled={status === 'Disconnected'} variant="destructive">
                Disconnect
              </Button>
              <Button onClick={sendTestMessage} disabled={status !== 'Connected'}>
                Send Test Message
              </Button>
              <Button onClick={clearMessages} variant="outline">
                Clear Messages
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Backend server should be running at: ws://localhost:8000/ws/trading-floor
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Messages ({messages.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-muted-foreground italic">No messages yet. Connect to start receiving messages.</p>
              ) : (
                <div className="space-y-1 font-mono text-sm">
                  {messages.map((message, index) => (
                    <div key={index} className="whitespace-pre-wrap break-words">
                      {message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>1. Make sure the backend server is running: <code>python simple_main.py</code></p>
            <p>2. Click "Connect" to establish WebSocket connection</p>
            <p>3. Click "Send Test Message" to test two-way communication</p>
            <p>4. Watch the messages panel for real-time updates</p>
            <p className="text-sm text-muted-foreground">
              Access main app: <a href="/" className="text-blue-500 hover:underline">http://localhost:3000</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}