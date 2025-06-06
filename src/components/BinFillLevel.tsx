
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BinFillLevelProps {
  fillLevel: number | null;
  status: string;
  isConnected: boolean;
}

const BinFillLevel: React.FC<BinFillLevelProps> = ({ fillLevel, status, isConnected }) => {
  // Removed useBinData hook and its destructuring

  console.log('BinFillLevel rendering with props:', { fillLevel, status, isConnected });

  useEffect(() => {
    console.log('BinFillLevel props changed:', { fillLevel, status });
  }, [fillLevel, status]);

  // Note: isConnected is intentionally not in the dependency array of this useEffect
  // as we are primarily interested in changes to fillLevel and status for data flow debugging.

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
      <CardContent className="flex flex-col items-center justify-center p-6">
        {/* Temporarily display raw props for debugging */}
        <div className="text-xl font-bold mb-2">
          Fill Level: {fillLevel !== null && !isNaN(fillLevel) ? `${fillLevel.toFixed(2)}%` : '--'}
        </div>
        <div className={`text-md font-semibold px-3 py-1 rounded-full ${getStatusColor(fillLevel)} text-white`}>
          Status: {getStatusText(fillLevel)}
        </div>

        {/* Original fill bar and status display logic (commented out for now) */}
        {/*
        <div className="w-full h-6 bg-gray-200 rounded-full mb-4 overflow-hidden">
            <div className={`h-full ${getStatusColor(fillLevel)}`} style={{ width: fillLevel !== null ? `${fillLevel}%` : '0%' }}></div>
        </div>
        <div className={`text-sm font-medium ${getStatusColor(fillLevel) === 'bg-green-500' ? 'text-green-700' : getStatusColor(fillLevel) === 'bg-yellow-500' ? 'text-yellow-700' : 'text-red-700'}`}>
            Status: {getStatusText(fillLevel)}
        </div>
        */}
      </CardContent>
    </Card>
  );
};

export default BinFillLevel;
