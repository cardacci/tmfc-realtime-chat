interface ContactBadgeProps {
	company: string;
	email: string;
	name: string;
	profilePicture: string;
}

export default function ContactBadge({ company, email, name, profilePicture }: ContactBadgeProps) {
	return (
		<div className='flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 max-w-sm'>
			<div className='relative'>
				<img
					alt={name}
					className='w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-white shadow-sm'
					src={profilePicture}
				/>
			</div>

			<div className='flex flex-col'>
				<h3 className='font-bold text-gray-900 text-base md:text-lg leading-tight'>
					{name}
				</h3>

				<p className='text-xs md:text-sm text-yellow-600 font-medium'>{company}</p>

				<a
					className='text-xs md:text-sm text-gray-500 hover:text-yellow-500 transition-colors mt-0.5 break-all'
					href={`mailto:${email}`}
				>
					{email}
				</a>
			</div>
		</div>
	);
}
