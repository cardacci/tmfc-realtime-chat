import { ROLES, type Role } from '../types/chat';

/**
 * Formats a timestamp for display in chat messages.
 * @param date - The date to format.
 * @returns Formatted time string (HH:MM format in 24-hour format).
 */
export function formatMessageTime(date: Date): string {
	return new Intl.DateTimeFormat('en-US', {
		hour: '2-digit',
		hour12: false, // 24-hour format.
		minute: '2-digit',
	}).format(date);
}

/**
 * Checks if the given role is a user role.
 * @param role - The role to check.
 * @returns True if the role is a user role, false otherwise.
 */
export function isUserRole(role: Role): boolean {
	return role === ROLES.USER;
}
