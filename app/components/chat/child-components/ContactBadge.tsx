interface ContactBadgeProps {
	company: string;
	email: string;
	name: string;
	profilePicture: string;
}

export default function ContactBadge({ company, email, name, profilePicture }: ContactBadgeProps) {
	return (
		<div className='group mt-3 p-4 md:p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300 max-w-sm relative overflow-hidden'>
			{/* Decorative gradient overlay */}
			<div className='absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-300/20 rounded-full blur-2xl -ml-16 -mt-16 group-hover:scale-150 transition-transform duration-500'></div>

			{/* Content */}
			<div className='relative z-10 flex items-start gap-3 md:gap-4'>
				{/* Avatar with decorative ring */}
				<div className='relative flex-shrink-0'>
					<div className='absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity'></div>

					<div className='relative w-14 h-14 md:w-16 md:h-16 rounded-full p-0.5 bg-gradient-to-br from-purple-400 to-pink-500'>
						<img
							alt={name}
							className='w-full h-full rounded-full object-cover border-2 border-white'
							src={profilePicture}
						/>
					</div>

					{/* Online status indicator */}
					<div className='absolute bottom-0 right-0 w-3.5 h-3.5 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white shadow-sm'></div>
				</div>

				{/* Info */}
				<div className='flex-1 min-w-0'>
					<h3 className='font-bold text-gray-900 text-base md:text-lg leading-tight mb-1 group-hover:text-purple-700 transition-colors'>
						{name}
					</h3>

					{/* Company badge */}
					<div className='inline-flex items-center gap-1.5 mb-2 px-2.5 py-1 bg-white/60 backdrop-blur-sm rounded-lg'>
						<svg
							className='w-3.5 h-3.5 text-purple-500'
							fill='currentColor'
							viewBox='0 0 20 20'
						>
							<path
								clipRule='evenodd'
								d='M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z'
								fillRule='evenodd'
							/>
						</svg>

						<span className='text-xs md:text-sm font-semibold text-purple-700'>
							{company}
						</span>
					</div>

					{/* Email button */}
					<a
						className='inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs md:text-sm font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group/email'
						href={`mailto:${email}`}
					>
						<svg
							className='w-3.5 h-3.5 md:w-4 md:h-4 group-hover/email:scale-110 transition-transform'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							viewBox='0 0 24 24'
						>
							<path
								d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>

						<span className='truncate max-w-[120px] md:max-w-[200px]'>{email}</span>
					</a>
				</div>
			</div>
		</div>
	);
}
