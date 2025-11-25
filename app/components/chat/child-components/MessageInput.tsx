import React, { useState } from 'react';
import { KEYS } from '../../../constants/keys';

/** Renders a message input field with send button (simulation only). */
export default function MessageInput() {
	/* ===== State ===== */
	const [message, setMessage] = useState('');
	const [isShaking, setIsShaking] = useState(false);

	/* ===== Functions ===== */
	const handleSend = () => {
		// Trigger shake animation
		setIsShaking(true);

		// Remove shake class after animation completes
		setTimeout(() => {
			setIsShaking(false);
		}, 500);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === KEYS.ENTER) {
			handleSend();
		}
	};

	return (
		<div className='mt-4 border-t border-gray-300 pt-4'>
			<div className={`flex gap-2 ${isShaking ? 'animate-shake' : ''}`}>
				<input
					className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent'
					onChange={e => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder='Type a message...'
					type='text'
					value={message}
				/>

				<button
					className='px-6 py-2 bg-yellow-400 text-white font-semibold rounded-lg hover:bg-yellow-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2'
					onClick={handleSend}
					type='button'
				>
					Send
				</button>
			</div>
		</div>
	);
}
