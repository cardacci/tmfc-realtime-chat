import emptyStateImage from '../../../assets/images/empty-state-messages.png';

export default function EmptyState() {
	return (
		<div className='flex flex-col items-center justify-center h-full p-8 text-center animate-fadeIn'>
			<div className='relative w-48 h-48 md:w-64 md:h-64 mb-6'>
				<img
					alt='No messages yet'
					className='w-full h-full object-contain drop-shadow-lg'
					src={emptyStateImage}
				/>

				{/* Decorative background blob */}
				<div className='absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-full blur-2xl -z-10 opacity-60' />
			</div>

			<h3 className='text-xl md:text-2xl font-bold text-gray-800 mb-2'>It's quiet here...</h3>

			<p className='text-gray-500 max-w-xs md:max-w-md mx-auto leading-relaxed'>
				Messages will appear here when available.
			</p>
		</div>
	);
}
