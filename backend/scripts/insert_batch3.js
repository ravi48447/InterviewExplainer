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
  'spring-data-jpa': [
    {
      title: 'What is the difference between Hibernate and Spring Data JPA',
      metaTitle: 'Spring Data JPA vs Hibernate: Key Differences Explained',
      metaDesc: 'Understand the relationship and differences between Hibernate (a JPA provider) and Spring Data JPA (an abstraction layer).',
      concepts: ['Spring Data JPA', 'Hibernate', 'JPA'],
      quiz: { q: 'What is Spring Data JPA in relation to Hibernate?', opts: ['A replacement for Hibernate', 'A competitor to Hibernate', 'An abstraction layer built on top of a JPA provider like Hibernate', 'A database connection pool'], ans: 'An abstraction layer built on top of a JPA provider like Hibernate' },
      sections: {
        interviewer_expectation: `This is a classic "clarity" question. Interviewers want to ensure developers aren't just blindly using annotations without understanding the underlying stack.\n\nExpectations:\n- Defining JPA as a specification.\n- Identifying Hibernate as an implementation of JPA.\n- Explaining Spring Data JPA as an abstraction layer that generates repository code dynamically.`,
        core_concepts: `**1. JPA (Java Persistence API):**\nJPA is not a framework; it's a Java specification (a set of interfaces and rules) for Object-Relational Mapping (ORM). It defines how Java objects should be mapped to relational database tables.\n\n**2. Hibernate:**\nHibernate is one of the most popular implementations of the JPA specification. It does the heavy lifting: generating SQL queries locally, managing the entity lifecycle (states like transient, persistent, detached), and handling database dialicts and caching.\n\n**3. Spring Data JPA:**\nSpring Data JPA is an abstraction layer built on top of JPA. It is *not* a JPA implementation itself. Its goal is to significantly reduce the amount of boilerplate code required to implement data access layers. Instead of writing DAO classes with EntityManager calls, you simply declare an interface extending \`JpaRepository\`, and Spring dynamically generates the implementation at runtime. By default, Spring Boot uses Hibernate as the underlying JPA provider for Spring Data JPA.`,
        important_points: `- **You cannot use Spring Data JPA without a JPA provider** (like Hibernate, EclipseLink, or OpenJPA).\n- Spring Data JPA provides features like **Method Name Query Derivation** (e.g., \`findByEmailAndIsActiveTrue\`).\n- It provides out-of-the-box support for pagination and sorting via \`PagingAndSortingRepository\`.\n- Hibernate provides the actual session cache (first-level cache).`,
        code_example: `\`\`\`java
// 1. Pure Hibernate / JPA (The old way)
// Requires an EntityManager and manual tracking
@Repository
public class UserDaoImpl implements UserDao {
    @PersistenceContext
    private EntityManager entityManager;

    public User findByEmail(String email) {
        return entityManager.createQuery("SELECT u FROM User u WHERE u.email = :email", User.class)
                            .setParameter("email", email)
                            .getSingleResult();
    }
}

// 2. Spring Data JPA (The modern way)
// No implementation needed! Spring generates it instantly.
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Spring Data JPA derives the query automatically
    Optional<User> findByEmail(String email);
    
    // Custom query using JPQL if derivation isn't enough
    @Query("SELECT u FROM User u WHERE u.age > :age AND u.status = 'ACTIVE'")
    List<User> findActiveAdults(@Param("age") int age);
}
\`\`\``,
        speakable_answer: `To understand the difference, it helps to look at the stack mathematically. \n\nAt the base, we have JPA, the Java Persistence API. It is simply a specification—a list of interfaces and rules for object-relational mapping. It cannot do anything on its own.\n\nNext is Hibernate. Hibernate is a concrete implementation of the JPA specification. It does all the hard work: dealing with the JDBC driver, translating your Java entities into SQL statements, and managing the cache and entity lifecycles.\n\nFinally, sitting on top of that is Spring Data JPA. Spring Data JPA is an abstraction layer whose sole purpose is to hide Boilerplate code. Instead of forcing us to write Data Access Object (DAO) classes that manually invoke Hibernate's EntityManager, Spring Data JPA allows us to just declare an interface. At runtime, Spring generates the implementation dynamically based on method names. By default, Spring Boot puts Hibernate directly underneath Spring Data JPA.`,
        followup_questions: `- What is Query Derivation in Spring Data JPA?\n- What is the difference between \`CrudRepository\` and \`JpaRepository\`?\n- Can you replace Hibernate with another provider while still using Spring Data JPA?\n- What is the First-Level Cache in Hibernate?`,
      }
    },
    {
      title: 'How does Method Name Query Derivation work in Spring Data JPA',
      metaTitle: 'Spring Data JPA: Method Name Query Derivation Guide',
      metaDesc: 'Learn how Spring Data JPA automatically generates SQL queries simply by parsing repository method names.',
      concepts: ['Query Derivation', 'Spring Data JPA', 'Repositories'],
      quiz: { q: 'Which method name correctly searches for a User by their email and active status?', opts: ['searchUserEmailStatus()', 'findByEmailAndActive()', 'getByEmailAndActiveTrue()', 'findUserByEm&Act()'], ans: 'getByEmailAndActiveTrue()' },
      sections: {
        interviewer_expectation: `This is a highly practical skill. Interviewers want to see that you understand the naming conventions and limitations of this feature.\n\nExpectations include:\n- Knowing the prefixes (\`find\`, \`read\`, \`get\`, \`count\`).\n- Understanding how to chain properties with \`And\` / \`Or\`.\n- Using keywords like \`Between\`, \`LessThan\`, \`IgnoreCase\`, and \`OrderBy\`.\n- Knowing when NOT to use derivation (when names get too long or logic is too complex).`,
        core_concepts: `**Query Derivation Mechanism:**\nSpring Data JPA includes a query builder mechanism that strips the prefixes \`find...By\`, \`read...By\`, \`query...By\`, \`count...By\`, and \`get...By\` from the method name and parses the remainder of it to construct a JPQL query at startup.\n\n**Supported Keywords:**\n- **Logical Operators:** \`And\`, \`Or\`\n- **Comparisons:** \`Between\`, \`LessThan\`, \`GreaterThan\`, \`Like\`, \`In\`, \`IsNull\`\n- **String Modifiers:** \`IgnoreCase\`, \`StartingWith\`, \`EndingWith\`, \`Containing\`\n- **Ordering:** \`OrderByAgeDesc\`, \`OrderByLastnameAsc\`\n\n**Nested Properties:**\nIf your \`User\` entity has an \`Address\` entity, and \`Address\` has a \`ZipCode\`, you can query a user by their address zip code using \`findByAddressZipCode(String zipCode)\`.`,
        important_points: `- **Startup Parsing:** Spring parses these methods when the application context loads. If you write a method name that references a property that doesn't exist on the entity, Spring Boot will fail to start and throw a \`PropertyReferenceException\`.\n- **Readability Limit:** While you *can* write \`findByEmailIgnoreCaseAndStatusTrueAndAgeGreaterThanOrderByCreatedAtDesc\`, it becomes a maintenance nightmare. For complex queries, use the \`@Query\` annotation instead.\n- **Pagination & Sorting:** You can pass a \`Pageable\` or \`Sort\` object as the last parameter to dynamically add sorting or return a paginated result instead of hardcoding \`OrderBy\` in the method name.`,
        code_example: `\`\`\`java
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Simple equality
    List<Product> findByCategory(String category);

    // Multiple conditions
    List<Product> findByCategoryAndPriceLessThan(String category, BigDecimal price);

    // String manipulation
    List<Product> findByNameContainingIgnoreCase(String keyword);

    // Null checks
    List<Product> findByDeletedAtIsNull();

    // Nested properties (Product -> Manufacturer -> Name)
    // Underscore resolves ambiguity if field names clash
    List<Product> findByManufacturer_Name(String manufacturerName);

    // Using Pageable for dynamic sorting and pagination
    Page<Product> findByCategory(String category, Pageable pageable);

    // When derivation is too ugly, use @Query
    @Query("SELECT p FROM Product p WHERE p.category = :category AND p.stock > 0")
    List<Product> findAvailableInCategory(@Param("category") String category);
}
\`\`\``,
        speakable_answer: `Method Name Query Derivation is one of Spring Data JPA's most powerful features. When the Spring context starts, it inspects the method names inside your repository interfaces. If a method starts with a specific prefix like findBy, getBy, or countBy, Spring parses the rest of the method name to generate a JPQL query automatically.\n\nYou can build complex queries by chaining entity property names with keywords like And, Or, Between, LessThan, and IgnoreCase. For example, a method named findByEmailAndIsActiveTrue will generate the SQL required to look up a user with that specific email where the active flag is true. If you make a typo and reference a property that doesn't exist on the entity, Spring acts as a safety net and fails to start the application, alerting you immediately.\n\nWhile this is incredibly useful, I try to follow a rule of thumb: if the method name becomes too long and difficult to read, or if the logic involves complex joins, I switch to using the @Query annotation to write explicit JPQL.`,
        followup_questions: `- What happens if you misspell a property name in a query method?\n- How do you implement pagination on a derived query method?\n- When would you choose to use the \`@Query\` annotation over query derivation?\n- Explain what happens when a query derivation conflicts with a nested property name.`,
      }
    },
    {
      title: 'Explain the N+1 select problem in JPA and how to solve it',
      metaTitle: 'The N+1 Select Problem in JPA & Hibernate Explained',
      metaDesc: 'A deep dive into the notorious N+1 Select problem in ORM frameworks, how lazy loading causes it, and how to fix it using JOIN FETCH and EntityGraphs.',
      concepts: ['N+1 Problem', 'Lazy Loading', 'Join Fetch', 'EntityGraph'],
      quiz: { q: 'Which JPQL keyword is used to solve the N+1 problem by pulling associations in a single query?', opts: ['EAGER_FETCH', 'INCLUDE', 'JOIN FETCH', 'LOAD_ALL'], ans: 'JOIN FETCH' },
      sections: {
        interviewer_expectation: `This is arguably the most important performance question for JPA. If a candidate doesn't understand the N+1 problem, they will likely crash production databases. \n\nExpectations:\n- Clearly explaining *what* the problem is (1 query for the parent, N queries for the children).\n- Identifying the cause: accessing lazy-loaded collections inside a loop.\n- Explaining the solutions: \`JOIN FETCH\` in JPQL, and \`@EntityGraph\`.`,
        core_concepts: `**What is the N+1 Problem?**\nIt is a performance anti-pattern where an application executes 1 database query to fetch a list of entities (say, 100 Posts), and then inside a loop, executes N additional queries to fetch a related entity or collection for each one (say, the Comments for each Post). Thus, pulling 100 posts fires 101 total queries instead of 1.\n\n**The Cause:**\nThis happens when a relationship (like \`@OneToMany\`) is configured with \`FetchType.LAZY\` (which is the recommended default). When you query the parent \`Post\` list, Hibernate puts proxy objects in place for the \`comments\` collection. Later, in a loop, when you call \`post.getComments().size()\`, the proxy triggers a brand new SQL hit to load those comments.`,
        important_points: `- **Do NOT fix this by changing to \`FetchType.EAGER\`:** While EAGER loading sometimes accidentally fixes N+1, it is a terrible practice. It forces the database to load the associated data *every single time* you fetch a post, even if you don't need the comments, causing memory bloat and cartesian product issues.\n- **Solution 1: \`JOIN FETCH\`:** In your \`@Query\`, explicitly tell Hibernate to grab the associated entities in the initial SQL \`JOIN\`. \`SELECT p FROM Post p JOIN FETCH p.comments\$.\n- **Solution 2: \`@EntityGraph\`:** A modern Spring Data JPA annotation that allows you to temporarily override the lazy strategy for a specific repository method.\n- **Solution 3: Hibernate \`@BatchSize\` / Default Batch Fetching:** Instructs Hibernate to load proxies in batches (e.g., IN clauses of 50) when one is accessed, turning N+1 into (N/50)+1.`,
        code_example: `\`\`\`java
@Entity
public class Author {
    @Id private Long id;
    private String name;
    
    // Default is LAZY. We keep it that way.
    @OneToMany(mappedBy = "author", fetch = FetchType.LAZY)
    private List<Book> books;
}

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    // BAD: findAll() will cause N+1 if you access books later.
    // List<Author> findAll();

    // GOOD: Solution 1 using JPQL JOIN FETCH
    // Fires EXACTLY 1 query with an INNER JOIN
    @Query("SELECT a FROM Author a JOIN FETCH a.books")
    List<Author> findAllWithBooksJoinFetch();

    // GOOD: Solution 2 using EntityGraph (Cleaner for long queries)
    // Temporarily treats the 'books' collection as EAGER for this method
    @EntityGraph(attributePaths = {"books"})
    List<Author> findAll();
}

// IN THE SERVICE LAYER:
public void printAuthorBooks() {
    // 1. Using standard findAll() -> N+1 happens here:
    List<Author> badAuthors = badRepo.findAll(); // 1 query
    for(Author a : badAuthors) {
        System.out.println(a.getBooks().size()); // Fires 1 extra query per author! (N queries)
    }

    // 2. Using JOIN FETCH -> Solved:
    List<Author> goodAuthors = authorRepository.findAllWithBooksJoinFetch(); // 1 massive query
    for(Author a : goodAuthors) {
        System.out.println(a.getBooks().size()); // 0 extra queries! Uses loaded data.
    }
}
\`\`\``,
        speakable_answer: `The N+1 Select problem is a severe performance issue where the ORM executes one initial query to retrieve a list of parent entities, and then subsequently executes N additional queries to fetch the related child entities for each parent. \n\nThis almost always happens when you have a OneToMany or ManyToOne relationship configured lazily. If you run a findAll on the parent, Hibernate gives you the parents with proxy objects for the children. But if you then loop through that parent list and call a getter on the children to map them to a DTO, Hibernate fires off a separate SQL query to the database for every single iteration of the loop.\n\nThe absolutely wrong way to solve this is by changing the FetchType to EAGER on the entity, which causes massive memory bloat across the entire application.\n\nThe correct way to solve it is to keep the relationship LAZY, but override it specifically on the repository method where you know you need the data. You do this either by writing a custom JPQL query using the 'JOIN FETCH' keyword, which tells Hibernate to execute a SQL JOIN and collapse the data into one result set, or by using the Spring Data @EntityGraph annotation to specify which paths to eagerly load for that specific call.`,
        followup_questions: `- Why is configuring a relationship with \`FetchType.EAGER\` considered a bad practice?\n- What is the difference between an ordinary \`JOIN\` and a \`JOIN FETCH\` in JPQL?\n- How does configuring \`default_batch_fetch_size\` in \`application.properties\` help mitigate this?\n- What is a MultipleBagFetchException and how is it related to fixing the N+1 problem?`,
      }
    },
    {
      title: 'What is the difference between save() and saveAndFlush() in Spring Data JPA',
      metaTitle: 'Spring Data JPA: save() vs saveAndFlush() Methods',
      metaDesc: 'Understand the Hibernate Persistence Context, the transactional write-behind cache, and when to force DB syncs using saveAndFlush().',
      concepts: ['Persistence Context', 'save()', 'saveAndFlush()'],
      quiz: { q: 'When you call repository.save(), when is the SQL INSERT statement typically executed?', opts: ['Immediately on method call', 'In a separate background thread', 'Right before the transaction commits', 'When the database connection is closed'], ans: 'Right before the transaction commits' },
      sections: {
        interviewer_expectation: `This question evaluates your understanding of the Hibernate First-Level Cache and the concept of Transactions.\n\nExpectations include:\n- Explaining the "write-behind" cache behavior of Hibernate.\n- Identifying that \`save()\` primarily manages state in the Persistence Context without executing immediate SQL.\n- Recognizing that \`flush()\` forces the execution of pending SQL statements within the current transaction.`,
        core_concepts: `**The Persistence Context:**\nHibernate acts as a middleman between your application and the database. The First-Level Cache (the Persistence Context) tracks changes to entities during a transaction. Hibernate uses a "transactional write-behind" strategy, meaning it waits as long as possible before sending SQL statements to the database. It usually sends them right before the transaction commits.\n\n**\`repository.save(entity)\`:**\nWhen you call \`save()\`, Spring Data JPA either persists a new entity or merges an existing one into the persistence context. It **does not** immediately fire an \`INSERT\` or \`UPDATE\` SQL statement to the database. The entity is simply tracked. \n\n**\`repository.saveAndFlush(entity)\`:**\nThis method acts exactly like \`save()\`, but immediately follows it with a call to \`entityManager.flush()\`. Flushing forces Hibernate to take all pending changes in the persistence context and execute the corresponding SQL statements against the database *immediately*.`,
        important_points: `- **Transactions still govern:** Even if you call \`saveAndFlush()\`, the changes are only visible to the current transaction. They are NOT permanently committed to the database until the \`@Transactional\` method completes successfully. If an exception occurs, the flushed changes will still be rolled back.\n- **Use cases for \`saveAndFlush()\`:** \n  1. When using database-generated triggers or defaults and you need to read the updated data back immediately within the same transaction.\n  2. When you want to catch a specific database exception (like a \`DataIntegrityViolationException\` for a unique constraint) immediately in a \`try-catch\` block, rather than waiting for the transaction to proxy the commit at the end of the method.\n- Calling \`flush\` frequently degrades performance by bypassing Hibernate's ability to batch SQL statements.`,
        code_example: `\`\`\`java
@Service
public class UserService {

    @Autowired private UserRepository userRepository;

    @Transactional
    public void demonstrateSave() {
        User u = new User("alice@example.com");
        
        // No SQL INSERT happens here. The context just tracks 'u'.
        userRepository.save(u); 
        
        System.out.println("Processing other logic...");
        // The INSERT SQL is executed AFTER this line, 
        // silently managed by the @Transactional interceptor upon commit.
    }

    @Transactional
    public void demonstrateSaveAndFlush() {
        User u = new User("bob@example.com");
        
        try {
            // SQL INSERT is forced to execute on this exact line
            userRepository.saveAndFlush(u); 
            
        } catch (DataIntegrityViolationException e) {
            // We can catch database constraint errors immediately here!
            // If we only used save(), this catch block wouldn't work
            // because the error would happen during the silent transaction commit later.
            throw new CustomDuplicateEmailException("Email exists");
        }
    }
}
\`\`\``,
        speakable_answer: `The difference between save() and saveAndFlush() comes down to how Hibernate interacts with the database underneath Spring Data JPA. Hibernate uses a first-level cache called the Persistence Context, and defaults to a transactional write-behind strategy. \n\nWhen you call save(), you are telling the Persistence Context to track the entity. It does not trigger an immediate SQL INSERT or UPDATE. Instead, Hibernate batches these changes and waits until the absolute last moment—usually right before the @Transactional method closes—to fire the SQL statements into the database. \n\nsaveAndFlush(), on the other hand, tells Hibernate to track the entity and immediately push the pending SQL statements to the database. The transaction is not committed yet, but the SQL is executed. \n\nWe usually use save() because batching is better for performance. We only use saveAndFlush() in very specific scenarios, such as when we need to catch database constraint exceptions in a try-catch block immediately, or when we are relying on database-side triggers to populate data that we need to read in the very next line of code.`,
        followup_questions: `- What does the \`@Transactional\` annotation do under the hood?\n- If you update a managed entity object inside a \`@Transactional\` method without calling \`save()\`, what happens?\n- What is the difference between the First-Level Cache and the Second-Level Cache in Hibernate?\n- Explain what the \`Transient\`, \`Persistent\`, and \`Detached\` entity states mean.`,
      }
    },
    {
      title: 'How does Dirty Checking work in Hibernate and Spring Data JPA',
      metaTitle: 'Hibernate Dirty Checking: Automatic Updates in JPA',
      metaDesc: 'Discover how Hibernate automatically tracks changes to managed entities and issues UPDATE statements via the Dirty Checking mechanism.',
      concepts: ['Dirty Checking', 'Hibernate Context', 'Transactions'],
      quiz: { q: 'Do you need to explicitly call repository.save() to persist changes to an entity retrieved within a @Transactional method?', opts: ['Yes, always', 'No, not if the entity is managed by the Persistence Context', 'Only if the change is a one-to-many relationship', 'Only if using saveAndFlush()'], ans: 'No, not if the entity is managed by the Persistence Context' },
      sections: {
        interviewer_expectation: `This question separates beginners from intermediate Hibernate users. Interviewers look for:\n\n- Understanding that \`repository.save()\` is not strictly required for updates.\n- Knowledge of entity states (specifically the \`Persistent\` managed state).\n- Understanding the role of the Transaction boundary in triggering the database sync.`,
        core_concepts: `**State Management:**\nWhen you retrieve an entity from the database using a repository (e.g., \`findById()\`) within an active \`@Transactional\` method, that entity is in the **Persistent** state. It is "managed" by the Hibernate Session / Persistence Context.\n\n**Dirty Checking Mechanism:**\nHibernate keeps a snapshot of every managed entity as it looked when it was loaded. When the transaction prepares to commit (or before a flush/query operation), Hibernate iterates over every managed entity in its context and compares its current state against the original snapshot.\n\nIf it detects any differences—if the entity is "dirty"—Hibernate automatically generates and executes an \`UPDATE\` SQL statement. You do not need to explicitly call \`repository.save()\`.`,
        important_points: `- **@Transactional is mandatory:** Dirty checking only works within the bounds of a transaction because the flushing of the persistence context happens as the transaction commits. If you load an entity outside a transaction, modifying it does nothing to the database.\n- **Performance Overhead:** If you load 10,000 entities in a transaction, Hibernate has to compare 10,000 snapshots to their current state on commit. This is why read-only transactions are important.\n- **@Transactional(readOnly = true):** Applying this to read-heavy service methods tells Hibernate it can skip maintaining snapshots completely, disabling dirty checking and saving significant CPU and memory.\n- **Dynamic Updates:** By default, Hibernate updates *every* column in the \`UPDATE\` statement. If you only want it to update the modified columns, annotate the entity with \`@DynamicUpdate\`.`,
        code_example: `\`\`\`java
@Service
public class OrderService {

    @Autowired private OrderRepository orderRepository;

    // SCENARIO 1: Dirty Checking in action
    @Transactional
    public void updateOrderStatus(Long orderId, String newStatus) {
        // Entity is loaded into the Persistence Context (Persistent state)
        Order order = orderRepository.findById(orderId).orElseThrow();
        
        // We mutate the state
        order.setStatus(newStatus);
        
        // Notice we DO NOT CALL orderRepository.save(order)!
        // When this method ends, the @Transactional proxy commits.
        // During commit, Hibernate compares 'order' to its original snapshot,
        // notices the status changed, and fires: UPDATE orders SET status = ? WHERE id = ?
    }

    // SCENARIO 2: Using readOnly for performance optimization
    // We only intend to read data. Disabling dirty checking saves memory and CPU.
    @Transactional(readOnly = true)
    public List<Order> getAllOrdersForCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }
}
\`\`\``,
        speakable_answer: `Dirty checking is a core feature of Hibernate that automatically tracks and persists changes made to managed entities. \n\nWhen you run code inside a @Transactional method and retrieve an entity from the database using Spring Data JPA, that entity enters the 'Persistent' state. It is now actively managed by the Persistence Context. While it manages the object, Hibernate keeps a hidden copy, or snapshot, of the entity's initial state.\n\nWhen you modify properties on that entity using standard setter methods, you don't actually need to call the save() method on the repository. As the transaction prepares to commit, Hibernate performs a process called 'flushing'. It compares the current state of every managed entity against its original snapshot. If it detects that dirt, it automatically issues an UPDATE SQL query to the database to sync the new state.\n\nThis is why keeping transactions short is important. It also explains why we add readOnly = true to @Transactional annotations on fetch-only methods. It tells Hibernate to bypass creating snapshots and skip the dirty checking process entirely, which frees up memory and CPU.`,
        followup_questions: `- What does the \`@DynamicUpdate\` annotation do and when should you use it?\n- Why might explicitly calling \`repository.save()\` on an already managed entity still be considered good practice by some teams?\n- How does the \`merge()\` function work for detached entities?\n- What happens if you modify an entity after the \`@Transactional\` method has completed?`,
      }
    }
  ],
  'spring-security': [
    {
      title: 'How does the Spring Security Filter Chain work',
      metaTitle: 'Spring Security Internals: The DelegatingFilterProxy and Filter Chain',
      metaDesc: 'Dive deeply into the architecture of Spring Security to understand how requests are intercepted, authenticated, and authorized via the Filter Chain.',
      concepts: ['Security Filter Chain', 'Spring Security', 'DelegatingFilterProxy'],
      quiz: { q: 'Which component is responsible for bridging the gap between the Servlet container and the Spring ApplctionContext in Spring Security?', opts: ['SecurityContextHolder', 'AuthenticationManager', 'DelegatingFilterProxy', 'OncePerRequestFilter'], ans: 'DelegatingFilterProxy' },
      sections: {
        interviewer_expectation: `Spring Security is notoriously complex. Interviewers use this question to determine if you just copy-paste security configurations from StackOverflow, or if you actually understand the architecture.\n\nExpectations:\n- Explaining that it operates at the Servlet Filter level, before requests reach the \`DispatcherServlet\`.\n- Mentioning \`DelegatingFilterProxy\` and \`FilterChainProxy\`.\n- Understanding that there is a sequence of filters doing distinct jobs (CORS, CSRF, Authentication, Authorization).`,
        core_concepts: `**The Servlet Architecture:**\nUnder the hood, Java web applications (like Tomcat) process requests through a chain of standard Servlet Filters before they reach your Spring Controllers.\n\n**The Bridge (DelegatingFilterProxy):**\nServlet containers don't know anything about Spring Beans. Spring registers a standard servlet filter called \`DelegatingFilterProxy\`. Its only job is to catch the incoming request and hand it over to a Spring Bean in the Application Context known as \`springSecurityFilterChain\`.\n\n**FilterChainProxy and the Security Filter Chain:**\nThe \`springSecurityFilterChain\` Bean is an instance of \`FilterChainProxy\`. This proxy holds a list of configured \`SecurityFilterChain\` objects. \nDepending on the request URL, it delegates the request to a specific chain of custom Spring filters. These filters execute sequentially to handle things like:\n1. \`CorsFilter\` (Cross-origin requests)\n2. \`CsrfFilter\` (Cross-site request forgery protection)\n3. \`UsernamePasswordAuthenticationFilter\` (Intercepts login requests)\n4. \`BearerTokenAuthenticationFilter\` (Reads JWTs)\n5. \`AuthorizationFilter\` (Checks role/authority access)`,
        important_points: `- **Order Matters:** The order of filters is strictly defined by Spring Security. You can inject custom filters, but you must specify where (e.g., \`addFilterBefore(new JwtFilter(), UsernamePasswordAuthenticationFilter.class)\`).\n- **SecurityContextHolder:** Once a filter successfully authenticates a user, it stores an \`Authentication\` object in the \`SecurityContextHolder\` (which uses a ThreadLocal). This allows the rest of the application to know "who" the user is during that thread's execution.\n- **Handling Failures:** If an authentication filter fails (e.g., bad password), it throws an \`AuthenticationException\`. If an authorization filter fails (e.g., lacks "ADMIN" role), it throws an \`AccessDeniedException\`. The \`ExceptionTranslationFilter\` catches these and returns 401 Unauthorized or 403 Forbidden.`,
        code_example: `\`\`\`java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF since we are using stateless REST APIs
            .csrf(csrf -> csrf.disable())
            
            // 2. Set authorization rules on endpoints
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            
            // 3. Set stateless session policy (No HTTPSession created)
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 4. Inject our custom JWT filter BEFORE the standard Username/Password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
\`\`\``,
        speakable_answer: `Spring Security works as a series of Servlet Filters that intercept an HTTP request before it ever reaches the Spring MVC DispatcherServlet and your controllers. \n\nBecause standard servlet containers, like Tomcat, don't understand Spring Beans natively, Spring Security bridges this gap using a special filter called the DelegatingFilterProxy. This proxy catches the request and hands it over to the Spring application context, specifically to a bean called FilterChainProxy. \n\nThe FilterChainProxy manages the actual Spring Security Filter Chain. This is an ordered sequence of granular filters that evaluate the request step by step. First, it might pass through CORS and CSRF filters. Next, it hits Authentication filters, which try to identify who the user is—for example, by extracting a JWT from the headers. If authentication succeeds, the user's details are stored in the SecurityContextHolder, which is thread-local.\n\nFinally, the request hits the AuthorizationFilter at the very end of the chain, which reads the SecurityContext to see if the authenticated user has the required roles to access the requested URL. If everything passes, the request is finally handed to your controller framework.`,
        followup_questions: `- How do you inject a custom filter into the Spring Security chain?\n- What is the \`SecurityContextHolder\` and how does it share data across a request?\n- Explain the role of the \`ExceptionTranslationFilter\`.\n- What happens if you define multiple \`SecurityFilterChain\` beans?`,
      }
    },
    {
      title: 'What is the difference between Authentication and Authorization',
      metaTitle: 'Spring Security: Authentication vs Authorization Concepts',
      metaDesc: 'Clarify the critical difference between Authentication (Who are you?) and Authorization (What can you do?) in application security.',
      concepts: ['Authentication', 'Authorization', 'Spring Security Role-Based Access'],
      quiz: { q: 'Returning an HTTP 403 Forbidden error usually indicates a failure in which process?', opts: ['Authentication', 'Authorization', 'Encryption', 'Data Validation'], ans: 'Authorization' },
      sections: {
        interviewer_expectation: `This is security 101. Mixing up these terms is an immediate red flag in an interview.\n\nExpectations:\n- Define Authentication: Identify verification.\n- Define Authorization: Permissions and access control.\n- Map these concepts to HTTP status codes (401 vs 403).\n- Know which Spring Security interfaces handle which (\`AuthenticationManager\` vs \`AccessDecisionManager\` / \`@PreAuthorize\`).`,
        core_concepts: `**1. Authentication ("Who are you?"):**\nThis is the process of verifying a user's identity. The system asks the user for credentials to prove they are who they claim to be. \n- **Methods:** Username/Password, API Keys, Biometrics, OAuth2/OIDC, JWT tokens.\n- **Spring Component:** \`AuthenticationManager\` and \`AuthenticationProvider\`.\n- **Failure Result:** If the user provides bad credentials or no credentials when required, the system returns a **401 Unauthorized** HTTP status code.\n\n**2. Authorization ("What are you allowed to do?"):**\nThis is the process of determining if an identity has permission to perform a specific action or access a specific resource. It always happens *after* a successful authentication.\n- **Methods:** Role-Based Access Control (RBAC), Attribute-Based Access Control (ABAC), ACLs.\n- **Spring Component:** Method Security (\`@PreAuthorize\`), Request Matcher authorization rules.\n- **Failure Result:** If the user is successfully authenticated but tries to access an admin panel they don't have the role for, the system returns a **403 Forbidden** HTTP status code.`,
        important_points: `- Authentication is handled early in the filter chain (e.g., \`BearerTokenAuthenticationFilter\`).\n- Authorization is handled late in the filter chain (\`AuthorizationFilter\`) or directly at the method level using AOP proxies.\n- The \`Authentication\` object in Spring Security (stored in the \`SecurityContext\`) holds both: the principal/identity (Authentication result) and a collection of \`GrantedAuthority\` objects (used for Authorization).`,
        code_example: `\`\`\`java
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    // 1. Authenticated users only (Authentication check in SecurityConfig)
    @GetMapping("/public")
    public String viewPublicDocs() {
        return "List of public docs accessible by any logged-in user.";
    }

    // 2. Role-Based Authorization
    // Requires the user's GrantedAuthorities to include "ROLE_MANAGER"
    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/approve")
    public String approveDocument() {
        return "Document approved. Only Managers can do this.";
    }

    // 3. Attribute-Based Authorization
    // Authenticated user must be the actual owner of the document
    @PreAuthorize("#userId == authentication.principal.id")
    @GetMapping("/private/{userId}")
    public String viewPrivateDocs(@PathVariable Long userId) {
        return "This is private data belonging to user " + userId;
    }
}
\`\`\``,
        speakable_answer: `Authentication and Authorization are two distinct steps in securing an application. \n\nAuthentication answers the question: "Who are you?" It is the process of verifying a user's identity, usually by checking a username and password, or validating a JWT token. In Spring Security, this is managed by the AuthenticationManager. If authentication fails, the application returns an HTTP 401 Unauthorized status.\n\nAuthorization answers the question: "What are you allowed to do?" It occurs only after authentication succeeds. It checks whether the verified user has the necessary permissions or roles to access a specific resource. In Spring, we handle this using request matchers or method-level annotations like @PreAuthorize. If authorization fails—for example, if a standard user tries to hit an admin endpoint—the application returns an HTTP 403 Forbidden status. \n\nIn short, Authentication is about proving identity, while Authorization is about granting access based on that confirmed identity.`,
        followup_questions: `- What HTTP header is standard for passing a Bearer token during authentication?\n- Explain what the \`UserDetails\` interface is used for in Spring Security.\n- How does the \`ExceptionTranslationFilter\` differentiate between throwing a 401 and a 403?\n- What is the difference between \`hasRole('ADMIN')\` and \`hasAuthority('WRITE_PRIVILEGE')\` in Spring Security?`,
      }
    },
    {
      title: 'How does JWT Authentication work in a Stateless REST API',
      metaTitle: 'Implementing Stateless JWT Authentication in Spring Boot',
      metaDesc: 'A comprehensive explanation of JSON Web Tokens (JWT), how they enable stateless authentication workflows, and how to validate them in Spring Security.',
      concepts: ['JWT', 'Stateless Authentication', 'Spring Security'],
      quiz: { q: 'Which part of a JWT ensures that the token has not been tampered with?', opts: ['The Header', 'The Payload', 'The Signature', 'The Base64 Encoding'], ans: 'The Signature' },
      sections: {
        interviewer_expectation: `Stateless REST APIs using JWTs form the backbone of modern web microservices. A candidate must know exactly how this flow operates end-to-end.\n\nExpectations:\n- Understanding the three parts of a JWT (Header, Payload, Signature).\n- Knowing the login flow (Client authenticates -> Server returns JWT).\n- Knowing the request flow (Client sends JWT in Authorization header -> Server validates signature).\n- Explaining the meaning of "stateless" (No HTTP sessions required on the server).`,
        core_concepts: `**Stateless Authentication vs Session-Based:**\nIn traditional web apps, the server generates a Session ID, sends it as a cookie, and stores the user's state in server memory (\`HttpSession\`). In microservice architectures, this requires sticky routing or centralized caches (Redis) and doesn't scale well. \nStateless authentication using JWT means the server remembers nothing. Every request must carry all the information needed to authenticate it.\n\n**JWT Structure (Header.Payload.Signature):**\n1. By Base-64 encoding the algorithm type (Header) and the user claims like ID and roles (Payload).\n2. A Signature is generated by hashing the Header and Payload together using a secret key stored only on the server.\n\n**The Login Flow:**\n1. Client POSTs \`/login\` with username and password.\n2. Server validates credentials against the database.\n3. Server creates a JWT containing the user ID, signs it with a secret key, and returns the token to the client.\n\n**The Request Flow:**\n1. Client sends a request with the header \`Authorization: Bearer <token>\`.\n2. A custom Spring Filter intercepts the request, extracts the token, and verifies its signature using the secret key.\n3. If valid, the filter trusts the payload, creates an \`Authentication\` object without hitting the database, and saves it in the \`SecurityContext\`.`,
        important_points: `- **Base64 is not encryption.** The payload of a JWT can be read by anyone. Never put passwords or sensitive PII in a JWT payload.\n- **Invalidation is hard.** Because the token lives entirely on the client, you cannot traditionally "log a user out" server-side before the token expires. Solutions include short token lifespans with Refresh Tokens, or maintaining a server-side backlist of revoked tokens (which partially defeats the purpose of statelessness).\n- In Spring Security, you must explicitly set \`SessionCreationPolicy.STATELESS\` to prevent Spring from generating \`JSESSIONID\` cookies.`,
        code_example: `\`\`\`java
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        final String authHeader = request.getHeader("Authorization");

        // 1. Check if token exists and has correct prefix
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract Token and decode Username
        final String jwt = authHeader.substring(7);
        final String username = jwtService.extractUsername(jwt);

        // 3. If username exists and context is empty, attempt to authenticate
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 4. Validate the signature cryptographically
            if (jwtService.isTokenValid(jwt, userDetails)) {
                
                // 5. Create Authentication Token and load into Security Context
                UsernamePasswordAuthenticationToken authToken = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Continue down the chain
        filterChain.doFilter(request, response);
    }
}
\`\`\``,
        speakable_answer: `JWT Authentication is designed to construct stateless APIs. 'Stateless' means the server does not store user session data in memory. Every request from the client must prove who is asking.\n\nA JWT consists of three base-64 encoded parts: a Header, a Payload containing user claims like their ID, and a cryptographic Signature. \n\nThe flow starts when a user logs in with valid credentials. The server generates a JWT containing the user's ID, signs it using an internal secret key, and sends it back to the client. The server then immediately forgets about the user.\n\nFor any subsequent requests, the client attaches the JWT to the HTTP Authorization header. In Spring Boot, we write a custom filter to intercept the request and extract the token. The filter mathematically verifies the cryptographic signature against our secret key. If the math checks out, we know the token was generated by us and hasn't been altered. We extract the user identity from the payload, place it into the SecurityContextHolder, and let the request proceed. We never have to hit the database to verify the session.`,
        followup_questions: `- Why shouldn't you put passwords or sensitive data in a JWT payload?\n- How do you implement a 'Logout' functionality with stateless JWTs?\n- Describe the Refresh Token pattern and why it's necessary.\n- Where should a frontend Single Page Application (like React or Angular) store the JWT securely to prevent XSS attacks?`,
      }
    },
    {
      title: 'What does PasswordEncoder do and why use BCrypt',
      metaTitle: 'Password Hashing in Spring Security using BCrypt',
      metaDesc: 'Learn the difference between hashing and encryption, and why BCrypt is the industry standard PasswordEncoder in Spring Security.',
      concepts: ['PasswordEncoder', 'BCrypt', 'Cryptography', 'Hashing'],
      quiz: { q: 'What technique does BCrypt use to protect against Rainbow Table attacks?', opts: ['Base64 Encoding', 'Two-factor Authentication', 'Salting', 'Symmetric Encryption'], ans: 'Salting' },
      sections: {
        interviewer_expectation: `Security questions surrounding passwords test candidate maturity. Interviewers want to ensure you will never store plaintext passwords.\n\nExpectations:\n- Knowing the difference between Encryption (reversible) and Hashing (irreversible).\n- Understanding the \`PasswordEncoder\` interface in Spring Security.\n- Explaining what Salting is.\n- Explaining why BCrypt is preferred over algorithms like MD5 or SHA-256 (it's deliberately slow).`,
        core_concepts: `**Hashing vs Encryption:**\nEncryption is a two-way function: data is scrambled, and a key can be used to mathematically reverse the scramble. Hashing is a one-way mathematical function. A password goes in, and a fixed-length string comes out. You cannot mathematically reverse a hash to get the password back.\n\n**Salting:**\nA salt is a chunk of random data appended to a password before it is hashed. If two users have the password "password123", without a salt, their hashes would be identical in the database. A hacker could use pre-computed dictionaries of hashes (Rainbow Tables) to reverse-engineer passwords en masse. With random salting, every hash is unique, completely nullifying Rainbow Tables.\n\n**PasswordEncoder Interface:**\nSpring Security provides the \`PasswordEncoder\` interface to centralize hashing. The most common implementation is \`BCryptPasswordEncoder\`.`,
        important_points: `- **Why BCrypt over SHA-256?** Speed is the enemy of password hashing. Standard SHA algorithms are designed to be extremely fast. A modern GPU cluster can calculate billions of SHA-256 hashes a second, making brute-force attacks trivial. BCrypt is designed to be **deliberately slow and computationally expensive**. It includes a "work factor" (rounds of calculation) that you can increase as hardware gets faster over the years to keep brute-force unfeasible.\n- BCrypt handles salting automatically. It generates a random 16-byte salt, hashes it with the password, and stores the salt *alongside* the hash in the final output string itself.\n- When a user logs in, the \`matches()\` method extracts the salt from the database string, appends it to the raw password provided in the login form, computes the hash over again, and checks if the results match.`,
        code_example: `\`\`\`java
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // The default strength/work factor is 10.
        // We can increase it to 12 or 14 to deliberately slow down the hashing algorithm
        // as server processing power increases.
        return new BCryptPasswordEncoder(12);
    }
}

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(String rawPassword) {
        // We hash the password before saving to the DB.
        // BCrypt handles the random salt generation automatically.
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        User user = new User();
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }
    
    // Note: Spring Security's DaoAuthenticationProvider handles the login check automatically,
    // but if you were doing it manually:
    public boolean checkLogin(String rawPassword, String dbHashedPassword) {
        return passwordEncoder.matches(rawPassword, dbHashedPassword);
    }
}
\`\`\``,
        speakable_answer: `In Spring Security, the PasswordEncoder interface dictates how passwords are obfuscated and verified. It is an industry absolute standard that passwords must never be stored in plaintext. If the database is compromised, plaintext passwords expose users on every other site where they reuse that password.\n\nMoreover, we never use 'Encryption' for passwords; we use 'Hashing'. Hashing is a one-way mathematical process, meaning the original password cannot be decrypted. When a user logs in, we hash the password they typed and compare it to the hash in the database.\n\nThe industry standard algorithm, provided via BCryptPasswordEncoder, is BCrypt. It gives us two major benefits. \nFirst, it automatically handles 'salting'—adding random data to each password before hashing—so that identical passwords yield different hashes, defeating Rainbow Table attacks. \nSecond, unlike standard SHA hashes which are built for speed, BCrypt is deliberately slow. It has a configurable 'work factor' that demands intense CPU computation. This makes algorithmic brute-force attacks computationally impossible for hackers, while the millisecond delay is completely unnoticeable to a human logging in.`,
        followup_questions: `- Explain the difference between Hashing and Encryption.\n- What is a Rainbow Table attack and how does Salting defend against it?\n- Why is having a fast hashing algorithm considered a bad thing for passwords?\n- Where does BCrypt store the generated salt?`,
      }
    },
    {
      title: 'What is Method Security and how do you use @PreAuthorize',
      metaTitle: 'Method-Level Security in Spring Boot with @PreAuthorize',
      metaDesc: 'An advanced look at Role-Based Access Control using Spring Security Method Security annotations like @PreAuthorize, @PostAuthorize, and SPEL.',
      concepts: ['Method Security', '@PreAuthorize', 'Spring Expression Language (SpEL)'],
      quiz: { q: 'To use expressions like #userId == authentication.principal.id inside @PreAuthorize, what language does Spring use?', opts: ['JavaScript', 'HQL', 'SpEL (Spring Expression Language)', 'JPQL'], ans: 'SpEL (Spring Expression Language)' },
      sections: {
        interviewer_expectation: `Configuring URL-based security in a \`SecurityFilterChain\` bean is standard, but manipulating security dynamically inside specific service or controller methods shows maturity.\n\nExpectations:\n- Acknowledging that \`@EnableMethodSecurity\` must be enabled.\n- Understanding how \`@PreAuthorize\` intercept method execution.\n- Knowing how to use SpEL (Spring Expression Language) to enforce complex authorization rules that involve method parameters.\n- Understanding the difference between \`hasRole\` and \`hasAuthority\`.`,
        core_concepts: `**Method Security vs URL Security:**\nWhile you can secure the \`/admin/**\` paths in the \`SecurityFilterChain\`, this can become cumbersome for complex applications where business rules overlap across endpoints. Method security allows you to attach authorization rules directly to Controller or Service methods.\n\n**@EnableMethodSecurity:**\nTo make the annotations work, you must apply the \`@EnableMethodSecurity\` annotation to a configuration class. Under the hood, Spring wraps annotated classes in an AOP (Aspect-Oriented Programming) Proxy.\n\n**@PreAuthorize and SpEL:**\n\`@PreAuthorize\` evaluates a boolean expression *before* the method is invoked. If it returns false, Spring throws an \`AccessDeniedException\`. It supports the **Spring Expression Language (SpEL)**, allowing you to inject method arguments into the security evaluation.`,
        important_points: `- **Role vs Authority:** In Spring, a "Role" is a specialized type of Authority prefixed with \`ROLE_\`. If you use \`hasRole('ADMIN')\`, Spring checks the SecurityContext for the authority \`ROLE_ADMIN\`. If you use \`hasAuthority('WRITE_PRIVILEGE')\`, no prefix is added.\n- **@PostAuthorize:** Checks after the method executes. Useful if the authorization decision depends on the data returned by the method. It can access the return value using the \`returnObject\` SpEL variable.\n- **AOP Proxy Limit:** Because Method Security relies on Spring proxies, calling an annotated method from *within the same class* will bypass the proxy, meaning the security check will **not** happen.`,
        code_example: `\`\`\`java
@Configuration
@EnableMethodSecurity // CRITICAL: This enables @PreAuthorize, @PostAuthorize, etc.
public class MethodSecurityConfig {
}

@Service
public class DocumentService {

    // 1. Basic Built-in Rules
    @PreAuthorize("hasRole('ADMIN') or hasRole('EDITOR')")
    public void approveDocument() {
        // Logic executing only if user is an ADMIN or EDITOR
    }

    // 2. Using SpEL with method arguments
    // The user can only delete a document if they are an ADMIN, OR 
    // if the ID of their token matches the requested resource ID.
    @PreAuthorize("hasRole('ADMIN') or authentication.principal.id == #userId")
    public void deleteUserData(Long userId) {
        // Logic to delete data
    }

    // 3. PostAuthorize 
    // The method runs, queries DB, but throws an exception BEFORE the object is returned 
    // to the controller if the author doesn't match the current user.
    @PostAuthorize("returnObject.authorName == authentication.name")
    public Document getPrivateDocument(Long docId) {
        return repository.findById(docId).orElseThrow();
    }
}
\`\`\``,
        speakable_answer: `Method Security is a feature in Spring Security that allows you to enforce authorization rules directly on Controller or Service methods, rather than configuring paths at the global filter level. \n\nTo activate it, you first add the @EnableMethodSecurity annotation to a configuration class. This tells Spring to wrap targeted beans in AOP proxies.\n\nThe most common annotation used is @PreAuthorize. The magic of @PreAuthorize is that it accepts Spring Expression Language, or SpEL. This allows you do to far more than just basic role checks like hasRole('ADMIN'). Using SpEL, you can reference the method's input parameters and compare them against the currently authenticated user in the SecurityContext. For example, you can write a rule that says a user can only edit a profile if they possess an admin role, OR if the username in their token matches the username parameter being passed to the edit method.\n\nThere is also @PostAuthorize, which allows the method to execute fully and hit the database, but intercepts the response object before it reaches the caller to ensure the user has permission to view that specific piece of data.`,
        followup_questions: `- How does Spring AOP make Method Security possible under the hood?\n- Why do \`@PreAuthorize\` checks fail to trigger if the method is called from another method within the same class?\n- What is the difference in Spring between checking a Role and checking an Authority?\n- How does \`@PostAuthorize\` intercept data?`,
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
