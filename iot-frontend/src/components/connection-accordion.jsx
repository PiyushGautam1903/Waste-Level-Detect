import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { ARDUINO_CODE } from "./data.constant";

const accordionStyles =
	"group flex items-center justify-between w-full p-4 transition border-b border-b-gray-500";

export const ConnectionAccordion = () => {
	return (
		<Accordion.Root type="multiple" className="w-full space-y-2">
			<Accordion.Item value="item-1">
				<Accordion.Header>
					<Accordion.Trigger className={accordionStyles}>
						Connection Information
						<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content className="p-4 bg-white text-sm">
					<ul className="list-disc list-inside space-y-1">
						<li>Device: Arduino Uno</li>
						<li>Sensor: HC-SR04 Ultrasonic</li>
						<li>Connection via Serial at 9600 baud</li>
						<li>Max Height: 30 cm</li>
					</ul>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="item-2">
				<Accordion.Header>
					<Accordion.Trigger className={accordionStyles}>
						Connection Arduino Code
						<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content className="p-4 bg-white text-sm overflow-auto">
					<pre className="text-xs bg-gray-50 p-2 rounded-md overflow-x-auto">
						{ARDUINO_CODE}
					</pre>
				</Accordion.Content>
			</Accordion.Item>

			<Accordion.Item value="item-3">
				<Accordion.Header>
					<Accordion.Trigger className={accordionStyles}>
						Connection Instructions
						<ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
					</Accordion.Trigger>
				</Accordion.Header>
				<Accordion.Content className="p-4 bg-white text-sm">
					<ol className="list-decimal list-inside space-y-1">
						<li>Plug Arduino into USB.</li>
						<li>Upload code using Arduino IDE.</li>
						<li>Run backend Python server.</li>
						<li>Click Connect in frontend.</li>
						<li>Observe real-time updates.</li>
					</ol>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	);
};
