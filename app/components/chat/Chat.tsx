import { useState } from 'react';

import logo from '../../assets/images/logo.avif';
import { useChatStream } from '../../hooks/useChatStream';
import ConnectionErrorAlert from './child-components/alerts/ConnectionErrorAlert';
import Sidebar from './child-components/NavigationBar';
import SlowConnectionAlert from './child-components/alerts/SlowConnectionAlert';
import ConversationView from './child-components/ConversationView';
import ErrorMessageDemo from './child-components/ErrorMessageDemo';
import MessageInput from './child-components/MessageInput';
import type { Conversation } from '../../types/chat';

/** Renders a waiting message when no conversations have arrived yet. */
function WaitingMessage({ conversations }: { conversations: Conversation[] }) {
	if (conversations.length === 0) {
		return <div className='text-center text-gray-400 mt-10'>Waiting for messages...</div>;
	}

	return null;
}

/** Main chat component. */
export function Chat() {
	const { conversations, error, isConnected, isSlowConnection } = useChatStream();

	/* ===== State ===== */
	const [showErrorDemo, setShowErrorDemo] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className='flex flex-col h-screen max-w-2xl mx-auto p-2 md:p-4'>
			<header className='chat-header mb-2 md:mb-4 flex justify-between items-center p-2 md:p-4 rounded-lg shadow-sm'>
				<div className='flex items-center gap-2 md:gap-4'>
					<img
						alt='The Mobile-First Company'
						className='h-8 md:h-12 w-auto object-contain mix-blend-multiply'
						src={logo}
					/>

					<h1 className='text-xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-fadeIn transition-transform duration-300 tracking-tight'>
						AI Chat
					</h1>
				</div>

				<div className='flex items-center gap-3'>
					<button
						aria-label='Open menu'
						className='p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500'
						onClick={() => setIsSidebarOpen(true)}
						type='button'
					>
						<svg
							className='w-6 h-6 text-gray-700'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								d='M4 6h16M4 12h16M4 18h16'
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
							/>
						</svg>
					</button>
				</div>
			</header>

			<Sidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				onToggleErrorDemo={() => setShowErrorDemo(prev => !prev)}
				showErrorDemo={showErrorDemo}
			/>

			<ConnectionErrorAlert error={error} />

			<SlowConnectionAlert isConnected={isConnected} isSlowConnection={isSlowConnection} />

			<div className='flex-1 overflow-y-auto space-y-4 md:space-y-6 p-2 md:p-4 bg-gray-50 rounded-lg border border-gray-200'>
				{showErrorDemo && <ErrorMessageDemo />}

				<WaitingMessage conversations={conversations} />

				{conversations.map((c, index) => (
					<ConversationView
						conversation={c}
						key={c.id}
						showTypingIndicator={index === conversations.length - 1}
					/>
				))}
			</div>

			<MessageInput disabled={!isConnected} />
		</div>
	);
}
