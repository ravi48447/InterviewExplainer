#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const presentations = [
  {
    file: "content/ruby-backend-fresher/rails-forms-and-views/erb-basics/complete-qa.json",
    slug: "rails-erb-basics",
    question: "What is ERB and how do you write it in Rails views?",
    beats: [
      {
        cue: "Define ERB by the response it helps Rails build",
        stage: "ERB builds server HTML",
        spokenText: "ERB means Embedded Ruby. A Rails `.html.erb` file mixes ordinary HTML with small Ruby expressions while the server builds a response. Rails compiles the template and sends only the resulting HTML to the browser; the browser never receives the Ruby source.",
      },
      {
        cue: "Give each delimiter one clear job",
        stage: "Each tag has one job",
        spokenText: "Use `<% ... %>` for control flow or setup whose result should not be printed, `<%= ... %>` for a value that belongs in the response, and `<%# ... %>` for a template comment. Opening an `if` or `each` with a control tag and printing only the needed values keeps the output intentional.",
        support: {
          type: "comparison",
          title: "Choose the ERB tag by its effect on the response",
          items: [
            {
              label: "<% ... %>",
              value: "run Ruby, print nothing",
              detail: "Use it for if, each, assignment, and block boundaries.",
              tone: "blue",
            },
            {
              label: "<%= ... %>",
              value: "evaluate and insert",
              detail: "Use it for text, a helper result, or a rendered fragment.",
              tone: "green",
            },
            {
              label: "<%# ... %>",
              value: "template comment",
              detail: "ERB removes it while processing the template.",
              tone: "neutral",
            },
            {
              label: "raw / html_safe",
              value: "skip normal escaping",
              detail: "Reserve these escape hatches for content already made safe.",
              tone: "orange",
            },
          ],
        },
      },
      {
        cue: "Use one small template to connect control tags and output tags",
        stage: "Control and output can meet",
        spokenText: "A list view can open a loop with `<% products.each do |product| %>` and place `<%= product.name %>` inside each list item. The control tag decides how many fragments are built; the output tag supplies the visible value. Calling `puts` inside the template does not insert that value into the HTML response.",
        support: {
          type: "code",
          title: "Render product names with the correct tag for each job",
          language: "erb",
          code: "<h1>Products</h1>\n\n<% if products.empty? %>\n  <p>No products yet.</p>\n<% else %>\n  <ul>\n    <% products.each do |product| %>\n      <li><%= product.name %></li>\n    <% end %>\n  </ul>\n<% end %>\n\n<%# This comment is not part of the response. %>",
          caption: "The example is executable ERB: control tags shape the list, output tags add names, and the comment disappears.",
        },
      },
      {
        cue: "Finish with Rails' output-safety boundary and view responsibility",
        stage: "Escaping guards text output",
        spokenText: "Rails HTML-escapes ordinary unsafe strings placed through an output tag, so a product name containing markup is shown as text. `raw` and `.html_safe` bypass that protection and must not be applied casually to user input. ERB should describe presentation and call view helpers; data loading and business rules belong outside the template.",
        recallRule: "Control tags shape the template, output tags add values, and Rails keeps ordinary text escaped unless code explicitly bypasses it.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/rails-forms-and-views/form-with/complete-qa.json",
    slug: "rails-form-with-basics",
    question: "How do you build forms in Rails with form_with?",
    beats: [
      {
        cue: "Start from the helper and the model information it can infer",
        stage: "The record supplies context",
        spokenText: "`form_with` is Rails' main form builder for model-backed and standalone forms. With `<%= form_with model: @article do |form| %>`, Rails uses the record's model name and persistence state to choose parameter names, a destination, and create-versus-update behaviour. Passing an explicit `url` and optional `scope` handles forms that are not tied to one record.",
      },
      {
        cue: "Trace one partial through new and persisted record states",
        stage: "State selects the request",
        spokenText: "A new Article normally submits to the collection create route with `POST`. The same form given a persisted Article targets that member's update route and represents `PATCH`, using Rails' hidden method field where the browser needs it. This is why one `_form.html.erb` partial can serve both new and edit pages.",
        support: {
          type: "trace",
          title: "One model-backed form follows two record states",
          items: [
            {
              label: "Article.new",
              value: "POST /articles",
              detail: "The collection request reaches create with article-scoped fields.",
              tone: "blue",
            },
            {
              label: "Persisted article",
              value: "PATCH /articles/:id",
              detail: "The same partial targets update for that record.",
              tone: "green",
            },
            {
              label: "Invalid model",
              value: "render the form again",
              detail: "Keep the submitted values and errors on the same object.",
              tone: "orange",
            },
            {
              label: "Saved model",
              value: "redirect to a stable page",
              detail: "A refresh no longer repeats the write request.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Connect builder calls to labels controls and submitted params",
        stage: "The builder connects fields",
        spokenText: "The yielded builder creates related controls such as `form.label :title`, `form.text_field :title`, and `form.submit`. Model-backed fields use names such as `article[title]`, and the object supplies current values and validation errors. The form partial should display useful messages from `article.errors` when a save fails.",
        support: {
          type: "code",
          title: "A small model-backed article form",
          language: "erb",
          code: "<%= form_with model: article do |form| %>\n  <%= form.label :title %>\n  <%= form.text_field :title %>\n  <%= form.submit %>\n<% end %>",
          caption: "The record drives form identity while the builder keeps the label, input, and submitted attribute connected.",
        },
      },
      {
        cue: "Separate form generation from server-side trust and persistence handling",
        stage: "Server checks stay separate",
        spokenText: "Rails adds an authenticity token to applicable non-GET forms for CSRF protection, but that does not make submitted attributes valid or permitted. The controller still filters the accepted shape and the model still validates domain rules. Render an invalid object with a failure status so its values and errors remain; redirect after a successful write.",
        recallRule: "form_with builds the browser contract; Strong Parameters, authorization, and model validation still protect the server-side change.",
      },
    ],
  },
  {
    file: "content/ruby-backend-fresher/rails-forms-and-views/partials-layouts/complete-qa.json",
    slug: "rails-partials-and-layouts-basics",
    question: "How do partials and layouts work in Rails views?",
    beats: [
      {
        cue: "Define the two template layers by the amount of response they own",
        stage: "The layout frames a page",
        spokenText: "A Rails layout is the outer response template: it usually owns the document shell, shared navigation, notices, and footer. Its `<%= yield %>` marks where Rails inserts the selected action template. A partial is a smaller reusable fragment inside that page rather than a second full document.",
      },
      {
        cue: "Trace the response from the layout to an action and its fragments",
        stage: "Partials fill smaller regions",
        spokenText: "Rails first renders the action's view content, including any partial calls, and places that result at the layout's yield point. A file named `_product.html.erb` is rendered without the underscore, for example `render \"product\", product: @product`. New and edit pages can similarly share one form partial while keeping their page headings separate.",
        support: {
          type: "trace",
          title: "A Rails HTML response is assembled from outside to inside",
          items: [
            {
              label: "Layout",
              value: "application.html.erb",
              detail: "Provides the shared document frame and a yield point.",
              tone: "blue",
            },
            {
              label: "Action template",
              value: "products/index.html.erb",
              detail: "Supplies the page-specific heading and composition.",
              tone: "green",
            },
            {
              label: "Partial",
              value: "products/_product.html.erb",
              detail: "Renders one independently meaningful product fragment.",
              tone: "orange",
            },
            {
              label: "Response",
              value: "one completed HTML document",
              detail: "The browser receives rendered HTML, not the template files.",
              tone: "neutral",
            },
          ],
        },
      },
      {
        cue: "Show how conventional collection rendering supplies a local",
        stage: "Locals make needs explicit",
        spokenText: "Explicit locals show what a partial needs and avoid a hidden dependence on many controller instance variables. `render \"product\", product: @product` supplies a local named `product`. With `render @products`, Rails chooses the conventional product partial for each record and supplies that same local automatically.",
        support: {
          type: "code",
          title: "The product partial used by collection rendering",
          language: "erb",
          code: "<article id=\"<%= dom_id(product) %>\">\n  <h2><%= product.name %></h2>\n</article>",
          caption: "render @products can apply this fragment to every Product and provide each record as the product local.",
        },
      },
      {
        cue: "Close with a practical boundary for useful extraction",
        stage: "Reuse should clarify structure",
        spokenText: "Extract a partial for markup that repeats or represents a meaningful unit such as a card, form, or navigation section. Splitting every few lines into a file makes the response harder to follow. Partials also do not solve database access: load associations before rendering so a collection partial does not hide an N+1 query.",
        recallRule: "The layout owns the page frame, the action owns the page, and partials own clear reusable fragments with explicit inputs.",
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
