import { useState } from 'react';
import { ROLES } from '../../../types/chat';
import type { Message } from '../../../types/chat';

/** Demo component to show error message examples */
export default function ErrorMessageDemo() {
	/* ===== State ===== */
	const [showDemo, setShowDemo] = useState(false);

	const demoErrorMessages: Message[] = [
		{
			content: '⚠️ Error: Received malformed JSON data. The message could not be parsed.',
			id: 'demo_error_1',
			isComplete: true,
			isError: true,
			role: ROLES.AGENT,
			timestamp: new Date(),
		},
		{
			content: '⚠️ Error: Received invalid data format. Expected an object but got string.',
			id: 'demo_error_2',
			isComplete: true,
			isError: true,
			role: ROLES.AGENT,
			timestamp: new Date(),
		},
		{
			content:
				'⚠️ Error: Received a malformed message (text_chunk). Some data could not be displayed.',
			id: 'demo_error_3',
			isComplete: true,
			isError: true,
			role: ROLES.AGENT,
			timestamp: new Date(),
		},
	];

	if (!showDemo) {
		return (
			<div className='mb-4'>
				<button
					className='w-full px-4 py-2 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg border border-orange-300 transition-colors text-sm font-medium'
					onClick={() => setShowDemo(true)}
					type='button'
				>
					🔍 Show Error Message Examples
				</button>
			</div>
		);
	}

	return (
		<div className='mb-4 p-4 bg-orange-50 rounded-lg border border-orange-200'>
			<div className='flex justify-between items-center mb-3'>
				<h3 className='text-sm font-semibold text-orange-900'>📋 Error Message Demo</h3>

				<button
					className='text-xs text-orange-600 hover:text-orange-800 underline'
					onClick={() => setShowDemo(false)}
					type='button'
				>
					Hide
				</button>
			</div>

			<p className='text-xs text-orange-700 mb-3'>
				These are examples of how error messages appear when malformed or incomplete data is
				received:
			</p>

			<div className='space-y-3'>
				{demoErrorMessages.map(msg => (
					<div key={msg.id} className='flex flex-col items-start animate-fadeIn'>
						<div className='message-error max-w-full'>
							<p className='text-sm whitespace-pre-wrap'>{msg.content}</p>

							<div className='text-[10px] text-gray-400 mt-1 text-left'>
								{new Intl.DateTimeFormat('es-ES', {
									hour: '2-digit',
									minute: '2-digit',
								}).format(msg.timestamp)}
							</div>
						</div>
					</div>
				))}
			</div>

			<div className='mt-3 pt-3 border-t border-orange-200'>
				<p className='text-xs text-orange-600'>
					<strong>Note:</strong> These are demo messages. Real error messages appear
					automatically when the stream receives corrupted data.
				</p>
			</div>
		</div>
	);
}
