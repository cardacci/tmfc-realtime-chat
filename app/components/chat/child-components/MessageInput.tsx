import React, { useState } from 'react';
import { KEYS } from '../../../constants/keys';
import { usePremium } from '../../../hooks/usePremium';

interface MessageInputProps {
	disabled?: boolean;
}

/** Renders a message input field with send button and optional model selector. */
export default function MessageInput({ disabled }: MessageInputProps) {
	/* ===== Hooks ===== */
	const { isPremiumMode, selectedModel } = usePremium();

	/* ===== State ===== */
	const [isShaking, setIsShaking] = useState(false);
	const [message, setMessage] = useState('');

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
				{/* Message Input */}
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

				{/* Send Button */}
				<button
					className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
						disabled
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: isPremiumMode
								? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 active:from-purple-700 active:to-pink-700 focus:ring-purple-400'
								: 'bg-yellow-400 text-white hover:bg-yellow-500 active:bg-yellow-600 focus:ring-yellow-400'
					}`}
					disabled={disabled}
					onClick={handleSend}
					type='button'
				>
					Send
				</button>
			</div>

			{/* Model Indicator */}
			{isPremiumMode && selectedModel && (
				<div className='mt-2 flex items-center justify-between'>
					<div className='flex items-center gap-2 text-xs text-purple-600'>
						<span className='font-medium'>
							{selectedModel.icon} Using {selectedModel.name}
						</span>
					</div>
				</div>
			)}
		</div>
	);
}
