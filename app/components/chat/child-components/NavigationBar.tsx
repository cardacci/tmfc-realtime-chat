interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	onToggleErrorDemo: () => void;
	showErrorDemo: boolean;
}

/** Sidebar menu with options and controls */
export default function Sidebar({
	isOpen,
	onClose,
	onToggleErrorDemo,
	showErrorDemo,
}: SidebarProps) {
	return (
		<>
			{/* Overlay */}
			{isOpen && (
				<div
					aria-hidden='true'
					className='fixed inset-0 bg-opacity-20 backdrop-blur-sm z-40 transition-all duration-300 animate-fadeIn'
					onClick={onClose}
				/>
			)}

			{/* Sidebar */}
			<div
				className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className='flex flex-col h-full'>
					{/* Header */}
					<div className='flex items-center justify-between p-6 border-b border-gray-200'>
						<h2 className='text-xl font-semibold text-gray-800'>Settings</h2>

						<button
							aria-label='Close menu'
							className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
							onClick={onClose}
							type='button'
						>
							<svg
								className='w-6 h-6 text-gray-600'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									d='M6 18L18 6M6 6l12 12'
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
								/>
							</svg>
						</button>
					</div>

					{/* Content */}
					<div className='flex-1 overflow-y-auto p-6'>
						<div className='space-y-6'>
							{/* Error Demo Toggle */}
							<div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200'>
								<div className='flex-1'>
									<h3 className='text-sm font-semibold text-gray-800 mb-1'>
										Error Demo
									</h3>

									<p className='text-xs text-gray-600'>
										Show error message examples
									</p>
								</div>

								<button
									aria-checked={showErrorDemo}
									aria-label='Toggle error message demo'
									className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
										showErrorDemo ? 'bg-indigo-600' : 'bg-gray-300'
									}`}
									onClick={() => {
										onToggleErrorDemo();
										onClose();
									}}
									role='switch'
									type='button'
								>
									<span
										className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
											showErrorDemo ? 'translate-x-6' : 'translate-x-1'
										}`}
									/>
								</button>
							</div>
						</div>
					</div>

					{/* Footer */}
					<div className='p-6 border-t border-gray-200'>
						<p className='text-xs text-gray-500 text-center'>
							The Mobile-First Company AI Chat
						</p>

						<p className='text-xs text-gray-500 text-center'>v0.0.4</p>
					</div>
				</div>
			</div>
		</>
	);
}
