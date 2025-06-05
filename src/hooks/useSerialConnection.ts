import { useState, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import type { SerialPort } from '../types/serial';

export const useSerialConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [availablePorts, setAvailablePorts] = useState<SerialPort[]>([]);
  const [selectedPort, setSelectedPort] = useState<SerialPort | null>(null);
  const [sensorData, setSensorData] = useState<number | null>(null);
  const portRef = useRef<SerialPort | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);

  // Check for Web Serial API support
  const isSerialSupported = typeof navigator !== 'undefined' && 'serial' in navigator;

  useEffect(() => {
    if (isSerialSupported && navigator.serial) {
      // Get already granted ports
      navigator.serial.getPorts().then(ports => {
        setAvailablePorts(ports);
      }).catch(error => {
        console.error('Error getting ports:', error);
      });
    }
  }, [isSerialSupported]);

  const requestPort = async () => {
    if (!isSerialSupported || !navigator.serial) {
      toast({
        title: "Serial API Not Supported",
        description: "Your browser doesn't support Web Serial API. Use Chrome/Edge for hardware connection.",
        variant: "destructive",
      });
      return;
    }

    try {
      const port = await navigator.serial.requestPort();
      setSelectedPort(port);
      setAvailablePorts(prev => [...prev, port]);
      toast({
        title: "Port Selected",
        description: "Serial port selected. Click connect to establish connection.",
      });
    } catch (error) {
      console.error('Port selection error:', error);
      toast({
        title: "Port Selection Cancelled",
        description: "No port was selected.",
        variant: "destructive",
      });
    }
  };

  const connect = async (port?: SerialPort) => {
    const targetPort = port || selectedPort;
    
    if (!targetPort) {
      await requestPort();
      return;
    }

    try {
      await targetPort.open({ baudRate: 9600 });
      portRef.current = targetPort;
      setIsConnected(true);
      
      toast({
        title: "✅ Connected Successfully!",
        description: "IoT device connected. Reading sensor data...",
      });

      // Start reading data
      startReading(targetPort);
      
    } catch (error) {
      console.error('Serial connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to IoT device. Check if the port is already in use.",
        variant: "destructive",
      });
    }
  };

  const startReading = async (port: SerialPort) => {
    if (!port.readable) return;
    
    const decoder = new TextDecoder();
    const reader = port.readable.getReader();
    readerRef.current = reader;

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed) {
            const distance = parseInt(trimmed);
            if (!isNaN(distance)) {
              setSensorData(distance);
              console.log('Sensor reading:', distance);
            }
          }
        }
      }
    } catch (error) {
      console.error('Reading error:', error);
      if (isConnected) {
        toast({
          title: "Connection Lost",
          description: "Lost connection to sensor. Please reconnect.",
          variant: "destructive",
        });
      }
    } finally {
      reader.releaseLock();
    }
  };

  const disconnect = async () => {
    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current = null;
      }
      
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
      
      setIsConnected(false);
      setSensorData(null);
      
      toast({
        title: "Disconnected",
        description: "IoT device disconnected",
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      setIsConnected(false);
      setSensorData(null);
    }
  };

  return {
    isConnected,
    connect,
    disconnect,
    requestPort,
    availablePorts,
    selectedPort,
    isSerialSupported,
    sensorData
  };
};
