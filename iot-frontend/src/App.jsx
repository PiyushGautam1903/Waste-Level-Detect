// App.jsx
import { useEffect, useRef, useState } from "react";
import { FillLevelBar } from "./components/fill-level-bar";
import { ActivityChart } from "./components/activity-chart";
import { ConnectionStatus } from "./components/connection-status";

function App() {
	const socketRef = useRef(null);
	const [data, setData] = useState({
		distance: 0,
		max_depth: 22.5,
		fill_percent: 0,
	});
	const [isConnected, setIsConnected] = useState(false);

	useEffect(() => {
		const connectWebSocket = () => {
			socketRef.current = new WebSocket("ws://localhost:8765");

			socketRef.current.onopen = () => {
				setIsConnected(true);
			};

			socketRef.current.onclose = () => {
				setIsConnected(false);
				setTimeout(connectWebSocket, 3000);
			};

			socketRef.current.onmessage = (event) => {
				try {
					const incomingData = JSON.parse(event.data);
					setData(incomingData);
				} catch (e) {
					console.error("Invalid JSON from server:", e);
				}
			};
		};

		connectWebSocket();
		return () => socketRef.current?.close();
	}, []);

	return (
		<div className="min-h-screen bg-gray-100 p-6">
			<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
				<FillLevelBar
					currentDistance={data.distance}
					maxDepth={data.max_depth}
					fillPercent={data.fill_percent}
				/>
				<ConnectionStatus connected={isConnected} />
				<ActivityChart fillPercent={data.fill_percent} />
			</div>
		</div>
	);
}

export default App;
