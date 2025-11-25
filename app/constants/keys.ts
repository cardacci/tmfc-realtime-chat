export const KEYS = {
	ENTER: 'Enter',
	SPACE: ' ',
} as const;

export type Key = (typeof KEYS)[keyof typeof KEYS];
