# test_server.py
import asyncio
import websockets
import json
import random
from utils import process_distance

connected_clients = set()

async def broadcast(message):
    for ws in connected_clients.copy():
        try:
            await ws.send(message)
        except:
            connected_clients.remove(ws)

async def send_mock_data():
    while True:
        # Simulate a fluctuating sensor reading
        raw_distance = round(random.uniform(5, 25), 2)
        payload = process_distance(raw_distance)
        await broadcast(json.dumps(payload))
        await asyncio.sleep(1.5)

async def handler(websocket):
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

async def main():
    print("🧪 Mock WebSocket server running at ws://localhost:8765")
    try:
        async with websockets.serve(handler, "localhost", 8765, ping_interval=None):
            await send_mock_data()
    except Exception as e:
        print(f"❌ WebSocket server error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
