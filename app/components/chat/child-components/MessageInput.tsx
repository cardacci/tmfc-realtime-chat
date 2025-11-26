import React, { useState } from 'react';
import { KEYS } from '../../../constants/keys';

/** Renders a message input field with send button (simulation only). */
export default function MessageInput({ disabled }: { disabled?: boolean }) {
	/* ===== State ===== */
	const [message, setMessage] = useState('');
	const [isShaking, setIsShaking] = useState(false);

	/* ===== Functions ===== */
	const handleSend = () => {
		if (disabled) return;

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
		<div className='mt-2 md:mt-4 border-t border-gray-300 pt-2 md:pt-4'>
			<div className={`flex gap-2 ${isShaking ? 'animate-shake' : ''}`}>
				<input
					className={`flex-1 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
						disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''
					}`}
					disabled={disabled}
					onChange={e => setMessage(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={disabled ? 'Connection lost...' : 'Type a message...'}
					type='text'
					value={message}
				/>

				<button
					className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
						disabled
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-yellow-400 text-white hover:bg-yellow-500 active:bg-yellow-600'
					}`}
					disabled={disabled}
					onClick={handleSend}
					type='button'
				>
					Send
				</button>
			</div>
		</div>
	);
}
