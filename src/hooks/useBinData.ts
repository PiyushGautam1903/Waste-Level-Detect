import { useState, useEffect } from 'react';
import { useSerialConnection } from './useSerialConnection';

interface HistoricalDataPoint {
  time: number;
  fillLevel: number;
}

export const useBinData = () => {
  const { sensorData, isConnected } = useSerialConnection();
  const [fillLevel, setFillLevel] = useState<number | null>(null);
  const [lastUpdate, setLastUpdate] = useState('--:--:--');
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  // Calculate fill level from sensor distance (assuming 20cm is empty, 5cm is full)
  useEffect(() => {
    if (sensorData !== null && isConnected) {
      // Convert distance to fill percentage
      // Assuming: 20cm = 0% full, 5cm = 100% full
      const maxDistance = 20; // cm when empty
      const minDistance = 5;  // cm when full
      
      const clampedDistance = Math.max(minDistance, Math.min(maxDistance, sensorData));
      const calculatedFillLevel = Math.round(((maxDistance - clampedDistance) / (maxDistance - minDistance)) * 100);
      
      setFillLevel(calculatedFillLevel);
      setLastUpdate(new Date().toLocaleTimeString());
      
      // Add to historical data
      setHistoricalData(prev => {
        const newData = [...prev, {
          time: Date.now(),
          fillLevel: calculatedFillLevel
        }];
        // Keep only last 50 data points
        return newData.slice(-50);
      });
    } else if (!isConnected) {
      // Reset when disconnected
      setFillLevel(null);
      setLastUpdate('--:--:--');
    }
  }, [sensorData, isConnected]);

  const status = fillLevel !== null ? (fillLevel >= 80 ? 'alert' : fillLevel >= 50 ? 'warning' : 'normal') : 'disconnected';

  return {
    fillLevel,
    sensorReading: sensorData,
    isConnected,
    lastUpdate,
    historicalData,
    status
  };
};
