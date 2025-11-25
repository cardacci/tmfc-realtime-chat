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
		<div className='mt-4 border-t border-gray-300 pt-4'>
			<div className={`flex gap-2 ${isShaking ? 'animate-shake' : ''}`}>
				<input
					className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
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
					className={`px-6 py-2 font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 ${
						disabled
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-yellow-400 text-white hover:bg-yellow-500'
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
