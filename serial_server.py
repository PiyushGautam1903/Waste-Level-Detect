import serial
import websockets
import asyncio
import json

# Configure serial port
# Replace 'COMx' with your Arduino's serial port
# Replace 9600 with your Arduino's baud rate
SERIAL_PORT = 'COM5'
BAUD_RATE = 9600

# Set to store connected WebSocket clients
connected_clients = set()

async def handle_serial_data(websocket):
       """Reads data from the serial port and sends it to connected clients."""
       try:
           ser = serial.Serial(SERIAL_PORT, BAUD_RATE)
           print(f"Connected to serial port {SERIAL_PORT}")

           while True:
               if ser.in_waiting > 0:
                   data = ser.readline().decode('utf-8').strip()
                   print(f"Received from Arduino: {data}")

                   # Send data to all connected clients
                   message = json.dumps({"type": "serial_data", "data": data})
                   await asyncio.wait([client.send(message) for client in connected_clients])

               await asyncio.sleep(0.01) # Small delay to avoid busy-waiting

       except serial.SerialException as e:
           print(f"Serial port error: {e}")
           # You might want to send an error message to clients here
       except websockets.exceptions.ConnectionClosed as e:
            print(f"WebSocket connection closed: {e}")
       finally:
            if 'ser' in locals() and ser.isOpen():
                ser.close()
                print(f"Serial port {SERIAL_PORT} closed")

async def register(websocket):
       """Registers a new WebSocket client."""
       connected_clients.add(websocket)
       print(f"Client connected. Total clients: {len(connected_clients)}")
       try:
           await websocket.wait_closed()
       finally:
           await unregister(websocket)

async def unregister(websocket):
       """Unregisters a WebSocket client."""
       connected_clients.remove(websocket)
       print(f"Client disconnected. Total clients: {len(connected_clients)}")


async def main():
       """Starts the WebSocket server and handles serial communication."""
       # Start the WebSocket server
       async with websockets.serve(register, "localhost", 8765):
           print("WebSocket server started on ws://localhost:8765")
           # Run the serial data handling in a separate task
           asyncio.create_task(handle_serial_data(None)) # Pass None as websocket initially
           # Keep the server running
           await asyncio.Future()


if __name__ == "__main__":
    # Run the serial data handling in a separate task
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
