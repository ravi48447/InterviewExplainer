# Interview Explainer V2 — Security, Privacy & Authentication Architecture

**Document:** `14_SECURITY_PRIVACY_AUTHENTICATION.md`
**Status:** Foundational / Security Architecture Standard
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md` through `13_ANALYTICS_OBSERVABILITY_GROWTH_MEASUREMENT.md`
**Purpose:** Define the security, authentication, authorization, privacy, secrets management, API protection, file-upload safety, abuse prevention, user-data protection, administrative access, AI integration security, incident response, and future production-security standards for Interview Explainer V2.

---

# 1. Purpose of This Document

Interview Explainer is currently evolving from:

```text
Public Interview Preparation Content
```

toward a broader platform containing:

```text
Public Content

User Accounts

Preparation Progress

Bookmarks

Mock Interviews

Resume Analysis

Job Hunting

Application Tracking

Real Interview Preparation

AI Features

Potential Payments

Administrative Tools
```

Each new capability increases the security surface.

The objective is not to create enterprise-level complexity before the product needs it.

The objective is:

> **Build a simple, secure foundation now so future features do not require unsafe shortcuts.**

---

# 2. Security Philosophy

Interview Explainer should follow:

```text
Secure by Default

Least Privilege

Minimal Data Collection

Explicit Authorization

Server-Side Enforcement

Controlled Trust Boundaries

Safe Failure

Defense in Depth

Simple Architecture Where Possible
```

Security should not depend on:

```text
Users behaving correctly

Hidden frontend buttons

Secret-looking URLs

Obscure API endpoints

Client-side validation alone
```

---

# 3. Security Is a System Property

Security does not belong only to:

```text
Login
```

It applies to:

```text
Frontend

Backend

Database

APIs

Authentication

Authorization

Files

AI Providers

Analytics

Admin Tools

Infrastructure

Deployment

Secrets

Logs

Backups
```

A secure login page does not make an insecure application secure.

---

# 4. V2 Security Scope

The V2 security architecture must cover:

```text
Public Content

Anonymous Visitors

Authenticated Users

Administrative Users

Internal Services

External APIs

File Uploads

AI Integrations

Analytics

Production Infrastructure

Future Payments
```

---

# 5. Threat Model Categories

Interview Explainer should consider threats such as:

```text
Account Takeover

Credential Theft

Session Theft

Unauthorized Data Access

Privilege Escalation

API Abuse

Automated Scraping

Spam

Malicious File Upload

Injection

Cross-Site Scripting

Cross-Site Request Forgery

Data Leakage

Secret Exposure

Admin Compromise

Denial of Service

AI Prompt Injection

Dependency Vulnerabilities
```

Not every threat requires the same level of protection immediately.

Prioritize according to:

```text
Likelihood

Impact

Current Product Surface
```

---

# 6. Security Priority Model

Use:

```text
P0 — Critical

P1 — High

P2 — Medium

P3 — Future Hardening
```

Examples:

```text
P0
Exposed production secret

P0
Unauthorized access to private user data

P1
Missing API rate limits on expensive AI endpoint

P2
Weak anti-automation on low-risk public interaction

P3
Advanced enterprise audit controls
```

---

# 7. Trust Boundaries

The system should explicitly recognize:

```text
Browser
    ↓
Application Server
    ↓
Database
    ↓
External Services
```

The browser is not trusted.

Never assume a request is valid because:

```text
The frontend would never send that.
```

Attackers can call APIs directly.

---

# 8. Client-Side Security Rule

Client-side checks are useful for:

```text
User Experience

Immediate Validation

Preventing Accidental Errors
```

They are not sufficient for:

```text
Authorization

Permission Enforcement

Payment Verification

Ownership Checks

Sensitive Data Protection
```

All critical enforcement must occur on the trusted server side.

---

# 9. Authentication vs Authorization

These must remain separate.

```text
Authentication
=
Who are you?

Authorization
=
Are you allowed to do this?
```

A logged-in user is not automatically allowed to access:

```text
Another User's Progress

Another User's Resume

Admin Tools

Private Interview Notes
```

---

# 10. Authentication Architecture

V2 should use a proven authentication system or library appropriate to the existing stack.

Avoid implementing from scratch:

```text
Password Hashing

Session Cryptography

OAuth Protocols

Token Rotation
```

unless there is a compelling technical reason.

---

# 11. Authentication Methods

Potential supported methods:

```text
Email + Password

Email Magic Link

Google Sign-In

Other OAuth Providers
```

The final selection should reflect:

```text
User Convenience

Implementation Complexity

Security

Provider Cost

Product Requirements
```

Do not add many login methods unnecessarily.

---

# 12. Early Authentication Recommendation

For the early product:

Prefer a small number of reliable authentication methods.

Example:

```text
Google Sign-In

+

Email-Based Authentication
```

The exact choice should be confirmed against the existing implementation.

---

# 13. Password Storage

If passwords are supported:

Passwords must never be stored as:

```text
Plain Text

Reversible Encryption
```

Use a modern password hashing approach through the chosen authentication framework.

Do not build custom password cryptography.

---

# 14. Password Requirements

Avoid unreasonable password complexity rules such as:

```text
Exactly one symbol

Exactly one uppercase character

Exactly one number
```

Prefer:

```text
Reasonable Minimum Length

Compromised Password Protection where practical

Rate-Limited Login Attempts
```

Long passwords should be supported.

---

# 15. Password Reset

Password reset flows should use:

```text
Time-Limited Tokens

Single-Use Tokens

Secure Randomness
```

Do not reveal unnecessarily whether a particular email address exists.

---

# 16. Authentication Enumeration

Avoid responses such as:

```text
This email is registered.
```

when the same endpoint can be used for account enumeration.

Use context-appropriate generic responses where necessary.

---

# 17. Email Verification

If email ownership matters:

Require verification before sensitive account functionality.

Do not block all public product value behind email verification unless necessary.

---

# 18. Session Architecture

Prefer secure session handling through the selected authentication system.

Sessions should support:

```text
Expiration

Revocation

Secure Cookie Handling

User Logout
```

---

# 19. Cookie Security

Authentication cookies should use appropriate attributes such as:

```text
HttpOnly

Secure in production

SameSite appropriate to architecture
```

The exact configuration depends on the authentication flow.

---

# 20. Token Storage

Avoid storing sensitive long-lived authentication tokens in:

```text
localStorage
```

when a safer secure-cookie architecture is available.

The final approach should match the chosen authentication system.

---

# 21. Session Expiration

Sessions should not remain valid indefinitely without policy.

Balance:

```text
Security

User Convenience
```

Sensitive actions may require stronger verification.

---

# 22. Logout

Logout should invalidate the relevant session according to the authentication architecture.

A frontend-only redirect is not sufficient.

---

# 23. Multiple Devices

The system should eventually support users accessing their account from:

```text
Phone

Laptop

Desktop
```

Session architecture should not unnecessarily assume one device.

---

# 24. Session Revocation

Future account security may support:

```text
Log Out of All Devices

Session Management
```

This is useful but does not need to block early V2 launch.

---

# 25. Authorization Model

Use explicit roles and ownership rules.

Potential roles:

```text
anonymous

user

admin
```

Future:

```text
editor

moderator

support
```

Do not create complex role systems before necessary.

---

# 26. Role-Based Access

Example:

```text
anonymous
→ public content

user
→ own private preparation data

admin
→ controlled administrative capabilities
```

Authorization should be checked server-side.

---

# 27. Ownership Authorization

For user-owned resources:

Always validate:

```text
resource.user_id
==
authenticated_user.id
```

or equivalent ownership logic.

Do not trust:

```text
user_id
```

sent by the client.

---

# 28. Insecure Direct Object Reference Protection

A user must not gain access by changing:

```text
/resume/123
```

to:

```text
/resume/124
```

Every private resource lookup must enforce ownership or permission.

---

# 29. Admin Security

Admin access is high risk.

Admin functionality should not be protected only by:

```text
Hidden Route

Unlinked URL

Frontend Role Check
```

Server-side authorization is mandatory.

---

# 30. Admin Authentication

Administrative accounts should have stronger security expectations.

Potential:

```text
Strong Authentication

MFA

Restricted Account Count

Audit Logging
```

MFA should be strongly considered once admin functionality can:

```text
Delete Content

Modify Users

Publish Content

Access Sensitive Data
```

---

# 31. Admin Surface Separation

Where practical:

Keep administrative functionality clearly separated from public product interfaces.

This improves:

```text
Authorization Clarity

Testing

Auditability
```

It does not replace actual security controls.

---

# 32. Principle of Least Privilege

Every:

```text
User

Service

Database Role

API Key

Deployment Token
```

should receive only the permissions required.

Avoid:

```text
One super-admin credential used everywhere.
```

---

# 33. Public Content Security

Public interview content is intentionally accessible.

However, public does not mean:

```text
Unlimited automated abuse is acceptable.
```

Protect against:

```text
Aggressive Scraping

Denial of Service

Expensive Automated Requests
```

without unnecessarily blocking legitimate:

```text
Users

Search Engines
```

---

# 34. Scraping Philosophy

Interview Explainer should distinguish between:

```text
Normal Search Crawling

Reasonable Public Access

Aggressive Automated Extraction

Infrastructure Abuse
```

Do not accidentally block Google while attempting to stop scrapers.

---

# 35. Rate Limiting

Rate limits should focus on sensitive or expensive operations.

Examples:

```text
Login Attempts

Password Reset

Search if expensive

AI Generation

Resume Analysis

Mock Interview APIs

File Uploads

Feedback Submission
```

Public static content may require different controls.

---

# 36. Rate Limit Dimensions

Potential dimensions:

```text
IP Address

Authenticated User

Endpoint

Time Window
```

Do not rely on IP alone for every use case.

Shared networks and proxies exist.

---

# 37. Rate Limit Response

Use appropriate status behavior such as:

```text
429 Too Many Requests
```

with user-friendly handling.

Do not expose unnecessary internal details.

---

# 38. API Security

Every API endpoint should answer:

```text
Who may call this?

What input is accepted?

What data may be returned?

How frequently may it be called?

What happens on failure?
```

---

# 39. API Input Validation

Validate all external input.

Examples:

```text
Path Parameters

Query Parameters

JSON Bodies

Form Data

Uploaded Files

Headers where relevant
```

Use schema validation where appropriate.

---

# 40. Validation Boundary

Validation should happen:

```text
At the system boundary
```

before untrusted input reaches core business logic.

---

# 41. Output Control

Do not return entire database objects automatically.

Explicitly select fields.

Avoid accidentally exposing:

```text
Password Hashes

Internal Flags

Provider Tokens

Private Metadata

Administrative Fields
```

---

# 42. Mass Assignment Protection

Do not allow clients to update arbitrary database fields by sending:

```text
{
  "role": "admin"
}
```

Use explicit allowed fields.

---

# 43. SQL Injection

Use:

```text
Parameterized Queries

Trusted ORM / Query Builder APIs
```

Avoid constructing database queries through unsafe string concatenation.

---

# 44. Cross-Site Scripting

User-controlled or externally sourced content must not be rendered as trusted HTML without appropriate sanitization.

Potential future sources:

```text
User Notes

Resume Content

Interview Notes

AI Responses

Admin Content
```

---

# 45. HTML Rendering

If rich HTML rendering is required:

Use a controlled sanitization strategy.

Avoid unrestricted:

```text
dangerouslySetInnerHTML
```

with untrusted content.

---

# 46. Markdown Security

Markdown can still produce dangerous output depending on the renderer.

If user or AI-generated Markdown is rendered:

Review:

```text
Raw HTML Support

Link Handling

Script Injection

Unsafe Protocols
```

---

# 47. Cross-Site Request Forgery

If authentication relies on cookies:

State-changing operations should follow the framework's appropriate CSRF protection model.

Do not assume:

```text
SameSite alone solves every architecture.
```

---

# 48. CORS

CORS should be configured intentionally.

Avoid:

```text
Access-Control-Allow-Origin: *
```

for sensitive authenticated APIs unless explicitly appropriate.

---

# 49. Security Headers

Production should use appropriate headers where compatible.

Potential:

```text
Content-Security-Policy

Strict-Transport-Security

X-Content-Type-Options

Referrer-Policy

Permissions-Policy

Frame Protection
```

The exact policy should be tested.

Do not deploy a strict CSP blindly and break the application.

---

# 50. Content Security Policy

CSP can reduce XSS impact.

However:

It must account for legitimate:

```text
Scripts

Fonts

Images

Analytics

Authentication

Payment Providers
```

Start with a policy that can be realistically maintained.

---

# 51. HTTPS

Production traffic should use HTTPS.

Sensitive cookies must not be transmitted over insecure connections.

---

# 52. Development Security

Development convenience must not weaken production.

Examples:

```text
Debug Mode

Verbose Errors

Test Credentials

Open CORS

Development Secrets
```

must not leak into production configuration.

---

# 53. Environment Separation

Maintain clear separation between:

```text
Local

Development

Preview

Staging if used

Production
```

Environment configuration should be explicit.

---

# 54. Secrets Management

Secrets include:

```text
Database Credentials

Authentication Secrets

OAuth Client Secrets

AI API Keys

Email Provider Keys

Payment Keys

Storage Credentials

Deployment Tokens
```

Secrets must not be committed to the repository.

---

# 55. Repository Secret Rule

Never commit:

```text
.env

Production API Keys

Private Keys

Database Passwords
```

unless a file is explicitly a safe example template.

---

# 56. Environment Example Files

A repository may contain:

```text
.env.example
```

with:

```text
PLACEHOLDER VALUES
```

not real secrets.

---

# 57. Secret Rotation

If a secret is accidentally exposed:

Do not merely delete it from the latest commit.

The secret should be:

```text
Revoked

Rotated

Replaced
```

Git history may still contain it.

---

# 58. Secret Scanning

Use available repository and platform secret scanning where practical.

Automated detection complements human discipline.

---

# 59. Logging Security

Logs must not contain:

```text
Passwords

Authentication Tokens

Full Sensitive Resume Data

Private Interview Notes

Payment Credentials
```

---

# 60. Error Logging

Errors should include enough technical context to investigate.

But avoid logging unnecessary sensitive payloads.

---

# 61. User-Facing Errors

Users should receive:

```text
Clear

Safe

Actionable
```

errors.

Avoid exposing:

```text
Stack Traces

Database Queries

Internal File Paths

Secrets

Infrastructure Details
```

---

# 62. Database Security

The application database should not be publicly accessible without appropriate controls.

Use:

```text
Authentication

Network Controls where available

Encrypted Connections where supported

Least-Privilege Credentials
```

---

# 63. Database Credentials

Application credentials should have only required permissions.

Administrative database credentials should not be used casually by the application runtime.

---

# 64. Database Backups

As user data becomes valuable:

Backups should exist.

But a backup that has never been tested may not be a reliable backup.

Future process should include:

```text
Backup

Retention

Restore Testing
```

---

# 65. Backup Security

Backups contain data.

They require protection equivalent to the sensitivity of the production data they contain.

---

# 66. User Data Categories

Interview Explainer should classify data.

Potential:

```text
PUBLIC

Public interview content


ACCOUNT

Email

Name

Authentication identity


PREPARATION

Progress

Bookmarks


CAREER

Resume

Job Applications

Interview Notes


SYSTEM

Logs

Security Events
```

Different categories require different handling.

---

# 67. Data Minimization

Collect:

```text
What the feature genuinely needs.
```

Do not collect data merely because:

```text
It might be useful someday.
```

---

# 68. Resume Data

Resume information can contain:

```text
Name

Email

Phone

Employment History

Education

Location

Links
```

Therefore resume handling requires stronger privacy controls than public question content.

---

# 69. Resume Storage

If resumes are stored:

Define:

```text
Where stored

Who may access

How long retained

How deleted

Whether original file is preserved
```

Do not leave this undefined.

---

# 70. Resume Processing

If a resume is sent to an external AI provider:

The product should understand:

```text
What data is transmitted

Why it is transmitted

Provider retention policy

Applicable privacy implications
```

---

# 71. Job Application Data

Future job tracking may include:

```text
Company

Role

Application Status

Interview Dates

Notes

Compensation
```

This data should remain private by default.

---

# 72. Real Interview Data

Real interview preparation may include highly personal notes.

Default:

```text
Private to the user
```

unless the user explicitly chooses to share.

---

# 73. User Data Isolation

Every user-owned data query must preserve isolation.

The architecture should make it difficult to accidentally query:

```text
All Users' Private Data
```

when only one user's data is required.

---

# 74. Data Deletion

The system should eventually support meaningful account and data deletion.

Deletion policy should define:

```text
What is deleted

What is retained

Why it is retained

How long retention lasts
```

---

# 75. Soft Delete vs Hard Delete

Use intentionally.

```text
Soft Delete
→ recoverability and auditability

Hard Delete
→ actual removal
```

Not every entity requires the same policy.

---

# 76. Data Retention

Do not retain sensitive data indefinitely without reason.

Potential categories may have different retention periods.

---

# 77. Privacy Policy Alignment

The actual product behavior must match the published privacy policy.

Do not claim:

```text
We never share data with third parties
```

if the product sends data to:

```text
Analytics

AI Providers

Email Providers

Payment Providers
```

Accuracy matters.

---

# 78. Analytics Privacy

Analytics should follow the measurement standards from Document 13.

Do not send:

```text
Resume Text

Private Notes

Passwords

Authentication Tokens
```

into analytics.

---

# 79. User Consent

Consent requirements depend on:

```text
Jurisdiction

Analytics Technology

Cookies

Advertising

Tracking Practices
```

The implementation should be reviewed against actual deployment regions and providers.

---

# 80. File Upload Security

Future features may allow:

```text
Resume Upload

Profile Image

Supporting Documents
```

Uploads are untrusted input.

---

# 81. Upload Validation

Validate:

```text
File Size

Allowed Type

Actual Content Type where practical

Filename Handling
```

Do not trust only the filename extension.

---

# 82. File Size Limits

Set explicit maximum sizes.

Avoid allowing arbitrarily large uploads.

This protects:

```text
Storage

Processing

Memory

Cost
```

---

# 83. File Names

Do not use raw user filenames as trusted storage paths.

Generate controlled storage identifiers.

Original filenames may be stored separately as metadata if needed.

---

# 84. Path Traversal

Never allow filenames such as:

```text
../../something
```

to control filesystem paths.

Use safe storage APIs and generated identifiers.

---

# 85. File Execution

Uploaded files should not become executable application code.

Storage and serving architecture should prevent accidental execution.

---

# 86. File Access

Private uploads should not automatically become publicly accessible through predictable URLs.

Use controlled access.

Potential:

```text
Authenticated Download

Time-Limited Signed URL
```

depending on storage architecture.

---

# 87. File Processing Isolation

Complex file parsing may expose vulnerabilities.

Resume processing should:

```text
Validate

Limit

Fail Safely
```

Do not trust parser input.

---

# 88. Malware Scanning

As file upload volume grows:

Consider malware scanning.

This may not be required for the earliest low-volume implementation.

But the architecture should allow it later.

---

# 89. AI Integration Security

AI features introduce new trust boundaries.

Potential flow:

```text
User Input
    ↓
Application
    ↓
AI Provider
    ↓
Generated Output
```

Both:

```text
User Input

AI Output
```

must be treated as untrusted.

---

# 90. AI API Keys

AI provider keys must remain server-side.

Never expose a secret AI key in browser JavaScript.

---

# 91. AI Cost Abuse

Expensive AI endpoints require:

```text
Authentication where appropriate

Rate Limits

Usage Limits

Request Size Limits

Monitoring
```

Otherwise attackers may generate significant cost.

---

# 92. Prompt Injection

User-uploaded resumes or external content may contain instructions attempting to manipulate AI behavior.

Example:

```text
Ignore all previous instructions.
```

The system should treat external content as:

```text
Data
```

not trusted system instructions.

---

# 93. AI Output Trust

AI-generated output should not automatically be treated as:

```text
Safe HTML

Correct Code

Verified Fact

Authorized Action
```

Use appropriate validation before downstream actions.

---

# 94. AI Tool Authorization

If future AI agents can perform actions:

Every action must still obey:

```text
Authentication

Authorization

User Confirmation where appropriate
```

An AI model should not become a bypass around permission checks.

---

# 95. AI Data Minimization

Send only the data required for the AI task.

Do not send:

```text
Entire User Database
```

when only:

```text
One Resume
```

is required.

---

# 96. AI Provider Failure

AI provider failure should not expose:

```text
API Keys

Internal Prompts

Stack Traces
```

to users.

Provide a controlled error state.

---

# 97. AI Output Rendering

If AI output contains:

```text
Markdown

HTML

Code
```

render it using a safe controlled pipeline.

Do not directly execute generated code.

---

# 98. Mock Interview Security

Future mock interviews may include:

```text
Audio

Text Answers

Scores

Feedback
```

These are private user data.

---

# 99. Audio Data

If voice recording is introduced:

Define:

```text
Whether audio is stored

Where stored

How long retained

Who processes it

How users delete it
```

Do not leave voice-data retention implicit.

---

# 100. Camera Data

If future interview simulation uses video:

Camera access must be:

```text
Explicit

Purpose-Limited

User Controlled
```

Do not record by default.

---

# 101. Browser Permissions

Request permissions:

```text
Microphone

Camera
```

only when the user initiates a feature requiring them.

Do not request unnecessary permissions on page load.

---

# 102. Payment Security

If payments are introduced:

Use a reputable payment provider.

Do not directly store:

```text
Card Numbers

CVV
```

unless the product has a very strong reason and required compliance architecture.

Prefer provider-hosted or tokenized payment flows.

---

# 103. Payment Verification

Do not trust:

```text
Frontend says payment succeeded.
```

Verify payment through the provider's trusted server-side mechanism.

---

# 104. Webhook Security

Payment and other external webhooks should validate:

```text
Signature

Source Authenticity

Replay Handling where appropriate
```

Do not accept arbitrary unauthenticated requests as trusted events.

---

# 105. Idempotency

Critical operations should handle duplicate delivery safely.

Examples:

```text
Payment Webhook

Account Provisioning

Subscription Activation
```

A repeated webhook should not create repeated purchases or duplicate state.

---

# 106. Abuse Prevention

Potential abuse includes:

```text
Spam Accounts

Credential Stuffing

Brute Force Login

Automated AI Usage

Feedback Spam

Scraping

Resource Exhaustion
```

Use layered controls.

---

# 107. CAPTCHA

CAPTCHA should not be the default solution for every form.

Use it when:

```text
Abuse is occurring

Risk justifies friction
```

Potentially on:

```text
Repeated Signup Abuse

Password Reset Abuse

High-Volume Anonymous Submission
```

---

# 108. Progressive Abuse Controls

Prefer:

```text
Normal User
→ minimal friction

Suspicious Pattern
→ stronger controls
```

rather than punishing every user from the beginning.

---

# 109. Login Protection

Potential protections:

```text
Rate Limiting

Temporary Backoff

Provider-Level Protection

Suspicious Activity Monitoring
```

Avoid permanently locking users out because of attacker-generated attempts.

---

# 110. Email Abuse

Endpoints that send email can be abused.

Examples:

```text
Password Reset

Magic Link

Invitations

Notifications
```

Apply:

```text
Rate Limits

Cooldowns

Abuse Monitoring
```

---

# 111. Search Abuse

If search becomes computationally expensive:

Protect against:

```text
Automated High-Frequency Queries

Extremely Large Inputs
```

Set reasonable limits.

---

# 112. Denial-of-Service Resilience

Use infrastructure protections where available.

Potential:

```text
Cloudflare

Caching

Rate Limiting

Request Size Limits

Timeouts
```

Do not attempt to solve global DDoS defense entirely inside application code.

---

# 113. Caching Security

Never accidentally cache:

```text
Private User Data
```

as:

```text
Public Shared Cache
```

Caching policy must distinguish:

```text
Public Content

Personalized Content
```

---

# 114. CDN Security

Public assets and public pages may benefit from CDN caching.

Authenticated personalized responses require careful cache control.

---

# 115. Cache Keys

If a response varies by:

```text
Authentication

Locale

User State
```

cache configuration must reflect that variation.

---

# 116. Dependency Security

Dependencies create supply-chain risk.

Maintain:

```text
Reasonable Dependency Updates

Vulnerability Monitoring

Removal of Unused Packages
```

Do not update everything blindly without testing.

---

# 117. Dependency Addition Rule

Before adding a package:

Ask:

```text
Is it maintained?

Is it necessary?

Is there a smaller existing solution?

What permissions does it require?

What is its security history?
```

---

# 118. Lockfiles

Commit the appropriate dependency lockfile.

This improves reproducibility.

---

# 119. Automated Vulnerability Alerts

Use available dependency vulnerability alerts.

But evaluate:

```text
Exploitability

Affected Code Path

Severity

Available Fix
```

Do not treat every alert identically.

---

# 120. Build Security

The build process should not:

```text
Print Secrets

Bundle Server Secrets into Client Code

Upload Sensitive Files
```

---

# 121. Client Environment Variables

Any variable exposed to browser code should be treated as public.

A name such as:

```text
NEXT_PUBLIC_...
```

must never contain a secret.

---

# 122. Source Maps

Production source-map strategy should balance:

```text
Debugging

Exposure

Monitoring Integration
```

Do not publish sensitive source artifacts unintentionally.

---

# 123. Git Security

Repository access should follow:

```text
Least Privilege

Protected Important Branches

Review for High-Risk Changes
```

Avoid sharing personal credentials.

---

# 124. Branch Protection

For production-critical branches, consider:

```text
Pull Request Review

Required Checks

Restricted Force Push
```

The exact policy should match team size.

---

# 125. Commit Security

Before commit:

Check for:

```text
Secrets

Private Data

Large Sensitive Files

Accidental Environment Files
```

---

# 126. Deployment Security

Production deployment credentials should not be shared casually.

Prefer:

```text
Individual Access

Scoped Tokens

Revocable Credentials
```

over one shared master credential.

---

# 127. Production Access

Limit who can:

```text
Deploy

Read Production Secrets

Access Production Database

Modify DNS

Modify Authentication Configuration
```

---

# 128. Cloudflare Security

Cloudflare may provide:

```text
TLS

DDoS Protection

Bot Controls

Rate Limiting

Firewall Rules
```

Use these strategically.

Do not create aggressive rules that block:

```text
Googlebot

Legitimate Users
```

without testing.

---

# 129. Search Engine Access

Security controls must preserve legitimate crawling of public content.

Verify after firewall changes:

```text
robots.txt

Sitemap

Representative Public Pages

Googlebot Accessibility
```

---

# 130. Staging Security

Preview and staging environments may contain unfinished functionality.

They should not be:

```text
Publicly Indexed
```

and should not expose production secrets unnecessarily.

---

# 131. Production Data in Development

Avoid copying full production user data into local development.

If production-like data is needed:

Use:

```text
Synthetic Data

Anonymized Data
```

where practical.

---

# 132. Test Accounts

Use dedicated test accounts.

Do not use another user's real account for development testing.

---

# 133. Security Event Logging

Potential security-relevant events:

```text
Repeated Failed Login

Admin Login

Role Change

Sensitive Data Deletion

Suspicious API Abuse
```

Logging should be proportional to risk.

---

# 134. Audit Logging

Administrative actions may eventually require:

```text
Who

Did What

When

To Which Resource
```

This is especially useful for:

```text
Content Deletion

User Management

Role Changes
```

---

# 135. Audit Log Integrity

Audit logs should not be casually editable through ordinary application interfaces.

---

# 136. Security Monitoring

Monitor for:

```text
Unusual Error Spikes

Repeated Authentication Failures

Unexpected Traffic Surges

AI Cost Spikes

Large Upload Spikes

Administrative Anomalies
```

---

# 137. Security Alerts

Alerts should prioritize meaningful threats.

Avoid alert fatigue.

Potential critical alerts:

```text
Production secret exposure

Massive authentication failure spike

Unexpected admin activity

Large AI cost anomaly

Database availability failure
```

---

# 138. Incident Response

A basic incident process should exist before a major incident.

Conceptually:

```text
Detect

Contain

Investigate

Fix

Recover

Review
```

---

# 139. Incident Severity

Potential:

```text
SEV-1
Active major breach or production compromise

SEV-2
Serious vulnerability with meaningful exposure

SEV-3
Limited security issue

SEV-4
Low-risk hardening issue
```

---

# 140. Incident First Actions

Depending on the incident:

```text
Revoke Credentials

Disable Vulnerable Feature

Block Malicious Traffic

Preserve Logs

Rotate Secrets

Patch Vulnerability
```

Do not destroy evidence unnecessarily.

---

# 141. Breach Communication

If user data is affected:

Response must consider:

```text
Actual Scope

Applicable Legal Requirements

User Communication

Provider Notification
```

Do not conceal material incidents.

---

# 142. Security Disclosure

As the product grows:

Provide a clear method for security researchers to report vulnerabilities.

Potential future:

```text
security@...
```

or an equivalent controlled channel.

---

# 143. Responsible Disclosure

Do not publicly expose vulnerability details before remediation where doing so creates unnecessary risk.

---

# 144. Security Testing Layers

Use:

```text
Static Analysis

Dependency Scanning

Automated Tests

Manual Review

Authorization Testing

Production Monitoring
```

No single tool provides complete security.

---

# 145. Authentication Tests

Test:

```text
Valid Login

Invalid Login

Logout

Expired Session

Unauthenticated Access

Authenticated Access
```

---

# 146. Authorization Tests

Critical test:

```text
User A cannot access User B's resource.
```

Apply to:

```text
Progress

Bookmarks

Resumes

Applications

Interview Notes
```

---

# 147. Admin Authorization Tests

Test:

```text
Normal User Cannot Access Admin Operation

Anonymous User Cannot Access Admin Operation

Admin Can Access Authorized Operation
```

Frontend hiding is not the test.

Direct API access must be tested.

---

# 148. Input Security Tests

Test:

```text
Oversized Input

Malformed Input

Unexpected Types

Empty Required Fields

Dangerous Strings
```

The system should fail safely.

---

# 149. File Upload Tests

Test:

```text
Valid File

Wrong Extension

Wrong MIME Type

Oversized File

Empty File

Malformed File
```

---

# 150. Rate Limit Tests

Verify:

```text
Normal Usage Works

Abusive Usage Is Limited

Recovery Occurs After Window
```

---

# 151. Security Headers Testing

Use automated and manual checks to verify production headers.

Do not rely only on configuration files.

Test the deployed response.

---

# 152. Production Security Checklist

Before major production release:

```text
[ ] No known production secrets committed

[ ] Authentication works securely

[ ] Authorization is server-enforced

[ ] Private resources enforce ownership

[ ] Admin routes enforce server-side permissions

[ ] Sensitive cookies use appropriate security attributes

[ ] Public and private caching are separated

[ ] APIs validate input

[ ] Sensitive endpoints have appropriate rate limits

[ ] User-facing errors do not expose internals

[ ] Logs do not contain obvious secrets

[ ] HTTPS is enforced

[ ] Security headers are reviewed

[ ] File uploads are constrained if enabled

[ ] AI keys remain server-side

[ ] Expensive AI endpoints are protected

[ ] Production and development environments are separated

[ ] Dependency vulnerabilities are reviewed

[ ] Backups exist once important user data exists
```

---

# 153. Privacy Checklist

Before introducing sensitive user features:

```text
[ ] Data collected is necessary

[ ] Data categories are documented

[ ] Private data is private by default

[ ] Analytics excludes sensitive content

[ ] Resume handling is documented

[ ] AI data transfer is understood

[ ] File retention is defined

[ ] User deletion behavior is defined

[ ] Privacy policy reflects actual behavior

[ ] Third-party processors are known
```

---

# 154. AI Security Checklist

Before launching AI-powered features:

```text
[ ] API keys remain server-side

[ ] Requests are authenticated where required

[ ] Usage is rate-limited

[ ] Request size is limited

[ ] User data sent to provider is minimized

[ ] Prompt injection is considered

[ ] AI output is treated as untrusted

[ ] Generated HTML is not rendered unsafely

[ ] AI failure has a safe error state

[ ] Usage and cost are monitored
```

---

# 155. File Security Checklist

Before launching uploads:

```text
[ ] Allowed file types are explicit

[ ] Maximum file size exists

[ ] Filename is not trusted as storage path

[ ] Private files are not publicly enumerable

[ ] Upload authorization exists

[ ] Download authorization exists where required

[ ] Parsing fails safely

[ ] Retention policy exists

[ ] Deletion behavior exists
```

---

# 156. Security Architecture for Current V2

The current V2 should prioritize:

```text
Secure Public Deployment

Safe Authentication

Correct Authorization

Secrets Management

Environment Separation

Input Validation

Rate Limits on Sensitive Endpoints

Admin Protection

Secure Analytics

Production Monitoring
```

Do not delay the UI and SEO rebuild to implement:

```text
Enterprise SIEM

Complex Zero-Trust Service Mesh

Advanced Multi-Region Security Architecture

Custom Cryptographic Systems
```

unless actual product requirements demand them.

---

# 157. Security Architecture for Future Modules

Future features should extend the foundation.

```text
CONTENT
→ public security and anti-abuse


USER DATABASE
→ authentication and data isolation


RESUME ANALYSIS
→ private file security and AI privacy


MOCK INTERVIEWS
→ private session data and AI cost protection


REAL INTERVIEWS
→ highly private notes and recordings


JOB HUNTING
→ application data privacy


PAYMENTS
→ provider verification and subscription security
```

---

# 158. AI Coding Agent Security Rules

AI coding agents working on the repository must:

```text
Inspect existing authentication before changing it

Never invent secret values

Never commit credentials

Never disable security checks merely to make tests pass

Never expose server secrets to client code

Never trust user IDs from the client for ownership

Never add public file access without reviewing privacy

Never remove rate limits without justification

Never weaken authorization for convenience
```

---

# 159. AI Agent Secret Rule

If an agent discovers what appears to be a real secret:

It should:

```text
Avoid repeating the value unnecessarily

Flag the exposure

Recommend rotation

Remove it safely from active configuration
```

Do not treat deletion from one file as complete remediation.

---

# 160. AI Agent Authentication Rule

Before modifying authentication:

Inspect:

```text
Current Provider

Session Strategy

Middleware

Protected Routes

Database Models

Environment Variables
```

Do not replace authentication architecture casually.

---

# 161. AI Agent Authorization Rule

Every new private resource requires explicit answers to:

```text
Who owns this?

Who can read it?

Who can create it?

Who can update it?

Who can delete it?
```

---

# 162. AI Agent Upload Rule

Do not add:

```text
<input type="file">
```

and consider the upload feature complete.

The complete feature includes:

```text
Validation

Storage

Authorization

Size Limits

Failure Handling

Deletion
```

---

# 163. AI Agent Security Validation

After security-sensitive changes:

Report:

```text
Threat Addressed

Implementation

Validation Performed

Known Limitations

Follow-Up Hardening
```

Do not claim:

```text
Fully Secure
```

without qualification.

---

# 164. Security Review Triggers

A focused security review should occur when introducing:

```text
Authentication Change

New Admin Capability

File Upload

Resume Processing

AI Tool Execution

Payment

Public Write API

User-to-User Sharing

Voice Recording

Video Recording
```

---

# 165. Security Debt

Track meaningful security debt such as:

```text
Temporary broad permission

Missing rate limit

Legacy authentication path

Unencrypted sensitive field

Overly broad service credential
```

Do not bury known security compromises.

---

# 166. Security Priority Order

Fix first:

```text
Exposed Secrets

Authentication Bypass

Authorization Failure

Private Data Exposure

Admin Compromise Risk

Injection

Unsafe File Access

Payment Integrity
```

Then:

```text
Abuse Hardening

Advanced Monitoring

Additional Defense in Depth
```

---

# 167. Security Definition of Done

The V2 security foundation is established when:

```text
[ ] Authentication architecture is documented

[ ] Authentication and authorization are separated

[ ] Private resource ownership is enforced server-side

[ ] Admin access has explicit protection

[ ] Secrets remain outside source control

[ ] Environment boundaries are defined

[ ] Sensitive API inputs are validated

[ ] Expensive endpoints can be rate-limited

[ ] Public and private caching are separated

[ ] User data categories are understood

[ ] Resume and career data are treated as private

[ ] Analytics does not collect sensitive content

[ ] File-upload security standards exist

[ ] AI integration security standards exist

[ ] Payment security principles exist

[ ] Dependency security is monitored

[ ] Production access follows least privilege

[ ] Security monitoring principles exist

[ ] Incident response basics exist

[ ] Security tests cover authentication and authorization

[ ] AI coding agents have explicit security constraints
```

---

# 168. Final Security Principle

Interview Explainer should not attempt to appear secure through complexity.

The goal is:

```text
Simple Architecture

+

Explicit Trust Boundaries

+

Correct Authentication

+

Strict Authorization

+

Minimal Sensitive Data

+

Safe Defaults

+

Measured Hardening
```

The permanent security principles are:

> **The browser is not trusted.**

> **Authentication does not imply authorization.**

> **Frontend visibility is not a security boundary.**

> **Every private resource requires an ownership rule.**

> **Every administrative action requires server-side authorization.**

> **Secrets do not belong in source control.**

> **Anything exposed to client JavaScript should be treated as public.**

> **Public content can be public without allowing unlimited infrastructure abuse.**

> **Search-engine access must not be accidentally destroyed by security controls.**

> **User input is untrusted.**

> **Uploaded files are untrusted.**

> **AI input is untrusted.**

> **AI output is untrusted.**

> **Private career data should remain private by default.**

> **Analytics must not become a hidden database of sensitive user information.**

> **Security controls should be proportional to actual risk.**

> **Do not build custom cryptography when proven systems exist.**

> **Do not overengineer enterprise security before product-market fit.**

> **Do not postpone basic security because the product is still small.**

> **Security must grow with the product without requiring a complete architectural reset.**

The desired outcome is:

```text
A public content platform
that remains easy to discover

+

A private preparation platform
that users can trust

+

A technical architecture
that can safely grow into
mock interviews,
resume analysis,
job hunting,
real interview preparation,
AI features,
and monetization
```

Security should protect the product's growth.

It should neither be ignored nor become unnecessary complexity that prevents the product from shipping.
