import { cn } from "../utils/merge-style";
import { Card } from "./card";
import { ConnectionAccordion } from "./connection-accordion";

export const StatusCard = ({ connected, onConnect }) => {
	return (
		<Card
			title="IOT Connection Status"
			description="Monitor backend WebSocket connection status."
		>
			<div className="flex flex-col gap-2 mb-2">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<span>Status: </span>
						<p
							className={cn(
								"flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-xl",
								connected
									? "text-green-600 bg-green-100"
									: "text-red-600 bg-red-100"
							)}
						>
							{connected ? "Connected" : "Disconnected"}
						</p>
					</div>
					<button
						onClick={onConnect}
						className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
					>
						{connected ? "Reconnect" : "Connect"}
					</button>
				</div>
				<ConnectionAccordion />
			</div>
		</Card>
	);
};
