import { useEffect, useState, useRef, useMemo } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Card } from "./card";

const MAX_POINTS = 60;
const INTERVAL_MS = 1000;

export const ActivityChart = ({ fillPercent }) => {
	const [data, setData] = useState([]);
	const lastValueRef = useRef(fillPercent);

	useEffect(() => {
		lastValueRef.current = fillPercent;
	}, [fillPercent]);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const timeLabel = now.toLocaleTimeString().split(":").slice(1).join(":"); // mm:ss

			setData((prev) => {
				const next = [
					...prev,
					{ time: timeLabel, percent: lastValueRef.current },
				];
				if (next.length > MAX_POINTS) next.shift();
				return next;
			});
		}, INTERVAL_MS);

		return () => clearInterval(interval);
	}, []);

	const chartData = useMemo(() => data, [data]);

	return (
		<Card title="Fill Activity" description="Jar fill level over time">
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={chartData}>
						<XAxis dataKey="time" interval="preserveStartEnd" tick={false} />
						<YAxis domain={[0, 100]} />
						<Tooltip />
						<Line
							type="monotone"
							dataKey="percent"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={false}
							isAnimationActive={false}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
			<p className="text-xs text-gray-500 text-center mt-1">
				Showing last 60 seconds (updated every 0.5s)
			</p>
		</Card>
	);
};
