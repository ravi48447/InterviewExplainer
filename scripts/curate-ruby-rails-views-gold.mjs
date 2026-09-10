#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = "content/ruby-backend-fresher/rails-forms-and-views";
const fence = (language, lines) => `\`\`\`${language}\n${lines.join("\n")}\n\`\`\``;

const lessons = {
  "erb-basics": {
    answerSize: "compact",
    direct: "ERB, or Embedded Ruby, is a template format that combines ordinary text such as HTML with Ruby expressions. In a Rails `.html.erb` view, `<% ... %>` runs Ruby without inserting its result, `<%= ... %>` evaluates an expression and adds its result to the response, and `<%# ... %>` is an ERB comment. Rails escapes unsafe string output by default, so bypassing that protection with `raw` or `html_safe` is safe only for content the application has already sanitised or fully controls.",
    quick: [
      "`.html.erb` combines an HTML response template with embedded Ruby.",
      "`<% ... %>` executes control flow or setup without printing its result.",
      "`<%= ... %>` inserts an expression's result into the response body.",
      "`<%# ... %>` creates a comment removed during ERB processing.",
      "Rails escapes unsafe strings by default; do not mark user input HTML-safe.",
    ],
    interview: [
      "- ERB means Embedded Ruby. Rails commonly uses `.html.erb` templates to combine static HTML with small Ruby expressions and control flow while building an HTTP response body.",
      "- The tags have distinct jobs. `<% ... %>` runs code but does not insert its return value, so it is used for an `if` or `each` block. `<%= ... %>` evaluates and outputs the result, such as a product name. `<%# ... %>` is an ERB comment and is omitted from the generated response.",
      "- For example, a products view can open a loop with `<% @products.each do |product| %>`, place `<%= product.name %>` inside one list item, and close the block with `<% end %>`. Calling `puts` inside a non-output tag writes elsewhere; it does not add text to the page.",
      "- Rails tracks HTML-safe strings and escapes ordinary unsafe output, which prevents a product name containing markup from becoming executable HTML. `raw` and `html_safe` bypass that boundary and must never be applied casually to user-controlled data.",
      "- ERB is best used for presentation choices and helper calls. Data loading and business rules belong before the template so the view remains a readable description of the response.",
    ],
    deepTitle: "ERB compiles a template into response-building Ruby",
    deep: [
      "A template is not sent to the browser as Ruby source. Rails compiles the ERB into a method that appends static text and evaluated output to a buffer. By the time the client receives the response, only the resulting HTML remains.",
      "Control-flow tags shape which static and dynamic fragments reach that buffer. They can open a Ruby block in one tag and close it later because the generated method contains one continuous Ruby program. Output tags append a value after converting it for the response context.",
      "HTML safety is contextual. Escaping converts characters such as `<` into text-safe entities so a value is displayed rather than treated as a tag or script. Sanitising is a separate operation that allows only an intended subset of markup. Marking an unsafe value as safe skips the guard without cleaning it.",
      "A view can call helpers for links, formatting, tags, and localisation. Queries or multi-step domain decisions inside the template are harder to reuse and can create hidden performance problems, especially when a loop triggers database access for every row.",
    ],
    visualType: "comparison_table",
    visualTitle: "Choose the ERB tag by output behaviour",
    visual: "| Tag | Runs Ruby | Inserts a value | Typical use |\n|---|---|---|---|\n| `<% ... %>` | Yes | No | `if`, `each`, assignment |\n| `<%= ... %>` | Yes | Yes | text, helper result, rendered partial |\n| `<%# ... %>` | No application expression | No | template-only comment |\n| `raw(value)` / `value.html_safe` | Yes | Unescaped | only trusted or sanitised markup |",
    codeTitle: "Use control tags for the loop and output tags for values",
    code: [
      "<!-- app/views/products/index.html.erb -->",
      "<h1>Products</h1>",
      "",
      "<% if @products.empty? %>",
      "  <p>No products yet.</p>",
      "<% else %>",
      "  <ul>",
      "    <% @products.each do |product| %>",
      "      <li><%= product.name %></li>",
      "    <% end %>",
      "  </ul>",
      "<% end %>",
      "",
      "<%# This comment is absent from the HTML response. %>",
    ],
    followups: [
      "What is the difference between `<% %>` and `<%= %>`?",
      "Why does `puts` not render a value into an ERB page?",
      "What is the difference between escaping, sanitising, and `html_safe`?",
    ],
  },
  "form-with": {
    answerSize: "standard",
    direct: "`form_with` is Rails' current form builder for model-backed and standalone forms. With `form_with model: @article`, Rails uses model naming and persistence state to choose field names, the destination URL, and whether the submission creates or updates the record. The builder supplies helpers such as `label`, `text_field`, and `submit`, and Rails includes CSRF protection for applicable non-GET forms. The controller must still permit input, validate the model, and render validation messages deliberately.",
    quick: [
      "`form_with model: record` derives naming, URL, and create-versus-update behaviour.",
      "A new record normally submits with POST; a persisted record normally uses PATCH.",
      "The yielded builder creates labels, inputs, selects, text areas, and submit controls.",
      "Rails adds an authenticity token to applicable forms for CSRF protection.",
      "Strong parameters and model validation still enforce the server-side contract.",
    ],
    interview: [
      "- `form_with` builds Rails forms using either a model object or an explicit URL and scope. The model-backed form is especially useful because Rails can derive the parameter name, route, and HTTP method from the record's model metadata and whether it has been persisted.",
      "- For example, `form_with model: @article` sends a new Article to the collection create route with POST. The same template given a persisted Article targets that member's update route and uses PATCH. This is why one `_form` partial can serve both the new and edit pages.",
      "- The yielded form builder generates connected controls such as `form.label :title`, `form.text_field :title`, and `form.submit`. It also repopulates values from the bound object. The view must read `@article.errors` and present useful validation messages; the builder does not replace model validation or automatically explain every failure.",
      "- Rails includes an authenticity token for applicable non-GET HTML forms, allowing the controller to reject forged cross-site submissions. That security feature does not make submitted attributes trustworthy: the controller still chooses permitted keys, and the model still checks domain rules.",
      "- After invalid input, render the form with the same object and a failure status so its values and errors remain available. After a successful write, redirect to a stable page to avoid repeating the submission on refresh. This keeps browser behaviour and the server-side record lifecycle aligned.",
    ],
    deepTitle: "The record supplies a form contract, not server-side trust",
    deep: [
      "Model-backed form inference starts with Active Model conventions. The builder asks for the model name, parameter key, route key, and persistence state. That information connects an Article object to fields such as `article[title]` and to the appropriate route helper without duplicating those strings in the template.",
      "Browsers submit name-value pairs, not Ruby objects. Rails parses those pairs into `params`, so the controller must select an allowed shape before mass assignment. A hidden method field lets an HTML form represent PATCH or DELETE semantics even though browsers directly support only GET and POST form methods.",
      "The CSRF token connects the rendered form to the user's session and application origin checks. It protects against a different site causing an authenticated browser to submit an unwanted state-changing request. It does not validate prices, ownership, or any business field.",
      "Error rendering completes the feedback loop. The failed model keeps rejected values and its `errors` collection in memory. Rendering within the same request preserves that state; redirecting creates a new request and usually loses it unless the application serialises it separately.",
    ],
    visualType: "flow_diagram",
    visualTitle: "One form partial, two persistence paths",
    visual: fence("mermaid", [
      "flowchart TD",
      "  F[form_with model: article] --> P{article persisted?}",
      "  P -->|no| C[POST /articles -> create]",
      "  P -->|yes| U[PATCH /articles/:id -> update]",
      "  C --> V{valid?}",
      "  U --> V",
      "  V -->|no| R[render form with values and errors]",
      "  V -->|yes| D[redirect to saved article]",
    ]),
    codeTitle: "Share a model-backed form between new and edit",
    code: [
      "<!-- app/views/articles/_form.html.erb -->",
      "<%= form_with model: article do |form| %>",
      "  <% if article.errors.any? %>",
      "    <ul>",
      "      <% article.errors.full_messages.each do |message| %>",
      "        <li><%= message %></li>",
      "      <% end %>",
      "    </ul>",
      "  <% end %>",
      "",
      "  <%= form.label :title %>",
      "  <%= form.text_field :title %>",
      "  <%= form.submit %>",
      "<% end %>",
      "",
      "<!-- new.html.erb or edit.html.erb -->",
      "<%= render 'form', article: @article %>",
    ],
    followups: [
      "How does `form_with` choose POST or PATCH for a model?",
      "Why are CSRF tokens, strong parameters, and model validations separate protections?",
      "Why should an invalid form usually render instead of redirect?",
    ],
  },
  "partials-layouts": {
    answerSize: "standard",
    direct: "A Rails layout is the outer response template that wraps an action's view and inserts it at `<%= yield %>`. A partial is a reusable template fragment whose filename starts with `_`, such as `_product.html.erb`, and is rendered without that underscore. Layouts provide page-wide structure; partials compose smaller repeated pieces. Passing explicit locals gives a partial a clear input contract, and collection rendering can apply one partial efficiently to many records.",
    quick: [
      "A layout wraps the action template and places its output at `yield`.",
      "A partial filename starts with `_`, but the render call omits the underscore.",
      "Use layouts for page shells and partials for reusable view fragments.",
      "Pass locals to make a partial's required data explicit.",
      "`render @records` can render the conventional partial once per collection item.",
    ],
    interview: [
      "- Layouts and partials compose a Rails response at different scales. The layout is the outer document—often the HTML head, navigation, notices, and footer—and `<%= yield %>` marks where the selected action template is inserted.",
      "- A partial is a smaller template fragment. The file `_product.html.erb` can be rendered with `render 'product', product: @product`; Rails omits the underscore in the call and exposes the supplied value as the local variable `product` inside the partial.",
      "- For example, both `new.html.erb` and `edit.html.erb` can render `_form.html.erb` with their Article object. The application layout wraps either page, while the form partial owns only the repeated fields and validation display. Those boundaries prevent a full page shell or form markup from being copied.",
      "- Rails can render a whole collection with `render @products`, choosing each object's conventional partial and local name. Explicit locals are often clearer than relying on many controller instance variables because they show what the fragment needs and make it safer to reuse.",
      "- Extraction should follow a real repeated or independently meaningful fragment. Too many tiny partials scatter one simple page across files; one huge partial hides the page structure. Layouts establish the frame, action templates describe the page, and partials name coherent pieces within it. This layering also lets a reader find shared chrome, page intent, and record presentation without searching through one monolithic template.",
    ],
    deepTitle: "The final body is assembled from nested templates",
    deep: [
      "Rails first renders the chosen action template and its partial calls, then places that captured output into the layout's main yield location. Named `content_for` regions can supply additional values—such as a page title—to named yields in the same layout.",
      "Partial lookup follows path and format conventions. A render call in a products view may find `_product.html.erb` in the current directory, while `render 'shared/navigation'` names a fragment in another directory. The partial's leading underscore distinguishes it from a full action template on disk.",
      "Locals create a narrow data boundary. A partial receiving `product:` can be understood and tested without knowing which controller instance variables happen to exist. Collection rendering repeats that boundary for every object and can expose a counter when ordering information is needed.",
      "Composition affects performance as well as organisation. Rendering a partial does not preload its associations, so a collection fragment that reads an unloaded relationship may trigger one query per row. Data needed by the view should be loaded before rendering, and fragment caching can be considered only after the data boundary is correct.",
    ],
    visualType: "concept_map",
    visualTitle: "How a Rails HTML response is composed",
    visual: fence("mermaid", [
      "flowchart TD",
      "  L[application layout] --> H[shared head / navigation]",
      "  L --> Y[main yield]",
      "  Y --> A[action template: products/index]",
      "  A --> C[render products collection]",
      "  C --> P[_product partial for each product]",
      "  L --> F[shared footer]",
      "  A -. content_for title .-> N[named layout yield]",
    ]),
    codeTitle: "Layout frame, page template, and record partial",
    code: [
      "<!-- app/views/layouts/application.html.erb -->",
      "<html>",
      "  <head><title><%= content_for?(:title) ? yield(:title) : 'Shop' %></title></head>",
      "  <body><%= yield %></body>",
      "</html>",
      "",
      "<!-- app/views/products/index.html.erb -->",
      "<% content_for :title, 'Products' %>",
      "<h1>Products</h1>",
      "<%= render @products %>",
      "",
      "<!-- app/views/products/_product.html.erb -->",
      "<article id=\"<%= dom_id(product) %>\">",
      "  <h2><%= product.name %></h2>",
      "</article>",
    ],
    followups: [
      "How does an action template reach the layout's `yield`?",
      "Why are partial locals often clearer than instance variables?",
      "How can collection partials reveal an N+1 query problem?",
    ],
  },
};

for (const [directory, lesson] of Object.entries(lessons)) {
  const file = path.join(root, directory, "complete-qa.json");
  const document = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!Array.isArray(document.questions) || document.questions.length !== 1) {
    throw new Error(`${file}: expected one canonical question`);
  }
  const question = document.questions[0];
  question.direct_answer = lesson.direct;
  question.last_updated = "2026-09-07";
  question.reading_time_minutes = lesson.answerSize === "standard" ? 8 : 6;
  question.answer = {
    ...(question.answer ?? {}),
    sections: [
      {
        type: "key_points",
        title: "Quick Revision",
        content: lesson.quick.map((point) => `- ${point}`).join("\n"),
      },
      {
        type: "speakable_answer",
        title: "Interview Answer",
        answerSize: lesson.answerSize,
        content: lesson.interview.map((paragraph) => paragraph.replace(/^[-*+]\s+/, "")).join("\n\n"),
      },
      {
        type: "deep_explanation",
        title: lesson.deepTitle,
        content: lesson.deep.join("\n\n"),
      },
      {
        type: lesson.visualType,
        title: lesson.visualTitle,
        content: lesson.visual,
      },
      {
        type: "code_example",
        title: lesson.codeTitle,
        content: fence("erb", lesson.code),
      },
    ],
  };
  question.followup_questions = lesson.followups;
  fs.writeFileSync(file, `${JSON.stringify(document, null, 2)}\n`);
}

console.log(`Curated ${Object.keys(lessons).length} Rails view and form questions.`);
