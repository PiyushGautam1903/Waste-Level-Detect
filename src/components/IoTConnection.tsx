
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useSerialConnection } from '@/hooks/useSerialConnection';

const IoTConnection = () => {
  const { isConnected, connect, disconnect, availablePorts } = useSerialConnection();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">IoT Connection</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="font-medium text-gray-700">IR Sensor</span>
              </div>
              <p className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Not connected'}</p>
            </div>
            <Button 
              onClick={isConnected ? disconnect : connect}
              className={`${isConnected ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Connection Information
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="text-xs text-gray-600">
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Port:</strong> {isConnected ? 'COM3 (USB Serial)' : 'None'}</p>
                  <p><strong>Baud Rate:</strong> 9600</p>
                  <p><strong>Protocol:</strong> Serial/USB</p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Arduino Code Reference
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="bg-black text-green-400 p-3 rounded text-xs font-mono">
                <div>// Arduino IR Sensor Code</div>
                <div>int irPin = A0;</div>
                <div>void setup() {'{'}</div>
                <div>  Serial.begin(9600);</div>
                <div>{'}'}</div>
                <div>void loop() {'{'}</div>
                <div>  int distance = analogRead(irPin);</div>
                <div>  Serial.println(distance);</div>
                <div>  delay(1000);</div>
                <div>{'}'}</div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="text-sm text-green-800">
              <strong>Connection Status:</strong> Connect your IoT device to see real-time bin level data.
            </p>
            <p className="text-xs text-green-600 mt-1">
              Note: This is a simulation environment. In a real deployment, the sensor would be physically connected to your device.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IoTConnection;
