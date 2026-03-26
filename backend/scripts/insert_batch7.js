const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});

function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function uniqueSlug(client, base) {
  let slug = base, n = 2;
  while (true) {
    const r = await client.query('SELECT id FROM questions WHERE slug=$1', [slug]);
    if (r.rows.length === 0) return slug;
    slug = `${base}-${n++}`;
  }
}

async function getOrCreateConcept(client, name) {
  const slug = toSlug(name);
  const existing = await client.query('SELECT id FROM concepts WHERE slug=$1', [slug]);
  if (existing.rows.length > 0) return existing.rows[0].id;
  const r = await client.query('INSERT INTO concepts(name,slug) VALUES($1,$2) RETURNING id', [name, slug]);
  return r.rows[0].id;
}

const QUESTIONS = {
  'jenkins': [
    {
      title: 'Explain the concept of Webhooks and how they interact with Jenkins',
      metaTitle: 'Jenkins Webhooks: Automating Trigger Pipelines',
      metaDesc: 'Understand what Webhooks are, how they differ from traditional polling, and how to configure GitHub to trigger Jenkins pipelines instantly on commit.',
      concepts: ['Webhooks', 'Triggers', 'Jenkins', 'GitHub Integration'],
      quiz: { q: 'Why is using a Webhook significantly superior to having Jenkins poll the Git repository every minute?', opts: ['Webhooks are more secure natively', 'Polling wastes resources checking a repository when nothing has changed; Webhooks instantly push a notification only when a change actually occurs', 'Polling is not supported by Jenkins anymore', 'Webhooks can automatically write commit messages for you'], ans: 'Polling wastes resources checking a repository when nothing has changed; Webhooks instantly push a notification only when a change actually occurs' },
      sections: {
        interviewer_expectation: `This question tests whether the candidate understands event-driven architectures versus polling mechanisms.\n\nExpectations:\n- Explaining the inefficiency of "Poll SCM".\n- Defining what a webhook actually is (An HTTP POST request triggered by an event).\n- Explaining the flow: Developer pushes to Git -> Git provider fires Webhook -> Jenkins receives payload -> Jenkins starts build.`,
        core_concepts: `**The Old Way (Polling):**\nHistorically, Jenkins was configured to ask GitHub every 60 seconds: "Has anything changed? Has anything changed?" This is highly inefficient. If 1,000 jobs are polling GitHub every minute, it creates massive, unnecessary network traffic and API throttling, yet it STILL introduces a delay of up to a minute before the build starts.\n\n**The Modern Way (Webhooks):**\nA Webhook is simply a user-defined HTTP POST callback. It is an event-driven model completely reversing the flow of communication.\nInstead of Jenkins constantly asking Git if there's an update, Jenkins exposes a specific URL (an API endpoint). We configure GitHub/GitLab: "Whenever someone pushes code to the \`main\` branch, send an HTTP POST request containing a JSON payload to this exact Jenkins URL."\n\nWhen Jenkins receives that tiny POST request, it knows instantly that it needs to start the pipeline. This makes CI/CD truly "Continuous" with zero delay and zero wasted resources.`,
        important_points: `- **Security Context:** Jenkins must be accessible from the internet (or at least from the Git provider's network) for the webhook to reach it. Alternatively, tools like \`smee.io\` can be used for local development proxying.\n- **Payloads:** Webhooks usually send a JSON payload containing valuable meta-data, like which user pushed the code, what branch they pushed to, and the specific commit hash. Jenkins plugins can parse this and use it as environment variables during the build.`,
        code_example: `\`\`\`javascript
// A conceptual representation of what GitHub sends TO Jenkins
// Method: POST -> https://jenkins.mycompany.com/github-webhook/

{
  "ref": "refs/heads/main",
  "before": "9049f1265b7fc93b... (old commit ID)",
  "after": "0d1a26e67d8f5eaf... (new commit ID)",
  "commits": [
    {
      "id": "0d1a26e67d8f5eaf...",
      "message": "fix: resolve null pointer exception in user service",
      "author": { "name": "Alice Developer", "email": "alice@example.com" }
    }
  ],
  "repository": {
    "name": "ecommerce-api",
    "full_name": "mydept/ecommerce-api"
  }
}
// Jenkins sees this payload, looks up which job matches 'ecommerce-api' and 'main' branch, and triggers it.
\`\`\``,
        speakable_answer: `Webhooks are the modern, event-driven mechanism we use to trigger Jenkins pipelines instantly. \n\nIn older CI environments, Jenkins relied on 'Polling.' It basically asked GitHub every minute, 'Are there new commits? Are there new commits?' This is horribly inefficient and actually delays the build start time.\n\nA Webhook reverses that communication path. A Webhook is just an HTTP POST request. You configure GitHub so that whenever a developer executes a 'git push', GitHub immediately fires a tiny POST request containing a JSON payload to a specific listener URL on your Jenkins server.\n\nAs soon as Jenkins receives that payload, it parses the metadata—figuring out which branch was pushed to and who pushed it—and instantly kicks off the corresponding pipeline. It saves massive amounts of network traffic and makes the Continuous Integration feedback loop instantaneous.`,
        followup_questions: `- What are some major security implications of exposing your Jenkins Webhook listener to the public internet? How do you secure it (HMAC signatures)?\n- Can you configure a Webhook to trigger on events OTHER than a code push (e.g., when a Pull Request is opened)?\n- If your Jenkins server is on a private corporate intranet, how can GitHub.com reach it to send the webhook?`,
      }
    },
    {
      title: 'What is a Shared Library in Jenkins and why is it useful',
      metaTitle: 'Jenkins Shared Libraries: Reusing Pipeline Code',
      metaDesc: 'Discover how Jenkins Shared Libraries enable DRY principles across hundreds of pipelines, centralizing logic and standardizing enterprise deployments.',
      concepts: ['Shared Library', 'DRY Principle', 'Groovy', 'Enterprise CI/CD'],
      quiz: { q: 'You have 50 microservices, each with its own Jenkinsfile. You need to update the Docker Registry URL for all of them. What is the most robust way to handle this?', opts: ['Manually edit all 50 Jenkinsfiles to change the string', 'Run a massive bash text-replace script across all 50 git repositories', 'Extract the Docker push logic into a Jenkins Shared Library, so you only have to update the URL in ONE central place', 'Delete the microservices and build a monolith'], ans: 'Extract the Docker push logic into a Jenkins Shared Library, so you only have to update the URL in ONE central place' },
      sections: {
        interviewer_expectation: `This is an advanced enterprise Jenkins question. Candidates should understand that managing 100 identical \`Jenkinsfiles\` is an anti-pattern.\n\nExpectations:\n- Defining the problem: Code duplication across dozens of microservice \`Jenkinsfiles\`.\n- Introducing Shared Libraries as a centralized Git repository of Groovy scripts.\n- Explaining how to import the library using \`@Library\`.`,
        core_concepts: `**The Problem:**\nSuppose a company has 50 Java Spring Boot microservices. Every single \`Jenkinsfile\` will look essentially identical: Checkout, \`mvn clean package\`, \`docker build\`, \`push to registry\`, deploy to Kubernetes. If the DevOps team decides to change the Docker registry URL, they have to manually issue Pull Requests to 50 different Git repositories to update 50 \`Jenkinsfiles\`.\n\n**The Solution (Shared Libraries):**\nJenkins allows you to create a "Shared Library." This is a separate, central Git repository filled with custom Groovy code. You can abstract complex procedures into simple, custom steps.\n\nFor example, you could write a Groovy script called \`buildAndPushDocker.groovy\` in the shared library. Then, in the 50 microservices, the \`Jenkinsfile\` simply calls \`buildAndPushDocker(imageName: 'my-api')\`. \nIf the registry URL changes, the DevOps team updates the *one* Groovy file in the Shared Library Git repository, and all 50 microservices automatically inherit the change on their next build.`,
        important_points: `- **Structure:** A standard Shared Library has a specific folder structure: \`src/\` (for heavy Groovy classes), \`vars/\` (for global variables/custom steps you can call directly in the pipeline), and \`resources/\` (for static JSON/YAML templates).\n- **Central Governance:** Shared libraries enforce standardization. Instead of trusting 50 different dev teams to write correct security-scanning logic in their pipelines, the DevOps team writes a \`standardCorpPipeline()\` in the shared library, and developers are only responsible for calling that one method.`,
        code_example: `\`\`\`groovy
// 1. Inside the Shared Library Git Repo (vars/standardJavaBuild.groovy)
def call(String projectName) {
    pipeline {
        agent any
        stages {
            stage('Compile') {
                steps {
                    sh "mvn clean package"
                }
            }
            stage('Security Scan') {
                steps {
                    // Centralized security logic across the entire company!
                    sh "sonar-scanner -Dproject.key=\${projectName}"
                }
            }
        }
    }
}

// ------------------------------------------------------------------

// 2. Inside a Developer's specific microservice Git repo (Jenkinsfile)

// Import the shared library (configured globally in Jenkins UI)
@Library('my-company-shared-lib') _

// Call the custom step we defined above. It replaces a massive 
// boilerplate file with a single line of code!
standardJavaBuild('user-service-api')
\`\`\``,
        speakable_answer: `Jenkins Shared Libraries are an enterprise feature used to enforce the DRY principle—Don't Repeat Yourself—across hundreds of CI/CD pipelines. \n\nWhen a company has dozens of microservices, their Jenkinsfiles usually contain exactly the same boilerplate steps for compiling Java, building Docker images, and deploying. Maintaining identical pipeline code across 50 repositories is a nightmare.\n\nA Shared Library solves this by creating a centralized Git repository of custom Groovy scripts. The DevOps team can write complex, standardized routines—like a 'buildAndPushToEnterpriseRegistry()' function. \n\nThen, in the individual microservice Jenkinsfiles, the developer simply uses the '@Library' annotation to import the shared library and calls that single function. If the company ever needs to change how Docker images are pushed, they update the logic in the central Shared Library repository ONE time, and all 50 pipelines instantly inherit the new logic without needing any code changes in their individual repositories.`,
        followup_questions: `- What is the difference between the \`vars/\` directory and the \`src/\` directory in a Jenkins Shared Library?\n- How do you handle versioning of a Shared Library to ensure an update doesn't randomly break older legacy pipelines?\n- Is it possible to load a Shared Library dynamically in a Jenkinsfile without configuring it globally in the Jenkins UI?`,
      }
    }
  ],
  'mockito': [
    {
      title: 'How do you test void methods or verify that a method was called a specific number of times in Mockito',
      metaTitle: 'Mockito verify(): Testing Void Methods and Invocations',
      metaDesc: 'Learn how to use Mockito verify() to assert interactions, test void methods, and ensure dependencies are called the exact correct number of times.',
      concepts: ['verify()', 'Void Methods', 'Interaction Testing', 'Times()'],
      quiz: { q: 'If a method returns void (nothing), you cannot use assertEquals() to check its result. How do you test it using Mockito?', opts: ['You cannot test void methods in Java', 'You use Mockito.verify() to assert that the void method actually interacted with its dependencies correctly', 'You change the method signature to return a boolean', 'You use the @Test(expected = Void.class) annotation'], ans: 'You use Mockito.verify() to assert that the void method actually interacted with its dependencies correctly' },
      sections: {
        interviewer_expectation: `Candidates must understand "Interaction Testing" versus "State Testing". If a method doesn't return a value, the only way to test it is to verify its side effects.\n\nExpectations:\n- Recognizing that returning \`void\` requires behavior verification.\n- Utilizing \`Mockito.verify(mock)\`.\n- Understanding modifiers like \`times(1)\`, \`never()\`, or \`atLeastOnce()\`.`,
        core_concepts: `**State Testing vs Interaction Testing:**\nNormally, you test by asserting the returned state: \`assertEquals(10, calculateTax())\`. But what if a \`UserService\` has a method \`void deleteUser(Long id)\`? It doesn't return anything. How do you know it worked?\n\nThe answer is Interaction Testing. We don't verify a returned value; we verify that the Service *interacted* correctly with the Mock object. We check the "side effects".\n\n**The \`verify()\` Method:**\nMockito provides the \`verify()\` method to assert that a specific method on a mock was called, with specific arguments.\nIf the \`deleteUser()\` logic determines that an admin cannot be deleted, you need to verify that the repository's \`deleteById()\` method was **never** called.\nIf it's a normal user, you verify that \`deleteById()\` was called **exactly once**.`,
        important_points: `- **Argument Matchers:** You don't have to know the exact argument passed. You can use matchers like \`verify(mock).save(any(User.class))\` to verify that *some* User object was saved, regardless of its exact fields.\n- **Order of Execution:** Mockito also provides an \`InOrder\` class to verify that mock methods were called in a strict, specific sequence (e.g., \`connect()\`, then \`execute()\`, then \`disconnect()\`).`,
        code_example: `\`\`\`java
public class UserService {
    private final UserRepository repository;
    private final EmailService emailService;

    // ... constructor ...

    public void deactivateAccount(Long userId, boolean isAdmin) {
        if (isAdmin) {
            // Business rule: Do not deactivate admins!
            return; 
        }
        
        repository.deactivateById(userId);
        emailService.sendDeactivationEmail(userId);
    }
}

// -------- THE TEST --------

@Test
void testDeactivateAccount_NormalUser() {
    // 1. ACT: Call the void method
    userService.deactivateAccount(5L, false);

    // 2. ASSERT & VERIFY side-effects
    // Verify it WAS called exactly 1 time
    verify(repository, times(1)).deactivateById(5L);
    
    // We can also just use verify(mock) as shorthand for times(1)
    verify(emailService).sendDeactivationEmail(5L);
}

@Test
void testDeactivateAccount_AdminUser() {
    // 1. ACT: Attempt to deactivate an admin
    userService.deactivateAccount(1L, true);

    // 2. ASSERT & VERIFY side-effects
    // The business rule says admins are ignored. 
    // We must verify the DB was NEVER touched!
    verify(repository, never()).deactivateById(anyLong());
    
    // Verify no emails were sent either
    verifyNoInteractions(emailService);
}
\`\`\``,
        speakable_answer: `When a method returns void, you cannot use traditional assertions like 'assertEquals' because there is no output to check. Instead, you have to verify the side-effects of that method. We call this Interaction Testing.\n\nIn Mockito, we use the 'verify' method for this. We execute the void method on our Service, and then we ask the Mockito Mock, 'Did the service interact with you correctly?'\n\nFor example, if my Service has a 'deleteAccount' method, I will call it, and then I will write: 'verify(userRepository, times(1)).deleteById(userId)'. This asserts that the Service actually passed the correct ID to the database mock exactly one time.\n\nVerify is also crucial for validating negative paths. If I try to delete a protected Admin user, my business logic should stop the action early. I can prove this works by writing 'verify(userRepository, never()).deleteById()', which guarantees the test fails if the repository mock is accidentally touched.`,
        followup_questions: `- How do you verify that AFTER calling a mock method, no OTHER unverified methods were called on that mock (\`verifyNoMoreInteractions\`)?\n- What is an \`ArgumentCaptor\` in Mockito and how can it be used in conjunction with \`verify()\`?\n- If you need to verify a specific execution sequence across multiple different mocks, what Mockito class would you use?`,
      }
    },
    {
      title: 'What is an ArgumentCaptor in Mockito and when would you use it',
      metaTitle: 'Mockito ArgumentCaptor: Inspecting Internal Object State',
      metaDesc: 'Discover how ArgumentCaptor allows you to intercept and deeply inspect objects that are created internally within a Service class before they are sent to a Mock.',
      concepts: ['ArgumentCaptor', 'Internal State', 'Mockito', 'Complex Assertions'],
      quiz: { q: 'When testing `userService.register("Alice")`, the Service internally constructs a complex `User` object and passes it to `repository.save(user)`. How do you assert that the internally generated `User.createdAt` field was set correctly?', opts: ['You cannot test internal variables in Java', 'Return the User object from the void method', 'Use reflection to break encapsulation and read private fields', 'Use an ArgumentCaptor to "catch" the User object exactly as it was handed to the repository mock, then run assertions on it'], ans: 'Use an ArgumentCaptor to "catch" the User object exactly as it was handed to the repository mock, then run assertions on it' },
      sections: {
        interviewer_expectation: `This tests deeper Mockito knowledge. An Argument captor solves a very specific testing limitation regarding object creation inside the method under test.\n\nExpectations:\n- Defining the problem: The Service creates an object internally using `+ '`new`' + ` that you don't have access to in the test.\n- Explaining that \`ArgumentCaptor\` intercepts the argument being passed to a mock during \`verify()\`.`,
        core_concepts: `**The Hidden Object Problem:**\nSuppose testing \`userService.registerUser(String email)\`. Inside that method, the Java code does \`User u = new User(email); u.setRole("GUEST"); repository.save(u);\`. \nBecause the \`User\` object is instantiated *inside* the service method using the \`new\` keyword, your JUnit test has no reference to it. How can you write an \`assertEquals\` to prove the role was correctly set to "GUEST"?\n\n**The ArgumentCaptor Solution:**\nAn \`ArgumentCaptor\` acts like a net. When you run \`verify(repository).save(...)\`, instead of just checking if the method was called, you put the Captor into the method call. \nWhen Mockito sees the \`save()\` method being triggered, the Captor "snatches" the actual Java object being passed in. \nYou can then pull the object out of the net (\`captor.getValue()\`) and write standard JUnit assertions against it.`,
        important_points: `- **Capturing Multiple Times:** If the mock method was called in a loop (e.g., saving 5 users), the ArgumentCaptor can capture all 5. You use \`captor.getAllValues()\` which returns a \`List\` of every object passed to that mock.\n- **Not for Stubbing:** It is considered bad practice to use \`ArgumentCaptor\` inside a \`when().thenReturn()\` block. It should strictly be used during the \`verify()\` phase at the end of the test.`,
        code_example: `\`\`\`java
public class UserService {
    private final UserRepository repository;

    public void registerDefaultUser(String email) {
        // We instantiate the object INTERNALLY. The test does not have a reference to this.
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setRole("GUEST");       // We need to test that this happens!
        newUser.setActive(true);        // We need to test that this happens!

        repository.save(newUser);
    }
}

// -------- THE TEST --------

@Test
void testRegisterDefaultUser() {
    // 1. Create the net (ArgumentCaptor) specifically shaped to catch 'User' objects
    ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

    // 2. ACT
    userService.registerDefaultUser("test@example.com");

    // 3. VERIFY and CATCH
    // We verify the save method was called, and we throw the net into the argument slot
    verify(repository).save(userCaptor.capture());

    // 4. RETRIEVE the object from the net
    User capturedUser = userCaptor.getValue();

    // 5. ASSERT deeply on the internal state
    assertEquals("test@example.com", capturedUser.getEmail());
    assertEquals("GUEST", capturedUser.getRole());       // Proved!
    assertTrue(capturedUser.isActive());                 // Proved!
}
\`\`\``,
        speakable_answer: `An ArgumentCaptor is a powerful Mockito feature used when a Service method instantiates a complex object internally that you don't otherwise have access to in your test. \n\nFor example, if I call a method 'registerUser' passing just an email string, the Service might internally construct a new User object, set a default Role of 'GUEST', set a timestamp, and pass that constructed object to the 'repository.save()' method. \n\nBecause I didn't create that User object in my test file, I can't write assertions against it. That's a problem, because I need to prove the role was set to 'GUEST'.\n\nTo solve this, I create an ArgumentCaptor. When I use Mockito's 'verify' block to check that 'repository.save()' was called, I pass the captor in as the argument. Mockito will effectively 'catch' the exact User object that the Service tried to save. I can then extract that object from the captor and write normal JUnit assertions against its internal fields.`,
        followup_questions: `- If a mocked method is called 3 times in a loop, what happens if you try to use \`captor.getValue()\`?\n- How does an \`ArgumentCaptor\` differ from using a custom \`ArgumentMatcher\`?\n- Is it best practice to use an ArgumentCaptor in a \`when()\` stubbing block or a \`verify()\` block? Why?`,
      }
    },
    {
      title: 'How do you test exceptions using Mockito (e.g., throwing an error when an ID is not found)',
      metaTitle: 'Mockito Exceptions: Testing the Unhappy Path',
      metaDesc: 'Learn how to use Mockito to simulate database failures or missing resources by stubbing mocks to throw custom Exceptions, forcing the unhappy path.',
      concepts: ['Exception Handling', 'assertThrows', 'when().thenThrow()', 'Mockito'],
      quiz: { q: 'If your Service expects an API client to throw a RestClientException, how do you instruct the Mockito mock to simulate this failure?', opts: ['when(client.get()).thenReturn(null)', 'when(client.get()).thenThrow(new RestClientException("Connection Timeout"))', 'verify(client).throwsException()', 'Throw the exception Manually before calling the Service'], ans: 'when(client.get()).thenThrow(new RestClientException("Connection Timeout"))' },
      sections: {
        interviewer_expectation: `Testing the "unhappy path" (error handling) is just as important as the happy path. Candidates must know how to force mocks to fail and how JUnit handles the resulting explosion.\n\nExpectations:\n- Using \`thenThrow()\` in Mockito instead of \`thenReturn()\`. \n- Showing how to catch the exception using JUnit 5's \`assertThrows()\`.`,
        core_concepts: `**Forcing the Unhappy Path:**\nGood code has defensive checks. If a \`UserRepository\` cannot find an entity, it might throw a \`ResourceNotFoundException\`. The \`UserService\` needs to either catch that exception, or let it propagate up to a Global Exception Handler. \nTo test this, we must force the mock repository to fail on command. We use \`when(mock.method()).thenThrow(Exception.class)\`.\n\n**Catching with JUnit 5 (\`assertThrows\`):**\nWhen you force the mock to throw the exception, the Service will execute and (usually) explode. If the test method explodes, the test is marked as Failed. \nHowever, in an error-handling test, the explosion IS the expected result! We use JUnit 5's \`assertThrows(Exception.class, () -> executableCode)\`. This wrapper tells JUnit: "I expect the arrow function inside me to throw an exception. If it DOES throw, the test PASSES. If it completes normally, the test FAILS."`,
        important_points: `- **Testing Void Methods that Throw:** The standard \`when(mock.method())\` syntax doesn't work for \`void\` methods. If you need a void method to throw an exception, you must reverse the syntax: \`doThrow(Exception.class).when(mock).myVoidMethod();\`.\n- **Asserting Exception Metadata:** \`assertThrows\` returns the actual Exception object that was caught. You should capture it and run \`assertEquals()\` on its message to ensure you threw the *right kind* of error, not just a generic NullPointerException.`,
        code_example: `\`\`\`java
public class ProductService {
    private final ProductRepository repository;

    public Product getProductDetails(Long id) {
        // If findById returns empty, throw a specific exception
        return repository.findById(id)
            .orElseThrow(() -> new ProductNotFoundException("Product ID " + id + " not found"));
    }
}

// -------- THE TEST --------

@Test
void testGetProductDetails_ThrowsExceptionWhenNotFound() {
    // 1. Arrange: Program the mock to return an empty Optional
    // This simulates the database not finding the record.
    when(repository.findById(99L)).thenReturn(Optional.empty());

    // 2. Act & Assert JUnit 5
    // We expect the Service to explode with a ProductNotFoundException.
    ProductNotFoundException thrownError = assertThrows(
        ProductNotFoundException.class, 
        () -> {
            // The code that we expect to explode is placed inside this lambda
            productService.getProductDetails(99L);
        }
    );

    // 3. Verify exactly WHAT the error message was
    assertEquals("Product ID 99 not found", thrownError.getMessage());
}

@Test
void testSimulatingDatabaseFailure() {
    // Alternatively, instruct the mock repository to literally throw an exception on contact
    when(repository.findAll()).thenThrow(new DataAccessException("Database is down") {});
    
    assertThrows(DataAccessException.class, () -> productService.getAllProducts());
}
\`\`\``,
        speakable_answer: `Testing the unhappy path is crucial. To test how a Service behaves when the database goes down or a record is missing, you must force your Mockito mocks to simulate failures.\n\nYou do this by replacing the standard 'thenReturn()' method with 'thenThrow()'. For example, I can program my repository mock by writing: 'when(repository.findById(99)).thenThrow(new RuntimeException())'. \n\nWhen I call my Service during the test, it will execute, hit the mock database, and the simulated exception will immediately explode upward into the Service logic. \n\nTo prevent this exception from failing the test suite, I wrap the service call in a JUnit 5 'assertThrows' block. This block essentially tells JUnit, 'I am about to execute a block of code, and I require it to throw an exception. If it throws, the test passes.' assertThrows also returns the exception object, allowing me to write assertions against the error message to guarantee it's exactly the error I expected, and not something random like a NullPointerException.`,
        followup_questions: `- Why can't you use \`when().thenThrow()\` on a method that returns \`void\`, and what syntax (\`doThrow\`) must you use instead?\n- How did we test for exceptions in older versions of JUnit 4 before \`assertThrows\` existed?\n- Why is it important to capture the result of \`assertThrows\` and assert against the exception's String message?`,
      }
    }
  ]
};

async function insertContent() {
  const client = await pool.connect();
  try {
    const domainRes = await client.query("SELECT id FROM domains WHERE slug = 'java-backend-1-3'");
    if (!domainRes.rows.length) return;
    const domainId = domainRes.rows[0].id;

    const stacksRes = await client.query(
      `SELECT ts.id, ts.slug, ts.name FROM domain_stack_map dsm
       JOIN tech_stacks ts ON ts.id = dsm.stack_id
       JOIN domains d ON d.id = dsm.domain_id
       WHERE d.slug = 'java-backend-1-3' ORDER BY dsm.display_order`
    );
    const stackMap = {};
    for (const s of stacksRes.rows) stackMap[s.slug] = s;

    const qsiRes = await client.query(
      `SELECT qsi.stack_id, COUNT(*) as cnt FROM question_stack_index qsi GROUP BY qsi.stack_id`
    );
    const existingCounts = {};
    for (const r of qsiRes.rows) existingCounts[r.stack_id] = parseInt(r.cnt);

    for (const [stackSlug, questions] of Object.entries(QUESTIONS)) {
      const stack = stackMap[stackSlug];
      if (!stack) continue;
      const stackId = stack.id;
      let orderIndex = (existingCounts[stackId] || 0) + 1;

      console.log(`\n▶ Processing stack: ${stackSlug} (id=${stackId})`);

      for (const q of questions) {
        await client.query('BEGIN');
        try {
          const baseSlug = toSlug(q.title);
          const slug = await uniqueSlug(client, baseSlug);

          const qRes = await client.query(
            `INSERT INTO questions(title, slug, difficulty, estimated_read_time, meta_title, meta_description)
             VALUES($1,$2,'medium',4,$3,$4) RETURNING id`,
            [q.title, slug, q.metaTitle, q.metaDesc]
          );
          const questionId = qRes.rows[0].id;
          console.log(`  ✓ Question [${questionId}]: ${q.title.substring(0, 50)}...`);

          await client.query(
            `INSERT INTO question_stack_index(stack_id, question_id, order_index) VALUES($1,$2,$3)`,
            [stackId, questionId, orderIndex++]
          );

          const sectionTypes = [
            'interviewer_expectation', 'core_concepts', 'important_points',
            'code_example', 'speakable_answer', 'followup_questions'
          ];
          for (let i = 0; i < sectionTypes.length; i++) {
            const sType = sectionTypes[i];
            const content = q.sections[sType];
            await client.query(
              `INSERT INTO answer_sections(question_id, section_type, section_order, content) VALUES($1,$2::answer_section_enum,$3,$4)`,
              [questionId, sType, i + 1, content]
            );
          }

          for (const cName of q.concepts) {
            const cId = await getOrCreateConcept(client, cName);
            try {
              await client.query(
                `INSERT INTO question_concepts(question_id, concept_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,
                [questionId, cId]
              );
            } catch (_) {}
          }

          const optionsJson = JSON.stringify(q.quiz.opts);
          await client.query(
            `INSERT INTO question_quizzes(question_id, quiz_question, options, correct_answer) VALUES($1,$2,$3,$4)`,
            [questionId, q.quiz.q, optionsJson, q.quiz.ans]
          );

          await client.query('COMMIT');
        } catch (err) {
          await client.query('ROLLBACK');
          console.error(`    ✗ ROLLBACK for "${q.title}": ${err.message}`);
        }
      }
    }

    console.log('\n▶ Adding question relations...');
    for (const [stackSlug] of Object.entries(QUESTIONS)) {
      const stack = stackMap[stackSlug];
      if (!stack) continue;
      const stackId = stack.id;
      const qInStack = await client.query(
        `SELECT question_id FROM question_stack_index WHERE stack_id = $1 ORDER BY order_index DESC LIMIT 10`,
        [stackId]
      );
      const ids = qInStack.rows.map(r => BigInt(r.question_id));
      if (ids.length < 2) continue;
      for (let i = 0; i < ids.length; i++) {
        const related1 = ids[(i + 1) % ids.length];
        const related2 = ids[(i + 2) % ids.length];
        for (const relId of [related1, related2]) {
          if (relId === ids[i]) continue;
          try {
            await client.query(
              `INSERT INTO question_relations(question_id, related_question_id, relation_type)
               VALUES($1,$2,'related'::relation_type_enum) ON CONFLICT DO NOTHING`,
              [ids[i].toString(), relId.toString()]
            );
          } catch (_) {}
        }
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

insertContent().catch(console.error);
