
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useSerialConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [availablePorts, setAvailablePorts] = useState<string[]>([]);

  // Check for Web Serial API support
  const isSerialSupported = 'serial' in navigator;

  useEffect(() => {
    if (isSerialSupported) {
      // Simulate available ports
      setAvailablePorts(['COM3', 'COM4', '/dev/ttyUSB0']);
    }
  }, [isSerialSupported]);

  const connect = async () => {
    try {
      if (isSerialSupported) {
        // In a real implementation, you would use:
        // const port = await navigator.serial.requestPort();
        // await port.open({ baudRate: 9600 });
        
        toast({
          title: "Connecting to IoT Device...",
          description: "Attempting to establish serial connection",
        });

        // Simulate connection delay
        setTimeout(() => {
          setIsConnected(true);
          toast({
            title: "✅ Connected Successfully!",
            description: "IoT device connected via USB Serial Port",
          });
        }, 2000);
      } else {
        toast({
          title: "Serial API Not Supported",
          description: "Your browser doesn't support Web Serial API. Use Chrome/Edge for hardware connection.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Serial connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to IoT device. Check USB connection.",
        variant: "destructive",
      });
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "IoT device disconnected",
    });
  };

  return {
    isConnected,
    connect,
    disconnect,
    availablePorts,
    isSerialSupported
  };
};
