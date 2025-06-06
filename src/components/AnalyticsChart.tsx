
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBinData } from '@/hooks/useBinData';
 
// Define a prop type for the component
interface AnalyticsChartProps {
 data: number[];
}
 
// Modify the component to accept props
const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {

  // Transform the incoming data into a format suitable for recharts
  const chartData = data.map((fillLevel, index) => ({
    time: new Date().getTime() + index * 1000, // Using index and a simple timestamp for now
    fillLevel: fillLevel,
  }));

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Daily Fill Level Analytics</CardTitle>
        <p className="text-sm text-gray-600">Historical bin fill data with automatic updates</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                domain={[0, 100]}
                label={{ value: 'Fill Level (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value) => [`${value}%`, 'Fill Level']}
                contentStyle={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="fillLevel" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="font-semibold text-blue-800">Average Fill Rate</div>
            <div className="text-xl font-bold text-blue-600">12% / day</div>
            <div className="text-xs text-blue-600">Based on last 7 days</div>
          </div>
          
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="font-semibold text-green-800">Time Until Full</div>
            <div className="text-xl font-bold text-green-600">≈ 26 hours</div>
            <div className="text-xs text-green-600">At current fill rate</div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="font-semibold text-purple-800">Collection Frequency</div>
            <div className="text-xl font-bold text-purple-600">Every 2 days</div>
            <div className="text-xs text-purple-600">Recommended schedule</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;
