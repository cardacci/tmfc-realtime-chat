import { COMPONENT_TYPES } from '../../../types/chat';
import { isUserRole } from '../../../utils/chat';
import CalendarEvent from './CalendarEvent';
import ContactBadge from './ContactBadge';
import type { ComponentData, Conversation, Message } from '../../../types/chat';

/** Renders a component message based on its type. */
function ComponentMessage({ component }: { component: ComponentData | undefined }) {
	if (!component) {
		return null;
	}

	/* ===== Constants & Variables ===== */
	const { data, type } = component;
	let componentResult;

	switch (type) {
		case COMPONENT_TYPES.CALENDAR_EVENT: {
			const { date, status, time, title } = data;

			componentResult = (
				<CalendarEvent date={date} status={status} time={time} title={title} />
			);
			break;
		}
		case COMPONENT_TYPES.CONTACT_BADGE: {
			const { company, email, name, profilePicture } = data;

			componentResult = (
				<ContactBadge
					company={company}
					email={email}
					name={name}
					profilePicture={profilePicture}
				/>
			);
			break;
		}
		default: {
			// Fallback generic display.
			componentResult = (
				<div className='mt-3 p-3 bg-gray-50 rounded border border-gray-200 text-sm'>
					<p className='font-semibold text-gray-600 mb-1'>{type}</p>

					<pre className='text-xs overflow-x-auto'>{JSON.stringify(data, null, 2)}</pre>
				</div>
			);
			break;
		}
	}

	return <div className='mt-3'>{componentResult}</div>;
}

/** Renders a typing indicator for the incomplete (streaming) message. */
function TypingIndicator({ message }: { message: Message | undefined }) {
	if (!message) {
		return null;
	}

	/* ===== Constants & Variables ===== */
	const { content, component, role } = message;
	const isUser = isUserRole(role);

	return (
		<div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
			<div
				className={`max-w-[80%] rounded-lg p-3 ${
					isUser
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

/** Renders a conversation header with date */
function ConversationHeader({ conversation }: { conversation: Conversation }) {
	/* ===== Functions ===== */
	const formatDate = (date: Date) => {
		return new Intl.DateTimeFormat('en-US', {
			day: 'numeric',
			month: 'long',
			weekday: 'long',
			year: 'numeric',
		}).format(date);
	};

	return (
		<div className='sticky top-0 z-10 flex items-center justify-center mb-4 pb-2 pt-2'>
			<div className='bg-white px-4 py-1 rounded-full shadow-sm border border-gray-200'>
				<span className='text-xs font-medium text-gray-600 uppercase'>
					{formatDate(conversation.timestamp)}
				</span>
			</div>
		</div>
	);
}

/** Renders a single conversation */
export default function ConversationView({
	conversation,
	showTypingIndicator,
}: {
	conversation: Conversation;
	showTypingIndicator: boolean;
}) {
	/* ===== Constants & Variables ===== */
	const completeMessages = conversation.messages.filter(msg => msg.isComplete);
	const incompleteMessage = showTypingIndicator
		? conversation.messages.find(msg => !msg.isComplete)
		: undefined;

	/* ===== Functions ===== */
	const formatMessageTime = (date: Date) => {
		return new Intl.DateTimeFormat('es-ES', {
			hour: '2-digit',
			minute: '2-digit',
		}).format(date);
	};

	return (
		<div className='mb-6 last:mb-0'>
			<ConversationHeader conversation={conversation} />

			<div className='space-y-4'>
				{completeMessages.map(msg => {
					const { content, component, id, role, timestamp } = msg;
					const isUser = isUserRole(role);

					return (
						<div
							key={id}
							className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
						>
							<div className={isUser ? 'message-user' : 'message-agent'}>
								<p className='whitespace-pre-wrap'>{content}</p>

								<ComponentMessage component={component} />

								<div
									className={`text-[10px] text-gray-400 mt-1 ${
										isUser ? 'text-right' : 'text-left'
									}`}
								>
									{formatMessageTime(timestamp)}
								</div>
							</div>
						</div>
					);
				})}

				<TypingIndicator message={incompleteMessage} />
			</div>
		</div>
	);
}
