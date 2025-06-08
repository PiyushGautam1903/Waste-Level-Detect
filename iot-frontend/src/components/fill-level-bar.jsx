import { Card } from "./card";

export const FillLevelBar = ({ currentDistance, maxDepth, fillPercent }) => {
	const getStatus = () => {
		if (fillPercent >= 80) return { label: "High", color: "bg-red-500" };
		if (fillPercent >= 50) return { label: "Medium", color: "bg-yellow-500" };
		return { label: "Low", color: "bg-green-500" };
	};

	const status = getStatus();

	return (
		<Card
			title="Waste - Bin Fill Level"
			description="Shows current fill level based on sensor data."
		>
			<div className="relative h-60 w-full border border-gray-300 bg-gray-100 rounded-md overflow-hidden flex flex-col-reverse">
				{/* Fill */}
				<div
					className="relative bg-blue-500 transition-all duration-500 w-full"
					style={{ height: `${fillPercent}%` }}
				>
					<div className="absolute text-sm font-semibold text-white">
						{fillPercent.toFixed(1)}%
					</div>
				</div>

				{/* Threshold lines */}
				<div className="absolute top-[20%] w-full border-t border-dashed border-red-400 text-[10px] text-center text-red-500">
					80% Alert
				</div>
				<div className="absolute top-[50%] w-full border-t border-dashed border-yellow-400 text-[10px] text-center text-yellow-500">
					50% Warning
				</div>

				{/* Fill percent label */}
				{/* <div className="absolute text-sm font-semibold text-blue-600">
					{fillPercent.toFixed(1)}%
				</div> */}
			</div>

			<div className="mt-4 text-sm text-center text-gray-700">
				Current Distance: {currentDistance.toFixed(1)} cm / Max Depth:{" "}
				{maxDepth.toFixed(1)} cm
			</div>

			<div className="mt-2 flex items-center justify-center gap-2 text-sm font-medium">
				<span className={`h-3 w-3 rounded-full ${status.color}`} />
				Status: {status.label}
			</div>
		</Card>
	);
};
