
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BinFillLevelProps {
  fillLevel: number | null;
  status: string;
  isConnected: boolean;
}

const BinFillLevel: React.FC<BinFillLevelProps> = ({ fillLevel, status, isConnected }) => {
  // Removed useBinData hook and its destructuring

  const getStatusColor = (level: number | null) => {
    if (level === null) return 'bg-gray-300';
    if (level >= 80) return 'bg-red-500';
    if (level >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusText = (level: number | null) => {
    if (level === null) return 'No Data';
    if (level >= 80) return 'Alert';
    if (level >= 50) return 'Medium';
    return 'Good';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Bin Fill Level</CardTitle>
        <p className="text-sm text-gray-600">
          {isConnected ? 'Live Sensor Data' : 'Connect sensor for live data'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-3xl font-bold text-gray-900">
            {fillLevel !== null ? `${fillLevel}%` : '--'}
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-lg h-6 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${getStatusColor(fillLevel)}`}
                style={{ width: `${fillLevel || 0}%` }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-700">
                {fillLevel !== null ? `${fillLevel}%` : 'No Data'}
              </span>
            </div>
          </div>
          
          {isConnected ? (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>80% Alert Level</span>
                <span className="text-red-500">⚠️</span>
              </div>
              <div className="flex justify-between">
                <span>50% Warning Level</span>
                <span className="text-yellow-500">⚠️</span>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                Connect your IR sensor to see real-time fill levels
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(fillLevel)}`}></div>
            <span className="text-sm font-medium">Status: {getStatusText(fillLevel)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BinFillLevel;
