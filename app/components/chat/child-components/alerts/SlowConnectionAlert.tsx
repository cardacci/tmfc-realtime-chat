interface SlowConnectionAlertProps {
	isConnected: boolean;
	isSlowConnection: boolean;
}

/** Renders a slow connection warning message. */
export default function SlowConnectionAlert({
	isConnected,
	isSlowConnection,
}: SlowConnectionAlertProps) {
	if (!isSlowConnection || !isConnected) {
		return null;
	}

	return (
		<div className='animate-fadeIn mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl shadow-sm'>
			<div className='flex items-start gap-3'>
				{/* Icon */}
				<div className='flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center'>
					<svg
						className='w-4 h-4 md:w-5 md:h-5 text-white'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						viewBox='0 0 24 24'
					>
						<path
							d='M13 10V3L4 14h7v7l9-11h-7z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</div>

				{/* Content */}
				<div className='flex-1 min-w-0'>
					<h4 className='text-sm md:text-base font-semibold text-orange-900 mb-0.5'>
						Slow Connection
					</h4>

					<p className='text-xs md:text-sm text-orange-700'>
						Your connection is slower than usual. Messages may take longer to load.
					</p>
				</div>

				{/* Animated bars indicator */}
				<div className='flex-shrink-0 flex items-end gap-0.5 h-5'>
					<div
						className='w-1 bg-orange-400 rounded-full animate-pulse'
						style={{ height: '40%', animationDelay: '0s' }}
					></div>

					<div
						className='w-1 bg-orange-500 rounded-full animate-pulse'
						style={{ height: '60%', animationDelay: '0.2s' }}
					></div>

					<div
						className='w-1 bg-orange-400 rounded-full animate-pulse'
						style={{ height: '80%', animationDelay: '0.4s' }}
					></div>
				</div>
			</div>
		</div>
	);
}
