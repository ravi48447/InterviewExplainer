/**
 * lib/user barrel — Phase 08 canonical user layer.
 */
export type {
  AuthProvider,
  PlanTier,
  ExperienceBand,
  SelectedDomain,
  User,
  AuthStatus,
  AuthState,
  LoginCredentials,
  SignupInput,
  AuthResult,
  AuthErrorCode,
  BookmarkEntry,
  ProgressStatus,
  ProgressEntry,
  GuestData,
} from "./user-types";
export { AuthError, initialAuthState } from "./user-types";

export { useUserState, useGuestData, validateEmail, validatePassword } from "./user-state";
export type { UseUserState } from "./user-state";

export {
  fetchBookmarks,
  addBookmark,
  removeBookmark,
  useBookmarks,
} from "./user-bookmark";
export type { UseBookmarks } from "./user-bookmark";

export {
  fetchProgress,
  upsertProgress,
  useProgress,
} from "./user-progress";
export type { UseProgress } from "./user-progress";

export {
  buildLoginMetadata,
  buildSignupMetadata,
  buildForgotPasswordMetadata,
  buildResetPasswordMetadata,
  buildAccountMetadata,
  buildProfileMetadata,
} from "./user-seo";
