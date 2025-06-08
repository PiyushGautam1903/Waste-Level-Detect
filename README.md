# Waste Bin Fill Level Monitor – IOT + Web App

This project is a full-stack, minimalist setup to monitor the fill level of a waste-bin using an IR distance sensor connected to an Arduino. The backend reads sensor data via serial port (or mock test mode), and serves it through a WebSocket API to a frontend built with React + Vite. The frontend visualizes fill status, live updates, and historical activity.

---

## 📁 Project Structure

---

## 🔌 IOT Backend

### 1. **arduino_code.ino**

- Arduino sketch that:
  - Uses an IR sensor on analog pin `A0`
  - Reads sensor value and converts it to estimated distance (in cm)
  - Sends distance over serial every 5 seconds
  - Sensor is installed on waste-bin lid to measure distance to fill level

### 2. **serial_server.py**

- Python backend to:
  - Read from serial port (e.g. `COM5` or `/dev/ttyUSB0`)
  - Converts distance into fill-level data
  - Automatically adapts to new waste-bin depths (after 3 consistent longer readings)
  - Exposes data via WebSocket for frontend consumption

### 3. **test_server.py**

- Mock version of backend for development:
  - Sends fake sensor readings with realistic patterns
  - Useful for testing frontend without Arduino hardware

### 4. **utils.py**

- Shared helper functions:
  - Sensor value smoothing
  - Fill level computation
  - Depth tracking logic

---

## 🧩 Frontend (Vite + React + Tailwind CSS)

### `App.jsx`

- Main layout using flex/grid
- Renders all cards: Fill level, activity chart, connection status

### `components/`

#### 🔹 `Card.jsx`

- Reusable card wrapper with title and description
- Used for layout consistency

#### 🔹 `FillLevelBar.jsx`

- Displays vertical fill status bar
- Uses percentage to compute fill height
- Smooth animation and label for current fill

#### 🔹 `ActivityChart.jsx`

- Line chart showing fill level over time
- Interpolated with `lerp()` for smooth transitions
- Auto-updates in real-time (60s window)

#### 🔹 `StatusCard.jsx`

- Shows WebSocket connection status (connected/disconnected)
- Button to manually connect or disconnect

---

## 🚀 Running the Project

### ✅ Requirements

- **Python 3.9+**
- **Node.js 18+**
- Arduino IDE (for flashing device)

---

### 🖥 1. Start the Backend

```bash
cd iot-backend
# For real hardware
python serial_server.py

# OR for mock testing
python test_server.py
```

### 🖥 2. Start the Frontend

```bash
cd iot-frontend
npm install
npm run dev
```

| Frontend will start at `http://localhost:5173` and connect to the backend WebSocket.

## 🏁 Production Deployment

In production, always use the real Arduino-connected backend:

```bash
cd iot-backend
python serial_server.py
```

| Use a process manager like pm2, supervisord, or systemd for reliability.

### Frontend can be built and served statically:

```bash
cd iot-frontend
npm run build
npx serve dist
```

## 📡 Features

- Real-time fill-level updates from IR sensor
- WebSocket-based streaming to frontend
- Adjustable depth recognition if sensor detects new max depth consistently
- Chart-based historical tracking
- Smooth UI with Tailwind CSS

## 📷 Future Ideas

- Support for multiple bins
- Export data to CSV
- Add alerting when bin is nearly empty/full

**🛠️ Built with ❤️ using Arduino, Python, WebSockets, and React.**
