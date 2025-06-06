import serial
import websockets
import asyncio
import json
import threading
import sys # Import sys for error logging

# Configure serial port
# Replace 'COMx' with your Arduino's serial port
# Replace 9600 with your Arduino's baud rate
SERIAL_PORT = 'COM5'
BAUD_RATE = 9600

# Set to store connected WebSocket clients
connected_clients = set()

# Event to signal when serial data is available
serial_data_event = asyncio.Event()
latest_serial_data = None

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
    if websocket in connected_clients:
        connected_clients.remove(websocket)
        print(f"Client disconnected. Total clients: {len(connected_clients)}")


async def send_serial_data_to_clients():
    global latest_serial_data
    while True:
        await serial_data_event.wait()
        serial_data_event.clear()

        if latest_serial_data is not None:
            message = json.dumps({"type": "serial_data", "data": latest_serial_data})
            print(f"Attempting to send message to {len(connected_clients)} clients: {message}")

            send_tasks = [client.send(message) for client in connected_clients if not client.close]

            if send_tasks:
                results = await asyncio.gather(*send_tasks, return_exceptions=True)
                for result in results:
                    if isinstance(result, Exception):
                        print(f"Error sending to a client: {result}", file=sys.stderr)

            print("Message send attempt finished.")
            latest_serial_data = None


def read_from_serial(loop): # Added loop as an argument
    """Reads data from the serial port in a separate thread."""
    global latest_serial_data
    try:
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE)
        print(f"Connected to serial port {SERIAL_PORT}")

        while True:
            if ser.in_waiting > 0:
                data = ser.readline().decode('utf-8').strip()
                print(f"Received from Arduino: {data}")
                latest_serial_data = data
                # Use loop.call_soon_threadsafe to set the event from the thread
                loop.call_soon_threadsafe(serial_data_event.set)

    except serial.SerialException as e:
        print(f"Serial port error: {e}")
    except Exception as e: # Catch other potential exceptions in the thread
        print(f"An unexpected error occurred in serial thread: {e}", file=sys.stderr)
    finally:
        if 'ser' in locals() and ser.isOpen():
            ser.close()
            print(f"Serial port {SERIAL_PORT} closed")


async def main():
    """Starts the WebSocket server and manages serial communication."""
    server = await websockets.serve(register, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")

    # Start the serial reading in a separate thread
    # Get the current running event loop to pass to the thread
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        # This case should ideally not happen if main is run with asyncio.run()
        # but included for robustness.
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        print("Created new event loop for thread communication.")

    # Pass the event loop to the read_from_serial function
    serial_thread = threading.Thread(target=read_from_serial, args=(loop,), daemon=True)
    serial_thread.start()

    # Start the task to send serial data to clients
    # Use create_task to run it concurrently with the server
    asyncio.create_task(send_serial_data_to_clients())

    # Keep the server running indefinitely until interrupted
    await server.wait_closed()
    # Or alternatively, to run forever:
    # await asyncio.Future()


if __name__ == "__main__":
    # Use asyncio.run() which handles loop creation and management
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped manually.")
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
