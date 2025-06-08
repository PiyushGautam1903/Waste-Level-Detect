export const Card = ({ title, description, children }) => {
	return (
		<div className="bg-white border border-gray-300 p-4 rounded-xl shadow-md h-fit">
			<h2 className="text-lg font-semibold mb-1">{title}</h2>
			{description && (
				<p className="text-sm text-gray-600 mb-4">{description}</p>
			)}
			{children}
		</div>
	);
};
