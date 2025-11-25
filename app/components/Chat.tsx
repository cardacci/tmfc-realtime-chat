import { useChatStream } from '../hooks/useChatStream';
import { ROLES, type Role } from '../types/chat';
import type { ComponentData, Message } from '../types/chat';

/**
 * Renders a chat error message.
 */
function ChatError({ error }: { error: string | null }) {
	if (error) {
		return (
			<div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
				{error}
			</div>
		);
	}

	return null;
}

/**
 * Renders a connection status message.
 */
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

/**
 * Renders a component message.
 */
function ComponentMessage({ component }: { component: ComponentData | undefined }) {
	if (component) {
		return (
			<div className='mt-3 p-3 bg-gray-50 rounded border border-gray-200 text-sm'>
				<p className='font-semibold text-gray-600 mb-1'>Component: {component.type}</p>

				<pre className='text-xs overflow-x-auto'>
					{JSON.stringify(component.data, null, 2)}
				</pre>
			</div>
		);
	}

	return null;
}

/**
 * Renders a waiting message.
 */
function WaitingMessage({ messages }: { messages: Message[] }) {
	if (messages.length === 0) {
		return <div className='text-center text-gray-400 mt-10'>Waiting for messages...</div>;
	}

	return null;
}

/**
 * Renders the chat interface.
 */
export function Chat() {
	/* ===== Hooks ===== */
	const { error, isConnected, messages } = useChatStream();

	/* ===== Functions ===== */
	function isUser(role: Role) {
		return role === ROLES.USER;
	}

	const renderMessages = () => {
		return messages.map(msg => {
			const { content, component, id, role } = msg;
			const isUserRole = isUser(role);

			return (
				<div
					key={id}
					className={`flex flex-col ${isUserRole ? 'items-end' : 'items-start'}`}
				>
					<div
						className={`max-w-[80%] rounded-lg p-3 ${
							isUserRole
								? 'bg-blue-500 text-white'
								: 'bg-white border border-gray-200 text-gray-800'
						}`}
					>
						<p className='whitespace-pre-wrap'>{content}</p>

						<ComponentMessage component={component} />
					</div>
				</div>
			);
		});
	};

	return (
		<div className='flex flex-col h-screen max-w-2xl mx-auto p-4'>
			<header className='mb-4 flex justify-between items-center'>
				<h1 className='text-2xl font-bold'>The Mobile-First Company AI Chat</h1>

				<ConnectionStatus isConnected={isConnected} />
			</header>

			<ChatError error={error} />

			<div className='flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
				<WaitingMessage messages={messages} />

				{renderMessages()}
			</div>
		</div>
	);
}
