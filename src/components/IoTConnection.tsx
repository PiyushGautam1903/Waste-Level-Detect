
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Usb } from 'lucide-react';
import { useSerialConnection } from '@/hooks/useSerialConnection';

const IoTConnection = () => {
  const { 
    isConnected, 
    connect, 
    disconnect, 
    requestPort, 
    availablePorts, 
    selectedPort,
    isSerialSupported 
  } = useSerialConnection();

  if (!isSerialSupported) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">IoT Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">⚠️ Browser Not Supported</div>
            <p className="text-sm text-gray-600 mb-4">
              Web Serial API is not supported in this browser. 
              Please use Chrome or Edge to connect to your IR sensor.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Usb className="w-5 h-5" />
          IoT Connection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="font-medium text-gray-700">IR Sensor</span>
              </div>
              <p className="text-sm text-gray-600">
                {isConnected ? 'Connected & Reading Data' : 'Not connected'}
              </p>
            </div>
          </div>

          {!isConnected && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Serial Port:
                </label>
                {availablePorts.length > 0 ? (
                  <Select onValueChange={(value) => {
                    const port = availablePorts[parseInt(value)];
                    connect(port);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a port..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePorts.map((port, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          Serial Port {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-sm text-gray-500">No ports available</p>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={requestPort}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
                >
                  Select New Port
                </Button>
                {selectedPort && (
                  <Button 
                    onClick={() => connect()}
                    className="bg-green-500 hover:bg-green-600 text-white flex-1"
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
          )}

          {isConnected && (
            <Button 
              onClick={disconnect}
              className="bg-red-500 hover:bg-red-600 text-white w-full"
            >
              Disconnect
            </Button>
          )}

          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Connection Information
              <ChevronDown className="w-4 h-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="text-xs text-gray-600">
                <div className="bg-gray-50 p-3 rounded">
                  <p><strong>Status:</strong> {isConnected ? 'Connected' : 'Disconnected'}</p>
                  <p><strong>Baud Rate:</strong> 9600</p>
                  <p><strong>Protocol:</strong> Serial/USB</p>
                  <p><strong>Expected Data:</strong> Distance readings in cm</p>
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

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Instructions:</strong> Connect your IR sensor via USB, then click "Select New Port" to choose the correct serial port.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Make sure your Arduino is programmed to send distance readings over serial at 9600 baud rate.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IoTConnection;
