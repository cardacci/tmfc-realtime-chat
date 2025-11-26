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
			className='mt-3 p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 max-w-sm cursor-pointer'
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
			<div className='flex items-center gap-2 mb-2'>
				<svg
					className='w-5 h-5 text-blue-500'
					fill='currentColor'
					viewBox='0 0 20 20'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z' />
				</svg>

				<h3 className='font-semibold text-gray-900 text-base md:text-lg'>{title}</h3>
			</div>

			<p className='text-sm text-gray-600'>
				{date} • {time}
			</p>

			{status && (
				<span className='inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded'>
					{status}
				</span>
			)}

			<p className='text-xs text-gray-400 mt-2'>Click to add to Google Calendar</p>
		</div>
	);
}
