import { useEffect, useState } from 'react';
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
	/* ===== State ===== */
	const [showContent, setShowContent] = useState(false);

	/* ===== Constants & Variables ===== */
	const content = message?.content || '';
	const component = message?.component;
	const DOTS_DELAY = 1000;
	const role = message?.role || 'agent';
	const isUser = isUserRole(role);
	const hasContent = content.length > 0;

	/* ===== Effects ===== */
	// Delay showing content by 500ms for agent messages only (to ensure typing dots are visible)
	useEffect(() => {
		// User messages: show immediately without delay.
		if (isUser) {
			setShowContent(true);

			return;
		}

		// Agent messages: apply 500ms delay
		if (hasContent && !showContent) {
			const timer = setTimeout(() => {
				setShowContent(true);
			}, DOTS_DELAY);

			return () => clearTimeout(timer);
		}

		// Reset when content is cleared (new message)
		if (!hasContent) {
			setShowContent(false);
		}
	}, [DOTS_DELAY, hasContent, isUser, showContent]);

	// Early return after all hooks
	if (!message) {
		return null;
	}

	return (
		<div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}>
			<div
				className={`max-w-[90%] md:max-w-[80%] rounded-lg p-2 md:p-3 ${
					isUser
						? 'bg-yellow-400 text-white'
						: 'bg-gray-100 border border-gray-300 text-gray-700'
				}`}
			>
				{showContent ? (
					<p className='text-sm md:text-base whitespace-pre-wrap break-words animate-textFadeIn'>
						{content}
					</p>
				) : (
					// Only show typing dots for agent messages
					!isUser && (
						<div className='flex items-center gap-1 py-1'>
							<span className='w-2 h-2 rounded-full bg-current typing-dot'></span>
							<span className='w-2 h-2 rounded-full bg-current typing-dot'></span>
							<span className='w-2 h-2 rounded-full bg-current typing-dot'></span>
						</div>
					)
				)}

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
		<div className='sticky top-0 z-20 flex items-center justify-center mb-4 pb-2 pt-2'>
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

			<div className='space-y-3 md:space-y-4'>
				{completeMessages.map(msg => {
					const { content, component, id, role, timestamp } = msg;
					const isUser = isUserRole(role);

					return (
						<div
							key={id}
							className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
						>
							<div className={isUser ? 'message-user' : 'message-agent'}>
								<p className='text-sm md:text-base whitespace-pre-wrap'>
									{content}
								</p>

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
