import { cn } from "../utils/merge-style";
import { Card } from "./card";

export const ConnectionStatus = ({ connected }) => {
	return (
		<Card
			title="Connection Status"
			description="Monitor backend WebSocket connection status."
		>
			<p
				className={cn(
					"flex items-center gap-1 text-sm font-medium p-4 rounded-xl w-fit",
					connected ? "text-green-500 bg-green-50" : "text-red-500 bg-red-50"
				)}
			>
				{connected ? "Connected" : "Disconnected"}
			</p>
		</Card>
	);
};
