/**
 * authorization.ts — Role/permission helpers (P14-T069..T088).
 * Pure functions over the UserRole/RolePermissions model — safe for both
 * server and client. The authenticated session resolves the role; these
 * helpers answer "can this role do X?" without touching I/O.
 */

import type { UserRole, RolePermissions } from "./platform-types";
import { ROLE_PERMISSIONS } from "./platform-types";

export function permissionsFor(role: UserRole): RolePermissions {
  return ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS.user;
}

export function can(
  role: UserRole | undefined | null,
  permission: keyof Omit<RolePermissions, "role">,
): boolean {
  if (!role) return false;
  return Boolean(permissionsFor(role)[permission]);
}

/** Authorization hierarchy for comparisons (user < editor, moderator < admin). */
export const ROLE_RANK: Record<UserRole, number> = {
  user: 0,
  editor: 1,
  moderator: 2,
  admin: 3,
};

export function hasAtLeast(role: UserRole | undefined | null, min: UserRole): boolean {
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[min];
}
