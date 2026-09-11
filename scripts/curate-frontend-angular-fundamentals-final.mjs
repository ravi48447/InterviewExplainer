#!/usr/bin/env node
/**
 * curate-frontend-angular-fundamentals-final.mjs — apply the final pattern
 * to the 6 remaining angular-fundamentals-fresher topics.
 */

import { applyTopic } from "./curate-frontend-final-pattern.mjs";

let total = 0;

total += applyTopic({
  moduleSlug: "angular-fundamentals-fresher",
  topicSlug: "angular-architecture-overview",
  topicTitle: "Angular Architecture Overview",
  anchors: [
    {
      slug: "angular-fundamentals-fresher-angular-architecture-overview-angular-architecture",
      slugName: "Angular architecture",
      question: "How is an Angular application structured — modules, components, and the bootstrap flow?",
      title: "Angular Architecture",
      direct:
        "An Angular app is a tree of components starting at a root component (App), each component = a TypeScript class + template + styles wired by a decorator. Since Angular 14+, standalone components are the default architecture: no NgModules — you import directives/pipes directly into the component's imports array, and main.ts bootstraps the root with bootstrapApplication(App). Change detection walks the component tree from root on each async event (click, HTTP, timer), re-checking every template binding. Dependency injection provides services (singletons by default at root) through constructor injection or the inject() function.",
      summary:
        "Angular apps are component trees bootstrapped from a root standalone component, with template bindings re-checked by change detection on every async event, and services provided by hierarchical dependency injection.",
      mistake:
        "Confusing NgModule-era architecture with modern standalone apps, and assuming Angular re-renders everything on any change — change detection is per-binding and tree-walked.",
      profile: "mechanism",
      stage: "framework",
      priority: "must-prepare",
      language: "ts",
      speakable:
        "The structure, verified (modern standalone Angular):\n\n```ts\n// main.ts — the bootstrap entry\nimport { bootstrapApplication } from '@angular/platform-browser';\nimport { App } from './app';\n\nbootstrapApplication(App, {\n  providers: [provideRouter(routes), provideHttpClient()],\n});\n\n// app.ts — the root component (class + template + decorator)\n@Component({\n  selector: 'app-root',\n  standalone: true,                  // no NgModule needed\n  imports: [CommonModule, RouterOutlet],  // directives/pipes used in the template\n  template: `<router-outlet />`,\n})\nexport class App {}\n```\n\nThe three architecture pieces (the interview core):\n1. COMPONENT TREE — every screen is components nested to the root. Each component owns a template whose bindings ({{ title }}, [value], (click)) tie class state to the DOM. Data flows DOWN via inputs (@Input), events flow UP via outputs (@Output EventEmitter).\n2. CHANGE DETECTION — on every async event (click, HTTP response, setTimeout), Angular walks the tree from root, re-evaluating each template binding and patching the DOM where a value changed. Zone.js triggers the walk; OnPush components are skipped unless their inputs change or they explicitly markForCheck().\n3. DEPENDENCY INJECTION — services are classes provided at a scope: providedIn: 'root' = one app-wide singleton; component providers = one per component instance. Components receive them via constructor injection (private http: HttpClient) or the inject() function.\n\nThe modern-vs-legacy note (worth saying unprompted): NgModules are the LEGACY bundling mechanism (pre-v14) — imports, declarations, and bootstrap all lived in @NgModule. Standalone components replaced it: the component itself declares its imports, and main.ts bootstraps directly. New code should be standalone; you'll still see NgModule in older codebases.",
      flow:
        "flowchart TD\n    M[main.ts bootstrapApplication] --> R[Root component App]\n    R --> C1[feature components]\n    C1 --> C2[nested components]\n    EV[async event: click HTTP timer] --> CD[change detection walks tree from root]\n    CD --> B[re-check each template binding]\n    B --> DOM[patch DOM where values changed]\n    SVC[root-provided services] -.injected into.-> C1\n    IN[input down: parent to child]  OUT[event up: child to parent]",
      deep:
        "Why change detection is the architecture's heartbeat (the mechanism interviewers probe): Angular's default strategy re-checks EVERY binding in EVERY component on EVERY async event — Zone.js monkey-patches async APIs (setTimeout, addEventListener, XHR) to know when to run the walk. The cost model: a large app does redundant checks, which is why OnPush exists — a component with OnPush is skipped entirely unless (a) an @Input reference changes (Object.is), (b) an event handler inside its template fires, (c) it calls markForCheck() or detectChanges(), or (d) an async pipe it uses emits. Immutable data + OnPush is the standard performance pattern — same philosophy as React's memo + new-references.\n\nThe DI hierarchy (the senior detail): the injector tree mirrors the component tree. A service provided at root lives in the root injector (singleton). The same service provided in a component's providers array creates a NEW instance for that component and its children — child injectors look up their chain, nearest provider wins. This is how you get per-feature singletons or per-dialog state. inject() vs constructor: inject() is the modern token-fetch (works in field initializers, shorter with TS), constructor params are the classic form — both resolve from the same injector chain, and inject() ONLY works inside an injection context (construction time, not later in a method or callback).\n\nThe signals transition (the 2024+ direction worth naming): Angular is adding signals (signal(), computed(), effect()) as reactive primitives — a component using signals re-renders surgically (only the bindings reading the changed signal), and signal-based inputs are replacing @Input for fine-grained updates. The honest framing: Zone-based CD is the mature default; signals are the future default — knowing both signals the depth.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "angular-fundamentals-fresher",
  topicSlug: "components-and-templates",
  topicTitle: "Components And Templates",
  anchors: [
    {
      slug: "angular-fundamentals-fresher-components-and-templates-bindings",
      slugName: "Angular bindings and component I/O",
      question: "How do Angular components bind data — interpolation, property/event/two-way binding, and @Input/@Output?",
      title: "Angular Bindings",
      direct:
        "Four binding forms connect class state to the DOM: interpolation {{ text }} (class→DOM text), property binding [src]=\"url\" (class→DOM property), event binding (click)=\"save()\" (DOM→class method), and two-way [(ngModel)]=\"name\" (both — banana-in-a-box syntax, event binding + property binding combined). Component communication: parent→child via @Input() (parent sets a property binding on the child tag), child→parent via @Output() + EventEmitter (child emits, parent listens with an event binding). Templates can reference class members directly — Angular compiles the template into binding instructions that change detection re-evaluates per event cycle.",
      summary:
        "The four binding kinds (interpolation, [property], (event), [(two-way)]) plus @Input down and @Output up — the complete data-flow vocabulary of an Angular app.",
      mistake:
        "Binding to attribute names instead of DOM properties ([class] vs [attr.class] confusion), and mutating an @Input object expecting the parent's OnPush to notice — reference change or markForCheck, not mutation.",
      profile: "mechanism",
      stage: "framework",
      priority: "must-prepare",
      language: "ts",
      speakable:
        "The full binding vocabulary, verified:\n\n```ts\n@Component({\n  selector: 'app-child',\n  template: `\n    {{ title }}                          <!-- 1. interpolation: class → DOM text -->\n    <img [src]=\"avatarUrl\" [alt]=\"title\">  <!-- 2. property: class → DOM property -->\n    <button (click)=\"save()\">Save</button> <!-- 3. event: DOM → class method -->\n    <input [(ngModel)]=\"name\">            <!-- 4. two-way: banana-in-a-box -->\n  `,\n})\nexport class Child {\n  @Input() title = '';                   // parent → child: property binding on the tag\n  @Output() saved = new EventEmitter<string>(); // child → parent: event binding on the tag\n  save() { this.saved.emit('done'); }    // parent receives via (saved)=\"onSaved($event)\"\n}\n```\n\nThe mental model (the interview core): data flows ONE WAY by default — down through @Input, up through @Output events. Two-way [(ngModel)] is sugar over both: [ngModel]=\"name\" sets, (ngModelChange)=\"name = $event\" updates — the box-in-bananas order [( )] is literally [ ] inside ( ), which is exactly what it desugars to.\n\nThe three traps worth naming:\n1. PROPERTY vs ATTRIBUTE — [src] binds the DOM PROPERTY (current value, updates live); [attr.src] writes the HTML attribute (static, string-only). Properties are what you want 95% of the time; attributes matter for ARIA and SVG where no property exists.\n2. INPUT MUTATION — a child mutating an @Input object changes the object the PARENT also holds. With OnPush parents, mutation isn't detected (Object.is sees the same reference). The fix: children treat inputs as read-only; parents pass new references.\n3. TEMPLATE REFERENCE — #var on an element hands the template the DOM node (or directive instance like #f=\"ngForm\`) — the bridge for reading form state without a round-trip through the class.",
      flow:
        "flowchart LR\n    I[interpolation: text] --> DOM\n    P['[property]: class state to DOM'] --> DOM\n    DOM --> E['(event): DOM to class method']\n    DOM --> TW['[(ngModel)]: both — desugars to [x] + (xChange)']\n    TW --> C[class state]\n    PAR[parent] -->|@Input property binding| CHI[child]\n    CHI -->|@Output EventEmitter| PAR\n    MUT[mutating an @Input object] -->|same reference — OnPush parent skips| MISS[change not detected]",
      deep:
        "How the template compiler treats each binding (the mechanism under the syntax): Angular compiles templates into render functions — each binding becomes an instruction like elementProperty() or listener() with a change-detector function that reads the class state. During change detection, the generated code compares each binding's last value with the fresh read; changed values go to the DOM via a diffing property writer. That's why bindings can be any expression (method calls work but re-run every cycle — keep them cheap or memoize), and why 'pure' pipes exist: a pure pipe skips execution when its inputs haven't changed (Object.is on all args).\n\nThe @Input/@Output contract in depth (senior details): inputs are inputs-only by Angular's style convention — a component should never write to its own @Input (use a setter if you need derived reactions, and never reassign the reference). Outputs: EventEmitter is observables under the hood; emit() nexts the value; parents subscribe via the event binding and MUST keep the $event parameter pattern for typing. Aliasing (@Input('alias') value) renames the public API without breaking the class — useful when wrapping third-party components. The new signal-based replacements: input() and output() functions (const title = input('')) give the same contract with lazy fine-grained reactivity — inputs become signals you read in computed()/effects.\n\nThe parent-child communication ladder (when one input/output isn't enough): (1) input/output for direct parent-child, (2) viewChild/viewChildren for a parent to reach into its OWN template's child instances (query by class or template ref), (3) a shared service class for unrelated components — one holds state, both inject it, (4) signals in a service for the modern form of (3). Route data and RxJS flows are the cross-feature versions. Interview answer shape: 'parent-to-child input, child-to-parent output, anything else through a shared service or state signal — never reach around the tree.'",
    },
  ],
});

total += applyTopic({
  moduleSlug: "angular-fundamentals-fresher",
  topicSlug: "directives-basics",
  topicTitle: "Directives Basics",
  anchors: [
    {
      slug: "angular-fundamentals-fresher-directives-basics-directives",
      slugName: "Angular directives",
      question: "What are Angular's three directive kinds — and how does @if/@for/@switch work in modern templates?",
      title: "Angular Directives",
      direct:
        "Directives are classes that attach behavior to DOM elements — three kinds: COMPONENTS (directives with a template), STRUCTURAL directives (add/remove DOM: modern @if/@for/@switch control-flow syntax, or legacy *ngIf/*ngFor which desugar to ng-template), and ATTRIBUTE directives (change appearance/behavior in place: ngClass, ngStyle, or custom highlightDirective). Modern Angular (v17+) replaces the asterisk forms with native control flow: @if (cond) { } @else { }, @for (item of items; track item.id) { }, @switch (x) { @case (…) }. track is REQUIRED in @for — the keying that makes DOM reuse and reordering efficient. Custom attribute directives use @Directive with an element/attribute selector and ElementRef/Renderer2 to alter the host.",
      summary:
        "Three directive families: components, structural (@if/@for/@switch adding/removing DOM, with mandatory track), and attribute (in-place behavior like ngClass or custom directives).",
      mistake:
        "Forgetting track in @for (identity-keying the loop), mutating array items expecting @for to reorder (it can't — identity doesn't change), and writing a structural directive when a computed value + @if was simpler.",
      profile: "mechanism",
      stage: "framework",
      priority: "must-prepare",
      language: "ts",
      speakable:
        "The three kinds with modern syntax, verified:\n\n```ts\n// 1. COMPONENT — a directive WITH a template (the most common kind)\n@Component({ /* selector + template */ })\nexport class Card {}\n\n// 2. STRUCTURAL — add/remove DOM. Modern control flow:\ntemplate: `\n  @if (user.isAdmin) {\n    <admin-panel />\n  } @else {\n    <user-panel />\n  }\n\n  @for (item of items; track item.id) {   // track is REQUIRED\n    <item-row [item]=\"item\" />\n  } @empty {\n    <p>No items.</p>\n  }\n\n  @switch (role) {\n    @case ('admin') { <admin-tools /> }\n    @case ('editor') { <edit-tools /> }\n    @default { <p>Read only.</p> }\n  }\n`\n\n// 3. ATTRIBUTE — change an existing element in place\n@Directive({ selector: '[appHighlight]' })\nexport class Highlight {\n  constructor(el: ElementRef, renderer: Renderer2) {\n    renderer.setStyle(el.nativeElement, 'background', 'yellow');\n  }\n}\n```\n\nThe structural story (the interview core): @if/@for/@switch are the NATIVE template syntax (v17+); the legacy forms *ngIf/*ngFor are directives whose * desugars to wrapping the host in an <ng-template> and rendering the embedded view when the condition holds — the embedded view carries its own change detector and context (let item, let i = index). The modern @forms compile to the same machinery but are built into the compiler: no import, better type-checking, and @for's mandatory track makes the classic ngFor trackBy performance fix the default rather than opt-in.\n\nWhy track matters (the depth point): @for reuses DOM nodes by identity key — track item.id keeps node X bound to item X across reorders (animations, focus, and scroll survive). Without a stable key (or with track by index), items shifting cause node churn — same class of bug as React keys. Track by a stable unique id, never by array index when the list can reorder.",
      flow:
        "flowchart TD\n    D[Directive] --> C[component: has template]\n    D --> S[structural: add/remove DOM]\n    D --> A[attribute: in-place change]\n    S --> IF['@if/@else']\n    S --> FOR['@for + track (required)']\n    S --> SW['@switch/@case/@default']\n    LEGACY['*ngIf/*ngFor desugar to ng-template'] -.replaced by.-> S\n    A --> NG[ngClass ngStyle]\n    A --> CU['custom: @Directive + ElementRef/Renderer2']\n    TRK[track item.id] --> REUSE[DOM node reuse across reorder — like React keys]",
      deep:
        "The structural-directive internals (how @if and *ngIf actually work): a structural directive receives a TemplateRef (the wrapped content) and a ViewContainerRef (where to insert views). *ngIf is literally NgIf seeing the boolean, then createEmbeddedView(template) when true / clear() when false — the embedded view is a live, change-detected instance, which is why content inside @if keeps bindings that update even though the outer host doesn't change. Writing your OWN structural directive is the same two-injector recipe: @Directive({ selector: '[appUnless]' }) with set appUnless(false) → viewContainer.createEmbeddedView(this.tpl) — the one case where the asterisk is still written by hand.\n\nAttribute directive depth (the good-practice layer): use Renderer2 (or @HostBinding/@HostListener) rather than touching ElementRef.nativeElement directly — nativeElement breaks on server-side rendering (Angular Universal) and workers, where the DOM doesn't exist. Inputs into a directive make it configurable ([appHighlight]=\"color\"), and @HostListener('mouseenter') is the declarative event hook. Directives can also inject the host component — the pattern behind form-control-hint directives that read the state of a sibling directive without any wiring from the template author.\n\nControl-flow comparisons interviewers want (the honest summary): @if beats *ngIf on typing and no-imports; @for beats *ngFor on FORCING the performance fix (track) and lazy evaluation of the loop body per item; @switch beats nested ternaries for readability (it compiles to a chain of @ifs — no jump table, it's sugar not a performance feature). The @empty block is @for's often-missed sibling — the zero-state case that used to require a separate *ngIf=\"items.length === 0\".",
    },
  ],
});

total += applyTopic({
  moduleSlug: "angular-fundamentals-fresher",
  topicSlug: "forms-template-driven",
  topicTitle: "Forms Template Driven",
  anchors: [
    {
      slug: "angular-fundamentals-fresher-forms-template-driven-td-forms",
      slugName: "template-driven Angular forms",
      question: "How do template-driven forms work — NgForm, ngModel registration, validation, and when to use them?",
      title: "Template Driven Forms",
      direct:
        "Template-driven forms (TDF) put the form model in the TEMPLATE: FormsModule + ngModel on each field, and Angular assembles an NgForm/FormControl model by directive order — you rarely touch the class. Registration: <form #f=\"ngForm\"> exposes the form model to the template; [(ngModel)] binds data two-way; name=\"x\" is REQUIRED for ngModel to self-register into the form. Validation: built-in attributes (required, minlength, email, pattern) become validator functions on the control; state is readable as touched/dirty/invalid on the control (f.form.controls.email.invalid) and as form-level (f.invalid). Use TDF for simple forms — reactive forms (explicit FormBuilder model in the class) win for dynamic fields, complex validation, and unit-testability without the DOM.",
      summary:
        "TDF = the template IS the form model: ngModel + name registers fields into NgForm, HTML validation attributes map to validators, and state flows through #f=\"ngForm\" — best for simple forms.",
      mistake:
        "Forgetting the name attribute (field silently doesn't register), checking pristine/touched state wrong, and building a complex dynamic form with TDF when reactive forms are the tool.",
      profile: "implementation",
      stage: "framework",
      priority: "must-prepare",
      language: "ts",
      speakable:
        "A working TDF with validation, verified:\n\n```html\n<form #f=\"ngForm\" (ngSubmit)=\"save(f)\">\n  <!-- name is MANDATORY: it's how ngModel registers into NgForm -->\n  <input name=\"email\" [(ngModel)]=\"model.email\" required email\n         #email=\"ngModel\" />\n  @if (email.invalid && email.touched) {\n    <p class=\"error\">\n      @if (email.errors?.['required']) { Email is required. }\n      @else if (email.errors?.['email']) { Enter a valid email. }\n    </p>\n  }\n\n  <input name=\"qty\" [(ngModel)]=\"model.qty\" required min=\"1\" max=\"9\"\n         #qty=\"ngModel\" />\n\n  <button [disabled]=\"f.invalid\">Submit</button>\n</form>\n```\n\nHow the model gets built (the interview core): unlike reactive forms where YOU build FormGroup/FormControl in the class, TDF builds the model from the template at directive-initialization time — each ngModel with a name registers a FormControl into the parent NgForm's FormGroup, in DOM order. #f=\"ngForm\" exports that auto-assembled model so the template can read it (f.invalid, f.value) and ngSubmit fires only on a valid submit by convention (you check f.invalid in the handler or guard with [disabled]).\n\nThe validation mapping: HTML attributes (required, minlength, email, pattern) are INTERCEPTED by Angular's directives and compiled into validator functions on the control — the DOM attribute is the authoring surface, but the runtime is the same Validators.required pipeline as reactive forms. State classes (ng-invalid/ng-touched) land on the element for CSS styling, and the errors object (control.errors) carries structured error keys you test in the template — same object as the reactive form.\n\nThe decision rule (say it unprompted): TDF for small, static, template-shaped forms — quick, readable, minimal code. Reactive forms for anything dynamic (fields added/removed at runtime), with cross-field validation, or needing to be unit-tested without rendering a template — the model exists in the class, so you test the model. Both run on the same underlying FormControl machinery; the difference is who declares it and where it lives.",
      flow:
        "flowchart TD\n    F['FormsModule + <form #f=ngForm>'] --> M['ngModel per field + name attr']\n    M --> REG[auto-register FormControl into NgForm in DOM order]\n    REG --> V[validators from HTML attrs: required email min pattern]\n    V --> ST[state: pristine dirty touched invalid + ng-* classes]\n    ST --> UI[template shows errors when touched + invalid]\n    SUB[(ngSubmit)] --> H[handler receives f — guard on f.invalid]\n    SIMPLE[simple static form] --> TDF[use TDF]\n    DYN[dynamic fields cross-field validation testable model] --> RF[use reactive forms]",
      deep:
        "The two-way binding + registration split (the mechanism people miss): [(ngModel)] without a name does two-way binding only — the field is NOT part of the form model and f.value won't include it. With name, ngModel BOTH binds the data and registers the control. standalone: true inside an ngForm boundary is the escape hatch for a field that binds but doesn't belong to the form. The #email=\"ngModel\" export gives the template the field's own FormControl — the per-field state (touched, dirty, errors) the error UI reads; without it you navigate f.form.controls['email'] which is untyped and clunky in templates.\n\nngSubmit vs form submit (the subtle contract): ngSubmit is Angular's own event that fires on submit AFTER ngNoForm/FORM_DIRECTIVES handling — and critically, TDF does NOT preventDefault for you in the old template binding form; the (ngSubmit) binding via NgForm DOES prevent the native submission, so the page-doesn't-reload guarantee comes from using NgForm's event, not from the browser. A disabled submit button ([disabled]=\"f.invalid\") is UX guidance, not a guarantee — always re-validate in the handler or server, since touched-state means users can still submit invalid forms via Enter key in some browsers.\n\nThe migration story (worth one line in any answer): form control value accessors (the bridge directives for non-input elements — select, custom components implementing ControlValueAccessor) work identically in both TDF and reactive forms — they're the CVA contract, the third layer below the two form styles. A custom form control (a rating widget, a masked input) implements ControlValueAccessor once and works in ngModel templates AND FormControl bindings; that's the layer interviewers drill when they ask 'how would you make our design-system input work with Angular forms.'",
    },
  ],
});

total += applyTopic({
  moduleSlug: "angular-fundamentals-fresher",
  topicSlug: "services-and-di-basics",
  topicTitle: "Services And Di Basics",
  anchors: [
    {
      slug: "angular-fundamentals-fresher-services-and-di-basics-di",
      slugName: "Angular services and DI",
      question: "How do Angular services and dependency injection work — providers, injectors, and inject()?",
      title: "Services And DI",
      direct:
        "A service is a plain class decorated @Injectable() that holds logic/state; DI delivers instances to components without them constructing anything. The provider registry decides instance identity: providedIn: 'root' = one app-wide singleton (the default and best choice); providers: [Service] on a component = a fresh instance for that subtree. The injector tree mirrors the component tree — child injectors look up by token, nearest provider wins, so a component-level provider SHADOWS the root one. Two injection forms: constructor injection (constructor(private http: HttpClient)) and the modern inject() function (private http = inject(HttpClient)) which works in field initializers and must run inside an injection context (construction time). providedIn: 'root' services are also tree-shakable — unused ones drop from the bundle.",
      summary:
        "Services are injected classes; provider scope (root vs component) decides singleton vs per-subtree identity via the injector tree, and inject() is the modern retrieval form.",
      mistake:
        "Providing a service in BOTH root and a component and being surprised the subtree gets the shadow instance; and calling inject() outside construction (a callback/setTimeout) where no injection context exists.",
      profile: "mechanism",
      stage: "framework",
      priority: "must-prepare",
      language: "ts",
      speakable:
        "The full DI picture, verified:\n\n```ts\n@Injectable({ providedIn: 'root' })   // ONE app-wide instance, tree-shakable\nexport class CartService {\n  private items: Item[] = [];\n  add(item: Item) { this.items.push(item); }\n  get count() { return this.items.length; }\n}\n\n@Component({ /* ... */ })\nexport class Checkout {\n  // modern form: field initializer, shorter with TS\n  private cart = inject(CartService);\n  // classic form: constructor parameter\n  constructor(private notifier: NotifierService) {}\n}\n\n// component-scoped: every Checkout gets its OWN CartService\n@Component({\n  providers: [CartService],   // shadows root for this subtree only\n})\nexport class Checkout {}\n```\n\nThe injector tree (the interview core): there is an injector per component level, rooted at the platform injector. When Checkout asks for CartService, Angular walks UP from the component's injector — if a provider exists at the component level, that instance wins (shadowing root); otherwise it reaches the root injector's provider. That's the whole scope model: 'root' = everyone shares one; component providers = that subtree shares one (and its children see the NEAREST one up their chain).\n\nWhy services at all (the design answer): components are UI-shaped and short-lived; services hold reusable logic and shared state so components stay thin. A cart in a component's field dies with the component — in a root service it survives navigation. The testability bonus: DI means every service arrives through the constructor, so a test provides a fake (TestBed.provide(HttpClient, useValue: fakeHttp)) instead of hitting a network — DI is what makes Angular components testable at all.\n\nWhen to scope a service to a component (the judgment layer): per-feature state — a dialog stack owned by one route, an editor session that must reset on close. Everything shared/stateless (API clients, stores, auth) goes to root. A smell worth naming: providing at a component purely to avoid import cycles is a misuse — fix the cycle, not the scope.",
      flow:
        "flowchart TD\n    S['@Injectable() service class'] --> PRV[provider registration]\n    PRV --> R['providedIn: root — one app singleton']\n    PRV --> C['component providers — one per subtree']\n    R --> TS[tree-shakable: unused = dropped from bundle]\n    INJ[injector tree mirrors component tree] --> L[lookup by token, nearest provider wins]\n    L --> SHADOW[component provider shadows root for its subtree]\n    INJCT['inject(Token) — modern, field initializer'] -.needs.-> CTX[injection context: construction time only]\n    TR['constructor(private s: Service) — classic'] --> SAME[same injector chain]\n    TST[tests provide fakes] --> TEST[why DI = testability]",
      deep:
        "The injection-context rule (the inject() gotcha interviewers now ask): inject() must run while an injection context is active — that means during class construction (field initializers and constructor body). Calling it inside a setTimeout, an event callback, or a method invoked later throws the NG0203 runtime error ('inject() must be called from an injection context'). The escapes: capture the service in a field first (private cart = inject(CartService); then use this.cart everywhere), or use Injector.runWithinInjectionContext for late needs. The reverse trap with constructor injection: parameter properties are sugar, but DI resolves by TYPE TOKEN at design time — the decorator metadata carries the tokens, which is why emitDecoratorMetadata and TS strict settings interplay here.\n\nThe token model (the layer beneath classes): DI keys are InjectionTokens, not classes per se — a class provider uses the class AS the token ({ provide: CartService, useClass: CartService }). The other provider recipes cover the remaining cases: useValue (a config object or mock: { provide: API_URL, useValue: '...' } — needs an InjectionToken<string> since a primitive can't key), useFactory (compose: create the service with dependencies chosen at runtime, deps: [Auth]), useExisting (alias one token to another — the redirect pattern). Tree-shaking only works for providedIn root because the decorator is statically analyzable; providers arrays in components are always reachable by construction and never shake.\n\nThe modern state direction (name it and the answer reads current): where teams used BehaviorSubject services for shared state, signals in services (signal(), computed()) are the 2024+ pattern — a CartService exposing readonly count = computed(() => this.items().length) gives components fine-grained reactivity without RxJS subscription management, and provideState/injection functions compose it with DI. RxJS still owns async flows (HTTP, timers, events); signals own synchronous derived state. 'Services hold state, DI wires them, signals make them reactive' is the accurate one-line architecture.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "angular-fundamentals-fresher",
  topicSlug: "scenario-based",
  topicTitle: "Angular Scenario Based",
  anchors: [
    {
      slug: "angular-fundamentals-fresher-scenario-based-scenario",
      slugName: "Angular debugging scenarios",
      question: "Angular view shows stale data, a @for list misbehaves, or a component leaks subscriptions — what's the fix?",
      title: "Angular Scenarios",
      direct:
        "The three classic Angular failure scenarios: (1) STALE DATA after mutation — with OnPush, mutating an object/array field keeps the same reference, so change detection skips the update; fix by replacing the reference (this.items = [...this.items, item]) or calling markForCheck() when mutation is unavoidable. (2) @for LIST MISBEHAVES on reorder — track keyed by index or a changing id causes node churn; track by a STABLE unique id so DOM nodes follow their items. (3) SUBSCRIPTION LEAKS — an interval or HTTP subscription in ngOnInit keeps running after the component is destroyed; fix with takeUntilDestroyed() (the modern one-liner), or the TakeUntil destroy$ pattern, or manual unsubscribe in ngOnDestroy; async pipe in templates unsubscribes automatically.",
      summary:
        "OnPush staleness → replace references; @for churn → stable track keys; subscription leaks → takeUntilDestroyed/async pipe.",
      mistake:
        "Mutating arrays under OnPush and 'randomly' calling detectChanges everywhere instead of fixing the data flow; and forgetting track stability when the API re-creates ids.",
      profile: "debugging",
      stage: "practical",
      priority: "must-prepare",
      language: "ts",
      speakable:
        "Each scenario with its verified fix:\n\n```ts\n// 1. STALE DATA — OnPush + mutation = skipped render\n@Component({ changeDetection: ChangeDetectionStrategy.OnPush })\nexport class Cart {\n  items: Item[] = [];\n\n  addBad(item: Item)  { this.items.push(item); }      // WRONG: same reference → CD skips\n  addGood(item: Item) { this.items = [...this.items, item]; } // RIGHT: new reference\n}\n\n// 2. @for REORDER — track by stable id, never index\n@for (item of items; track item.id) { ... }   // node follows item across reorder\n@for (item of items; track $index) { ... }     // reorder = node churn (focus lost)\n\n// 3. SUBSCRIPTION LEAK — the modern one-liner\nexport class Feed implements OnInit {\n  private destroy = injectDestroyRef; // DestroyRef\n  ngOnInit() {\n    this.http.get('/feed').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(...);\n    // or simpler — inside injection context, no arg needed:\n    interval(1000).pipe(takeUntilDestroyed()).subscribe(tick => this.now = tick);\n  }\n}\n```\n\nThe reasoning per scenario (the interview structure):\n1. OnPush means the component renders only when an @Input reference changes, a template event fires inside it, or markForCheck() runs. Mutation keeps the reference — Object.is still equal — so the binding is never re-checked. Immutable updates (new array/object) flip the reference and the render happens. markForCheck() is the honest escape when the mutation is genuinely the right model (third-party canvas libs, state machines) — but sprinkle it last, not first.\n2. track is @for's identity contract. A stable unique id means: item moves up → its DOM node MOVES (focus, animations, scroll position preserved). Index keying means: item removed at 0 → every node shifts its data — visually 'works' but focus is lost, animations misfire, and inputs inside rows show the wrong item's value during the update frame.\n3. Subscriptions outlive components unless closed. takeUntilDestroyed() both closes and expresses intent in one operator; the async pipe in templates ({{ feed$ | async }}) manages the whole lifecycle in the binding itself — subscribe-on-check, unsubscribe-on-destroy; often the cleanest fix is pushing data into a signal via toSignal(rx) and letting the framework own it.",
      flow:
        "flowchart TD\n    SYM{symptom} -->|stale view under OnPush| F1[mutation kept the reference]\n    F1 --> FIX1[new array/object reference OR markForCheck as last resort]\n    SYM -->|list reorder breaks focus| F2[track keyed by index or unstable id]\n    F2 --> FIX2[track item.id — stable unique identity]\n    SYM -->|memory grows / code runs after route change| F3[unclosed subscription]\n    F3 --> FIX3[takeUntilDestroyed / TakeUntil destroy$ / async pipe / toSignal]\n    MODEL[immutable data flow] -.prevents.-> F1\n    ID[stable domain ids] -.prevents.-> F2",
      deep:
        "The OnPush decision tree (the senior-level complete rules): a component with OnPush renders when (1) any @Input reference changes, (2) a template event binding inside IT fires (click handlers — but a PARENT method reassigning the same component's inputs doesn't count), (3) it or an ancestor calls markForCheck() (marks the path to root dirty), (4) it calls detectChanges() directly (local check — runs now, but doesn't mark ancestors), (5) a signal it reads in a template changes, or (6) an async pipe it hosts emits. The async-pipe point is subtle: the pipe itself calls markForCheck() on emission, which is why OnPush + observable | async 'just works' — the classic pattern was OnPush everywhere + async pipes for data flows, before signals subsumed it.\n\nSubscription lifecycle beyond takeUntilDestroyed (the full toolbox): (a) async pipe — template-owned; (b) takeUntil(this.destroy$) with a Subject blasted in ngOnDestroy — the classic pattern, still fine, one line more; (c) manual .unsubscribe() in ngOnDestroy for imperative subscriptions stored as fields; (d) takeUntilDestroyed() — the operator form of (b) with the DestroyRef injection token; and (e) FIRST-value semantics: take(1)/first() when the flow is a one-shot request (HTTP) — no need to unsubscribe a completed observable, completion cleans up automatically. The real leak sources are INTERVALS and WebSocket/event listeners, which never complete.\n\nThe signals reconciliation (why these scenarios are shrinking): signal-based state makes scenario 1 mostly disappear — a signal() holding an array is read in the template; any .set()/update() notifies exactly the bindings reading it regardless of OnPush, because fine-grained reactivity replaces the reference-equality gate. toSignal(observable) turns any RxJS flow into the same model — the leak in scenario 3 becomes framework-managed teardown. The honest interview line: 'know the OnPush/track/unsubscribe trio because every existing codebase has them; write signal state in new code so the whole class of issues never forms.'",
    },
  ],
});

console.log(`Curated angular-fundamentals-fresher: ${total} questions.`);
