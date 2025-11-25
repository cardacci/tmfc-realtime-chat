import { useChatStream } from '../../hooks/useChatStream';
import ConversationView from './child-components/ConversationView';
import type { Conversation } from '../../types/chat';

/** Renders a chat error message. */
function ChatError({ error }: { error: string | null }) {
	if (!error) {
		return null;
	}

	return (
		<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
			{error}
		</div>
	);
}

/** Renders a connection status message. */
function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
	return (
		<div className='flex items-center gap-2'>
			<span
				className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
			/>

			<span className='text-sm text-gray-500'>
				{isConnected ? 'Connected' : 'Disconnected'}
			</span>
		</div>
	);
}

/** Renders a waiting message when no conversations have arrived yet. */
function WaitingMessage({ conversations }: { conversations: Conversation[] }) {
	if (conversations.length === 0) {
		return <div className='text-center text-gray-400 mt-10'>Waiting for messages...</div>;
	}

	return null;
}

/** Main chat component. */
export function Chat() {
	const { conversations, error, isConnected } = useChatStream();

	return (
		<div className='flex flex-col h-screen max-w-2xl mx-auto p-4'>
			<header className='mb-4 flex justify-between items-center'>
				<div className='flex items-baseline gap-2'>
					<h1 className='text-2xl font-bold text-black'>
						The Mobile-First Company AI Chat
					</h1>

					<span className='text-xs text-gray-400'>v0.0.2</span>
				</div>

				<ConnectionStatus isConnected={isConnected} />
			</header>

			<ChatError error={error} />

			<div className='flex-1 overflow-y-auto space-y-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
				<WaitingMessage conversations={conversations} />

				{conversations.map((c, index) => (
					<ConversationView
						conversation={c}
						index={index}
						key={c.id}
						showTypingIndicator={index === conversations.length - 1}
					/>
				))}
			</div>
		</div>
	);
}
