/**
 * File-backed user store.
 *
 * Persists accounts, selected domains, bookmarks and progress to a single JSON
 * file under `<frontend>/.data/auth.json`. This keeps the entire login →
 * dashboard → bookmarks flow working with just `npm run dev` — no external
 * database or Java backend required.
 *
 * Concurrency is handled with a simple synchronous read-modify-write, which is
 * more than adequate for a single-process dev/SSR server. For multi-instance
 * production you would swap `readStore`/`writeStore` for a real database.
 *
 * Server-only.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { hashPassword, verifyPassword, randomToken, sha256 } from './crypto';

export interface SelectedDomain {
  slug: string;
  name: string;
}

export type AuthProvider = 'password' | 'google' | 'github' | 'magic';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  experienceLevel: string | null;
  /** Entitlement tier. While payments are disabled, everyone is effectively unlocked. */
  plan: 'free' | 'pro';
  /** Domains the user has added to their workspace (switchable dashboards). */
  domains: SelectedDomain[];
  /** The currently-active focus domain slug. */
  activeDomain: string | null;
  /** Goal-driven onboarding: the role they're targeting + an optional date. */
  targetRole: string | null;
  interviewDate: string | null;
  /** How the account was created / last authenticated. */
  authProvider: AuthProvider;
  createdAt: string;
}

interface AuthToken {
  hash: string;        // sha256 of the raw token
  uid: string;
  type: 'reset' | 'magic';
  expISO: string;
}

export interface UserProgress {
  /** questionId -> ISO timestamp of completion */
  completed: Record<string, string>;
  /** questionId -> ISO timestamp of last view */
  views: Record<string, string>;
}

interface StoreShape {
  users: StoredUser[];
  /** userId -> list of bookmarked question ids */
  bookmarks: Record<string, number[]>;
  /** userId -> progress */
  progress: Record<string, UserProgress>;
  /** Short-lived password-reset / magic-link tokens. */
  authTokens: AuthToken[];
}

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'auth.json');

const EMPTY_STORE: StoreShape = { users: [], bookmarks: {}, progress: {}, authTokens: [] };

function readStore(): StoreShape {
  try {
    if (!fs.existsSync(DATA_FILE)) return structuredClone(EMPTY_STORE);
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<StoreShape>;
    return {
      users: (parsed.users ?? []).map(normalizeUser),
      bookmarks: parsed.bookmarks ?? {},
      progress: parsed.progress ?? {},
      authTokens: parsed.authTokens ?? [],
    };
  } catch {
    return structuredClone(EMPTY_STORE);
  }
}

/** Backfill fields added after a user was first stored (forward-compat). */
function normalizeUser(u: Partial<StoredUser> & { id: string }): StoredUser {
  return {
    id: u.id,
    name: u.name ?? '',
    email: u.email ?? '',
    passwordHash: u.passwordHash ?? '',
    experienceLevel: u.experienceLevel ?? null,
    plan: u.plan ?? 'free',
    domains: u.domains ?? [],
    activeDomain: u.activeDomain ?? null,
    targetRole: u.targetRole ?? null,
    interviewDate: u.interviewDate ?? null,
    authProvider: u.authProvider ?? 'password',
    createdAt: u.createdAt ?? new Date().toISOString(),
  };
}

function writeStore(store: StoreShape): void {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[user-store] failed to persist:', err);
  }
}

// ─── Account operations ─────────────────────────────────────────────────────

const normalizeEmail = (email: string) => (email || '').trim().toLowerCase();

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  experienceLevel?: string | null;
  domains?: SelectedDomain[];
  targetRole?: string | null;
  interviewDate?: string | null;
}

function blankUser(email: string, name: string, provider: AuthProvider): StoredUser {
  return {
    id: crypto.randomUUID(),
    name: name.trim() || email.split('@')[0],
    email,
    passwordHash: '',
    experienceLevel: null,
    plan: 'free',
    domains: [],
    activeDomain: null,
    targetRole: null,
    interviewDate: null,
    authProvider: provider,
    createdAt: new Date().toISOString(),
  };
}

export function createUser(input: CreateUserInput): StoredUser {
  const email = normalizeEmail(input.email);
  if (!email || !input.password) throw new AuthError('Email and password are required.');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new AuthError('Please enter a valid email address.');
  if (input.password.length < 6) throw new AuthError('Password must be at least 6 characters.');

  const store = readStore();
  if (store.users.some(u => u.email === email)) {
    throw new AuthError('An account with this email already exists.', 409);
  }

  const domains = (input.domains ?? []).filter(d => d && d.slug);
  const user = blankUser(email, input.name || '', 'password');
  user.passwordHash = hashPassword(input.password);
  user.experienceLevel = input.experienceLevel ?? null;
  user.domains = domains;
  user.activeDomain = domains[0]?.slug ?? null;
  user.targetRole = input.targetRole ?? null;
  user.interviewDate = input.interviewDate ?? null;

  store.users.push(user);
  writeStore(store);
  return user;
}

/** Find an account by email or create a passwordless one (OAuth / magic link). */
export function findOrCreateByEmail(email: string, name: string, provider: AuthProvider): StoredUser {
  const normalized = normalizeEmail(email);
  if (!normalized) throw new AuthError('A valid email is required.');
  const store = readStore();
  const existing = store.users.find(u => u.email === normalized);
  if (existing) return existing;
  const user = blankUser(normalized, name, provider);
  store.users.push(user);
  writeStore(store);
  return user;
}

export function authenticate(email: string, password: string): StoredUser {
  const store = readStore();
  const user = store.users.find(u => u.email === normalizeEmail(email));
  // Run a verify even when the user is missing to keep timing consistent.
  const ok = user ? verifyPassword(password, user.passwordHash) : verifyPassword(password, 'x:y');
  if (!user || !ok) throw new AuthError('Invalid email or password.', 401);
  return user;
}

export function getUserById(id: string | null): StoredUser | null {
  if (!id) return null;
  return readStore().users.find(u => u.id === id) ?? null;
}

export function updateUser(id: string, mutate: (u: StoredUser) => void): StoredUser {
  const store = readStore();
  const user = store.users.find(u => u.id === id);
  if (!user) throw new AuthError('User not found.', 404);
  mutate(user);
  writeStore(store);
  return user;
}

/** Add (if new) a domain and make it the active focus domain. */
export function setActiveDomain(id: string, domain: SelectedDomain): StoredUser {
  return updateUser(id, (u) => {
    if (!u.domains.some(d => d.slug === domain.slug)) {
      u.domains.push(domain);
    } else {
      // Keep the freshest display name.
      u.domains = u.domains.map(d => (d.slug === domain.slug ? { ...d, name: domain.name || d.name } : d));
    }
    u.activeDomain = domain.slug;
  });
}

export function removeDomain(id: string, slug: string): StoredUser {
  return updateUser(id, (u) => {
    u.domains = u.domains.filter(d => d.slug !== slug);
    if (u.activeDomain === slug) u.activeDomain = u.domains[0]?.slug ?? null;
  });
}

export function getUserByEmail(email: string): StoredUser | null {
  return readStore().users.find(u => u.email === normalizeEmail(email)) ?? null;
}

/** Update editable profile fields (used by account page + onboarding). */
export interface ProfilePatch {
  name?: string;
  experienceLevel?: string | null;
  targetRole?: string | null;
  interviewDate?: string | null;
}

export function updateProfile(id: string, patch: ProfilePatch): StoredUser {
  return updateUser(id, (u) => {
    if (typeof patch.name === 'string' && patch.name.trim()) u.name = patch.name.trim();
    if (patch.experienceLevel !== undefined) u.experienceLevel = patch.experienceLevel;
    if (patch.targetRole !== undefined) u.targetRole = patch.targetRole;
    if (patch.interviewDate !== undefined) u.interviewDate = patch.interviewDate;
  });
}

// ─── One-time tokens (password reset + magic link) ───────────────────────────

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** Create a one-time token for an existing user. Returns the RAW token to email. */
export function createAuthToken(uid: string, type: 'reset' | 'magic'): string {
  const store = readStore();
  const raw = randomToken();
  store.authTokens = store.authTokens.filter(t => new Date(t.expISO).getTime() > Date.now());
  store.authTokens.push({
    hash: sha256(raw),
    uid,
    type,
    expISO: new Date(Date.now() + TOKEN_TTL_MS).toISOString(),
  });
  writeStore(store);
  return raw;
}

/** Validate + consume a token, returning the user id (single use). */
export function consumeAuthToken(rawToken: string, type: 'reset' | 'magic'): string | null {
  if (!rawToken) return null;
  const store = readStore();
  const hash = sha256(rawToken);
  const idx = store.authTokens.findIndex(t => t.hash === hash && t.type === type);
  if (idx === -1) return null;
  const token = store.authTokens[idx];
  store.authTokens.splice(idx, 1); // single use
  writeStore(store);
  if (new Date(token.expISO).getTime() < Date.now()) return null;
  return token.uid;
}

export function setPassword(id: string, newPassword: string): StoredUser {
  if (!newPassword || newPassword.length < 6) throw new AuthError('Password must be at least 6 characters.');
  return updateUser(id, (u) => { u.passwordHash = hashPassword(newPassword); });
}

// ─── Guest data merge ────────────────────────────────────────────────────────

export interface GuestData {
  bookmarks?: number[];
  completed?: number[];
}

/** Merge anonymous (localStorage) activity into a freshly authenticated account. */
export function mergeGuestData(userId: string, data: GuestData): void {
  const store = readStore();

  if (Array.isArray(data.bookmarks) && data.bookmarks.length) {
    const set = new Set(store.bookmarks[userId] ?? []);
    for (const id of data.bookmarks) if (Number.isFinite(id)) set.add(id);
    store.bookmarks[userId] = [...set];
  }

  if (Array.isArray(data.completed) && data.completed.length) {
    const p = store.progress[userId] ?? { completed: {}, views: {} };
    const now = new Date().toISOString();
    for (const id of data.completed) {
      if (Number.isFinite(id) && !p.completed[String(id)]) p.completed[String(id)] = now;
    }
    store.progress[userId] = p;
  }

  writeStore(store);
}

// ─── Bookmarks ────────────────────────────────────────────────────────────

export function listBookmarks(userId: string): number[] {
  return readStore().bookmarks[userId] ?? [];
}

export function isBookmarked(userId: string, questionId: number): boolean {
  return (readStore().bookmarks[userId] ?? []).includes(questionId);
}

export function addBookmark(userId: string, questionId: number): void {
  const store = readStore();
  const list = store.bookmarks[userId] ?? [];
  if (!list.includes(questionId)) list.push(questionId);
  store.bookmarks[userId] = list;
  writeStore(store);
}

export function removeBookmark(userId: string, questionId: number): void {
  const store = readStore();
  store.bookmarks[userId] = (store.bookmarks[userId] ?? []).filter(id => id !== questionId);
  writeStore(store);
}

// ─── Progress ───────────────────────────────────────────────────────────────

export function getProgress(userId: string): UserProgress {
  return readStore().progress[userId] ?? { completed: {}, views: {} };
}

export function markComplete(userId: string, questionId: number): void {
  const store = readStore();
  const p = store.progress[userId] ?? { completed: {}, views: {} };
  if (!p.completed[String(questionId)]) p.completed[String(questionId)] = new Date().toISOString();
  store.progress[userId] = p;
  writeStore(store);
}

export function trackView(userId: string, questionId: number): void {
  const store = readStore();
  const p = store.progress[userId] ?? { completed: {}, views: {} };
  p.views[String(questionId)] = new Date().toISOString();
  store.progress[userId] = p;
  writeStore(store);
}

// ─── Serialization for the client ────────────────────────────────────────────

export interface PublicUser {
  id: string;
  name: string;
  email: string;
  domainSlug: string | null;
  domains: SelectedDomain[];
  activeDomain: string | null;
  experienceLevel: string | null;
  plan: 'free' | 'pro';
  targetRole: string | null;
  interviewDate: string | null;
  authProvider: AuthProvider;
}

export function toPublicUser(u: StoredUser): PublicUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    domainSlug: u.activeDomain,
    domains: u.domains,
    activeDomain: u.activeDomain,
    experienceLevel: u.experienceLevel,
    plan: u.plan,
    targetRole: u.targetRole,
    interviewDate: u.interviewDate,
    authProvider: u.authProvider,
  };
}
