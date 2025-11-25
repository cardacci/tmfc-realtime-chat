import { useEffect, useState } from 'react';
import { SSEEventType } from '../types/chat';
import type { ComponentType, Message } from '../types/chat';

/* ===== Constants & Enums ===== */
const STREAM_URL = 'https://api-dev.withallo.com/v1/demo/interview/conversation';

export function useChatStream() {
	/* ===== State ===== */
	const [error, setError] = useState<string | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [messages, setMessages] = useState<Message[]>([]);

	/* ===== Functions ===== */
	// Helper to parse SSE event data.
	const parseEventData = (e: { data: string }): any => {
		return JSON.parse(e.data);
	};

	// Helper to update the last message safely.
	const updateLastMessage = (updater: (msg: Message) => Message) => {
		setMessages(prev => {
			if (prev.length === 0) {
				return prev;
			}

			const lastMsg = prev[prev.length - 1];
			const updatedMsg = updater({ ...lastMsg });

			return [...prev.slice(0, -1), updatedMsg];
		});
	};

	/* ===== Effects ===== */
	useEffect(() => {
		const eventSource = new EventSource(STREAM_URL);

		// Error handler.
		eventSource.onerror = err => {
			console.error('SSE Connection Error:', err);
			setIsConnected(false);
			setError('Connection lost. Reconnecting...');
			// EventSource automatically attempts to reconnect.
		};

		// Open handler.
		eventSource.onopen = () => {
			console.log('SSE Connection Opened');
			setIsConnected(true);
			setError(null);
		};

		/* ===== Event Listeners. ===== */
		// Component end.
		eventSource.addEventListener(SSEEventType.COMPONENT_END, _e => {
			/*
			Component is done, nothing specific to update on the message structure itself
			unless we want to mark the component as complete specifically.
			For now, message_end usually follows.
			*/
		});

		// Component start.
		eventSource.addEventListener(SSEEventType.COMPONENT_START, e => {
			const data = parseEventData(e);
			const { messageId } = data;

			updateLastMessage(msg => {
				if (msg.id !== messageId) {
					return msg;
				}

				return {
					...msg,
					component: {
						data: {},
						type: data.componentType as ComponentType,
					},
				};
			});
		});

		// Component field.
		eventSource.addEventListener(SSEEventType.COMPONENT_FIELD, e => {
			const data = parseEventData(e);
			const { messageId } = data;

			updateLastMessage(msg => {
				if (msg.id !== messageId || !msg.component) {
					return msg;
				}

				return {
					...msg,
					component: {
						...msg.component,
						data: {
							...msg.component.data,
							[data.field]: data.value,
						},
					},
				};
			});
		});

		// Message end.
		eventSource.addEventListener(SSEEventType.MESSAGE_END, e => {
			const data = parseEventData(e);
			const { messageId } = data;

			updateLastMessage(msg => {
				if (msg.id !== messageId) {
					return msg;
				}

				return { ...msg, isComplete: true };
			});
		});

		// Message start.
		eventSource.addEventListener(SSEEventType.MESSAGE_START, e => {
			const data = parseEventData(e);
			const { messageId, role } = data;

			setMessages(prev => [
				...prev,
				{
					content: '',
					id: messageId,
					isComplete: false,
					role,
				},
			]);
		});

		// Text chunk.
		eventSource.addEventListener(SSEEventType.TEXT_CHUNK, e => {
			const data = parseEventData(e);
			const { messageId } = data;

			updateLastMessage(msg => {
				if (msg.id !== messageId) {
					return msg;
				}

				return { ...msg, content: msg.content + data.chunk };
			});
		});

		return () => {
			// Unmount.
			eventSource.close();
			setIsConnected(false);
		};
	}, []);

	return {
		error,
		isConnected,
		messages,
	};
}
