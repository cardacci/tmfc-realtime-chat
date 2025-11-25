/* ===== Constants & Enums ===== */
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
export type ComponentType = 'calendar_event' | 'contact_badge';

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface ComponentData {
	data: Record<string, string>;
	type: ComponentType;
}

export interface Message {
	component?: ComponentData;
	content: string;
	id: string;
	isComplete: boolean;
	role: Role;
}
