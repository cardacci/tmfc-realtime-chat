import { ROLES, type Role } from '../types/chat';

/**
 * Checks if the given role is a user role.
 * @param role - The role to check.
 * @returns True if the role is a user role, false otherwise.
 */
export function isUserRole(role: Role): boolean {
	return role === ROLES.USER;
}
