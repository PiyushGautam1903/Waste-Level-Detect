# mock.py
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
        # Occasionally simulate slightly larger depth
        raw_distance = round(random.uniform(0, 25), 2)
        payload = process_distance(raw_distance)
        await broadcast(json.dumps(payload))
        await asyncio.sleep(2)

async def handler(websocket):
    connected_clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        connected_clients.remove(websocket)

async def main():
    print("Mock server started at ws://localhost:8765")
    await websockets.serve(handler, "localhost", 8765)
    await send_mock_data()

if __name__ == "__main__":
    asyncio.run(main())
