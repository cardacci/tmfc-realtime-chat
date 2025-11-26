interface ConnectionErrorAlertProps {
	error: string | null;
}

/** Renders a connection error message. */
export default function ConnectionErrorAlert({ error }: ConnectionErrorAlertProps) {
	if (!error) {
		return null;
	}

	return (
		<div className='animate-fadeIn mb-3 md:mb-4 p-3 md:p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl shadow-sm'>
			<div className='flex items-start gap-3'>
				{/* Icon */}
				<div className='flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center'>
					<svg
						className='w-4 h-4 md:w-5 md:h-5 text-white'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						viewBox='0 0 24 24'
					>
						<path
							d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				</div>

				{/* Content */}
				<div className='flex-1 min-w-0'>
					<h4 className='text-sm md:text-base font-semibold text-red-900 mb-0.5'>
						Connection Error
					</h4>

					<p className='text-xs md:text-sm text-red-700'>{error}</p>
				</div>

				{/* Pulse indicator */}
				<div className='flex-shrink-0'>
					<span className='relative flex h-3 w-3'>
						<span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>

						<span className='relative inline-flex rounded-full h-3 w-3 bg-red-500'></span>
					</span>
				</div>
			</div>
		</div>
	);
}
