
import React, { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { useBinData } from '@/hooks/useBinData';

const AlertSystem = () => {
  const { fillLevel, isConnected } = useBinData();

  useEffect(() => {
    if (isConnected && fillLevel !== null && fillLevel >= 80) {
      toast({
        title: "🚨 Bin Alert!",
        description: `Bin is ${fillLevel}% full. Collection needed soon!`,
        variant: "destructive",
      });
    }
  }, [fillLevel, isConnected]);

  return null;
};

export default AlertSystem;
