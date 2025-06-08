# main.py
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
        print("Connected to Arduino.")
    except serial.SerialException:
        print("Could not connect to Arduino.")
        return

    while True:
        try:
            line = arduino.readline().decode("utf-8").strip()
            if "Distance" in line:
                if "Out of range" in line:
                    raw_distance = 999  # large value to indicate no detection
                else:
                    parts = line.split()
                    raw_distance = float(parts[1])

                payload = process_distance(raw_distance)
                await broadcast(json.dumps(payload))
        except Exception as e:
            print("Error:", e)
        await asyncio.sleep(1)

async def handler(websocket):
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

async def main():
    print("Sensor server started at ws://localhost:8765")
    await websockets.serve(handler, "localhost", 8765)
    await read_sensor_data()

if __name__ == "__main__":
    asyncio.run(main())
