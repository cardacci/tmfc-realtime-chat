import { useState } from 'react';

export function ChatInterface() {
	const [demoMode, setDemoMode] = useState(false);

	return (
		<div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
			{/* Header */}
			<div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
				<div className="flex items-center justify-between">
					<h1 className="text-xl font-semibold text-gray-900 dark:text-white">
						AI Chat Assistant
					</h1>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
			</div>
		</div>
	);
}
