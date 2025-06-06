import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import BinFillLevel from '@/components/BinFillLevel';
import AnalyticsChart from '@/components/AnalyticsChart';
import AlertSystem from '@/components/AlertSystem';

const Index = () => {
  const [binFillLevel, setBinFillLevel] = useState<number | null>(null);
  const [binStatus, setBinStatus] = useState<string>(''); // You'll need to determine how to derive status from serial data
  const [serialData, setSerialData] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    ws.current = new WebSocket('ws://localhost:8765');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'serial_data') {
          setSerialData((prevData) => [...prevData, message.data]);

          const heightInCm = parseFloat(message.data);
          const totalHeightCm = 15; // Assuming bin height is 15 cm

          if (!isNaN(heightInCm)) {
            // Calculate fill level percentage
            const fillLevelPercentage = ((totalHeightCm - heightInCm) / totalHeightCm) * 100;

            // Ensure percentage is within a reasonable range (0-100)
            const validFillLevel = Math.max(0, Math.min(100, fillLevelPercentage));

            setChartData((prevData) => [...prevData, validFillLevel]);
            setBinFillLevel(validFillLevel);

            // Derive binStatus based on the calculated percentage
            setBinStatus(validFillLevel >= 80 ? 'Alert' : validFillLevel >= 50 ? 'Medium' : 'Good');
          } else {
            setBinFillLevel(null); // Set to null if data is not a valid number
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  const disconnectWebSocket = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
  };

  useEffect(() => {
    return () => {
      disconnectWebSocket();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <AlertSystem />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <BinFillLevel
              fillLevel={binFillLevel}
              status={binStatus} // Pass the derived status
              isConnected={isConnected}
            />
          </div>
          <div className="lg:col-span-1">
            {/* Placeholder for WebSocket connection and data display */}
            <h2>Serial Data</h2>
            <button onClick={isConnected ? disconnectWebSocket : connectWebSocket}>
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
            <div>
              <h3>Received Data:</h3>
              <ul>
                {serialData.map((data, index) => (
                  <li key={index}>{data}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <AnalyticsChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Index;
