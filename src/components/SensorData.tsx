
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBinData } from '@/hooks/useBinData';

const SensorData = () => {
  const { sensorReading, isConnected, lastUpdate } = useBinData();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">IR Sensor Data</CardTitle>
        <p className="text-sm text-gray-600">Real-time readings</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{sensorReading}</div>
            <p className="text-sm text-gray-600">Distance (cm)</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Connection Status</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Last Update</span>
              <span className="text-sm text-gray-600">{lastUpdate}</span>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Raw Sensor Output:</div>
              <div className="font-mono text-sm text-gray-800 bg-black text-green-400 p-2 rounded">
                &gt; IR_SENSOR: {sensorReading}cm | STATUS: {isConnected ? 'OK' : 'ERROR'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorData;
