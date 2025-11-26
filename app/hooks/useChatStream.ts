import { useEffect, useRef, useState } from 'react';
import { ROLES, SSEEventType, WindowEventType } from '../types/chat';
import type { ComponentType, Conversation, Message } from '../types/chat';

/* ===== Constants & Enums ===== */
const CONNECTION_LISTENER_CHANGE_EVENT = 'change';
const MAX_CONVERSATIONS = 5;
const MAX_RTT_MS = 500; // Maximum Round-Trip Time in milliseconds.
const STREAM_URL = 'https://api-dev.withallo.com/v1/demo/interview/conversation';

enum SlowConnectionType {
	SLOW_2G = 'slow-2g',
	TWO_G = '2g',
}

/**
 * Checks if the given effective connection type is considered slow.
 * @param effectiveType - The effective connection type from the Network Information API.
 * @returns True if the connection type is slow, false otherwise.
 */
function isSlowConnectionType(effectiveType: string): boolean {
	return Object.values(SlowConnectionType).includes(effectiveType as SlowConnectionType);
}

export function useChatStream() {
	/* ===== State ===== */
	const [conversations, setConversations] = useState<Conversation[]>([]); // List of conversations.
	const [error, setError] = useState<string | null>(null); // Error state.
	const [isConnected, setIsConnected] = useState<boolean>(false); // Connection state.
	const [isSlowConnection, setIsSlowConnection] = useState<boolean>(false); // Slow connection state.

	/* ===== Refs ===== */
	const currentConversationIndexRef = useRef<number>(0); // Current conversation index.
	const eventSourceRef = useRef<EventSource | null>(null); // EventSource connection.
	const receivedMessageIdsRef = useRef<Set<string>>(new Set()); // Received message IDs.

	/* ===== Functions ===== */
	// Helper to add a new message to the current conversation.
	const addMessage = (message: Message) => {
		setConversations(prev => {
			const currentIndex = currentConversationIndexRef.current;

			// If no conversations exist, create the first one.
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

	// Helper to close the EventSource connection.
	const closeConnection = () => {
		if (eventSourceRef.current) {
			eventSourceRef.current.close();
			eventSourceRef.current = null;
			setIsConnected(false);
		}
	};

	/**
	 * Helper to execute incomplete message error and display it to the user.
	 * @param data - The parsed event data to validate.
	 * @param eventType - The SSE event type for error logging.
	 */
	const executeIncompleteMessageError = (data: any, eventType: string) => {
		console.error(`[SSE ${eventType}] Incomplete message: missing required fields`, data);

		// Create a visible error message for the user.
		const errorMessage: Message = {
			content:
				'⚠️ Oops! We received an incomplete message. Some information might be missing.',
			id: `error_${Date.now()}_${Math.random()}`,
			isComplete: true,
			isError: true,
			role: ROLES.AGENT,
			timestamp: new Date(),
		};

		addMessage(errorMessage);
	};

	/**
	 * Helper to parse SSE event data.
	 * @param e - The SSE event containing data to parse.
	 * @param eventType - Optional event type for better error logging.
	 * @returns Parsed data object or null if parsing fails.
	 */
	const parseEventData = (e: { data: string }, eventType?: string): any => {
		try {
			const parsed = JSON.parse(e.data);

			// Validate that we got an object back
			if (typeof parsed !== 'object' || parsed === null) {
				console.error(
					`[SSE ${eventType || 'Unknown'}] Invalid data format: expected object, got ${typeof parsed}`
				);

				// Create error message for user.
				const errorMessage: Message = {
					content:
						'⚠️ Sorry, we received some unexpected data. Please try again in a moment.',
					id: `error_${Date.now()}_${Math.random()}`,
					isComplete: true,
					isError: true,
					role: ROLES.AGENT,
					timestamp: new Date(),
				};

				addMessage(errorMessage);

				return null;
			}

			return parsed;
		} catch (error) {
			console.error(
				`[SSE ${eventType || 'Unknown'}] Malformed JSON:`,
				error instanceof Error ? error.message : error,
				'\nRaw data:',
				e.data
			);

			// Create error message for user.
			const errorMessage: Message = {
				content:
					'⚠️ We encountered a communication issue. Please refresh the page and try again.',
				id: `error_${Date.now()}_${Math.random()}`,
				isComplete: true,
				isError: true,
				role: ROLES.AGENT,
				timestamp: new Date(),
			};

			addMessage(errorMessage);

			return null;
		}
	};

	// Helper to start a new conversation.
	const startNewConversation = () => {
		const newConversation: Conversation = {
			id: `conversation_${Date.now()}`,
			messages: [],
			timestamp: new Date(),
		};

		setConversations(prev => {
			let updatedConversations = [...prev, newConversation];

			// Keep only the last N conversations (performance).
			if (updatedConversations.length > MAX_CONVERSATIONS) {
				updatedConversations = updatedConversations.slice(1);
			}

			const newIndex = updatedConversations.length - 1;

			currentConversationIndexRef.current = newIndex;

			return updatedConversations;
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

	/**
	 * Validates SSE event data and required fields.
	 * @param data - The parsed event data to validate.
	 * @param eventType - The SSE event type for error logging.
	 * @param additionalChecks - Optional function that performs additional validation checks.
	 * @returns True if data is valid, false otherwise.
	 */
	const validateEventData = (
		data: any,
		eventType: string,
		additionalChecks?: (data: any) => boolean
	): boolean => {
		// Check if data exists and has messageId. MessageId is required for all events.
		if (!data || !data.messageId) {
			executeIncompleteMessageError(data, eventType);

			return false;
		}

		// Run additional validation checks if provided.
		if (additionalChecks && !additionalChecks(data)) {
			executeIncompleteMessageError(data, eventType);

			return false;
		}

		return true;
	};

	/* ===== Effects ===== */
	// Mount - Online/Offline detection.
	useEffect(() => {
		const handleOffline = () => {
			setIsConnected(false);
			setError(
				"No internet connection. We'll reconnect automatically when you're back online."
			);
		};

		const handleOnline = () => {
			setIsConnected(true);
			setError(null);
		};

		const connection = (window.navigator as any).connection;
		const updateConnectionStatus = () => {
			if (connection) {
				const isSlow =
					isSlowConnectionType(connection.effectiveType) || connection.rtt > MAX_RTT_MS;
				setIsSlowConnection(isSlow);
			}
		};

		window.addEventListener(WindowEventType.ONLINE, handleOnline);
		window.addEventListener(WindowEventType.OFFLINE, handleOffline);

		if (connection) {
			connection.addEventListener(CONNECTION_LISTENER_CHANGE_EVENT, updateConnectionStatus);
			updateConnectionStatus(); // Initial check
		}

		// Initial check
		if (!window.navigator.onLine) {
			handleOffline();
		}

		return () => {
			// Unmount - Remove event listeners.
			window.removeEventListener(WindowEventType.ONLINE, handleOnline);
			window.removeEventListener(WindowEventType.OFFLINE, handleOffline);

			if (connection) {
				connection.removeEventListener(
					CONNECTION_LISTENER_CHANGE_EVENT,
					updateConnectionStatus
				);
			}
		};
	}, []);

	// Mount - SSE Connection.
	useEffect(() => {
		let timeoutId: ReturnType<typeof setTimeout>;

		const connectToStream = () => {
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

				// Only set error if we are online (otherwise offline handler takes care of it)
				setIsConnected(false);
				// We don't set an error here to avoid flashing "Connection lost" during
				// standard reconnections (e.g., when the stream ends and restarts).
				// The isConnected state will still disable the UI appropriately.
				// setError("Connection temporarily lost. We're trying to reconnect...");
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
				const additionalChecks = (data: any) => !!data.componentType;
				const data = parseEventData(e, SSEEventType.COMPONENT_START);

				// Validate data and required fields.
				if (!validateEventData(data, SSEEventType.COMPONENT_START, additionalChecks)) {
					return;
				}

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
				const additionalChecks = (data: any) => !!data.field && data.value !== undefined;
				const data = parseEventData(e, SSEEventType.COMPONENT_FIELD);

				// Validate data and required fields.
				if (!validateEventData(data, SSEEventType.COMPONENT_FIELD, additionalChecks)) {
					return;
				}

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
				const data = parseEventData(e, SSEEventType.MESSAGE_END);

				// Validate data and required fields.
				if (!validateEventData(data, SSEEventType.MESSAGE_END)) {
					return;
				}

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
				const additionalChecks = (data: any) => !!data.role;
				const data = parseEventData(e, SSEEventType.MESSAGE_START);

				// Validate data and required fields
				if (!validateEventData(data, SSEEventType.MESSAGE_START, additionalChecks)) {
					return;
				}

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
						timestamp: new Date(),
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
					timestamp: new Date(),
				});
			});

			// Text chunk.
			eventSource.addEventListener(SSEEventType.TEXT_CHUNK, e => {
				const additionalChecks = (data: any) => data.chunk !== undefined;
				const data = parseEventData(e, SSEEventType.TEXT_CHUNK);

				// Validate data and required fields
				if (!validateEventData(data, SSEEventType.TEXT_CHUNK, additionalChecks)) {
					return;
				}

				const { messageId } = data;

				updateLastMessage(msg => {
					if (msg.id !== messageId) {
						return msg;
					}

					return { ...msg, content: msg.content + data.chunk };
				});
			});
		};

		// Delay connection to allow empty state to be seen.
		timeoutId = setTimeout(connectToStream, 2000);

		return () => {
			// Unmount
			clearTimeout(timeoutId);
			closeConnection(); // Close connection properly.
		};
	}, []);

	return {
		conversations,
		error,
		isConnected,
		isSlowConnection,
	};
}
