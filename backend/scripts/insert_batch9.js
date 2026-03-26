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
  'system-design-basics': [
    {
      title: 'Explain the CAP Theorem and its implications for distributed databases',
      metaTitle: 'Mastering the CAP Theorem in System Design',
      metaDesc: 'A comprehensive guide to understanding Consistency, Availability, and Partition Tolerance in distributed systems, and why you can only choose two.',
      concepts: ['CAP Theorem', 'Consistency', 'Availability', 'Partition Tolerance', 'Distributed Systems'],
      quiz: { q: 'According to the CAP Theorem, if a network partition occurs between two data centers, what choice must a distributed database system make?', opts: ['It must sacrifice Partition Tolerance', 'It must choose between maintaining strict Consistency or maintaining high Availability', 'It must replicate data faster', 'It instantly defaults to a CP system'], ans: 'It must choose between maintaining strict Consistency or maintaining high Availability' },
      sections: {
        interviewer_expectation: `This is the most fundamental question in distributed data. Candidates must prove they know why modern NoSQL databases are built differently than traditional SQL.\n\nExpectations:\n- Defining Consistency, Availability, and Partition tolerance.\n- Explaining why 'P' is not optional in a distributed system.\n- Giving examples of CP vs AP databases.`,
        core_concepts: `**The Three Pillars (C. A. P.):**\n- **Consistency (C):** Every read receives the most recent write or an error. If User A updates their balance to $10, User B must see $10 instantly. No stale data.\n- **Availability (A):** Every request receives a (non-error) response, without the guarantee that it contains the most recent write. The system is always "up".\n- **Partition Tolerance (P):** The system continues to operate despite an arbitrary number of messages being dropped or delayed by the network between nodes (e.g., a cable is cut between Datacenter A and Datacenter B).\n\n**The Reality of Distributed Systems:**\nIn a distributed network (e.g., across the internet), network partitions WILL occur. Therefore, **Partition Tolerance (P) is mandatory, not optional.** \n\nWhen a partition occurs (Nodes can't talk to each other), the system is forced to make a trade-off:\n1. **Choose Consistency (CP):** The system refuses to answer requests until the partition heals, ensuring no one reads stale data. (Sacrifices Availability). Examples: HBase, MongoDB (default).\n2. **Choose Availability (AP):** The system answers the request using whatever old/stale data it currently has, prioritizing uptime. (Sacrifices strict Consistency). Examples: Cassandra, DynamoDB.`,
        important_points: `- **Eventual Consistency:** AP systems usually offer "Eventual Consistency". When the network heals, the nodes will sync back up in the background.\n- **PACELC Theorem:** An extension of CAP. It states that even when the system is running normally (No Partitions), you still have to trade-off between Latency (L) and Consistency (C).`,
        code_example: `\`\`\`text
// A Conceptual Example of a Network Partition

[Node A (New York)] <====== NETWORK CABLE CUT ======> [Node B (London)]

1. Client writes "Stock=50" to Node A. 
2. Node A cannot tell Node B about the update because the cable is cut.

WHAT HAPPENS WHEN A CLIENT READS FROM NODE B?

Option 1 (CP - Consistency Chosen):
Node B says: "I know the network is down. I might have stale data. I am 
shutting down my read API and throwing an Error so I don't give you bad data."
Result: System is Consistent, but strictly UNAVAILABLE.

Option 2 (AP - Availability Chosen):
Node B says: "The network is down, but I'll give you what I have. 
Last I heard, Stock was 100."
Result: System is Available, but INCONSISTENT (Client sees exactly the wrong data).
\`\`\``,
        speakable_answer: `The CAP theorem states that a distributed data store can provide at most two of the following three guarantees: Consistency, Availability, and Partition Tolerance.\n\nConsistency means every read receives the absolute most recent write. Availability means every request gets a non-error response, even if the node contains stale data. Partition Tolerance means the system survives network failures between its internal nodes.\n\nIn reality, because network partitions on the internet are unavoidable, Partition Tolerance is mandatory. Therefore, the CAP theorem dictates that when a network failure occurs, you are forced to choose between 'C' and 'A'.\n\nIf you choose Consistency—like many banking databases—you must sacrifice Availability. The disconnected database node will throw an error rather than serve potentially stale data. If you choose Availability—like Cassandra or a social media feed—the disconnected node will continue answering requests using whatever old data it has, relying on 'Eventual Consistency' to fix things once the network heals.`,
        followup_questions: `- What does the PACELC theorem add to the original CAP theorem?\n- Explain how a banking application vs. a social media "Like" counter would choose differently between AP and CP.\n- Is a traditional relational database (like a single MySQL master) considered CA, CP, or AP?`,
      }
    },
    {
      title: 'Compare Vertical Scaling (Scaling Up) against Horizontal Scaling (Scaling Out)',
      metaTitle: 'Scaling Strategies in System Design',
      metaDesc: 'Compare the benefits and limitations of Vertical Scaling vs Horizontal Scaling, and understand why modern cloud architectures rely heavily on scaling out.',
      concepts: ['Vertical Scaling', 'Horizontal Scaling', 'Load Balancing', 'System Availability'],
      quiz: { q: 'What is a major limitation of Vertical Scaling?', opts: ['It requires complex Load Balancers', 'It creates massive data consistency issues', 'It has a hard hardware limit and requires downtime to upgrade', 'It forces you to use microservices'], ans: 'It has a hard hardware limit and requires downtime to upgrade' },
      sections: {
        interviewer_expectation: `This is a fundamental capacity planning question. Candidates must know that while horizontal scaling is the modern standard, it introduces massive software complexity.\n\nExpectations:\n- Defining both scaling types clearly.\n- Explaining the hard limits of Vertical Scaling (hardware maximums, downtime).\n- Explaining the complexity of Horizontal Scaling (Load balancers, statelessness, distributed data).`,
        core_concepts: `**Vertical Scaling (Scaling Up):**\nAdding more power to a single existing machine (more CPU, more RAM, faster SSDs).\n- **Pros:** Incredibly easy. The software doesn't change. You don't need load balancers. There are no distributed system complexities.\n- **Cons:** It has a hard ceiling; eventually, you cannot buy a larger processor. It also requires downtime to turn the server off and add RAM, and it acts as a Single Point of Failure (SPOF).\n\n**Horizontal Scaling (Scaling Out):**\nAdding more machines to a pool of resources (going from 1 server to 10 servers).\n- **Pros:** Practically infinite scalability. It provides massive fault tolerance (if one server dies, the other 9 take over). It allows for zero-downtime deployments.\n- **Cons:** It massively increases architectural complexity. You now require a Load Balancer to distribute traffic. Your application code MUST become "Stateless" (you cannot store user sessions in local server memory anymore because the next request might go to a different server). Distributed database consistency becomes a nightmare.`,
        important_points: `- **Statelessness is Mandatory:** For horizontal scaling to work on the web tier, the servers cannot hold state. Session data must be moved out of the Tomcat server's RAM and placed into a centralized caching layer like Redis so all horizontally scaled nodes can access it.`,
        code_example: `\`\`\`text
// THE EVOLUTION OF TRAFFIC

Phase 1 (Low Traffic): 
[Internet] ---> [Single 2GB RAM Server (App + DB)]

Phase 2 (Traffic Increases - Vertical Scaling):
Action: Shut down server, upgrade to 16GB RAM.
[Internet] ---> [Single 16GB RAM Server (App + DB)]
* Limitation: What happens when 128GB isn't enough?

Phase 3 (Massive Traffic - Horizontal Scaling):
Action: Buy 5 small, cheap servers. Add a Load Balancer. Make app stateless.

                /---> [App Server 1 (Stateless)] --\\
[Internet] ---> [Load Balancer] ---> [App Server 2 (Stateless)] ---> [Centralized DB]
                \\---> [App Server 3 (Stateless)] --/
                
* Benefit: If Server 2 catches on fire, the Load Balancer instantly 
routes traffic to 1 and 3. No downtime for users.
\`\`\``,
        speakable_answer: `Vertical Scaling, or 'Scaling Up', means adding more resources like CPU or RAM to an existing single server. It is incredibly simple because you don't have to change your application architecture at all. However, it suffers from a hard hardware limit—eventually, you can't buy a larger motherboard—and upgrading usually requires system downtime. It also leaves you with a Single Point of Failure.\n\nHorizontal Scaling, or 'Scaling Out', means adding more standalone servers to a pool. This is the gold standard for modern cloud architectures. It provides virtually infinite scale and great fault tolerance. \n\nHowever, Horizontal Scaling introduces massive architectural complexity. You now require a Load Balancer to distribute internet traffic among the nodes. More importantly, it forces your application code to become 'Stateless'. You can no longer store user session data in the local server's memory, because a user's subsequent HTTP request might be routed to a completely different server. You have to extract that state into a central cache like Redis.`,
        followup_questions: `- Explain how "Sticky Sessions" work on a Load Balancer, and why they are generally considered an anti-pattern when scaling horizontally.\n- How does Horizontal Scaling affect database architecture compared to web server architecture?\n- Is it possible to use Vertical and Horizontal scaling at the same time? Give an example.`,
      }
    },
    {
      title: 'What is a Load Balancer and what are common routing algorithms used in them',
      metaTitle: 'Understanding Load Balancers and Routing Algorithms',
      metaDesc: 'Explore the critical role of Load Balancers in distributed systems, covering Layer 4 vs Layer 7 load balancing and popular routing algorithms.',
      concepts: ['Load Balancer', 'Round Robin', 'Layer 7', 'Reverse Proxy'],
      quiz: { q: 'Which load balancing strategy sends subsequent requests from the same user to the exact same backend server?', opts: ['Round Robin', 'Least Connections', 'IP Hash / Sticky Sessions', 'Random'], ans: 'IP Hash / Sticky Sessions' },
      sections: {
        interviewer_expectation: `Load balancers are the gateway to any scalable system. Candidates must know what they do and how they decide where to send traffic.\n\nExpectations:\n- Defining the purpose: Distributing traffic across multiple servers.\n- Mentioning health checks.\n- Naming at least 3 routing algorithms (Round Robin, Least Connections, IP Hash).\n- Differentiating L4 (Transport) vs L7 (Application) load balancing.`,
        core_concepts: `**Purpose of a Load Balancer:**\nA Load Balancer (LB) sits between the users and the server pool. Its job is to distribute incoming network traffic across multiple backend servers to ensure no single server becomes overwhelmed, improving responsiveness and availability.\n\n**Health Checks:**\nA critical feature of LBs is health checking. The LB constantly pings the backend servers (usually calling a \`/health\` endpoint). If Server B stops responding or returns a 500 error, the LB temporarily removes it from the pool and stops sending traffic to it until it recovers.\n\n**Routing Algorithms:**\n- **Round Robin:** The simplest. Requests are distributed sequentially: Server 1, then Server 2, then Server 3, then back to Server 1.\n- **Least Connections:** Routes the new request to the server that currently has the fewest active connections. Great when some requests (like downloading a huge file) keep a connection open much longer than others.\n- **IP Hash (Sticky Sessions):** A hash of the client's IP address is used to determine the server. This guarantees that User A will *always* connect to Server 2. This is useful if the backend servers are "Stateful" and hold local memory caches for that user (though this is increasingly viewed as an anti-pattern).`,
        important_points: `- **Layer 4 vs Layer 7:** \n  - **L4 (Transport Layer):** Looks only at IP addresses and TCP ports to route traffic. Extremely fast, but blind to the actual request data.\n  - **L7 (Application Layer):** Reads the actual HTTP Request (URLs, Headers, Cookies). It can route intelligently: "If the URL is \`/video\`, send it to the massive high-bandwidth servers. If the URL is \`/api\`, send it to the CPU-intensive servers."`,
        code_example: `\`\`\`nginx
# A simple Nginx Load Balancer Configuration (Layer 7)

http {
    # 1. Define the pool of backend servers
    upstream my_backend_app {
        # Using Least Connections algorithm instead of default Round Robin
        least_conn; 
        
        server 10.0.0.1:8080;
        server 10.0.0.2:8080;
        server 10.0.0.3:8080 fail_timeout=30s; # Basic Health Check fallback
    }

    server {
        listen 80;

        location / {
            # 2. Forward all incoming internet traffic to the pool above
            proxy_pass http://my_backend_app;
            
            # Forward the original client IP
            proxy_set_header X-Real-IP $remote_addr; 
        }
    }
}
\`\`\``,
        speakable_answer: `A Load Balancer is a critical component in any horizontally scaled architecture. It sits between the internet and your backend servers, acting as a traffic cop that distributes incoming requests to prevent any single server from becoming a bottleneck.\n\nA major feature of load balancers is Health Checking. They continuously ping the backend nodes, and if a server crashes, the load balancer instantly reroutes traffic away from it to ensure high availability.\n\nTo decide where to route traffic, Load Balancers use various algorithms. 'Round Robin' simply cycles through the servers sequentially. 'Least Connections' is smarter; it sends the new request to whichever server currently has the fewest active user connections. \n\nModern load balancers usually operate at Layer 7 of the OSI model. This means they can actually read the HTTP headers and URLs. Because of this, they can do intelligent routing—for example, sending all traffic starting with '/images' to a dedicated pool of media servers, while sending all '/api' traffic to a pool of heavy CPU servers.`,
        followup_questions: `- What are the downsides of relying on 'Sticky Sessions' (IP Hashing) in a load balancer?\n- If a single Load Balancer is routing traffic to 100 servers, how do you prevent the Load Balancer itself from becoming a Single Point of Failure?\n- Explain the difference in performance and capability between an L4 (Transport) Load Balancer and an L7 (Application) Load Balancer.`,
      }
    },
    {
      title: 'Compare Relational Databases (SQL) against Non-Relational Databases (NoSQL)',
      metaTitle: 'SQL vs NoSQL: Choosing the Right Database',
      metaDesc: 'A deep comparative analysis of SQL vs NoSQL databases, discussing schemas, ACID compliance, scaling strategies, and real-world use cases.',
      concepts: ['SQL', 'NoSQL', 'ACID', 'Data Modeling', 'Scaling'],
      quiz: { q: 'Which of the following is typically a defining characteristic of most NoSQL databases?', opts: ['They enforce strict, rigidly defined schemas', 'They possess complex JOIN capabilities', 'They are designed primarily to scale horizontally using distributed nodes', 'They strictly adhere to full ACID transaction standards out of the box'], ans: 'They are designed primarily to scale horizontally using distributed nodes' },
      sections: {
        interviewer_expectation: `This asks the candidate to justify their technology decisions. "NoSQL is faster" is a terrible answer. They need to talk about data structure and scaling.\n\nExpectations:\n- SQL: Strict schema, Relational (JOINs), ACID transactions, Vertical Scaling.\n- NoSQL: Dynamic schema, Document/Key-Value, Eventual Consistency, Horizontal Scaling.\n- Use Cases: SQL for financial data; NoSQL for rapid prototyping, massive unstructured data, or high-throughput logging.`,
        core_concepts: `**SQL (Relational): MySQL, PostgreSQL**\n- **Structure:** Tabular data with strict schemas (columns defined up front). Uses Foreign Keys to map relationships between tables.\n- **Querying:** Powerful \`JOIN\` operations allowing you to query deeply connected data dynamically.\n- **Integrity:** Focuses heavily on ACID compliance (Atomicity, Consistency, Isolation, Durability). 100% data integrity is guaranteed.\n- **Scaling:** Traditionally scales **Vertically** (buying a bigger server). True horizontal scaling for writes is notoriously difficult.\n\n**NoSQL (Non-Relational): MongoDB, Cassandra, DynamoDB**\n- **Structure:** Flexible/Dynamic schemas. Data can be JSON documents, Key-Value pairs, or Wide-Column arrays. You can add a new field to one document without affecting others.\n- **Querying:** Generally lacks complex \`JOIN\` operations. Data is usually "denormalized" (duplicated and nested) to make reads faster.\n- **Integrity:** Often trades strict ACID guarantees for the CAP Theorem's Availability and Partition Tolerance (Eventual Consistency).\n- **Scaling:** Designed from the ground up to scale **Horizontally**. Data is automatically sharded across hundreds of commodity servers.`,
        important_points: `- **Denormalization:** In SQL, you create a \`Users\` table and an \`Addresses\` table, and JOIN them. In NoSQL (Document store), you usually embed the Address JSON directly exactly *inside* the User document. This makes reads blazing fast but updates more complicated.\n- **Convergence:** The lines are blurring. Postgres now has incredible JSONB support (acting like NoSQL), and MongoDB has added multi-document ACID transactions (acting like SQL).`,
        code_example: `\`\`\`sql
-- SQL: Strict Rules, Normalization, Relationships
CREATE TABLE Users (
    id INT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);
CREATE TABLE Orders (
    id INT PRIMARY KEY,
    amount DECIMAL(10,2),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
-- To get data, we DO A JOIN.
\`\`\`

\`\`\`javascript
// NoSQL (MongoDB): Flexible Schema, Embedded Data (Denormalized)
// We just dump the entire object into the collection. No joins needed to read it.
{
  "_id": ObjectId("5f4e..."),
  "name": "Alice",
  "age": 28, // Schema is flexible. Bob's document might not have 'age'
  "orders": [
    { "amount": 99.50, "date": "2023-10-01" },
    { "amount": 12.00, "date": "2023-10-05" }
  ]
}
\`\`\``,
        speakable_answer: `The choice between SQL and NoSQL fundamentally comes down to how your data is structured and how you intend to scale.\n\nSQL, or Relational Databases like Postgres, are built on strict, rigid schemas. You normalize your data into separate tables and use JOINs to connect them. SQL guarantees complete ACID compliance, which means it is absolutely essential for financial transactions where data integrity is paramount. However, SQL historically scales vertically, which creates hardware limitations under massive traffic.\n\nNoSQL databases—like MongoDB or DynamoDB—were built to solve that scaling problem. They have dynamic, schema-less designs, storing data as JSON documents or Key-Value pairs. Instead of joining tables, you denormalize and embed related data together. NoSQL databases are designed from the ground up to scale horizontally across hundreds of servers via sharding. The trade-off is that they often rely on Eventual Consistency rather than strict ACID guarantees.\n\nIf you have highly structured data with complex relationships, or require financial accuracy, use SQL. If you have massive amounts of rapidly changing, unstructured data—like an IoT sensor stream or a gaming leaderboard—and need infinite horizontal write-scaling, use NoSQL.`,
        followup_questions: `- Explain the concept of "Denormalization" in NoSQL and why it leads to faster reads but slower, riskier writes.\n- In modern PostgreSQL, how does the \`JSONB\` column type somewhat bridge the gap between SQL and NoSQL?\n- Why is it difficult to perform a standard SQL \`JOIN\` across horizontally sharded database nodes?`,
      }
    },
    {
      title: 'What is Database Sharding and why is it considered the most complex scaling strategy',
      metaTitle: 'Mastering Database Sharding and Partitioning',
      metaDesc: 'Dive into Database Sharding, the ultimate technique for horizontally scaling relational databases, and learn about the complexity of routing logic and resharding.',
      concepts: ['Database Sharding', 'Horizontal Partitioning', 'Hash Rings', 'Scaling Writes'],
      quiz: { q: 'Which of the following is the primary challenge introduced by implementing database sharding?', opts: ['It makes read queries slower on a single shard', 'It complicates application architecture because the application must now calculate a routing key to determine which shard holds the specific user is data', 'It requires switching from SQL to NoSQL', 'It prevents the use of database indexes'], ans: 'It complicates application architecture because the application must now calculate a routing key to determine which shard holds the specific user is data' },
      sections: {
        interviewer_expectation: `This is an advanced data management topic. Sharding is the "last resort" for scaling SQL writes. Candidates should understand the immense architectural pain it causes.\n\nExpectations:\n- Defining sharding as Horizontal Partitioning of data across multiple physical disk/servers.\n- Explaining the Shard Key (how you decide where data goes).\n- Highlighting the massive complexities: Cross-shard joins are impossible, and re-balancing data is a nightmare.`,
        core_concepts: `**The Write Bottleneck:**\nIf a database has too many *Reads*, you add Read Replicas. But if a database has too many *Writes* (insertions/updates), replicas don't help. The primary master node becomes the bottleneck. \nTo scale writes horizontally, we use **Sharding** (Horizontal Partitioning).\n\n**What is Sharding?**\nSharding is taking one massive 1-Billion-row table and cutting it horizontally into 10 smaller tables of 100-Million rows, and putting each chunk on a completely different physical server (Shard D, Shard E, etc.).\n\n**The Shard Key:**\nTo make this work, you must define a Shard Key. \nFor example, if the key is \`User ID\`, you might use a Hash algorithm. User ID 50 hashes to Server A. User ID 99 hashes to Server B. \nThe application logic (or an intermediate proxy) MUST intercept every database query, look at the User ID, run the hash, and route the SQL query to the correct physical server.\n\n**The Nightmare of Sharding:**\n1. **No Cross-Shard Joins:** If User A (on Server 1) wants to see data related to User B (on Server 2), you cannot write a SQL \`JOIN\`. The data is on different physical hard drives. The Application Layer has to pull from both servers and join it in Java memory.\n2. **The Celebrity Problem (Hotspots):** If you shard by "Twitter Handle", Lady Gaga's shard will receive 10,000x more traffic than yours, rendering that specific server overwhelmed while the others sit idle.\n3. **Resharding:** If your 10 shards fill up and you need to add an 11th, the hash math changes. You must migrate millions of rows of data between live servers without downtime.`,
        important_points: `- **Consistent Hashing:** To solve the "Resharding" math problem, engineers use a concept called "Consistent Hashing" (a hash ring), which minimizes the amount of data that needs to be moved when a new shard is brought online.\n- **NewSQL:** Modern distributed databases like CockroachDB or Google Spanner handle this sharding logic internally and automatically, abstracting the nightmare away from the application developer.`,
        code_example: `\`\`\`text
// Conceptual view of Application-level Sharding

1. User requests their profile: GET /user/105

2. Application Layer needs to fetch from DB:
   int targetShard = hashFunction(105); // returns Shard_B
   
3. Application establishes a connection specifically to DB_Shard_B
   "SELECT * FROM Users WHERE id = 105"

------------------------------------------------

DATABASE ARCHITECTURE:
[Shard A (User IDs 1-100)]       -> Physical Server 1 (Paris)
[Shard B (User IDs 101-200)]     -> Physical Server 2 (London)
[Shard C (User IDs 201-300)]     -> Physical Server 3 (Berlin)

* Notice that to the application, there is no longer a single "Database".
* The application must act as a router.
\`\`\``,
        speakable_answer: `Database Sharding is the process of horizontally partitioning a massive database table across multiple physically independent servers. We usually do this as a last resort when the database is receiving so many write operations that a single master server can no longer handle the disk I/O.\n\nWhile sharding provides massive write scalability, it introduces phenomenal architectural complexity. \nFirst, you must choose a Shard Key—like User ID—and use a hashing algorithm to determine which server that specific user's data lives on. Your application code or a database proxy must now route every single SQL query to the correct physical machine.\n\nThe real pain of sharding is that standard database features break. You can no longer perform a SQL JOIN across tables if the data resides on different shards, because they are on different physical hard drives. You also face the 'Hotspot' problem, where one shard receives vastly more traffic than others due to uneven data distribution. Finally, resharding—adding a new server to the cluster when the others fill up—requires manually re-evaluating the hash ring and migrating live data between servers without causing downtime.`,
        followup_questions: `- Explain what "Consistent Hashing" is and how it solves the problem of adding a new server during a Resharding operation.\n- What is the "Celebrity Problem" in sharding, and how can choosing a bad Shard Key destroy your system's performance?\n- How does Sharding fundamentally differ from configuring Database Read Replicas?`,
      }
    }
  ],
  'advanced-java': [
    {
      title: 'Explain the internal working of a HashMap in Java (pre and post Java 8)',
      metaTitle: 'Mastering the Java HashMap Internals',
      metaDesc: 'A deep dive into the inner workings of Java\'s HashMap, covering hash functions, bucket arrays, collision resolution via linked lists, and Java 8 Red-Black trees.',
      concepts: ['HashMapInternals', 'Hashing', 'Buckets', 'Red-Black Tree', 'Time Complexity'],
      quiz: { q: 'In Java 8, what happens to a HashMap bucket when too many hash collisions occur in the same bucket?', opts: ['The JVM throws a `CollisionLimitExceededException`', 'The HashMap automatically increases the array capacity to spread them out immediately', 'The underlying Linked List structure transforms into a Red-Black Tree to degrade lookup time from O(N) to O(log N)', 'The elements are simply lost'], ans: 'The underlying Linked List structure transforms into a Red-Black Tree to degrade lookup time from O(N) to O(log N)' },
      sections: {
        interviewer_expectation: `This is the most common Advanced Java interview question. It proves the candidate understands data structures, memory, and algorithmic complexity, not just API usage.\n\nExpectations:\n- Defining the initial Array of Buckets.\n- Explaining the \`hashCode()\` to index translation.\n- Explaining Collision resolution using Linked Lists.\n- Crucially: Explaining the Java 8 optimization (Linked List to Red-Black Tree).`,
        core_concepts: `**1. The Backing Structure:**\nInternally, a \`HashMap\` is simply an Array of "Nodes" (or buckets). By default, this array has a capacity of 16.\n\n**2. The Hashing Process (PUT operation):**\nWhen you call \`map.put("Alice", 25)\`:\n- Java calls \`"Alice".hashCode()\`, returning a massive integer.\n- It runs a bitwise AND operation (modulo) against the array's capacity (16) to calculate a specific Array Index (e.g., Index 4).\n- It places the data (Key="Alice", Value=25) into Bucket index 4.\n\n**3. Hash Collisions:**\nWhat if \`map.put("Bob", 30)\` also calculates to Index 4? This is a Collision.\n- **Pre-Java 8:** The \`HashMap\` handles this by turning Bucket 4 into a Linked List. Bob is attached to the end of Alice. To find Bob later, Java must iterate through the Linked List.\n- **The O(N) Danger:** If 1000 keys mistakenly hash to Bucket 4, finding a value degrades from \`O(1)\` time to \`O(N)\` time, destroying map performance.\n\n**4. The Java 8 Optimization:**\nIn Java 8, if a Linked List in a single bucket grows beyond a certain threshold (default is 8 nodes), the \`HashMap\` dynamically transforms that Linked List into a **Red-Black Tree**.\nThis is a self-balancing binary search tree. Now, even if there are 1000 collisions in one bucket, the search time degrades only to \`O(log N)\` rather than \`O(N)\`, significantly protecting system performance against bad hashCode implementations.`,
        important_points: `- **Load Factor & Rehashing:** A \`HashMap\` has a default Load Factor of 0.75. When the map becomes 75% full (12 items in a 16-bucket array), it triggers a Rehash. It creates a brand-new array double the size (32) and completely recalculates the bucket index for every single item. This is an extremely CPU-intensive operation.`,
        code_example: `\`\`\`text
// VISUALIZING THE HASHMAP ARRAY (Capacity = 8 for simplicity)

[0] -> null
[1] -> Node(K="David", V=40)
[2] -> Node(K="Alice", V=25) -> (Linked List) -> Node(K="Bob", V=30) 
[3] -> null
[4] -> null
[5] -> Node(K="Charlie", V=15)
[6] -> null
[7] -> null

// What happens in Java 8 if Bucket [2] gets 8 elements linked together?
// It transforms into a Tree!

[2] ->       Node(Alice)
             /         \\
     Node(Alex)       Node(Bob)
       /                /     \\
Node(Adam)      Node(Bill)   Node(Ben)
\`\`\``,
        speakable_answer: `Internally, a Java HashMap is backed by an Array of buckets, which defaults to a size of 16. \n\nWhen you put a key-value pair into the map, Java calls the 'hashCode()' method on the key. It takes that integer, applies a bitwise modulo operation based on the array size, and computes exactly which bucket index the data should be stored in. This allows for blazingly fast O(1) retrieval.\n\nHowever, problems occur when two different keys compute to the exact same bucket index, known as a Hash Collision. To resolve this, the bucket becomes a Linked List, holding both elements. When retrieving data from a collided bucket, Java has to evaluate the 'equals()' method on each node in the list. If you have terrible hashing and 100 elements end up in the same bucket, your lookup performance degrades to O(N).\n\nTo fix this flaw, Java 8 introduced a major optimization. If the Linked List in any single bucket reaches a threshold of 8 elements, the structure dynamically transforms into a Red-Black Tree. This guarantees that even in the absolute worst-case scenario of massive collisions, the search time complexity will only ever degrade to O(log N).`,
        followup_questions: `- Explain the mathematical purpose of the "Load Factor" (default 0.75) and what "Rehashing" means when it is triggered.\n- Why is it a disastrous bug to override \`equals()\` on a custom object but forget to override \`hashCode()\` when using it as a HashMap key?\n- In Java, a \`ConcurrentHashMap\` is thread-safe while a standard \`HashMap\` is not. How does a \`ConcurrentHashMap\` achieve this without locking the entire map?`,
      }
    },
    {
      title: 'What is the Java Memory Model (JMM) and the difference between Heap and Stack memory',
      metaTitle: 'Java Memory Architecture: Heap vs Stack',
      metaDesc: 'A foundational overview of Java memory management, differentiating between the Thread Stack for execution and the shared Heap for object storage.',
      concepts: ['Java Memory Model', 'Heap Memory', 'Stack Memory', 'Garbage Collection'],
      quiz: { q: 'When a method creates a new Object using the `new` keyword (e.g. `User u = new User();`), where is the actual Object data stored, and where is the reference variable `u` stored?', opts: ['Both are stored in the Stack space of the active thread', 'The Object data is on the Heap; the reference variable `u` is on the Stack', 'The Object data is on the Stack; the reference is on the Heap', 'Both are stored in the Metaspace (PermGen)'], ans: 'The Object data is on the Heap; the reference variable `u` is on the Stack' },
      sections: {
        interviewer_expectation: `This tests low-level system understanding. Developers who don't know the difference between Heap and Stack write memory leaks and get StackOverflowErrors.\n\nExpectations:\n- Defining the Stack (per thread, local variables, method calls, primitive types).\n- Defining the Heap (shared memory, all objects created via \`new\`, Garbage Collected).\n- Explaining reference vs literal storage.`,
        core_concepts: `**1. Stack Memory (The Execution Scope):**\n- **Ownership:** Every single Thread in Java gets its own private Stack. Stacks cannot be accessed by other threads.\n- **Purpose:** It tracks the execution of methods through "Stack Frames." Every time a method is called, a new frame is pushed onto the top. When the method finishes, it pops off.\n- **Storage:** It stores local primitive variables (int, double, boolean) and **references** (pointers) to complex objects.\n- **Lifespan:** Very short. Variables die the moment the method (frame) finishes.\n\n**2. Heap Memory (The Global Storage):**\n- **Ownership:** There is only ONE Heap per JVM. All threads share it.\n- **Purpose:** It stores actual Objects. If you write \`new Something()\`, the memory for that object is allocated on the Heap.\n- **Storage:** Complex objects, Arrays, and Strings (String Pool).\n- **Lifespan:** Long. Objects live on the Heap until all Stack references pointing to them are destroyed. At that point, the Garbage Collector deletes them to free up RAM.`,
        important_points: `- **Pass by Value:** Java is strictly Pass-by-Value. When passing an Object to a method, you are passing the *value of the reference* (the pointer address residing on the stack) to the new stack frame. Both stack frames now point to the exact same object on the shared Heap.`,
        code_example: `\`\`\`java
public class MemoryExample {

    public static void main(String[] args) {
        // 1. 'x' is a primitive. The value '10' is stored directly on the Thread STACK.
        int x = 10; 

        // 2. 'new User()' allocates a massive 50MB object on the shared HEAP.
        // 3. 'user1' is just a tiny reference (pointer) stored on the STACK, pointing to the Heap.
        User user1 = new User("Alice"); 
        
        // 4. A new Stack Frame is created for calculate()
        calculate(user1); 
        
    } // <- main() method stack frame pops. 'x' and 'user1' references are destroyed. 
      // The Alice User object on the Heap now has 0 pointers. It becomes eligible for Garbage Collection.

    public static void calculate(User uParam) {
        // 'uParam' is a NEW reference variable on this specific stack frame.
        // But it points to the EXACT SAME Object on the shared Heap as 'user1'.
        uParam.setName("Bob"); 
    }
}
\`\`\``,
        speakable_answer: `The Java Memory Model broadly divides memory into two main areas: the Stack and the Heap.\n\nStack memory is highly structured, very fast, and extremely localized. Every Thread in Java gets its own private Stack. The Stack is utilized for execution tracking via 'Stack Frames'. Whenever a method is called, a frame is pushed; when it returns, it pops. The Stack strictly holds primitive local variables like 'int' and 'boolean', as well as tiny reference variables—which are essentially memory pointers.\n\nHeap memory, on the other hand, is a massive, globally shared pool of RAM accessible by all threads. Any time you use the 'new' keyword to instantiate an Object, that physical object is created on the Heap. \n\nSo, if you declare 'User u = new User()', the complex User object lives on the shared Heap, while the tiny reference variable 'u' lives on your thread's isolated Stack. When a method finishes and the Stack frame is destroyed, the 'u' reference vanishes. If no other references point to that User object on the Heap, the Java Garbage Collector will eventually sweep it away to reclaim memory.`,
        followup_questions: `- What causes a \`StackOverflowError\` versus an \`OutOfMemoryError\` (OOM)?\n- What is the "String Pool" in Java, and where does it reside in memory?\n- Explain what happens structurally in memory when two threads try to modify the exact same Object on the Heap simultaneously.`,
      }
    },
    {
      title: 'Explain the principles of the Java Garbage Collector (GC) and generational garbage collection',
      metaTitle: 'Understanding Java Garbage Collection',
      metaDesc: 'Learn how Java automates memory management through Garbage Collection, exploring the generational hypothesis: Young Generation, Old Generation, and Stop-The-World pauses.',
      concepts: ['Garbage Collection', 'Generational GC', 'Stop The World', 'Young Generation'],
      quiz: { q: 'According to the "Weak Generational Hypothesis" which heavily influences Java GC design, which of the following statements is true?', opts: ['Large objects are collected faster than small objects', 'Most newly created objects die very quickly, while objects that survive a long time tend to stay alive forever', 'The Garbage Collector runs continuously on a separate thread taking exactly 50% CPU', 'Objects are deleted as soon as they go out of scope using reference counting'], ans: 'Most newly created objects die very quickly, while objects that survive a long time tend to stay alive forever' },
      sections: {
        interviewer_expectation: `Senior Java roles require tuning the JVM. Candidates must understand "Stop the World" events and the generational architecture (Eden, Survivor, Tenured).\n\nExpectations:\n- Defining GC: Automatic reclamation of unreferenced Heap objects.\n- Defining "Stop the World" pauses.\n- Explaining the Generational Hypothesis (most objects die young).\n- Differentiating Minor GC (fast, Young Gen) vs Major GC (slow, Old Gen).`,
        core_concepts: `**What is Garbage Collection?**\nIn languages like C++, developers must manually write \`free(memory)\`. In Java, a background daemon engine (the GC) automatically scans the Heap, identifies objects that no longer have any active Stack references pointing to them, and deletes them to free RAM.\n\n**The Weak Generational Hypothesis:**\nIBM analysts discovered that in OOP systems, 95% of objects are created inside a method and die the moment the method ends. Thus, *most objects die young.* Java designed its Heap around this fact by splitting it into "Generations".\n\n**1. The Young Generation (Minor GC):**\n- All fresh \`new\` objects are placed in the "Eden Space". \n- Eden fills up very fast. When full, a **Minor GC** occurs. \n- The GC quickly looks for the surviving 5%. It moves them to a "Survivor" space and blindly clears the entire Eden space. This is incredibly fast.\n\n**2. The Old Generation (Major GC):**\n- If an object survives multiple Minor GCs (e.g., a long-lived database connection pool), it is "promoted" to the Old Generation (Tenured space).\n- The Old Gen fills up very slowly. When it does, a **Major GC** occurs.\n- Major GCs are very slow because they have to scan massive amounts of scattered, long-living data.\n\n**Stop-The-World (STW):**\nDuring certain phases of Garbage Collection, the JVM must literally freeze all application threads. Web requests pause, everything stops. If a Major GC takes 5 seconds, your application suffers a 5-second lag spike. Tuning the JVM is entirely about minimizing STW pauses.`,
        important_points: `- **Modern GCs:** Older GCs (Parallel, CMS) suffered from long STW pauses. Modern Java uses the **G1GC** (Garbage First) by default, and newer versions offer **ZGC** and **Shenandoah**, which boast sub-millisecond STW pauses regardless of how massive the Heap is (Terabytes).`,
        code_example: `\`\`\`text
// VISUALIZING THE HEAP ARCHITECTURE

[        THE COMPLETE JVM HEAP        ]
---------------------------------------
[   YOUNG GENERATION    ] [  OLD GEN  ]
[ Eden  ][ S0 ][ S1 ]     [ Tenured   ]

Lifecycle:
1. Object 'A' created via 'new'. Goes to [Eden].
2. [Eden] fills up. MINOR GC triggers. (Stop The World for 0.01 seconds)
3. Object 'A' is still referenced! It moves to Survivor Space [S0].
4. 15 more Minor GCs happen. Object 'A' is incredibly stubborn.
5. The JVM promotes Object 'A' into [Tenured / Old Gen].
6. Days later, [Old Gen] fills up. MAJOR GC triggers. (Stop The World for 2.0 seconds)
7. The JVM scans the entire heap, finds Object A is dead, and clears it.
\`\`\``,
        speakable_answer: `Java handles memory management automatically via the Garbage Collector. It scans the Heap memory to find objects that no longer have any active references pointing to them, and destroys them to free up RAM.\n\nModern Java GC is 'Generational', based on the Weak Generational Hypothesis which states that 'most objects die young'. Because most objects are just temporary local variables inside methods, the Heap is split into a Young Generation and an Old Generation.\n\nWhen you instantiate a new object, it goes into the Young Generation's 'Eden' space. Because this space fills rapidly, Java frequently performs a 'Minor GC'. This scan is blazingly fast; it finds the 5 percent of objects still alive, moves them to a Survivor space, and instantly wipes Eden clean. \n\nIf an object survives multiple Minor GCs—like a global configuration object or a Spring bean—it gets promoted to the Old Generation. The Old Generation fills up much slower, but when it does, it triggers a 'Major GC'. \n\nMajor GCs are computationally expensive and trigger what are called 'Stop-The-World' events. The JVM literally pauses all application threads—meaning your web server stops answering HTTP requests—until the garbage collection is complete. Much of JVM tuning involves preventing massive Stop-The-World pauses by adjusting the ratios between these generations.`,
        followup_questions: `- How does the Garbage Collector actually identify which objects are "alive" (explain the concept of GC Roots)?\n- Explain the difference in architecture between the default G1GC (Garbage First) and the newer ZGC.\n- What does the JVM flag \`-Xmx\` and \`-Xms\` configure?`,
      }
    },
    {
      title: 'Explain the concept of Thread Safety and how to prevent Race Conditions in Java',
      metaTitle: 'Concurrency in Java: Thread Safety and Synchronization',
      metaDesc: 'Understand the dangers of multi-threading in Java, explaining race conditions, stale memory, and the mechanics of the synchronized keyword and volatile variables.',
      concepts: ['Thread Safety', 'Race Condition', 'Synchronized', 'Volatile', 'Locks'],
      quiz: { q: 'Two threads simultaneously attempt to execute `counter++` on a shared variable `counter` currently valued at 5. What could be the final value?', opts: ['It is guaranteed to be 7', 'It is guaranteed to be 6', 'It could be 6 or 7, depending on CPU context switching causing a Race Condition', 'The JVM throws a `ConcurrencyModificationException`'], ans: 'It could be 6 or 7, depending on CPU context switching causing a Race Condition' },
      sections: {
        interviewer_expectation: `Concurrency is notoriously difficult. Candidates must prove they understand *why* multithreading breaks data integrity and how to fix it.\n\nExpectations:\n- Defining a Race Condition (two threads mutating shared state simultaneously).\n- Explaining the non-atomic nature of \`++\`.\n- Introducing \`synchronized\` to enforce mutual exclusion (locks).\n- Knowing modern alternatives (Locks, AtomicInteger, ConcurrentHashMap).`,
        core_concepts: `**The Danger of Shared State:**\nIn a web server (like Tomcat), every HTTP request is handled by a separate Thread. If Thread A and Thread B access the exact same Object on the Heap simultaneously, and try to modify it, data corruption guarantees occur. This is a **Race Condition**.\n\n**The Non-Atomic Illusion:**\nYou might write \`counter++\`. It looks like one operation. At the CPU level, it is THREE operations:\n1. Read \`counter\` from memory (Value=5)\n2. Add 1 to it (Math=6)\n3. Write the new value back to memory.\nIf Thread A and Thread B execute Step 1 at the exact same microsecond, they BOTH read '5'. They both add 1. They both write '6' back. You lost an increment!\n\n**Mutual Exclusion (\`synchronized\`):**\nTo fix this, the code must be Thread Safe. The oldest mechanism is the \`synchronized\` keyword. It acts as a locked door (a Monitor Lock/Mutex).\nWhen Thread A enters a \`synchronized\` method, it locks the door behind it. If Thread B arrives, it physically blocks and waits outside the method until Thread A finishes and unlocks the door. This guarantees that only one thread can execute the 3-step \`++\` operation at a time.\n\n**The \`volatile\` Keyword:**\nSometimes the issue isn't concurrent mutation, but CPU caching. CPUs cache variables in L1 cache for speed. Thread A might change a variable, but Thread B doesn't see the change because it's looking at a stale cache. \nThe \`volatile\` keyword forces the JVM to NEVER cache that variable. Every thread must read/write it directly from Main Memory (Heap), guaranteeing visibility.`,
        important_points: `- **Deadlocks:** The danger of using Locks is Deadlock. Thread A locks Resource 1 and waits for Resource 2. Thread B locks Resource 2 and waits for Resource 1. Both threads freeze forever. \n- **Modern Tools:** The \`java.util.concurrent\` package provides dramatically better lock-free tools. Instead of \`synchronized(counter) { counter++; }\`, modern Java uses \`AtomicInteger counter;\` and calls \`counter.incrementAndGet()\`, leveraging hardware-level CAS (Compare-And-Swap) for massive performance gains.`,
        code_example: `\`\`\`java
public class BankAccount {
    private int balance = 100; // Shared state on the Heap

    // 1. DANGEROUS: Race Condition. 
    // If two threads withdraw $100 simultaneously, balance might become -100!
    public void withdrawUnsafe(int amount) {
        if (balance >= amount) {
            // CPU context switch happens HERE! Thread 2 sneaks in.
            balance = balance - amount; 
        }
    }

    // 2. SAFE PRE-JAVA-5: Monitor Locking
    // Only one thread can be inside this method FOR THIS SPECIFIC OBJECT at a time.
    public synchronized void withdrawSafe(int amount) {
        if (balance >= amount) {
            balance = balance - amount;
        }
    }

    // 3. SAFE MODERN: ReentrantLock
    private final Lock lock = new ReentrantLock();
    
    public void withdrawModern(int amount) {
        lock.lock(); // Explicitly acquire the lock
        try {
            if (balance >= amount) {
                balance = balance - amount;
            }
        } finally {
            // MUST be in finally block, otherwise an exception causes a permanent lock!
            lock.unlock(); 
        }
    }
}
\`\`\``,
        speakable_answer: `Thread Safety is a crucial concept when multiple threads have shared access to the same Object on the Heap. \n\nA classic issue is a Race Condition. For example, the operation 'counter++' looks like one step, but it's actually three: read, add, and write. If two threads read the counter simultaneously when it's at 5, they will both independently calculate 6 and write 6 back to memory, resulting in a lost increment and corrupted data.\n\nTo prevent this, we must enforce mutual exclusion. Historically, we use the 'synchronized' keyword on a method or block. This places a 'monitor lock' on the object. When Thread A enters the method, it acquires the lock. If Thread B tries to enter, the JVM suspends Thread B and forces it to wait until Thread A completes the method and releases the lock. This guarantees atomic, sequential execution.\n\nWhile synchronization prevents race conditions, it hurts performance by creating bottlenecks. Modern Java provides better alternatives in the 'java.util.concurrent' package, such as 'ReentrantLocks', 'ConcurrentHashMaps', and 'AtomicInteger' classes, which utilize hardware-level Compare-And-Swap algorithms to achieve thread safety without expensive blocking locks.`,
        followup_questions: `- Explain the difference between marking a method as \`synchronized\` versus using a \`synchronized(this) { }\` block inside the method.\n- What is the difference between a \`ReentrantLock\` and a \`ReadWriteLock\`?\n- What is a Deadlock, and what are the standard architectural patterns to prevent it from ever happening?`,
      }
    },
    {
      title: 'What are Java 8 Streams and how do they differ from Collections',
      metaTitle: 'Mastering Java 8 Streams API',
      metaDesc: 'Explore the power of Java 8 Streams, understanding functional pipelines, intermediate vs terminal operations, and lazy evaluation for processing data.',
      concepts: ['Streams API', 'Functional Programming', 'Lazy Evaluation', 'Lambda Expressions'],
      quiz: { q: 'You create a Stream, call `.filter(...)`, and then call `.map(...)`. Why does no data actually process yet?', opts: ['Streams are broken in Java 8', 'Because `.filter()` and `.map()` are Intermediate Operations, and a Stream utilizes Lazy Evaluation—it will not process a single element until a Terminal Operation like `.collect()` is invoked.', 'Because you must call `.start()` on the Stream', 'Because the data is too large for memory'], ans: 'Because `.filter()` and `.map()` are Intermediate Operations, and a Stream utilizes Lazy Evaluation—it will not process a single element until a Terminal Operation like `.collect()` is invoked.' },
      sections: {
        interviewer_expectation: `Streams revolutionized Java. Candidates must be able to contrast the declarative Stream style against the old imperative \`for-loop\` style.\n\nExpectations:\n- Defining that Collections *store* data, Streams *process* data.\n- Differentiating Intermediate operations (filter, map) vs Terminal operations (collect, count).\n- Explaining the magic of Lazy Evaluation.\n- Providing a coding example solving a data-transformation problem.`,
        core_concepts: `**Collections vs Streams:**\n- A **Collection** (List, Set) is an in-memory data structure. Its job is to *store* elements. It holds data at rest.\n- A **Stream** is a pipeline of computational operations. Its job is to *compute* elements. A Stream holds NO data itself; it simply pulls data from a source (like a List), transforms it, and outputs a result.\n\n**The Functional Pipeline:**\nStreams allow you to write "Declarative" code (telling Java *what* you want) rather than "Imperative" code (writing messy nested \`if\` and \`for\` loops telling Java exactly *how* to do it).\n\n**The Two Types of Operations:**\n1. **Intermediate Operations (Transformations):** Operations like \`.filter()\`, \`.map()\` (transform A to B), \`.sorted()\`. These operations return *another Stream*, allowing you to chain them together fluently.\n2. **Terminal Operations (The Trigger):** Operations like \`.collect()\`, \`.count()\`, \`.findFirst()\`. These return a final result (a List, an Int, an Optional). A stream cannot be reused after a terminal operation triggers.\n\n**Lazy Evaluation:**\nThe true power of Streams. If you chain 5 \`.filter()\` and 2 \`.map()\` calls together, Java does absolutely nothing. It builds a theoretical blueprint. **Execution does not start until the Terminal Operation is called.** \nBecause of this, Java can highly optimize the pipeline. If you use \`.findFirst()\`, Java will stop processing the pipeline the absolute second it finds a match, saving massive CPU cycles.`,
        important_points: `- **Parallel Streams:** By changing \`.stream()\` to \`.parallelStream()\`, Java automatically splits the processing workload across your multi-core CPU using the ForkJoin pool. However, if the operation involves external REST calls or DB queries, parallel streams can cause severe thread-pool exhaustion.`,
        code_example: `\`\`\`java
List<Employee> employees = // ... list of 1000 employees

// ----------------------------------------------------
// THE OLD IMPERATIVE WAY (Java 7)
// Goal: Get the names of the top 3 highest paid IT employees

List<String> topITNames = new ArrayList<>();
Collections.sort(employees, new Comparator...); // Messy boilerplate sort
for (Employee e : employees) {
    if ("IT".equals(e.getDepartment())) {
        topITNames.add(e.getName().toUpperCase());
        if (topITNames.size() == 3) {
            break; // Manual loop management
        }
    }
}

// ----------------------------------------------------
// THE MODERN DECLARATIVE WAY (Java 8 Streams)

List<String> topITNamesStream = employees.stream()
    // 1. Intermediate: Filter only IT
    .filter(e -> "IT".equals(e.getDepartment())) 
    
    // 2. Intermediate: Sort by salary descending
    .sorted(Comparator.comparing(Employee::getSalary).reversed()) 
    
    // 3. Intermediate: Transform Employee object into a String Name
    .map(e -> e.getName().toUpperCase()) 
    
    // 4. Intermediate: We only want 3
    .limit(3) 

    // 5. TERMINAL: Trigger execution! Pack results into a new List.
    .collect(Collectors.toList()); 
\`\`\``,
        speakable_answer: `Java 8 Streams fundamentally changed how we manipulate data, shifting Java from Imperative programming to Declarative, Functional programming.\n\nA Collection is a data structure designed to store data in memory. A Stream is a computational pipeline designed to process that data. A Stream never actually holds data itself; it simply attaches to a Collection and flows data through a series of transformations.\n\nThe API is broken into two types of operations. Intermediate operations, like 'filter' or 'map', transform the data and return a new Stream, allowing you to chain them effortlessly. Terminal operations, like 'collect' or 'count', produce a final result.\n\nThe most important feature of Streams is Lazy Evaluation. When you chain five filters and a map operation together, Java executes absolutely nothing. It merely constructs a blueprint. Data processing does not invoke until the Terminal Operation at the very end is called. This allows the JVM to perform profound optimizations. If your terminal operation is 'findFirst', the Stream will short-circuit and stop evaluating elements the moment it finds a single match, saving massive computational overhead compared to a standard for-loop.`,
        followup_questions: `- What does the \`).map()\` function do in a stream, and how does it differ from \`.flatMap()\`?\n- What happens if you try to invoke a terminal operation (like \`.count()\`) twice on the exact same Stream instance?\n- Explain a scenario where using \`.parallelStream()\` would actually result in SLOWER performance than a standard sequential \`.stream()\`.`,
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
