import { ROLES } from '../../../types/chat';
import { formatMessageTime } from '../../../utils/chat';
import type { Message } from '../../../types/chat';

/** Demo component to show error message examples */
export default function ErrorMessageDemo() {
	const demoErrorMessages: Message[] = [
		{
			content:
				'⚠️ Oops! We received an incomplete message. Some information might be missing.',
			id: 'demo_error_1',
			isComplete: true,
			isError: true,
			role: ROLES.AGENT,
			timestamp: new Date(),
		},
		{
			content: '⚠️ Sorry, we received some unexpected data. Please try again in a moment.',
			id: 'demo_error_2',
			isComplete: true,
			isError: true,
			role: ROLES.AGENT,
			timestamp: new Date(),
		},
		{
			content:
				'⚠️ We encountered a communication issue. Please refresh the page and try again.',
			id: 'demo_error_3',
			isComplete: true,
			isError: true,
			role: ROLES.AGENT,
			timestamp: new Date(),
		},
	];

	return (
		<div className='mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200'>
			<div className='flex justify-between items-center mb-3'>
				<h3 className='text-sm font-semibold text-orange-900'>📋 Error Message Examples</h3>
			</div>

			<p className='text-xs text-orange-700 mb-3'>
				These are examples of how error messages appear when there are communication issues:
			</p>

			<div className='space-y-3'>
				{demoErrorMessages.map(msg => {
					const { content, id, timestamp } = msg;

					return (
						<div key={id} className='flex flex-col items-start animate-fadeIn'>
							<div className='message-error max-w-full'>
								<p className='text-sm whitespace-pre-wrap'>{content}</p>

								<div className='text-[10px] text-gray-400 mt-1 text-left'>
									{formatMessageTime(timestamp)}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div className='mt-3 pt-3 border-t border-orange-200'>
				<p className='text-xs text-orange-600'>
					<strong>Note:</strong> These are demo messages. Real error messages appear
					automatically when communication issues occur.
				</p>
			</div>
		</div>
	);
}
