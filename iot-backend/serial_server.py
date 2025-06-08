# serial_server.py (main.py)
import asyncio
import serial
import websockets
import json
from utils import process_distance

connected_clients = set()

async def broadcast(message):
    for ws in connected_clients.copy():
        try:
            await ws.send(message)
        except:
            connected_clients.remove(ws)

async def read_sensor_data():
    try:
        arduino = serial.Serial("COM5", 9600, timeout=1)
        await asyncio.sleep(2)
        print("✅ Connected to Arduino.")
    except serial.SerialException:
        print("❌ Could not connect to Arduino. Check COM port.")
        return

    while True:
        try:
            line = arduino.readline().decode("utf-8").strip()
            if "Distance" in line:
                if "Out of range" in line:
                    raw_distance = 999  # Invalid reading
                else:
                    parts = line.split()
                    raw_distance = float(parts[1])

                payload = process_distance(raw_distance)
                await broadcast(json.dumps(payload))
        except Exception as e:
            print("⚠️ Error reading from serial:", e)
        await asyncio.sleep(0.5)

async def handler(websocket):
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

async def main():
    print("🚀 Sensor WebSocket server starting at ws://localhost:8765")
    try:
        async with websockets.serve(handler, "localhost", 8765, ping_interval=None):
            await read_sensor_data()
    except Exception as e:
        print(f"❌ WebSocket server error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
