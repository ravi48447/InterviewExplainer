#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/ruby-security-basics/sql-injection-basics/complete-qa.json",
    slug: "ruby-sql-injection-basics",
    question: "What is SQL injection, and how does Rails prevent it?",
    beats: [
      {
        cue: "Define the failure at the point where a query is assembled",
        stage: "Input must remain data",
        spokenText: "SQL injection happens when untrusted text becomes part of the SQL program instead of staying a value. An expression such as `where(\"email = '#{params[:email]}'\")` builds one SQL string before the adapter sees it. Quotes, comments, or operators in the input may then change the query's grammar rather than represent an email address.",
      },
      {
        cue: "Show the two normal Active Record forms that keep values separate",
        stage: "Values belong in binds",
        spokenText: "Rails protects values when the query structure and the value reach Active Record separately. `User.where(email: params[:email])` uses a hash condition, while `User.where(\"age >= ?\", params[:age])` uses a placeholder. In both cases the adapter quotes or binds the value for its type, so a malicious-looking string remains data.",
        support: {
          type: "comparison",
          title: "Choose the protection for the changing query part",
          items: [
            {
              label: "Interpolated SQL",
              value: "structure and input merge",
              detail: "Avoid request values inside SQL strings because the input can alter grammar.",
              tone: "orange",
            },
            {
              label: "Hash condition",
              value: "column plus bound value",
              detail: "Use it for straightforward equality and structured Active Record queries.",
              tone: "green",
            },
            {
              label: "Placeholder",
              value: "fixed fragment plus bind",
              detail: "Use it when the condition needs a static operator or expression.",
              tone: "blue",
            },
            {
              label: "Column or direction",
              value: "application allowlist",
              detail: "Identifiers and SQL keywords cannot be supplied as ordinary bound values.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Handle a client-selected sort field without turning it into SQL text",
        stage: "Identifiers need allowlists",
        spokenText: "Binding is for values, not a column name, table name, `ASC`, or an entire SQL fragment. If an endpoint accepts `sort=title`, map that public choice to an application-owned expression and reject or default unknown choices. The search below escapes `LIKE` wildcard characters and then binds the pattern; the sort order can only come from the frozen map.",
        support: {
          type: "code",
          title: "Bind the search value and map the sort choice",
          language: "ruby",
          code: "class UserSearch\n  SORTS = {\n    \"newest\" => { created_at: :desc },\n    \"title\" => { title: :asc }\n  }.freeze\n\n  def self.call(email:, sort: \"newest\")\n    escaped = ActiveRecord::Base.sanitize_sql_like(email)\n    order = SORTS.fetch(sort, SORTS.fetch(\"newest\"))\n\n    User.where(\"email LIKE ?\", \"%#{escaped}%\")\n        .order(order)\n        .limit(50)\n  end\nend",
          caption: "The only variable SQL structure comes from SORTS; the external email remains a bound value.",
        },
      },
      {
        cue: "Close with the boundaries and the supporting defenses",
        stage: "Safe construction is central",
        spokenText: "Methods that accept raw SQL fragments still need careful review, and input validation is not a replacement for parameterization. I would also give the application's database account only the privileges it needs, test quotes and invalid sort keys, and filter sensitive query data from logs. Those layers reduce impact, but the main rule remains: the application owns SQL structure; external input occupies controlled value positions.",
        recallRule: "Bind changing values, allowlist changing structure, and never assemble SQL grammar from request text.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-security-basics/strong-params/complete-qa.json",
    slug: "ruby-strong-params-basics",
    question: "What are Strong Parameters in Rails, and what do they not protect?",
    beats: [
      {
        cue: "Define the controller boundary and the operation it protects",
        stage: "Mass assignment starts closed",
        spokenText: "Strong Parameters are Rails' controller boundary for mass assignment. Request data arrives as an unpermitted `ActionController::Parameters` object, so a controller cannot safely pass an arbitrary submitted hash straight to `create` or `update`. It must first name the keys and nested shapes that this endpoint accepts.",
      },
      {
        cue: "Show the current and established ways to declare the accepted shape",
        stage: "Describe the accepted shape",
        spokenText: "In current Rails, `params.expect(user: [:name, :email])` requires the expected `user` shape and permits those fields. Existing applications commonly use `params.require(:user).permit(:name, :email)`. Nested arrays and hashes need their own explicit shape; broad escapes such as `permit!`, `{}` permission, or `to_unsafe_h` remove much of this protection.",
      },
      {
        cue: "Make the permitted list specific to the endpoint and its authority",
        stage: "Lists follow the endpoint",
        spokenText: "A submitted key is not safe merely because the model has that column. A profile endpoint can accept `name`, `email`, and `time_zone` without accepting `admin` or `suspended`. An administrator action can use a different parameter method after its own authorization check. This keeps a future sensitive column from silently entering every update path.",
        support: {
          type: "code",
          title: "Give the profile endpoint its own permitted shape",
          language: "ruby",
          code: "class UsersController < ApplicationController\n  def update\n    current_user.update!(profile_params)\n    head :no_content\n  end\n\n  private\n\n  def profile_params\n    params.expect(user: [:name, :email, :time_zone])\n  end\nend",
          caption: "The update can mass-assign only the self-service fields listed by this controller action.",
        },
      },
      {
        cue: "Separate input shape from value correctness and user permission",
        stage: "Three checks protect updates",
        spokenText: "Strong Parameters filter shape; they do not prove that an email is valid or that this user may change a field. Authorization checks the actor and record, model and database validation protect value rules, and Strong Parameters limit what reaches mass assignment. I would test each boundary by submitting a sensitive key and proving that it stays unchanged.",
        support: {
          type: "comparison",
          title: "Each boundary answers a different question",
          items: [
            {
              label: "Strong Parameters",
              value: "Which input shape may be assigned?",
              detail: "Filters keys and nested structures at the controller boundary.",
              tone: "blue",
            },
            {
              label: "Authorization",
              value: "May this actor make this change?",
              detail: "Applies user, role, record, and action policy.",
              tone: "orange",
            },
            {
              label: "Validation",
              value: "Is the resulting value valid?",
              detail: "Protects model and database rules independently of request shape.",
              tone: "green",
            },
          ],
        },
        recallRule: "Permit the endpoint's shape, authorize the actor's change, and validate the resulting values.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/ruby-security-basics/xss-basics/complete-qa.json",
    slug: "ruby-xss-basics",
    question: "What is cross-site scripting, and how does Rails reduce XSS risk?",
    beats: [
      {
        cue: "Define the attack by what the browser eventually does",
        stage: "XSS is an output failure",
        spokenText: "Cross-site scripting happens when attacker-controlled data reaches a browser context as active markup or code under the application's trusted origin. The value may be stored in a comment, reflected from a request, or inserted later by JavaScript. The important question is not only where it entered, but which browser sink finally interprets it.",
      },
      {
        cue: "Explain Rails' safe default for ordinary text output",
        stage: "ERB escapes plain text",
        spokenText: "For plain text, normal ERB output such as `<%= @comment.body %>` is the right default. Rails HTML-escapes unsafe characters, so a submitted tag is displayed as text instead of becoming an element. The small runnable example shows that encoding step directly; a Rails template performs it automatically on an ordinary unsafe string.",
        support: {
          type: "code",
          title: "See markup become harmless text",
          language: "ruby",
          code: "require \"cgi\"\n\ncomment = %q{<img src=x onerror=\"alert(1)\">}\nrendered = \"<p>#{CGI.escapeHTML(comment)}</p>\"\nputs rendered",
          caption: "The output contains encoded angle brackets, so the browser receives text rather than an img element.",
        },
      },
      {
        cue: "Distinguish intentional rich HTML from ordinary plain-text fields",
        stage: "Rich HTML needs a policy",
        spokenText: "If the product intentionally accepts limited formatting, use `sanitize(rich_html, tags: ALLOWED_TAGS)` with a small, explicit allowlist. Sanitizing chooses which markup may survive; escaping treats all markup as text. Calling `raw`, `.html_safe`, or `<%==` on untrusted content skips the normal protection instead of validating it.",
      },
      {
        cue: "Connect each output context to the control it needs",
        stage: "The sink decides protection",
        spokenText: "HTML text, URLs, script data, CSS, and DOM APIs follow different grammars. Validate URL schemes, serialize data instead of building JavaScript source, and prefer `textContent` to `innerHTML` for client-side text. Content Security Policy adds defense in depth, but it does not make an unsafe sink safe. Protection belongs at the final rendering context.",
        support: {
          type: "trace",
          title: "Follow the value to its browser interpretation",
          items: [
            {
              label: "Source",
              value: "comment, URL, import, or API",
              detail: "Treat the value as untrusted even if it was stored earlier.",
              tone: "neutral",
            },
            {
              label: "Plain HTML text",
              value: "escape",
              detail: "Normal ERB output keeps tags visible as text.",
              tone: "green",
            },
            {
              label: "Intentional rich HTML",
              value: "allowlist sanitize",
              detail: "Only the product's supported tags and attributes may remain.",
              tone: "blue",
            },
            {
              label: "URL, script, or DOM",
              value: "context-specific safe API",
              detail: "HTML escaping alone does not define safety for another grammar.",
              tone: "orange",
            },
          ],
        },
        recallRule: "Keep plain text escaped, sanitize only intentional rich HTML, and protect every value for its final browser context.",
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
