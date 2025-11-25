/* ===== Constants & Enums ===== */
export const COMPONENT_TYPES = {
	CALENDAR_EVENT: 'calendar_event',
	CONTACT_BADGE: 'contact_badge',
} as const;

export const ROLES = {
	AGENT: 'agent',
	USER: 'user',
} as const;

export enum SSEEventType {
	COMPONENT_END = 'component_end',
	COMPONENT_FIELD = 'component_field',
	COMPONENT_START = 'component_start',
	MESSAGE_END = 'message_end',
	MESSAGE_START = 'message_start',
	TEXT_CHUNK = 'text_chunk',
}

/* ===== Types & Interfaces ===== */
export type ComponentType = (typeof COMPONENT_TYPES)[keyof typeof COMPONENT_TYPES];

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface ComponentData {
	data: Record<string, string>;
	type: ComponentType;
}

export interface Conversation {
	id: string;
	messages: Message[];
	timestamp: Date;
}

export interface Message {
	component?: ComponentData;
	content: string;
	id: string;
	isComplete: boolean;
	role: Role;
	timestamp: Date;
}
