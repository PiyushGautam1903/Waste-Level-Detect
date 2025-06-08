import { Card } from "./card";

export const FillLevelBar = ({ fillPercent }) => {
	const getStatus = () => {
		if (fillPercent >= 80) return { label: "High", color: "bg-red-500" };
		if (fillPercent >= 50) return { label: "Medium", color: "bg-yellow-500" };
		return { label: "Low", color: "bg-green-500" };
	};

	const status = getStatus();

	return (
		<Card
			title="Bin Fill Level"
			className={"flex flex-col gap-5 justify-start"}
		>
			<div className="flex flex-col gap-5 justify-start">
				<div className="flex items-center justify-between gap-2 w-full text-gray-500 text-base font-medium">
					<span>Current Level</span>
					<span>{fillPercent.toFixed(1)}%</span>
				</div>
				<div className="relative h-60 w-full border border-gray-300 bg-gray-100 rounded-md overflow-hidden flex flex-col-reverse">
					<div
						className="relative bg-yellow-300 transition-all duration-500 w-full"
						style={{ height: `${fillPercent}%` }}
					/>
					<div className="absolute top-[20%] w-full border-t border-dashed border-red-500 text-[10px] text-center text-red-500">
						80% Alert
					</div>
					<div className="absolute top-[50%] w-full border-t border-dashed border-orange-500 text-[10px] text-center text-orange-500">
						50% Warning
					</div>
				</div>
				<div className="flex items-center gap-2 font-medium">
					<span className={`h-3 w-3 rounded-full ${status.color}`} />
					Status: {status.label}
				</div>
			</div>
		</Card>
	);
};
