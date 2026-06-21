/**
 * Shared OAuth provider config (client-safe).
 *
 * Client IDs are public by design, so we expose them via NEXT_PUBLIC_* vars and
 * use their presence to decide whether to show each social button. The matching
 * *_CLIENT_SECRET (server-only) is required to actually complete the flow.
 */

export type OAuthProviderId = 'google' | 'github';

export interface OAuthProviderMeta {
  id: OAuthProviderId;
  label: string;
  /** Whether the provider is configured (client id present). */
  enabled: boolean;
}

export const OAUTH_PROVIDERS: OAuthProviderMeta[] = [
  {
    id: 'google',
    label: 'Google',
    enabled: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  {
    id: 'github',
    label: 'GitHub',
    enabled: !!process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
  },
];

export const ANY_OAUTH_ENABLED = OAUTH_PROVIDERS.some(p => p.enabled);
