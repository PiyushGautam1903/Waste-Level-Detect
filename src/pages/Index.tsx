import React, { useState, useEffect, useRef } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import BinFillLevel from '@/components/BinFillLevel';
import AnalyticsChart from '@/components/AnalyticsChart';
import AlertSystem from '@/components/AlertSystem';

const Index = () => {
  const [binFillLevel, setBinFillLevel] = useState<number | null>(null);
  const [binStatus, setBinStatus] = useState<string>('');
  const [serialData, setSerialData] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [useSampleData, setUseSampleData] = useState(true); // Start with sample data
  const ws = useRef<WebSocket | null>(null);
  console.log(binFillLevel);
  const connectWebSocket = () => {
    // Prevent multiple connections
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('WebSocket is already connected.');
      return;
    }

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
          console.log('Received serial data string:', message.data); // Log the raw data string

          // Extract the numerical height in cm from the string, e.g., "Distance: 21.92 cm" -> 21.92
          const dataString = message.data;
          // Use a regular expression to find a floating-point number in the string
          const regex = /[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?/;
          const match = dataString.match(regex);

          let heightInCm: number | null = null;

          if (match && match[0]) { // If a match was found, the number is the first element of the match array
              heightInCm = parseFloat(match[0]);
              console.log('Extracted heightInCm:', heightInCm); // Log the extracted number
          } else {
              console.log('Could not extract number from data string:', dataString); // Log if extraction fails
          }

          const totalHeightCm = 15; // Assuming bin height is 15 cm

          if (heightInCm !== null && !isNaN(heightInCm)) {
            // Calculate fill level percentage
            const fillLevelPercentage = ((totalHeightCm - heightInCm) / totalHeightCm) * 100;

            // Ensure percentage is within a reasonable range (0-100)
            const validFillLevel = Math.max(0, Math.min(100, fillLevelPercentage));

            console.log('Calculated fill level:', validFillLevel); // Log the calculated fill level

            // Update state variables
            // Limit chart data to a reasonable number of points
            console.log('Setting chartData with:', [...chartData.slice(-20), validFillLevel]);
            setChartData((prevData) => [...prevData.slice(-20), validFillLevel]); // Keep last 20 points
            console.log('Setting binFillLevel with:', validFillLevel);
            setBinFillLevel(validFillLevel);
            // Derive binStatus based on the calculated percentage
            console.log('Setting binStatus with:', validFillLevel >= 80 ? 'Alert' : validFillLevel >= 50 ? 'Medium' : 'Good');
            setBinStatus(validFillLevel >= 80 ? 'Alert' : validFillLevel >= 50 ? 'Medium' : 'Good');
            console.log('State updates triggered for fill level:', validFillLevel); // Confirm state updates for a specific fill level
          }
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
      // Optional: Attempt to reconnect after a delay
      // setTimeout(connectWebSocket, 5000); // Attempt to reconnect every 5 seconds
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      // The onclose event will typically be called after an error
    };
  };

  const disconnectWebSocket = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
  };

  useEffect(() => {
    connectWebSocket(); // Connect when the component mounts

    return () => {
      disconnectWebSocket(); // Disconnect when the component unmounts
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <AlertSystem />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <BinFillLevel
              fillLevel={binFillLevel}
              status={binStatus}
              isConnected={isConnected}
            />
          </div>
          <div className="lg:col-span-1">
            {/* Placeholder for WebSocket connection and data display */}
            <h2>Serial Data</h2>
             {/* You can keep the button for manual connect/disconnect if you like,
                 but automatic connection is now handled in useEffect */}
            <button onClick={isConnected ? disconnectWebSocket : connectWebSocket} className="mb-4">
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
            <div>
              <h3>Received Data:</h3>
              <ul>
                {/* Limit the number of displayed serial data entries for performance */}
                {serialData.slice(-10).map((data, index) => (
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
