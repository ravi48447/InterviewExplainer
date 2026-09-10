#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/authentication-basics/devise-basics/complete-qa.json",
    slug: "rails-devise-auth-basics",
    question: "What is Devise, and how does it handle authentication in Rails?",
    beats: [
      {
        cue: "Define the gem and separate identity from permission",
        stage: "Devise builds on Warden",
        spokenText: "Devise is a modular Rails authentication gem built on the Rack-based Warden framework. Authentication answers who the user is. Devise supplies common mechanics such as password verification, sign-in and sign-out, recovery, remember-me behavior, and optional confirmation; it does not decide whether that authenticated user may edit a particular record.",
      },
      {
        cue: "Connect routes and enabled model modules to the authentication scope",
        stage: "Modules configure the model",
        spokenText: "`devise_for :users` creates authentication routes and a `:user` mapping. The User model enables only the modules the product needs, such as `database_authenticatable`, `recoverable`, `rememberable`, and `validatable`. Some modules need database columns and operational setup—for example, recovery needs correct mail delivery and token-host configuration.",
        support: {
          type: "code",
          title: "Wire one Devise scope and protect a controller",
          language: "ruby",
          code: "Rails.application.routes.draw do\n  devise_for :users\nend\n\nclass User < ApplicationRecord\n  devise :database_authenticatable, :recoverable, :validatable\nend\n\nclass DashboardController < ApplicationController\n  before_action :authenticate_user!\n\n  def show\n    @account_name = current_user.name\n  end\nend",
          caption: "The route and model establish the user scope; the controller requires that identity and reads it through current_user.",
        },
      },
      {
        cue: "Trace submitted credentials through Warden into a scoped session",
        stage: "Warden establishes identity",
        spokenText: "With `database_authenticatable`, submitted credentials reach a Warden strategy. The model stores a password digest in `encrypted_password`, never the original password. On a valid match, Warden records the user in the mapped session scope; later requests restore that identity so helpers such as `current_user`, `user_signed_in?`, and `authenticate_user!` can use it.",
        support: {
          type: "trace",
          title: "Password sign-in to protected action",
          items: [
            {
              label: "Route",
              value: "POST /users/sign_in",
              detail: "The Devise user mapping selects the authentication scope.",
              tone: "blue",
            },
            {
              label: "Strategy",
              value: "Warden verifies credentials",
              detail: "The password is checked against the stored digest.",
              tone: "neutral",
            },
            {
              label: "Session",
              value: "user identity recorded",
              detail: "Later requests can restore the mapped user.",
              tone: "green",
            },
            {
              label: "Application",
              value: "authorize the action",
              detail: "Authentication supplies current_user; policy still decides permission.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "State the security and customization responsibilities left to the app",
        stage: "Authorization remains separate",
        spokenText: "`authenticate_user!` blocks anonymous access, but record-level authorization, allowed registration fields, safe redirects, rate limiting, session policy, audit events, and multi-factor requirements still belong to the application. Devise is a maintained foundation, not an automatic security policy. Test failed and successful sign-in, logout, recovery expiry, and access to protected actions for every enabled scope.",
        recallRule: "Devise maps a model, runs Warden strategies, and exposes a scoped signed-in identity; the application still owns authorization and product policy.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/authentication-basics/sessions-and-cookies/complete-qa.json",
    slug: "rails-sessions-and-cookies-basics",
    question: "How do sessions and cookies work in Rails?",
    beats: [
      {
        cue: "Begin with the browser transport and its scope attributes",
        stage: "Cookies follow browser rules",
        spokenText: "A cookie is a small name and value stored by the browser and sent with later HTTP requests when its domain, path, expiry, Secure, and SameSite rules match. `Secure` limits transmission to HTTPS, `HttpOnly` blocks normal JavaScript reads, and SameSite affects cross-site sending. Those attributes reduce specific risks but do not make arbitrary cookie contents trustworthy or secret.",
      },
      {
        cue: "Distinguish plain signed and encrypted Rails cookie jars",
        stage: "Rails jars change protection",
        spokenText: "Rails exposes different cookie jars. `cookies[:theme]` is plain and can be read or changed by the browser user. `cookies.signed[:account_id]` adds integrity, so Rails can detect tampering, but the value remains readable. `cookies.encrypted[:draft]` adds confidentiality as well as integrity. Choose the jar from the data's threat model rather than from a convenient syntax.",
        support: {
          type: "comparison",
          title: "Do not confuse transport, protection, and session storage",
          items: [
            {
              label: "Plain cookie",
              value: "readable and changeable",
              detail: "Suitable only for non-sensitive values whose owner may edit them.",
              tone: "neutral",
            },
            {
              label: "Signed cookie",
              value: "readable, tamper-evident",
              detail: "Integrity is protected, but the payload is not hidden.",
              tone: "blue",
            },
            {
              label: "Encrypted cookie",
              value: "confidential and signed",
              detail: "Rails protects both content and integrity with application secrets.",
              tone: "green",
            },
            {
              label: "Session",
              value: "store-dependent",
              detail: "The hash API stays stable while payload location depends on the configured store.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Explain how CookieStore differs from a server-side session store",
        stage: "Store controls data location",
        spokenText: "Rails presents `session` as a hash, but its configured store decides where the data lives. CookieStore places the protected session payload in the browser cookie, so it avoids a lookup but has a small size limit and sends the payload on every matching request. Cache or database stores normally place an opaque identifier in the cookie and keep the session record server-side, enabling central invalidation at the cost of storage and lookup.",
      },
      {
        cue: "Show the sign-in boundary and close with browser security limits",
        stage: "Renew identity at sign-in",
        spokenText: "After password verification, renew the session with `reset_session` and store a stable identifier such as `session[:user_id]`, not an entire model. Load current account status on later requests and reset the session on logout. Cookie credentials are sent automatically, so state-changing browser requests still need CSRF protection; HttpOnly reduces token reading by injected script but does not stop that script from acting as the user.",
        support: {
          type: "code",
          title: "Keep a small identity session and reset it at both boundaries",
          language: "ruby",
          code: "class SessionsController < ApplicationController\n  def create\n    user = User.authenticate_by(\n      email: params[:email], password: params[:password]\n    )\n    return head :unauthorized unless user\n\n    reset_session\n    session[:user_id] = user.id\n    cookies[:theme] = {\n      value: 'dark', same_site: :lax, secure: Rails.env.production?\n    }\n    redirect_to dashboard_path\n  end\n\n  def destroy\n    reset_session\n    redirect_to root_path\n  end\nend",
          caption: "The authenticated identity stays small in session; the plain cookie contains only a non-sensitive display preference.",
        },
        recallRule: "Cookies transport browser values, Rails jars choose cryptographic protection, and the session store chooses where per-browser state is kept.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/authentication-basics/token-auth-intro/complete-qa.json",
    slug: "rails-token-auth-intro",
    question: "How does bearer-token authentication work, and is it always stateless?",
    beats: [
      {
        cue: "Define a bearer credential and its transport boundary",
        stage: "Bearer means possession",
        spokenText: "A bearer token is a credential whose holder may present it to a protected API. The client normally sends `Authorization: Bearer <token>` over HTTPS, and possession is enough to use it. The raw value must stay out of URLs, logs, analytics, and browser history, and client storage must match the platform threat model because a leaked token can be replayed until it expires or is revoked.",
      },
      {
        cue: "Compare server-looked-up opaque secrets with signed claim tokens",
        stage: "Opaque and JWT differ",
        spokenText: "An opaque token is a random secret with no client-readable meaning. Store only its cryptographic hash and look it up on each request; that server state adds a lookup but makes individual revocation direct. A signed JWT carries readable claims and can be verified locally. Its signature protects integrity, not confidentiality, so private data does not belong in ordinary signed claims.",
        support: {
          type: "comparison",
          title: "Token representation does not decide the whole architecture",
          items: [
            {
              label: "Opaque access token",
              value: "random secret + lookup",
              detail: "Immediate per-token revocation is straightforward; validation requires server state.",
              tone: "blue",
            },
            {
              label: "Signed JWT",
              value: "claims + signature",
              detail: "Signature validation may be local, but claims remain readable.",
              tone: "green",
            },
            {
              label: "Bearer usage",
              value: "possession grants use",
              detail: "Both formats require TLS and strict leak prevention.",
              tone: "orange",
            },
            {
              label: "System state",
              value: "separate decision",
              detail: "Refresh, revocation, account status, and key rotation may still require current data.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Keep structure and secret storage visible in an opaque-token example",
        stage: "Validation precedes permission",
        spokenText: "The API validates the token before using its identity and scope, then performs a separate authorization check for the requested action. An opaque-token store hashes the presented secret, finds an active record, checks expiry and scope, and loads current user or tenant state. The runnable example never stores or prints the usable token; deleting its hash revokes that credential immediately.",
        support: {
          type: "code",
          title: "Store only the hash of an opaque bearer token",
          language: "ruby",
          code: "require 'digest'\nrequire 'securerandom'\n\nclass TokenStore\n  def initialize\n    @records = {}\n  end\n\n  def issue(user_id:, scope:)\n    raw_token = SecureRandom.hex(32)\n    @records[digest(raw_token)] = { user_id: user_id, scope: scope }\n    raw_token\n  end\n\n  def authenticate(raw_token)\n    @records[digest(raw_token)]\n  end\n\n  def revoke(raw_token)\n    @records.delete(digest(raw_token))\n  end\n\n  private\n\n  def digest(raw_token)\n    Digest::SHA256.hexdigest(raw_token)\n  end\nend\n\nstore = TokenStore.new\ntoken = store.issue(user_id: 42, scope: 'profile:read')\np store.authenticate(token)\nstore.revoke(token)\np store.authenticate(token)",
          caption: "The first lookup returns identity and scope; after revocation the same bearer secret returns nil.",
        },
      },
      {
        cue: "Explain why revocation refresh and current account policy add state",
        stage: "Stateless is a system choice",
        spokenText: "Local JWT verification can avoid an access-token row lookup, but the wider design is not automatically stateless. Refresh-token rotation, stolen-token revocation, disabled users, changed roles, and signing-key rotation often use current server data or accept access until a short token expires. Return 401 for an absent or invalid credential and 403 when a known identity lacks permission; authentication and authorization remain separate.",
        recallRule: "Bearer describes possession-based use, opaque or JWT describes representation, and statelessness depends on the full validation and revocation design.",
      },
    ],
  },
];

for (const presentation of presentations) {
  const absolutePath = path.join(repoRoot, presentation.file);
  const document = JSON.parse(fs.readFileSync(absolutePath, "utf8"));
  const questions = Array.isArray(document) ? document : document.questions;
  if (!Array.isArray(questions) || questions.length !== 1) {
    throw new Error(`Expected one question in ${presentation.file}`);
  }

  const question = questions[0];
  if (question.slug !== presentation.slug || question.question !== presentation.question) {
    throw new Error(`Question identity changed in ${presentation.file}`);
  }

  const sections = question.answer?.sections;
  if (!Array.isArray(sections)) throw new Error(`${presentation.slug} is missing answer sections`);
  for (const requiredType of ["key_points", "speakable_answer", "deep_explanation"]) {
    if (sections.filter((section) => section.type === requiredType).length !== 1) {
      throw new Error(`${presentation.slug} needs one ${requiredType} section`);
    }
  }

  const speakable = sections.find((section) => section.type === "speakable_answer");
  speakable.answerSize = "standard";
  speakable.beats = presentation.beats;
  speakable.content = presentation.beats.map((beat) => beat.spokenText).join("\n\n");

  fs.writeFileSync(absolutePath, `${JSON.stringify(document, null, 2)}\n`);
  console.log(`Curated ${presentation.slug}`);
}
