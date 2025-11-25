import { useEffect, useRef, useState } from 'react';
import { SSEEventType } from '../types/chat';
import type { ComponentType, Conversation, Message } from '../types/chat';

/* ===== Constants & Enums ===== */
const STREAM_URL = 'https://api-dev.withallo.com/v1/demo/interview/conversation';

export function useChatStream() {
	/* ===== State ===== */
	const [conversations, setConversations] = useState<Conversation[]>([]); // List of conversations.
	const [error, setError] = useState<string | null>(null); // Error state.
	const [isConnected, setIsConnected] = useState<boolean>(false); // Connection state.

	/* ===== Refs ===== */
	const currentConversationIndexRef = useRef<number>(0); // Current conversation index.
	const eventSourceRef = useRef<EventSource | null>(null); // EventSource connection.
	const receivedMessageIdsRef = useRef<Set<string>>(new Set()); // Received message IDs.

	/* ===== Functions ===== */
	// Helper to close the EventSource connection.
	const closeConnection = () => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
			setIsConnected(false);
		}
	};

	// Helper to parse SSE event data.
	const parseEventData = (e: { data: string }): any => {
		return JSON.parse(e.data);
	};

	// Helper to start a new conversation.
	const startNewConversation = () => {
		const newConversation: Conversation = {
			id: `conversation_${Date.now()}`,
			messages: [],
			timestamp: new Date(),
		};

		setConversations(prev => {
			const newIndex = prev.length;

			currentConversationIndexRef.current = newIndex;

			return [...prev, newConversation];
		});
	};

	// Helper to update the last message in the current conversation safely.
	const updateLastMessage = (updater: (msg: Message) => Message) => {
		setConversations(prev => {
			const currentIndex = currentConversationIndexRef.current;

			if (currentIndex >= prev.length || prev[currentIndex].messages.length === 0) {
				return prev;
			}

			const updatedConversations = [...prev];
			const currentConversation = updatedConversations[currentIndex];
			const messages = currentConversation.messages;
			const lastMsg = messages[messages.length - 1];
			const updatedMsg = updater({ ...lastMsg });

			updatedConversations[currentIndex] = {
				...currentConversation,
				messages: [...messages.slice(0, -1), updatedMsg],
			};

			return updatedConversations;
		});
	};

	// Helper to add a new message to the current conversation.
	const addMessage = (message: Message) => {
		setConversations(prev => {
			const currentIndex = currentConversationIndexRef.current;

			// If no conversations exist, create the first one
			if (prev.length === 0) {
				const newConversation: Conversation = {
					id: `conversation_${Date.now()}`,
					messages: [message],
					timestamp: new Date(),
				};
				currentConversationIndexRef.current = 0; // Set index for the first conversation.

				return [newConversation];
			}

			const updatedConversations = [...prev];
			const currentConversation = updatedConversations[currentIndex];

			updatedConversations[currentIndex] = {
				...currentConversation,
				messages: [...currentConversation.messages, message],
			};

			return updatedConversations;
		});
	};

	/* ===== Effects ===== */
	useEffect(() => {
		const eventSource = new EventSource(STREAM_URL);

		// Store the EventSource instance.
		eventSourceRef.current = eventSource;

		// Error handler.
		eventSource.onerror = err => {
			console.error('SSE Connection Error:', err);

			// Check if this is an intentional close.
			if (eventSource.readyState === EventSource.CLOSED) {
				setIsConnected(false);

				return;
			}

			setIsConnected(false);
			setError('Connection lost. Reconnecting...');
			// EventSource automatically attempts to reconnect.
		};

		// Open handler.
		eventSource.onopen = () => {
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

			// Check if we've already received this message (new conversation detection)
			if (receivedMessageIdsRef.current.has(messageId)) {
				// Clear the received IDs to start fresh tracking for the new conversation.
				receivedMessageIdsRef.current.clear();
				receivedMessageIdsRef.current.add(messageId);

				// Start a new conversation.
				startNewConversation();

				// Add the first message to the new conversation.
				addMessage({
					content: '',
					id: messageId,
					isComplete: false,
					role,
				});

				return;
			}

			// Mark this message ID as received.
			receivedMessageIdsRef.current.add(messageId);

			// Add message to current conversation.
			addMessage({
				content: '',
				id: messageId,
				isComplete: false,
				role,
			});
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
			// Unmount - close connection properly.
			closeConnection();
		};
	}, []);

	return {
		conversations,
		error,
		isConnected,
	};
}
