import { useState, useEffect } from 'react';

interface HistoricalDataPoint {
  time: number;
  fillLevel: number;
}

export const useBinData = () => {
  const [fillLevel, setFillLevel] = useState(45);
  const [sensorReading, setSensorReading] = useState(15);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('--:--:--');
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  // Initialize historical data
  useEffect(() => {
    const generateInitialData = () => {
      const data = [];
      const now = Date.now();
      for (let i = 23; i >= 0; i--) {
        data.push({
          time: now - (i * 60 * 60 * 1000), // hourly data for last 24 hours
          fillLevel: Math.floor(Math.random() * 30) + (i * 2) // gradual increase over time
        });
      }
      return data;
    };
    
    setHistoricalData(generateInitialData());
  }, []);

  // Simulate real-time sensor data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sensor readings
      const newReading = Math.floor(Math.random() * 5) + 12; // 12-17 cm range
      const newFillLevel = Math.max(0, Math.min(100, 
        Math.floor((20 - newReading) / 20 * 100) + Math.floor(Math.random() * 10 - 5)
      ));
      
      setSensorReading(newReading);
      setFillLevel(newFillLevel);
      setLastUpdate(new Date().toLocaleTimeString());
      
      // Add to historical data every few updates
      if (Math.random() > 0.7) {
        setHistoricalData(prev => {
          const newData = [...prev, {
            time: Date.now(),
            fillLevel: newFillLevel
          }];
          // Keep only last 50 data points
          return newData.slice(-50);
        });
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Simulate connection status
  useEffect(() => {
    const connectionInterval = setInterval(() => {
      setIsConnected(prev => Math.random() > 0.1 ? true : !prev); // 90% uptime
    }, 10000);

    // Initial connection after 2 seconds
    const timeout = setTimeout(() => setIsConnected(true), 2000);

    return () => {
      clearInterval(connectionInterval);
      clearTimeout(timeout);
    };
  }, []);

  const status = fillLevel >= 80 ? 'alert' : fillLevel >= 50 ? 'warning' : 'normal';

  return {
    fillLevel,
    sensorReading,
    isConnected,
    lastUpdate,
    historicalData,
    status
  };
};
