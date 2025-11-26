import { useState } from 'react';

import logo from '../../assets/images/logo.avif';
import { useChatStream } from '../../hooks/useChatStream';
import { usePremium } from '../../hooks/usePremium';
import ConnectionErrorAlert from './child-components/alerts/ConnectionErrorAlert';
import Sidebar from './child-components/NavigationBar';
import SlowConnectionAlert from './child-components/alerts/SlowConnectionAlert';
import ConversationView from './child-components/ConversationView';
import EmptyState from './child-components/EmptyState';
import ErrorMessageDemo from './child-components/ErrorMessageDemo';
import MessageInput from './child-components/MessageInput';

/** Main chat component. */
export function Chat() {
	/* ===== Hooks ===== */
	const { conversations, error, isConnected, isSlowConnection } = useChatStream();
	const { isPremiumMode } = usePremium();

	/* ===== State ===== */
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [showErrorDemo, setShowErrorDemo] = useState(false);

	/* ===== Functions ===== */
	const renderConversations = () => {
		if (conversations.length === 0) {
			return <EmptyState />;
		}

		return conversations.map((c, index) => (
			<ConversationView
				conversation={c}
				key={c.id}
				showTypingIndicator={index === conversations.length - 1}
			/>
		));
	};

	return (
		<div className='flex flex-col h-screen max-w-2xl mx-auto p-2 md:p-4'>
			<header
				className={`chat-header mb-2 md:mb-4 flex justify-between items-center p-2 md:p-4 rounded-lg shadow-sm transition-all duration-300 ${
					isPremiumMode
						? 'bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-2 border-purple-300'
						: ''
				}`}
			>
				<div className='flex items-center gap-2 md:gap-4'>
					<img
						alt='The Mobile-First Company'
						className='h-8 md:h-12 w-auto object-contain mix-blend-multiply'
						src={logo}
					/>

					<div className='flex flex-col'>
						<h1 className='text-xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-fadeIn transition-transform duration-300 tracking-tight'>
							AI Chat
						</h1>
						{isPremiumMode && (
							<div className='flex items-center gap-1 mt-0.5'>
								<svg
									className='w-3 h-3 text-purple-600'
									fill='currentColor'
									viewBox='0 0 20 20'
								>
									<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
								</svg>

								<span className='text-[10px] md:text-xs font-bold text-purple-600 uppercase tracking-wide'>
									Premium
								</span>
							</div>
						)}
					</div>
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

			<div
				className={`flex-1 overflow-y-auto space-y-4 md:space-y-6 p-2 md:p-4 rounded-lg border transition-all duration-500 ${
					isPremiumMode
						? 'bg-gradient-to-b from-white/80 via-purple-50/30 to-pink-50/30 border-purple-200/50 backdrop-blur-sm'
						: 'bg-gray-50 border-gray-200'
				}`}
			>
				{showErrorDemo && <ErrorMessageDemo />}

				{renderConversations()}
			</div>

			<MessageInput disabled={!isConnected} />
		</div>
	);
}
