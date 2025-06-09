// App.jsx
import { useRef, useState } from "react";
import { FillLevelBar } from "./components/fill-level-bar";
import { ActivityChart } from "./components/activity-chart";
import { StatusCard } from "./components/status-card";
import { Header } from "./components/header";

function App() {
	const socketRef = useRef(null);
	const [data, setData] = useState({
		distance: 0,
		max_depth: 22.5,
		fill_percent: 0,
	});
	const [isConnected, setIsConnected] = useState(false);

	const connectWebSocket = () => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			console.log("Already connected");
			return;
		}

		socketRef.current = new WebSocket("ws://localhost:8765");

		socketRef.current.onopen = () => {
			console.log("WebSocket connected");
			setIsConnected(true);
		};

		socketRef.current.onclose = () => {
			console.log("WebSocket disconnected");
			setIsConnected(false);
		};

		socketRef.current.onerror = (err) => {
			console.error("WebSocket error", err);
			setIsConnected(false);
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

	return (
		<div className="min-h-screen flex flex-col gap-2">
			<Header />
			<div className="max-w-[1400px] w-full mx-auto flex flex-col gap-6 p-6">
				<h1 className="text-3xl font-medium">Smart Bin Monitoring Dashboard</h1>
				<div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="flex flex-col gap-6">
						<FillLevelBar fillPercent={data.fill_percent} />
						<ActivityChart fillPercent={data.fill_percent} />
					</div>
					<StatusCard connected={isConnected} onConnect={connectWebSocket} />
				</div>
			</div>
		</div>
	);
}

export default App;
