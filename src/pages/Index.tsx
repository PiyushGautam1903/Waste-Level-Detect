
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import BinFillLevel from '@/components/BinFillLevel';
import IoTConnection from '@/components/IoTConnection';
import SensorData from '@/components/SensorData';
import AnalyticsChart from '@/components/AnalyticsChart';
import AlertSystem from '@/components/AlertSystem';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <AlertSystem />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <BinFillLevel />
          </div>
          <div className="lg:col-span-1">
            <SensorData />
          </div>
          <div className="lg:col-span-1">
            <IoTConnection />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <AnalyticsChart />
        </div>
      </div>
    </div>
  );
};

export default Index;
