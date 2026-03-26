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
      title: 'What is Continuous Integration and Continuous Deployment (CI/CD)',
      metaTitle: 'Understanding CI/CD Pipelines: From Commit to Production',
      metaDesc: 'A comprehensive explanation of Continuous Integration, Continuous Delivery, and Continuous Deployment, and how Jenkins facilitates these processes.',
      concepts: ['CI/CD', 'Jenkins', 'DevOps', 'Automation'],
      quiz: { q: 'What is the primary difference between Continuous Delivery and Continuous Deployment?', opts: ['Continuous Delivery applies to frontends; Continuous Deployment applies to backends', 'Continuous Delivery requires manual approval before pushing to production; Continuous Deployment is fully automated', 'Continuous Deployment happens daily; Continuous Delivery happens weekly', 'There is no difference; they are interchangable terms'], ans: 'Continuous Delivery requires manual approval before pushing to production; Continuous Deployment is fully automated' },
      sections: {
        interviewer_expectation: `This asks for the fundamental philosophy behind DevOps automation. Candidates should clearly differentiate the stages of CI vs CD.\n\nExpectations:\n- Defining CI (merging code frequently, automated builds, and testing).\n- Defining CDelivey (releasing to staging, waiting for manual approval).\n- Defining CDeployment (fully automated release to production).\n- Identifying the goal: reducing risk, increasing deployment frequency.`,
        core_concepts: `**1. Continuous Integration (CI):**\nThe practice of merging all developers' working copies to a shared mainline (like \`main\` or \`master\` branch) several times a day. \nWhen a developer pushes code, a CI server (like Jenkins) automatically triggers a process to:\n- Download the new code.\n- Compile the application (e.g., \`mvn clean compile\`).\n- Run all Unit and Integration tests.\n*Goal:* Discover integration bugs immediately, rather than waiting for a "QA Phase" at the end of the month.\n\n**2. Continuous Delivery (CD):**\nAn extension of CI. Once the code builds successfully and passes tests, the pipeline automatically deploys the application to Staging or UAT (User Acceptance Testing) environments. \n- The crucial aspect of Continuous *Delivery* is that deploying to Production requires a **manual human approval step** (clicking a "Deploy" button).\n\n**3. Continuous Deployment (CD):**\nThe ultimate goal of DevOps. If the automated tests pass, the code is deployed directly into Production without any human intervention. This requires massive confidence in your automated testing suite to prevent catastrophic bugs from hitting customers.`,
        important_points: `- **Risk Reduction:** Deploying 10 small changes a week is vastly less risky than deploying 1 massive update containing 500 changes every 6 months. Small changes are easy to rollback; massive changes are not.\n- **Feedback Loop:** The primary metric of CI/CD success is lead time—the time it takes for a developer to write a line of code and see it running in production. A fast feedback loop increases agility.`,
        code_example: `\`\`\`groovy
// Example of a Conceptual CI/CD Pipeline flow (Not strictly syntax)

// 1. CONTINUOUS INTEGRATION PHASE
Stage("Checkout") { git clone ... }
Stage("Build") { mvn clean package }
Stage("Test") { mvn test }      <-- If this fails, the whole pipeline aborts

// 2. CONTINUOUS DELIVERY PHASE
Stage("Deploy to Staging") { docker run ... }
Stage("Integration Tests") { run_selenium_tests }

// THE HUMAN GATE (Difference between Delivery and Deployment)
Stage("Approval") { 
    input message: 'Approve deployment to Production?' 
}

// 3. CONTINUOUS DEPLOYMENT PHASE (If the gate is passed/removed)
Stage("Deploy to Prod") { push_to_kubernetes }
\`\`\``,
        speakable_answer: `CI/CD stands for Continuous Integration and Continuous Deployment, and it represents a philosophical shift in how we ship software. It moves us away from massive, risky, manual deployments to small, safe, automated ones.\n\nContinuous Integration, or CI, focuses on the codebase. It dictates that developers should merge their code into the main branch frequently—often multiple times a day. Whenever they push, a tool like Jenkins automatically pulls the code, compiles it, and runs thousands of automated unit tests. The goal is to detect bugs and integration issues immediately, rather than discovering them weeks later.\n\nOnce CI passes, the process hands off to CD, which can mean two things. \nContinuous Delivery means the pipeline automatically packages the application and deploys it to a staging environment so QA can test it. However, the final push to Production requires a human being to click an 'Approve' button.\n\nContinuous Deployment is the final evolution. In this model, there is no human intervention. If a developer pushes code and the automated test suite passes perfectly, that code goes straight to live production customers minutes later. This requires an incredibly robust and trustworthy automated testing suite.`,
        followup_questions: `- What is the "Shift-Left" testing philosophy and how does CI enable it?\n- Why might a company choose Continuous Delivery over Continuous Deployment, even if their automation is perfect?\n- How do you handle database schema migrations automatically in a CI/CD pipeline?\n- If a build fails the "Test" stage in Jenkins, what should happen next?`,
      }
    },
    {
      title: 'What is a Jenkinsfile and what are the benefits of Pipeline as Code',
      metaTitle: 'Jenkins Pipeline as Code: Understanding the Jenkinsfile',
      metaDesc: 'Explore the concept of Pipeline as Code, the role of a Jenkinsfile, and the differences between Declarative and Scripted Jenkins pipelines.',
      concepts: ['Jenkinsfile', 'Pipeline as Code', 'Declarative Pipeline'],
      quiz: { q: 'What is the primary advantage of storing a Jenkinsfile in your Git repository alongside the application code?', opts: ['It forces the pipeline to run faster', 'It versions the pipeline definition so changes can be tracked, reviewed, and rolled back exactly like application code', 'It hides the pipeline structure from security audits', 'It bypasses Jenkins permissions checks'], ans: 'It versions the pipeline definition so changes can be tracked, reviewed, and rolled back exactly like application code' },
      sections: {
        interviewer_expectation: `Jenkins has evolved massively. Older devs clicked through the UI to create jobs; modern DevOps uses code. This tests if the candidate is using modern practices.\n\nExpectations:\n- Defining "Pipeline as Code".\n- Introducing the \`Jenkinsfile\`, which lives in Version Control.\n- Listing benefits: Versioning, Auditing, Code Review, Portability.\n- Distinguishing between Declarative (modern) and Scripted (legacy) syntax.`,
        core_concepts: `**The Legacy Approach (Freestyle Jobs):**\nHistorically, you set up a Jenkins job by logging into the Jenkins web UI, clicking "New Item," and typing shell commands into text boxes. If the Jenkins server crashed, or someone accidentally deleted the job, you lost the entire build process. There was no history of who changed what.\n\n**Pipeline as Code (Jenkinsfile):**\nPipeline as Code solves this by defining the entire CI/CD process (checkout, build, test, deploy) in a text file called a \`Jenkinsfile\`. This file is committed directly to the Git repository right next to the Java source code (e.g., \`src/\`, \`pom.xml\`, \`Jenkinsfile\`).\n\n**The Two Syntaxes:**\n1.  **Declarative Pipeline (Recommended):** A newer, stricter, YAML-like structure inside Groovy. It uses predefined blocks (\`pipeline\`, \`agent\`, \`stages\`, \`steps\`). It's easier to read, write, and validate.\n2.  **Scripted Pipeline:** The older approach. It uses raw Groovy code. It offers maximum flexibility (you can write complex \`for\` loops and logic), but it's much harder to maintain and prone to spaghetti code.`,
        important_points: `- **Versioning & Auditability:** Because the pipeline is in Git, every change is tracked. You can see exactly *who* changed the build process and *why* (via commit messages). You can even mandate Pull Requests for pipeline changes.\n- **Branch Specificity:** A massive benefit is that the \`main\` branch and the \`feature-x\` branch can have *different* \`Jenkinsfile\`s. If I need a new database to test a new feature, I can edit the \`Jenkinsfile\` on my branch to spin one up during testing, without breaking the build process for everyone else.`,
        code_example: `\`\`\`groovy
// Example of a Modern Declarative Jenkinsfile
pipeline {
    // 1. Where should this run? 'any' available node/agent
    agent any

    // Environment variables passing to shell scripts
    environment {
        DOCKER_IMAGE = "my-registry/my-app:\${env.BUILD_ID}"
    }

    // 2. The pipeline is broken into chronological Stages
    stages {
        stage('Build') {
            steps {
                // The actual commands to run
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
            // 3. Post-stage actions (e.g., aggregating JUnit XML reports)
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('Dockerize') {
            steps {
                sh 'docker build -t \${DOCKER_IMAGE} .'
            }
        }
    }
    
    // 4. Global Post Actions (Fires when the entire pipeline finishes)
    post {
        failure {
            slackSend(channel: '#dev-alerts', message: "Build \${env.BUILD_NUMBER} FAILED!")
        }
    }
}
\`\`\``,
        speakable_answer: `A Jenkinsfile enables a concept called 'Pipeline as Code.' \n\nIn the old days, developers manually configured build jobs by clicking through the Jenkins web interface. That meant there was no version history; if someone broke the build steps, it was incredibly difficult to figure out exactly what they changed or how to revert it. Worse, if the Jenkins server died, the entire build configuration was lost.\n\nA Jenkinsfile solves this by letting us define the entire CI/CD process—checkout, compile, test, and deploy—as a structured text file. Most importantly, we commit this Jenkinsfile directly into our Git repository alongside the application code.\n\nThe benefits are immense. Our build infrastructure is now versioned. Every change is tracked by a Git commit, can undergo peer review via Pull Requests, and can be instantly rolled back if a mistake is made. Furthermore, because the pipeline lives in the branch, a developer can safely modify the pipeline on their own feature branch to accommodate new requirements without affecting the production build line on the main branch. \n\nModern Jenkinsfiles primarily use 'Declarative' syntax, which is a rigid, easy-to-read block structure, replacing the older 'Scripted' syntax which was essentially free-form Groovy programming.`,
        followup_questions: `- What is a Jenkins "Agent" (or Node) and why is it important in distributed builds?\n- Explain the difference between the \`steps{}\` block and the \`post{}\` block in a Declarative Pipeline.\n- How does Jenkins know when to trigger a pipeline build automatically?\n- What happens if the \\\`mvn test\\\` step returns a non-zero exit code?`,
      }
    },
    {
      title: 'How do you securely manage Secrets (like passwords or API keys) in Jenkins',
      metaTitle: 'Managing Secrets Safely in Jenkins Pipelines',
      metaDesc: 'Learn how to handle sensitive data like database passwords, API keys, and SSH keys in Jenkins securely, avoiding hardcoded plaintext credentials.',
      concepts: ['Jenkins Credentials', 'Secrets Management', 'Security'],
      quiz: { q: 'Where is the WORST place to store the database password that Jenkins needs to run integration tests?', opts: ['In the Jenkins Credentials Manager plugin', 'Hardcoded in plaintext inside the Jenkinsfile in the Git repository', 'In an external Vault like HashiCorp Vault', 'Passed in as an encrypted environment variable'], ans: 'Hardcoded in plaintext inside the Jenkinsfile in the Git repository' },
      sections: {
        interviewer_expectation: `Security is paramount. A candidate who hardcodes API keys in Git or prints them into the console log is an immediate red flag.\n\nExpectations:\n- Acknowledging that secrets NEVER go in the \`Jenkinsfile\` or Git repo.\n- Mentioning the built-in Jenkins Credentials Plugin.\n- Explaining how to inject secrets securely using \`withCredentials\` or the declarative \`credentials()\` helper.\n- (Bonus) Mentioning external secret managers like AWS Secrets Manager or HashiCorp Vault for enterprise setups.`,
        core_concepts: `**The Danger:**\nJenkins needs access to highly sensitive information: SSH keys to access Git, passwords to push images to Docker registers, and API keys to deploy to AWS. If you hardcode these into a \`Jenkinsfile\`, anyone with read-access to the Git repository can steal them. Furthermore, if you just echo them into the terminal, they will remain forever in the Jenkins build logs for anyone to read.\n\n**Jenkins Credentials Store:**\nThe secure approach uses the Jenkins Credentials Manager. An administrator logs into the Jenkins UI and stores the secret (e.g., an AWS Access Key) in the encrypted vault. They give it a friendly ID, like \`aws-prod-keys\`.\n\n**Injecting Secrets:**\nInside the \`Jenkinsfile\`, the developer references the ID (\`aws-prod-keys\`). When the pipeline runs, Jenkins securely injects the secret into the environment *only for the duration of that specific step*. \nFurthermore, Jenkins actively monitors the console output and uses regex to **mask** the secret with \`****\` if a script accidentally tries to print it to the log.`,
        important_points: `- **Enterprise Vaults:** While Jenkins' internal credential store is okay, enterprises usually use external Vaults (like HashiCorp Vault or AWS Secrets Manager). Jenkins securely authenticates with the external Vault at runtime to fetch the secret, rather than storing the actual password inside Jenkins itself.\n- **Types of Credentials:** Jenkins supports various types: Secret text (passwords/tokens), Usernames with passwords, Secret Files (e.g., a \`.p12\` certificate), and SSH Usernames with Private Keys.`,
        code_example: `\`\`\`groovy
// Example: Using Declarative Pipeline to securely use a password

pipeline {
    agent any

    environment {
        // BAD PRACTICE: Hardcoding in the repository
        // DB_PASSWORD = "mySuperSecretPassword123!" 

        // GLOBALLY AVAILABLE SECRET:
        // Jenkins fetches the credential with ID 'docker-hub-login' and binds 
        // the username to DOCKER_USER and the password to DOCKER_PASS
        DOCKER_USER = credentials('docker-hub-username')
        DOCKER_PASS = credentials('docker-hub-password')
    }

    stages {
        stage('Deploy to Server') {
            steps {
                // BEST PRACTICE: Scoped Secrets
                // This secret is ONLY available within this specific block
                withCredentials([string(credentialsId: 'prod-api-token', variable: 'API_TOKEN')]) {
                    
                    // The API_TOKEN variable now holds the secure secret.
                    // If you try to run 'echo \${API_TOKEN}', Jenkins will print '****'
                    sh '''
                        curl -X POST https://api.production.com/deploy \\
                             -H "Authorization: Bearer \${API_TOKEN}"
                    '''
                }
            }
        }
    }
}
\`\`\``,
        speakable_answer: `Managing secrets securely is critical because CI/CD pipelines hold the keys to the kingdom—database passwords, AWS credentials, and Docker registry tokens. \n\nThe golden rule is that secrets must never be hardcoded into the Jenkinsfile or committed to Git, as that exposes them to everyone in the company. Also, they must never be printed to the Jenkins console logs.\n\nTo handle this, we use the Jenkins Credentials Plugin. Administrative teams store the actual sensitive strings, SSH keys, or certificates securely inside the encrypted Jenkins vault and assign them an ID. \n\nThen, inside my Jenkinsfile, I use the 'withCredentials' block or the declarative 'credentials()' method, passing in that ID. Jenkins temporarily decrypts the secret and injects it into my shell environment strictly for the duration of that specific script block. And if my script accidentally types 'echo password' into the console, Jenkins actively intercepts it and masks the text with asterisks in the logs to prevent leakage.\n\nIn larger enterprise environments, we take this a step further and don't store secrets in Jenkins at all, but rather fetch them dynamically at runtime from an external vault like HashiCorp Vault or AWS Secrets Manager.`,
        followup_questions: `- How does the \`withCredentials\` block improve security compared to injecting secrets as global environment variables?\n- What is the difference between storing a "Secret Text" and a "Secret File" in Jenkins?\n- Explain what happens if a bash script in a Jenkins stage accidentally runs \`echo "$MY_DATABASE_PASSWORD"\`.\n- What are the risks of using the same Jenkins server/agent to test untrusted pull requests that has access to production deployment secrets?`,
      }
    }
  ],
  'mockito': [
    {
      title: 'What is the purpose of Mocking in Unit Testing, and how does Mockito help',
      metaTitle: 'Introduction to Mockito: Why We Mock Dependencies',
      metaDesc: 'Understand the core philosophy of Unit Testing regarding isolation, what "Mocks" are, and why the Mockito framework is essential in Java development.',
      concepts: ['Mocking', 'Unit Testing', 'Mockito', 'Isolation'],
      quiz: { q: 'In Unit Testing, why is it considered bad practice to let a Service class directly query a real PostgreSQL database?', opts: ['Because the database might return the wrong answer', 'Because it makes the test slow, fragile, and dependent on external environment state', 'Because databases cannot be queried from JUnit tests', 'Because SQL queries are not written in Java'], ans: 'Because it makes the test slow, fragile, and dependent on external environment state' },
      sections: {
        interviewer_expectation: `This tests the fundamental concept of *isolation* in unit testing. Candidates must distinguish between Unit Tests and Integration Tests.\n\nExpectations:\n- Defining a Unit Test (testing one specific class/method in isolation).\n- Identifying the problem with external dependencies (Database, external APIs, File System).\n- Defining a Mock (a fake object that mimics real behavior).\n- Explaining how Mockito intercepts calls and returns pre-programmed responses.`,
        core_concepts: `**The Unit Testing Philosophy:**\nA Unit Test is designed to test a solitary unit of code (typically a single class) in complete isolation. If you are testing a \`UserService\`, you should *only* be testing the logic inside \`UserService\` (calculating age, formatting strings, checking permissions).\n\n**The Problem with Dependencies:**\nThe \`UserService\` likely depends on a \`UserRepository\` (which talks to a real database) and an \`EmailClient\` (which talks to an external REST API). If you run a test and it fails because the database is offline or the VPN is down, your test is useless. That is an Integration Test, not a Unit Test. Furthermore, hitting real databases takes hundreds of milliseconds, making test suites incredibly slow.\n\n**The Solution: Mocks (Mockito):**\nWe need to run the \`UserService\` but physically disconnect it from the database and internet. We use a mocking framework like **Mockito**. \nMockito creates a "fake" (mock) version of the \`UserRepository\` and injects it into the Service. We then program the mock: "When the service asks you for User ID #5, don't go to the database; just instantly return this fake User object." This ensures the test is blazing fast, perfectly predictable, and strictly tests the Service logic.`,
        important_points: `- **Mocks vs Spies:** A Mock is a completely fake object; every method returns \`null\` unless you explicitly tell it what to return. A Spy wraps a *real* object; it executes real code unless you specifically tell it to intercept and fake a specific method.\n- **Verify:** Mockito isn't just for returning fake data. It's also used to verify behavior: "Did the Service class actually call the \`save()\` method on the repository exactly one time during this transaction?"`,
        code_example: `\`\`\`java
// The Class we want to test
public class OrderService {
    private final PaymentGateway paymentGateway; // External dependency!

    public OrderService(PaymentGateway paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    public boolean processOrder(double amount) {
        if (amount <= 0) return false;
        // We DO NOT want to hit the real Stripe/PayPal API during a unit test!
        return paymentGateway.chargeCreditCard(amount);
    }
}

// -----------------------------------------------------

// The Unit Test using Mockito
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock // 1. Create a completely fake version of the interface
    PaymentGateway fakePaymentGateway;

    @InjectMocks // 2. Inject the fake into the real Service we want to test
    OrderService orderService;

    @Test
    void testProcessOrder_Success() {
        // 3. STUB THE MOCK (Program its behavior)
        // "When the service calls chargeCreditCard with 100.0, return true instantly"
        when(fakePaymentGateway.chargeCreditCard(100.0)).thenReturn(true);

        // 4. ACT: Call the real method on the real Service
        boolean result = orderService.processOrder(100.0);

        // 5. ASSERT & VERIFY
        assertTrue(result);
        
        // Verify that the service *actually* attempted to charge the card exactly once
        verify(fakePaymentGateway, times(1)).chargeCreditCard(100.0);
    }
}
\`\`\``,
        speakable_answer: `The primary philosophy of a Unit Test is isolation. When I write a test for a Service class, I want to evaluate only the business logic contained within that specific file. \n\nHowever, enterpise classes rarely exist in a vacuum. A Service usually depends on Repositories that talk to a database, or HTTP clients that talk to third-party APIs. If I let my Unit Test execute real database queries, the test becomes slow, fragile, and dependent on the environment. If the database is down, my test fails, even if my Java code is perfectly fine.\n\nThis is where Mockito comes in. Mockito creates 'Mocks', which are fake, dummy implementations of those external dependencies. Instead of injecting a real UserRepository into my Service during the test, I inject a Mockito Mock. \n\nI then program the mock with instructions, called 'stubbing'. I tell it: 'When the service asks you to find user ID 1, don't talk to a database; just immediately return this hardcoded User object.' This completely severs the dependency on the database, making the test execute in milliseconds with guaranteed predictability. Finally, Mockito allows me to 'verify' behavior, ensuring that the Service actually remembered to call the repository's save method when it was supposed to.`,
        followup_questions: `- What is the fundamental difference between a Mock and a Stub?\n- What happens by default if a Service class calls a method on a Mockito Mock that you forgot to program (stub) a response for?\n- Explain the difference between \`@Mock\` and \`@Spy\` in Mockito.\n- How does the \`verify()\` method help test void methods that don't return a value?`,
      }
    },
    {
      title: 'Explain the difference between @Mock and @MockBean in Spring Boot testing',
      metaTitle: 'Spring Boot Testing: @Mock vs @MockBean',
      metaDesc: 'Clarify the critical distinction between standard Mockito @Mock annotations and Spring Boot\'s @MockBean for context-aware Integration Testing.',
      concepts: ['@Mock', '@MockBean', 'Spring Context', 'Testing'],
      quiz: { q: 'When should you use @MockBean instead of @Mock?', opts: ['When testing a single class in complete isolation quickly', 'When you are loading the Spring Application Context (e.g., using @SpringBootTest or @WebMvcTest) and need to replace a real bean with a mock', 'When you need to mock a static method', 'When you want to test the real implementation of a database repository'], ans: 'When you are loading the Spring Application Context (e.g., using @SpringBootTest or @WebMvcTest) and need to replace a real bean with a mock' },
      sections: {
        interviewer_expectation: `This is a classic "Senior vs Junior" Spring Boot question. Blurring the line between pure Mockito and Spring Boot test slicing causes terribly slow test suites.\n\nExpectations:\n- Defining \`@Mock\` as a pure Mockito construct (No Spring Context).\n- Defining \`@MockBean\` as a Spring construct (Loads the Application Context).\n- Explaining the performance penalty of \`@MockBean\`.\n- Knowing when to use which (Unit Tests vs Context/Controller Tests).`,
        core_concepts: `**1. \`@Mock\` (Pure Unit Testing):**\nThis comes directly from the Mockito framework. It dynamically creates a fake proxy object. \n- **Key trait:** It is incredibly fast. It does NOT load Spring. There is no Dependency Injection, no database connections, no \`@Autowired\`. You are simply instantiating normal Java objects and injecting fakes via the constructor manually (or via \`@InjectMocks\`).\n- **Use Case:** Testing the business logic of a single, isolated \`@Service\` class.\n\n**2. \`@MockBean\` (Spring Integration Testing):**\nThis comes from the \`spring-boot-test\` library. It instructs Spring to load up the Application Context (the giant container of all your beans). However, whenever it finds the real bean in the context (like the real \`UserRepository\`), it intercepts it and *replaces* it with a Mockito Mock.\n- **Key trait:** It is significantly slower because it requires the massive Spring architecture to boot up entirely just to run the test.\n- **Use Case:** When you *have* to load Spring, such as using \`@WebMvcTest\` to test controllers where you need Spring's HTTP routing, JSON marshaling, and Validation annotations to work, but you still want to fake the database tier.`,
        important_points: `- **The Performance Trap:** A common junior mistake is putting \`@SpringBootTest\` and \`@MockBean\` on every single test class. This forces Spring to reboot the context dozens of times, turning a test suite that should take 3 seconds into one that takes 3 minutes.\n- **Context Caching:** Spring tries to cache the application context between tests to save time. However, every time you add or change a \`@MockBean\` declaration in a test class, you "dirty" the context, forcing Spring to destroy the cache and reboot the context completely for the next test class.`,
        code_example: `\`\`\`java
// --- SCENARIO 1: PURE UNIT TEST (FAST) ---
// Does NOT load Spring Boot. Runs in 50 milliseconds.
@ExtendWith(MockitoExtension.class) 
class FastServiceTest {

    @Mock // Pure Mockito
    UserRepository userRepository;

    @InjectMocks // Manually creates UserService and passes in the mock
    UserService userService;

    @Test
    void testLogic() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        userService.doSomething(1L);
    }
}

// --- SCENARIO 2: SPRING WEB TEST (SLOWER) ---
// Loads Spring's Web layer. Runs in ~1.5 seconds.
@WebMvcTest(UserController.class) // Only boots the Controller layer, not the DB
class SlowerControllerTest {

    @Autowired // Spring's fake HTTP client to test routing
    MockMvc mockMvc;

    @MockBean // Spring replaces the real UserService with a Mock in the context!
    UserService userService;

    @Test
    void testHttpEndpoint() throws Exception {
        when(userService.getUserData()).thenReturn("Hello");
        
        // This tests HTTP routing, Jackson JSON serialization, and @Valid annotations
        mockMvc.perform(get("/api/users"))
               .andExpect(status().isOk());
    }
}
\`\`\``,
        speakable_answer: `The distinction between @Mock and @MockBean is critical for writing test suites that execute quickly.\n\n@Mock is a standard Mockito annotation used for pure Unit Testing. It creates a lightweight proxy object instantly. It operates completely outside of Spring Boot. When you use @Mock, the Spring Application Context never loads, no beans are created, and dependency injection is handled manually or via @InjectMocks. These tests run in a few milliseconds and should make up 80% of your test suite.\n\n@MockBean, on the other hand, is a Spring Boot testing annotation. It fundamentally alters the Spring Application Context. When you use it, you are forcing Spring to boot up its heavy infrastructure. Spring will load the context, find the bean definition you specified, and dynamically replace that real bean with a Mockito mock inside the context container. \n\nBecause @MockBean forces the Spring context to load, it carries a massive performance penalty. We only use @MockBean when we are performing integration tests or slice tests—like @WebMvcTest for testing Controllers—where we absolutely need the Spring framework running to handle HTTP routing and JSON serialization but still want to fake the database or downstream services.`,
        followup_questions: `- How does Spring's Context Caching work to speed up tests, and how does \`@MockBean\` accidentally destroy that cache?\n- If you need to test the interaction between your Spring Data JPA Repository and a real H2 database, should you use \`@MockBean\`?\n- What does the \`@InjectMocks\` annotation do when paired with \`@Mock\` in a unit test?\n- Can you use Mockito's \`when().thenReturn()\` syntax on an object created via \`@MockBean\`?`,
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
