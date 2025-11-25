import { useChatStream } from '../hooks/useChatStream';
import { COMPONENT_TYPES, ROLES, type Role } from '../types/chat';
import { ContactBadge } from './ContactBadge';
import type { ComponentData, Message } from '../types/chat';

/** Renders a chat error message. */
function ChatError({ error }: { error: string | null }) {
	if (!error) return null;
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

/** Renders a component message (e.g., contact badge). */
function ComponentMessage({ component }: { component: ComponentData | undefined }) {
	if (!component) return null;
	const { data, type } = component;
	const isContactBadge = type === COMPONENT_TYPES.CONTACT_BADGE;
	if (isContactBadge) {
		const { company, email, name, profilePicture } = data;
		return (
			<div className='mt-3'>
				<ContactBadge
					company={company}
					email={email}
					name={name}
					profilePicture={profilePicture}
				/>
			</div>
		);
	}
	return (
		<div className='mt-3 p-3 bg-gray-50 rounded border border-gray-200 text-sm'>
			<p className='font-semibold text-gray-600 mb-1'>Component: {type}</p>
			<pre className='text-xs overflow-x-auto'>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}

/** Renders a waiting message when no messages have arrived yet. */
function WaitingMessage({ messages }: { messages: Message[] }) {
	if (messages.length === 0) {
		return <div className='text-center text-gray-400 mt-10'>Waiting for messages...</div>;
	}
	return null;
}

/** Renders a typing indicator for the incomplete (streaming) message. */
function TypingIndicator({ message }: { message: Message | undefined }) {
	if (!message) return null;
	const { content, component, role } = message;
	const isUserRole = role === ROLES.USER;
	return (
		<div className={`flex flex-col ${isUserRole ? 'items-end' : 'items-start'}`}>
			<div
				className={`max-w-[80%] rounded-lg p-3 ${
					isUserRole
						? 'bg-yellow-400 text-white opacity-80'
						: 'bg-gray-100 border border-gray-300 text-gray-700 opacity-80'
				}`}
			>
				<p className='whitespace-pre-wrap'>
					{content}
					<span className='inline-block w-2 h-4 bg-current ml-1 animate-pulse'>|</span>
				</p>
				<ComponentMessage component={component} />
			</div>
		</div>
	);
}

/** Main chat component. */
export function Chat() {
	const { error, isConnected, messages } = useChatStream();

	const completeMessages = messages.filter(msg => msg.isComplete);
	const incompleteMessage = messages.find(msg => !msg.isComplete);

	const isUser = (role: Role) => role === ROLES.USER;

	const renderMessages = () =>
		completeMessages.map(msg => {
			const { content, component, id, role } = msg;
			const isUserRole = isUser(role);
			return (
				<div
					key={id}
					className={`flex flex-col ${isUserRole ? 'items-end' : 'items-start'} animate-fadeIn`}
				>
					<div className={isUserRole ? 'message-user' : 'message-agent'}>
						<p className='whitespace-pre-wrap'>{content}</p>
						<ComponentMessage component={component} />
					</div>
				</div>
			);
		});

	return (
		<div className='flex flex-col h-screen max-w-2xl mx-auto p-4'>
			<header className='mb-4 flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-black'>The Mobile-First Company AI Chat</h1>
				<ConnectionStatus isConnected={isConnected} />
			</header>

			<ChatError error={error} />

			<div className='flex-1 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200'>
				<WaitingMessage messages={messages} />
				{renderMessages()}
				<TypingIndicator message={incompleteMessage} />
			</div>
		</div>
	);
}
