import { KEYS } from '../../../constants/keys';

interface CalendarEventProps {
	date: string; // e.g., '2025-12-01'
	status?: string; // e.g., 'Confirmed', 'Pending'
	time: string; // e.g., '14:00 - 15:00'
	title: string;
}

export default function CalendarEvent({ title, date, time, status }: CalendarEventProps) {
	/* ===== Functions ===== */
	/** Format dates for Google Calendar (YYYYMMDDTHHMMSS) */
	const formatDateTime = (dateStr: string, timeStr: string) => {
		const [hours, minutes] = timeStr.split(':');

		return `${dateStr.replace(/-/g, '')}T${hours}${minutes}00`;
	};

	/** Helper function to create Google Calendar URL. */
	const createGoogleCalendarUrl = () => {
		// Parse time range (e.g., "14:00 - 15:00" or just "14:00")
		let endTime: string;
		let startTime: string;

		if (time.includes('-')) {
			[startTime, endTime] = time.split('-').map(t => t.trim());
		} else {
			// If no end time specified, default to 30 minutes after start
			startTime = time.trim();

			const [hours, minutes] = startTime.split(':').map(Number);
			const totalMinutes = hours * 60 + minutes + 30;
			const endHours = Math.floor(totalMinutes / 60) % 24;
			const endMinutes = totalMinutes % 60;

			endTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
		}

		const endDateTime = formatDateTime(date, endTime);
		const startDateTime = formatDateTime(date, startTime);

		// Build Google Calendar URL.
		const params = [
			'action=TEMPLATE',
			`dates=${encodeURIComponent(`${startDateTime}/${endDateTime}`)}`,
			`text=${encodeURIComponent(title)}`,
		].join('&');

		return `https://calendar.google.com/calendar/render?${params}`;
	};

	/** Handle click event to open Google Calendar. */
	const handleClick = () => {
		window.open(createGoogleCalendarUrl(), '_blank', 'noopener,noreferrer');
	};

	return (
		<div
			className='group mt-3 p-4 md:p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 max-w-sm cursor-pointer relative overflow-hidden'
			onClick={handleClick}
			onKeyDown={e => {
				if (e.key === KEYS.ENTER || e.key === KEYS.SPACE) {
					e.preventDefault();
					handleClick();
				}
			}}
			role='button'
			tabIndex={0}
		>
			{/* Decorative gradient overlay */}
			<div className='absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-indigo-300/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500'></div>

			{/* Content */}
			<div className='relative z-10'>
				{/* Header with icon */}
				<div className='flex items-start gap-3 mb-3'>
					<div className='flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300'>
						<svg
							className='w-5 h-5 md:w-6 md:h-6 text-white'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							viewBox='0 0 24 24'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
								strokeLinecap='round'
								strokeLinejoin='round'
							/>
						</svg>
					</div>

					<div className='flex-1 min-w-0'>
						<h3 className='font-bold text-gray-900 text-base md:text-lg leading-tight mb-1 group-hover:text-blue-700 transition-colors'>
							{title}
						</h3>

						<div className='flex items-center gap-2 text-xs md:text-sm text-gray-600'>
							<svg
								className='w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									clipRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
									fillRule='evenodd'
								/>
							</svg>

							<span className='font-medium'>{time}</span>
						</div>
					</div>
				</div>

				{/* Date */}
				<div className='flex items-center gap-2 mb-3 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-lg'>
					<svg
						className='w-4 h-4 text-indigo-500'
						fill='currentColor'
						viewBox='0 0 20 20'
					>
						<path
							clipRule='evenodd'
							d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
							fillRule='evenodd'
						/>
					</svg>

					<span className='text-sm font-medium text-gray-700'>{date}</span>
				</div>

				{/* Status badge */}
				{status && (
					<div className='mb-3'>
						<span className='inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-full border border-green-200'>
							<span className='w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse'></span>

							{status}
						</span>
					</div>
				)}

				{/* Call to action */}
				<div className='flex items-center gap-2 text-xs text-blue-600 font-medium group-hover:text-blue-700 transition-colors'>
					<svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
						<path d='M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z' />

						<path d='M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z' />
					</svg>

					<span>Add to Google Calendar</span>
				</div>
			</div>
		</div>
	);
}
