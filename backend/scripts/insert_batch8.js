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
  'rabbitmq': [
    {
      title: 'What is RabbitMQ and why do we use Message Brokers instead of direct REST API calls',
      metaTitle: 'Introduction to RabbitMQ and Asynchronous Messaging',
      metaDesc: 'Understand the fundamental purpose of message brokers like RabbitMQ, the concept of decoupling, and why asynchronous communication is crucial in microservices.',
      concepts: ['Message Broker', 'RabbitMQ', 'Decoupling', 'Asynchronous Communication'],
      quiz: { q: 'When a User signs up, the system must create a DB record, send a Welcome Email (takes 2 seconds), and generate a PDF report (takes 5 seconds). What is the primary benefit of using RabbitMQ here instead of making direct REST calls?', opts: ['RabbitMQ makes the Email send instantly', 'The User DB record gets created faster', 'The User does not have to wait 7 seconds staring at a loading spinner; the REST API returns instantly while background workers process the email and PDF asynchronously', 'RabbitMQ automatically writes the PDF file for you'], ans: 'The User does not have to wait 7 seconds staring at a loading spinner; the REST API returns instantly while background workers process the email and PDF asynchronously' },
      sections: {
        interviewer_expectation: `This is a fundamental architecture question. Candidates must explain "synchronous vs asynchronous" and "tight coupling vs loose coupling."\n\nExpectations:\n- Defining a Message Broker.\n- Explaining the limitations of direct HTTP/REST calls (blocking, cascading failures).\n- Explaining asynchronous processing (fire and forget).`,
        core_concepts: `**The Problem with Direct REST APIs (Synchronous):**\nImagine an E-Commerce system. An \`OrderService\` receives a checkout request. If it directly calls the \`PaymentService\` (REST), then calls the \`InventoryService\` (REST), and then the \`EmailService\` (REST), the user is left waiting for all 3 to complete.\nMoreover, if the \`EmailService\` goes down, the entire checkout process fails (Cascading Failure). The services are strictly, tightly coupled.\n\n**The Message Broker Solution (Asynchronous):**\nRabbitMQ acts as a middleman (a post office). \nInstead of calling services directly, the \`OrderService\` simply drops a message into RabbitMQ: "Order #123 was placed." Then, it immediately returns a '200 OK' to the user. The checkout is completely decoupled.\n\nSimultaneously, the \`PaymentService\`, \`InventoryService\`, and \`EmailService\` are constantly "listening" to RabbitMQ. They instantly see the new message, pick it up, and process it independently at their own pace.`,
        important_points: `- **Fault Tolerance:** If the \`EmailService\` crashes, the system doesn't break. The "Order #123" message simply waits safely inside RabbitMQ. When the \`EmailService\` boots back up an hour later, it reads the message and sends the email.\n- **Spike Handling (Buffering):** If a Black Friday sale sends 10,000 requests per second to a system that can only handle 1,000, a direct REST API will crash from memory overload. RabbitMQ buffers the spike; the queue holds the 10,000 messages safely while the backend workers chew through them at their maximum speed.`,
        code_example: `\`\`\`java
// 1. THE BAD WAY: Synchronous Tight Coupling
@PostMapping("/checkout")
public String checkout(Order order) {
    saveToDb(order);
    
    // User waits, and if Email Service is down, checkout FAILS!
    emailClient.sendConfirmation(order.getEmail()); 
    inventoryClient.reduceStock(order.getItems());  
    
    return "Success";
}

// ---------------------------------------------------------

// 2. THE GOOD WAY: Asynchronous Decoupling via RabbitMQ
@PostMapping("/checkout")
public String checkout(Order order) {
    saveToDb(order);
    
    // Fire and Forget. Returns instantly! Takes 2 milliseconds.
    rabbitTemplate.convertAndSend("order-exchange", "order.created", order);
    
    return "Success! Check your email shortly.";
}

// Somewhere else in the codebase (or in a completely different microservice)
@RabbitListener(queues = "email-queue")
public void handleOrderCreatedEvent(Order order) {
    // This happens safely in the background
    emailService.sendConfirmation(order.getEmail());
}
\`\`\``,
        speakable_answer: `Before message brokers, microservices usually communicated via direct HTTP REST calls. This creates tight coupling. If Service A calls Service B, and Service B is slow or down, Service A fails too. It also forces the end-user to wait for all downstream processes to finish synchronously.\n\nRabbitMQ acts as anomalous middleman. It allows us to implement asynchronous messaging and decouple our architecture. \n\nInstead of making a direct REST call, Service A simply publishes a message format into RabbitMQ—for example, 'User Signed Up'—and immediately returns a fast response to the client. \n\nMeanwhile, in the background, Service B and Service C are listening to RabbitMQ. They pick up the message and process it at their own pace. If Service B is currently offline for maintenance, RabbitMQ simply holds the message safely in a queue until Service B comes back online. This provides massive fault tolerance and allows our system to absorb huge traffic spikes without crashing.`,
        followup_questions: `- What is the fundamental difference between RabbitMQ (a message queue) and Apache Kafka (an event streaming platform)?\n- How does RabbitMQ ensure that a message isn't lost if the RabbitMQ server itself restarts (durability)?\n- Explain the concept of "Backpressure" and how an asynchronous queue handles it.`,
      }
    },
    {
      title: 'Explain the core components of RabbitMQ: Publishers, Exchanges, Bindings, Queues, and Consumers',
      metaTitle: 'RabbitMQ Architecture: Exchanges, Bindings, and Queues',
      metaDesc: 'A deep dive into the inner workings of RabbitMQ, understanding how messages flow from Publishers through Exchanges and Bindings into Queues.',
      concepts: ['Exchange', 'Queue', 'Binding', 'Routing Key'],
      quiz: { q: 'In RabbitMQ, where does a Publisher directly send its messages?', opts: ['Directly to a Queue', 'Directly to a Consumer', 'To an Exchange, which then routes it to Queues based on Bindings', 'To a Database'], ans: 'To an Exchange, which then routes it to Queues based on Bindings' },
      sections: {
        interviewer_expectation: `This is a mandatory RabbitMQ question. Unlike simple queues (like AWS SQS), RabbitMQ has a complex routing model. If candidates don't know what an Exchange is, they haven't really used RabbitMQ.\n\nExpectations:\n- Defining that Publishers send to Exchanges, NOT Queues.\n- Defining Queues (where messages wait).\n- Defining Bindings (the rules connecting Exchanges to Queues).\n- Defining the Routing Key (the address tag on the message).`,
        core_concepts: `**1. Publishers (Producers):**\nThe application that creates the data. *Crucially, in RabbitMQ, producers never send messages directly to a queue.* They don't even know if a queue exists.\n\n**2. Exchanges (The Post Office):**\nA publisher sends its message to an Exchange. An Exchange is exactly like a mail sorting facility. It receives messages from producers and pushes them to queues based on specific rules.\n\n**3. Routing Key (The Address):**\nWhen the publisher sends the message to the Exchange, it attaches a \`Routing Key\` (e.g., \`"error.log.critical"\` or \`"order.created"\`). This is the address label on the envelope.\n\n**4. Bindings (The Sorting Rules):**\nA Binding is a link between an Exchange and a Queue. It tells the Exchange: "If a message arrives with the routing key \`order.create\`, route a copy of it into Queue A."\n\n**5. Queues (The Mailbox):**\nA queue is the actual buffer that stores messages in memory (or on disk) until a consumer processes them.\n\n**6. Consumers:**\nThe microservices that read messages from the Queues and process them.`,
        important_points: `- **Decoupling at the Routing Layer:** This separation is powerful. The \`OrderService\` simply says "I created an order." It doesn't care who cares. Later, if the analytics team wants a copy of that order, they just create a new Queue and bind it to the same Exchange. The \`OrderService\` code never changes.`,
        code_example: `\`\`\`java
@Configuration
public class RabbitConfig {

    // 1. The Mailbox
    @Bean
    public Queue orderEmailQueue() {
        return new Queue("order.email.queue");
    }

    // 2. The Sorting Facility
    @Bean
    public DirectExchange orderExchange() {
        return new DirectExchange("order-exchange");
    }

    // 3. The Sorting Rule (Binding)
    // "Take messages sent to 'order-exchange' that are tagged with 
    // 'routing.order.created' and put them in the 'order.email.queue'"
    @Bean
    public Binding bindingEmail(Queue orderEmailQueue, DirectExchange orderExchange) {
        return BindingBuilder.bind(orderEmailQueue)
                             .to(orderExchange)
                             .with("routing.order.created");
    }
}

// ----------------------------------------------------

@Service
public class OrderService {
    @Autowired RabbitTemplate template;
    
    public void createOrder(Order o) {
        // 4. PUBLISHER: Send to the EXCHANGE (not the queue), with a ROUTING KEY
        template.convertAndSend("order-exchange", "routing.order.created", o);
    }
}
\`\`\``,
        speakable_answer: `RabbitMQ's architecture is slightly different from simpler queue systems because producers never send messages directly to queues. Instead, the architecture involves Publishers, Exchanges, Bindings, Queues, and Consumers.\n\nA Publisher is the service generating the event. It sends its message to an Exchange, attaching a 'Routing Key', which is essentially an address label on an envelope.\n\nThe Exchange acts exactly like a post office sorting facility. It receives the message and decides which queues should get a copy of it. It makes this decision using 'Bindings'. \n\nA Binding is a pre-configured rule that links an Exchange to a Queue. A binding says, 'If a message arrives at this exchange with the routing key "order.created", send a copy into the email queue.'\n\nFinally, the message rests inside the Queue—a memory or disk buffer—until a Consumer microservice connects, pops the message off, and processes it. This separation of Exchanges and Queues is what gives RabbitMQ its immense flexibility.`,
        followup_questions: `- What are the four types of Exchanges in RabbitMQ (Direct, Topic, Fanout, Headers)?\n- If a Publisher sends a message to an Exchange, but there are no Queues bound to that Exchange, what happens to the message by default?\n- How does a 'Fanout' exchange differ from a 'Direct' exchange?`,
      }
    },
    {
      title: 'Explain the four main types of Exchanges in RabbitMQ: Direct, Topic, Fanout, and Headers',
      metaTitle: 'RabbitMQ Exchange Types Explained',
      metaDesc: 'Compare Direct, Topic, Fanout, and Headers exchanges in RabbitMQ, providing use cases for each routing strategy.',
      concepts: ['Direct Exchange', 'Topic Exchange', 'Fanout Exchange', 'Routing Strategies'],
      quiz: { q: 'If you want a message to be broadcasted to EVERY single queue bound to the exchange, ignoring the routing key entirely, which exchange type should you use?', opts: ['Direct', 'Topic', 'Fanout', 'Headers'], ans: 'Fanout' },
      sections: {
        interviewer_expectation: `This tests the candidate's understanding of routing complexities. A good developer knows when to use a simple Fanout versus a complex Topic regex.\n\nExpectations:\n- Direct: Exact string match on the routing key.\n- Topic: Wildcard/Regex match on the routing key.\n- Fanout: Broadcast to all queues (ignores routing key).\n- Headers: Matches based on HTTP-header-like attributes (rarely used).`,
        core_concepts: `Exchanges dictate *how* messages are routed to queues based on bindings. \n\n**1. Direct Exchange:**\nA message goes to the queues whose binding key **exactly matches** the routing key of the message.\n- *Example:* Message routing key is \`"pdf.create"\`. It only goes to the queue bound with exactly \`"pdf.create"\`.\n\n**2. Topic Exchange (Wildcards):**\nThe most powerful exchange. Messages are routed based on wildcard pattern matching using dots. \n- \`*\` (star) substitutes for exactly one word.\n- \`#\` (hash) substitutes for zero or more words.\n- *Example:* Queue A bounds to \`"logs.*.error"\`. Queue B bounds to \`"logs.#"\`.\nA message sent with key \`"logs.billing.error"\` goes to BOTH queues (it matches both patterns). \nA message sent with key \`"logs.auth.info"\` goes ONLY to Queue B.\n\n**3. Fanout Exchange (Broadcast):**\nThis exchange completely ignores the routing key. It simply copies the message and throws it into **every single queue** bound to it. \n- *Example:* Global configuration updates or "System Shutting Down" massive broadcasts.\n\n**4. Headers Exchange:**\nInstead of looking at the routing key string, it routes based on arguments contained inside the message headers (key-value pairs like JSON properties). It is rarely used compared to Topic exchanges.`,
        important_points: `- **Performance:** Fanout is the fastest exchange because it doesn't have to evaluate wildcard regexes or string matches; it just copies the byte stream blindly. Topic exchanges are slightly slower but offer massive flexibility.`,
        code_example: `\`\`\`java
// Demonstrating TOPIC Exchange Routing

@Bean
public TopicExchange topicExchange() {
    return new TopicExchange("my-topic-exchange");
}

@Bean
public Binding allBillingLogs(Queue billingQueue, TopicExchange exchange) {
    // Catch EVERYTHING related to billing: "billing.info", "billing.error", "billing.auth.failed"
    return BindingBuilder.bind(billingQueue).to(exchange).with("billing.#");
}

@Bean
public Binding allCriticalErrors(Queue alertQueue, TopicExchange exchange) {
    // Catch ANY critical error, regardless of system: "billing.critical", "auth.critical"
    return BindingBuilder.bind(alertQueue).to(exchange).with("*.critical");
}

// --- PUBLISHING ---
// This message goes to billingQueue ONLY
rabbitTemplate.convertAndSend("my-topic-exchange", "billing.info", message);

// This message goes to BOTH billingQueue AND alertQueue!
rabbitTemplate.convertAndSend("my-topic-exchange", "billing.critical", message);

// This message goes to alertQueue ONLY
rabbitTemplate.convertAndSend("my-topic-exchange", "auth.critical", message);
\`\`\``,
        speakable_answer: `RabbitMQ provides four main routing algorithms, configured via Exchange types.\n\nA 'Direct' exchange is the simplest: it routes messages to a queue if the message's routing key exactly matches the queue's binding key, character for character.\n\nA 'Fanout' exchange acts as a massive broadcast. It completely ignores routing keys and simply delivers a copy of the message to every single queue bound to it. It's incredibly fast and useful for global notifications.\n\nA 'Topic' exchange is the most flexible and widely used in microservices. It allows wildcard matching using dots, asterisks, and hash symbols. For example, a queue bound to 'logs-dot-asterisk-dot-error' will receive all error logs, whether the system is billing, auth, or inventory. This allows you to construct highly complex publish/subscribe architectures.\n\nFinally, a 'Headers' exchange ignores the routing key entirely and routes based on key-value pairs stored in the message's metadata headers. It's powerful for complex boolean logic but is rarely used in typical applications.`,
        followup_questions: `- In a Topic exchange, explain the strict difference between the \`*\` wildcard and the \`#\` wildcard.\n- If you need to route a message based on the value of a specific JSON field inside the message payload (e.g. \`{"priority":"HIGH"}\`), can an Exchange do that natively?\n- Which exchange algorithm is the most CPU intensive for RabbitMQ to process?`,
      }
    },
    {
      title: 'What is message Acknowledgment (ACK/NACK) in RabbitMQ and why is it critical',
      metaTitle: 'RabbitMQ Consumer Acknowledgements (ACK/NACK)',
      metaDesc: 'Explore how RabbitMQ guarantees message delivery by requiring explicit consumer acknowledgments, preventing data loss when worker nodes crash.',
      concepts: ['Acknowledgment (ACK)', 'Negative Acknowledgment (NACK)', 'Message Loss', 'Reliability'],
      quiz: { q: 'If a Consumer receives a message from RabbitMQ under auto-ack mode, starts processing it, and then its server immediately crashes due to an OutOfMemoryError, what happens to the message?', opts: ['The message sits in the queue forever', 'The message is automatically sent to another consumer', 'The message is permanently lost, because RabbitMQ deleted it the millisecond it left the queue', 'RabbitMQ pauses all operations until the consumer reboots'], ans: 'The message is permanently lost, because RabbitMQ deleted it the millisecond it left the queue' },
      sections: {
        interviewer_expectation: `Message broker reliability hinges on ACKs. Candidates must explain how to prevent message loss when consumers crash mid-processing.\n\nExpectations:\n- Changing from auto-ack (fire and forget) to manual-ack.\n- Explaining that RabbitMQ holds the message "Unacknowledged" until the consumer says it finished successfully.\n- Defining NACK/Reject (putting the message back in the queue or dropping it).`,
        core_concepts: `**The Danger of Auto-Ack:**\nBy default, RabbitMQ operates in \`auto-ack\` mode. The moment a message is pushed over the network to a consumer, RabbitMQ instantly deletes it from the queue memory. \nIf the Consumer's Java application throws an exception on line 2, or the AWS EC2 instance completely crashes, the message is permanently lost. For financial transactions, this is catastrophic.\n\n**Manual Acknowledgment (ACK):**\nTo guarantee reliability, we use Manual Acknowledgments. \nWhen a consumer pulls a message, RabbitMQ marks it as \`Unacknowledged\`. The message remains physically locked in the queue. No other consumer can see it.\nThe strict rule is: *RabbitMQ will not delete the message until the Consumer explicitly sends an HTTP/TCP signal back saying "ACK" (I have finished processing this successfully).* \nIf the Consumer crashes, the TCP connection breaks. RabbitMQ notices the break, realizes it never got an ACK, and immediately unlocks the message so another consumer can process it.\n\n**Negative Acknowledgment (NACK / Reject):**\nIf the Consumer catches a \`NullPointerException\` and knows it cannot process the message, it explicitly sends a \`NACK\` back to RabbitMQ. The consumer can tell RabbitMQ to either \`requeue=true\` (put it back in line for someone else to try) or \`requeue=false\` (throw it in the trash / Dead Letter Exchange).`,
        important_points: `- **Idempotency:** Because a consumer might crash *after* processing the database transaction but *before* sending the ACK, another consumer will process the same message again. Therefore, all consumer logic MUST be idempotent (processing the same message twice safely without double-charging a credit card).`,
        code_example: `\`\`\`java
// Spring Boot makes manual acking very simple.
// Application.properties:
// spring.rabbitmq.listener.simple.acknowledge-mode=manual

@Service
public class PaymentConsumer {

    @RabbitListener(queues = "payment-queue")
    public void processPayment(Message message, Channel channel) throws IOException {
        long deliveryTag = message.getMessageProperties().getDeliveryTag();

        try {
            // 1. Do the dangerous business logic
            String body = new String(message.getBody());
            processCreditCardTransaction(body);

            // 2. ONLY IF SUCCESSFUL, send explicit ACK to RabbitMQ to delete the message
            // false = don't ack multiple messages at once
            channel.basicAck(deliveryTag, false); 
            
        } catch (Exception e) {
            // 3. IF ERROR, catch it and send a NACK.
            // basicNack(deliveryTag, multiple=false, requeue=true)
            // requeue=true tells RabbitMQ to put it back in the queue to try again
            channel.basicNack(deliveryTag, false, true); 
        }
    }
}
\`\`\``,
        speakable_answer: `Message Acknowledgments are the mechanism RabbitMQ uses to guarantee that a message is successfully processed and not lost if a server crashes.\n\nIf RabbitMQ is run in its default 'Auto-Ack' mode, it deletes a message from the queue the millisecond it sends it to a consumer. If that consumer's database connection times out and it crashes while processing, that message is gone forever.\n\nTo prevent this, production systems use 'Manual ACKs'. In this mode, RabbitMQ delivers the message but keeps a locked copy of it in the queue. The Consumer processes the business logic, and only when the database transaction commits successfully does it send a network signal back to RabbitMQ saying 'ACK'. Only then does RabbitMQ delete the message.\n\nIf the consumer application crashes before sending the ACK, the network socket closes. RabbitMQ detects this drop, realizes the message was never ACKed, and immediately un-locks it so another healthy consumer can pick it up. Alternatively, if the consumer catches an exception, it can actively send a 'NACK', instructing RabbitMQ to requeue the message or route it to a Dead Letter queue.`,
        followup_questions: `- What is a Dead Letter Exchange (DLX) and how does it relate to NACKs?\n- Explain why Consumer code MUST be Idempotent in an architecture that guarantees "At Least Once" delivery.\n- What happens if a developer forgets to send an ACK or NACK in their code (does the message get requeued)?`,
      }
    },
    {
      title: 'What is a Dead Letter Exchange (DLX) and how do you handle Poison Messages',
      metaTitle: 'Handling Failures: Dead Letter Exchanges in RabbitMQ',
      metaDesc: 'Learn how to configure Dead Letter Exchanges (DLX) to handle unprocessable messages, avoiding queue blockage and infinite requeue loops.',
      concepts: ['Dead Letter Exchange', 'Poison Message', 'Retry Logic', 'Error Handling'],
      quiz: { q: 'A consumer tries to parse a JSON message, but the JSON is malformed. The consumer NACKs it with `requeue=true`. What is the likely result?', opts: ['RabbitMQ automatically fixes the JSON', 'The message is moved to an archive storage bucket', 'An infinite loop: The consumer pulls it again, fails immediately, NACKs it again, over and over, rapidly draining CPU and blocking the queue', 'RabbitMQ drops the message after 3 tries'], ans: 'An infinite loop: The consumer pulls it again, fails immediately, NACKs it again, over and over, rapidly draining CPU and blocking the queue' },
      sections: {
        interviewer_expectation: `This separates advanced messaging developers from beginners. Requeuing broken messages creates infinite loops. Candidates must know how to route bad data out of the main flow.\n\nExpectations:\n- Defining a Poison Message (data that will *always* fail to process).\n- Explaining the danger of infinite requeue loops.\n- Defining a Dead Letter Exchange (DLX) and a Dead Letter Queue (DLQ).\n- Explaining how to route failed messages to the DLQ for human inspection.`,
        core_concepts: `**The Poison Message Problem:**\nSuppose an upstream system accidentally sends a message with an invalid email format (\`"customer@@email"\`). Your Java code tries to validate it, throws an \`IllegalArgumentException\`, catches the error, and sends a \`NACK(requeue=true)\`.\nRabbitMQ puts the message back at the front of the queue. The consumer instantly pulls it again. It fails again. It requeues again. \nYou have just created an Infinite Requeue Loop. The consumer will process this bad message 1,000 times a second, burning 100% CPU, while all the *good* messages stuck behind it in the queue are completely blocked.\n\n**The Dead Letter Exchange (DLX) Solution:**\nA Poison Message is one that will *never* succeed no matter how many times you retry it. We need to get it out of the main queue.\nWe configure the main queue with a fallback routing rule called a **Dead Letter Exchange**. \nWhen our Java code catches the validation exception, instead of requeuing, it issues a \`NACK(requeue=false)\`. \nBecause the queue has a DLX configured, RabbitMQ doesn't delete the message; instead, it immediately routes it to the Dead Letter Exchange, which deposits it safely into a separate "Dead Letter Queue" (DLQ).\n\n**DLQ Processing:**\nMessages in the DLQ just sit there. The main queue is now unblocked and processing healthy messages. Later, an engineer can manually inspect the DLQ, figure out why the JSON was malformed, fix the bug in the publisher, and optionally replay those dead messages.`,
        important_points: `- **Other DLX Triggers:** Messages go to the DLX not just when they are NACKed without requeue, but also if they expire (Time-To-Live / TTL) or if the main queue reaches its maximum length limit.\n- **Retries BEFORE Dead-Lettering:** Spring Boot allows you to configure a retry policy (e.g., try 3 times, waiting 2 seconds between each). Only if it fails the 3rd time does it finally NACK and send to the DLX.`,
        code_example: `\`\`\`java
@Configuration
public class RabbitConfig {

    // 1. Create the Exception/Graveyard Queue
    @Bean
    public Queue deadLetterQueue() {
        return new Queue("payment.dlq");
    }

    @Bean
    public DirectExchange deadLetterExchange() {
        return new DirectExchange("dlx.exchange");
    }

    @Bean
    public Binding dlqBinding() {
        return BindingBuilder.bind(deadLetterQueue()).to(deadLetterExchange()).with("payment.dead");
    }

    // 2. Create the Main Queue and TELL IT about the Graveyard
    @Bean
    public Queue mainPaymentQueue() {
        Map<String, Object> args = new HashMap<>();
        // If a message dies here, send it to 'dlx.exchange'
        args.put("x-dead-letter-exchange", "dlx.exchange");
        args.put("x-dead-letter-routing-key", "payment.dead");
        
        return new Queue("payment.queue", true, false, false, args);
    }
}

// ------------------------------------

@RabbitListener(queues = "payment.queue")
public void process(Message m, Channel channel) {
    try {
        if (new String(m.getBody()).contains("INVALID")) {
            throw new RuntimeException("Unparsable data");
        }
        channel.basicAck(m.getMessageProperties().getDeliveryTag(), false);
        
    } catch (Exception e) {
        // NACK with requeue=FALSE. 
        // Because of the x-dead-letter args, RabbitMQ routes it to the DLQ!
        channel.basicNack(m.getMessageProperties().getDeliveryTag(), false, false);
    }
}
\`\`\``,
        speakable_answer: `A Dead Letter Exchange, or DLX, is a critical fail-safe mechanism used to handle poison messages and prevent queue blockages.\n\nA poison message is a payload that will logically never succeed—for example, a message containing malformed JSON. If a consumer catches an exception handling this message and tells RabbitMQ to requeue it, it will immediately be pulled again, fail again, and requeue again. This infinite loop drives CPU usage to 100% and blocks all healthy messages waiting behind it in the queue.\n\nTo prevent this, we configure the queue with a DLX property. When our code detects an unrecoverable error, instead of requeuing, we issue a Negative Acknowledgment with 'requeue=false'. \n\nRabbitMQ intercepts this rejection and, instead of deleting the message, routes it to the configured Dead Letter Exchange, dropping it safely into a Dead Letter Queue. This gets the broken message out of the way, allowing the system to continue processing healthy traffic. Developers can then set up alerts on the DLQ to be notified that a message failed, allowing them to manually inspect the bad payload and patch the publisher.`,
        followup_questions: `- How can you combine a Dead Letter Exchange with a Message TTL (Time-To-Live) to implement an asynchronous "Delayed Retry" mechanism?\n- If a message requires calling an external API that is temporarily down, should you NACK(requeue=true) or NACK(requeue=false) to the DLX?\n- Does Spring AMQP (Spring Boot) provide built-in interceptors to handle maximum retry limits automatically before sending to the DLX?`,
      }
    }
  ],
  'junit': [
    {
      title: 'What are the core differences between JUnit 4 and JUnit 5',
      metaTitle: 'JUnit 5 Architecture: Jupiter, Vintage, and Platform',
      metaDesc: 'Explore the major architectural and annotation changes introduced in JUnit 5, moving away from a monolithic framework to a modular architecture.',
      concepts: ['JUnit 5 Architecture', 'Annotations', 'Testing Frameworks'],
      quiz: { q: 'Which of the following annotations replaced `@Before` and `@After` from JUnit 4 in JUnit 5?', opts: ['@BeforeClass and @AfterClass', '@BeforeEach and @AfterEach', '@PreTest and @PostTest', '@Start and @TearDown'], ans: '@BeforeEach and @AfterEach' },
      sections: {
        interviewer_expectation: `This tests if the candidate has kept their skills updated. JUnit 4 is legacy; knowing the migration points demonstrates active learning.\n\nExpectations:\n- Mentioning architecture: JUnit 5 is modular (Platform + Jupiter + Vintage).\n- Knowing annotation changes: \`@Before\` -> \`@BeforeEach\`, \`@Test(expected)\` -> \`assertThrows()\`, \`@Ignore\` -> \`@Disabled\`.\n- Understanding that JUnit 5 requires Java 8+ features.`,
        core_concepts: `**1. Architectural Shift (Monolith to Modular):**\nJUnit 4 was a single monolithic jar file. If you wanted to run tests, everything was bundled together.\nJUnit 5 is modular, composed of three main sub-projects:\n- **JUnit Platform:** The foundation that acts as an interface between the JVM and testing frameworks. It allows IDEs (IntelliJ) and Build Tools (Maven/Gradle) to discover and run tests.\n- **JUnit Jupiter:** The modern API and execution engine for writing actual JUnit 5 tests. It contains all the new annotations.\n- **JUnit Vintage:** A backwards-compatibility engine that allows you to run older JUnit 4 tests on the new JUnit 5 Platform.\n\n**2. Java 8 Baseline:**\nJUnit 5 was rewritten to fully exploit Java 8 features, specifically lambdas. This drastically changed how things like Assertions work.\n\n**3. Key Annotation Changes:**\n- \`@Before\` is now \`@BeforeEach\`\n- \`@After\` is now \`@AfterEach\`\n- \`@BeforeClass\` is now \`@BeforeAll\`\n- \`@AfterClass\` is now \`@AfterAll\`\n- \`@Ignore\` is now \`@Disabled\`\n- \`@RunWith(MockitoJUnitRunner.class)\` is now \`@ExtendWith(MockitoExtension.class)\``,
        important_points: `- **Exception Testing:** In JUnit 4, you tested exceptions via annotation: \`@Test(expected = Exception.class)\`. In JUnit 5, you use a lambda assertion: \`assertThrows(Exception.class, () -> myCode());\`, which allows you to assert against the exact line that failed, rather than the whole method.\n- **Multiple Assertions:** JUnit 5 introduced \`assertAll()\`, which accepts multiple lambdas and runs ALL of them, reporting all failures at once, rather than stopping the test at the first failure.`,
        code_example: `\`\`\`java
// ---------------------------------------
// THE OLD WAY: JUnit 4
// ---------------------------------------
import org.junit.Before;
import org.junit.Test;
import org.junit.Ignore;

public class LegacyTest {
    
    @Before   // Runs before every test
    public void setup() {}

    @Test(expected = IllegalArgumentException.class)
    public void testException() {
        // Test passes if THIS throws the exception
        calculateAge(-5); 
    }

    @Ignore("Re-enable when database is back")
    @Test
    public void testDatabase() {}
}

// ---------------------------------------
// THE MODERN WAY: JUnit 5 (Jupiter)
// ---------------------------------------
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Disabled;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ModernTest {  // Package-private class is allowed in JUnit 5!
    
    @BeforeEach // Changed annotation name
    void setup() {} // Package-private method is allowed!

    @Test
    void testException() {
        // Java 8 Lambda approach allows checking the exact code block
        // AND capturing the exception to assert its message
        IllegalArgumentException e = assertThrows(
            IllegalArgumentException.class, 
            () -> calculateAge(-5)
        );
        assertEquals("Age cannot be negative", e.getMessage());
    }

    @Disabled("Re-enable when database is back")
    @Test
    void testDatabase() {}
}
\`\`\``,
        speakable_answer: `The transition from JUnit 4 to JUnit 5 brought massive architectural and syntax changes. \n\nArchitecturally, JUnit 4 was a monolith. JUnit 5 is modularized into three pieces: The Platform, which interfaces with Maven and IntelliJ; Jupiter, which is the modern programming API; and Vintage, which provides reverse-compatibility to run legacy JUnit 4 tests.\n\nSyntax-wise, JUnit 5 raised its minimum requirement to Java 8 to take full advantage of lambdas. This drastically changed assertions. Instead of testing exceptions inside the '@Test' annotation, JUnit 5 uses 'assertThrows' wrapped around a lambda block, allowing us to capture the exception and verify its error message.\n\nAnnotations were also modernized for clarity: '@Before' became '@BeforeEach', '@BeforeClass' became '@BeforeAll', and '@Ignore' became '@Disabled'. Finally, JUnit 5 removed the requirement for test classes and methods to be 'public', allowing developers to use cleaner, package-private visibility.`,
        followup_questions: `- Explain the difference between \`assertAll()\` in JUnit 5 and sequentially writing multiple \`assertEquals()\` statements.\n- How does JUnit 5's \`@ExtendWith\` differ from JUnit 4's \`@RunWith\` or \`@Rule\` implementations?\n- What is the purpose of the \`@DisplayName\` annotation in JUnit 5?`,
      }
    },
    {
      title: 'How do you parameterize a test in JUnit 5 to run multiple data sets through the same method',
      metaTitle: 'JUnit 5 Parameterized Tests: @ValueSource & @CsvSource',
      metaDesc: 'Discover how to eliminate repetitive test code by writing Parameterized Tests in JUnit 5, supplying multiple data variations to a single test method.',
      concepts: ['Parameterized Tests', '@CsvSource', '@ValueSource', 'Data-Driven Testing'],
      quiz: { q: 'Which annotation dictates that the test method will be fed arguments from a comma-separated format?', opts: ['@CsvSource', '@ValueSource', '@MethodSource', '@EnumSource'], ans: '@CsvSource' },
      sections: {
        interviewer_expectation: `This tests intermediate/advanced JUnit capabilities. Candidates writing multiple identical tests with different hardcoded inputs are writing unmaintainable code.\n\nExpectations:\n- Defining the problem: Duplicating code just to test different inputs.\n- Replacing \`@Test\` with \`@ParameterizedTest\`.\n- Using sources like \`@ValueSource\` (for single arguments) or \`@CsvSource\` (for multiple arguments).`,
        core_concepts: `**The Problem with Hardcoding:**\nSuppose you wrote a \`StringUtil.isPalindrome()\` method. To test it thoroughly, you want to test "racecar", "radar", "level", and a negative case like "hello".\nIf you use standard \`@Test\` annotations, you either write 4 separate methods, or you cram 4 assertions into one method. If the first assertion fails, the remaining 3 are never executed, hiding potential bugs.\n\n**Parameterized Tests:**\nJUnit 5 provides \`@ParameterizedTest\`. This tells JUnit: "Do not run this method once. Run this method *multiple times*, completely independently, passing in different data each run."\n\n**Data Sources:**\nYou provide data using source annotations:\n- \`@ValueSource\`: An array of basic types (Strings, ints). Perfect for testing a single argument (e.g., 5 invalid email addresses).\n- \`@CsvSource\`: Comma-separated strings. Perfect when your method takes multiple arguments, or you want to pass an "Input" and the "Expected Output" together.\n- \`@MethodSource\`: Calls a static Java method that returns a Stream of complex objects to be pushed into the test.`,
        important_points: `- **Test Clarity:** Parameterized tests drastically reduce boilerplate code, making test suites easier to read and maintain.\n- **Naming:** You can use the \`name\` attribute on \`@ParameterizedTest\` to format the output string in the IDE, making it easy to identify exactly which data set failed (e.g., \`name = "Testing string: {0} expected result: {1}"\`).`,
        code_example: `\`\`\`java
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;

class StringValidatorTest {

    // 1. Using @ValueSource for a single parameter
    // This method will run exactly 3 independent times.
    @ParameterizedTest
    @ValueSource(strings = {"racecar", "radar", "level"})
    void testIsPalindrome_ValidCases(String word) {
        assertTrue(StringValidator.isPalindrome(word));
    }

    // 2. Using @CsvSource for multiple parameters (Input AND Expected Output)
    // Runs 4 independent times. The CSV is mapped to the method arguments.
    @ParameterizedTest(name = "Index: {index} -> upperCase('{0}') should be '{1}'")
    @CsvSource({
        "apple,  APPLE",
        "banana, BANANA",
        "UPPER,  UPPER",
        ",       "          // Tests null handling
    })
    void testToUpperCase(String input, String expected) {
        // ACT
        String result = StringValidator.toUpperCase(input);
        
        // ASSERT
        assertEquals(expected, result);
    }
}
\`\`\``,
        speakable_answer: `Parameterized tests allow us to achieve data-driven testing and eliminate massive amounts of duplicated code. \n\nIf I write a function to format a phone number, I need to test ten different edge cases—missing area codes, extra dashes, letters instead of numbers. Instead of writing ten separate '@Test' methods, I write a single '@ParameterizedTest'.\n\nI then provide a data source to feed arguments into that method. For simple, single-argument tests, I use '@ValueSource', supplying an array of strings or integers. \n\nIf my test requires multiple inputs, or if I want to pass an input alongside its expected output, I use '@CsvSource'. JUnit reads the CSV strings, splits them up, and executes the target method repeatedly, isolating each execution. If the third data set fails, JUnit still proceeds to run the fourth and fifth, providing comprehensive feedback on exactly which boundary cases are broken.`,
        followup_questions: `- What is \`@MethodSource\` and when would you use it over \`@CsvSource\`?\n- How does \`@EnumSource\` work, and what is its primary use case?\n- If a parameterized test runs 10 times and fails on iteration 5, do iterations 6-10 still execute?`,
      }
    },
    {
      title: 'What is the purpose of the @BeforeEach and @BeforeAll annotations',
      metaTitle: 'JUnit Lifecycle: @BeforeEach and @BeforeAll',
      metaDesc: 'Understand the JUnit test execution lifecycle, explaining how to set up preconditions and tear down state between independent tests to ensure true test isolation.',
      concepts: ['Test Lifecycle', '@BeforeEach', '@BeforeAll', 'Test Isolation'],
      quiz: { q: 'Which method signature is strictly required when using the `@BeforeAll` annotation in a standard JUnit 5 test class?', opts: ['The method must return a boolean', 'The method must be `public static void`', 'The method must be `private final`', 'The method must take the ApplicationContext as an argument'], ans: 'The method must be `public static void`' },
      sections: {
        interviewer_expectation: `This tests the basics of test lifecycles and isolation principles. A candidate who doesn't reset state between tests writes flaky test suites.\n\nExpectations:\n- Defining \`@BeforeEach\` (runs before every single \`@Test\` method).\n- Defining \`@BeforeAll\` (runs exactly once before the class even initializes).\n- Explaining *why* we reset state (Test Isolation and side-effects).\n- Knowing that \`@BeforeAll\` methods must inherently be \`static\`.`,
        core_concepts: `**The Principle of Isolation:**\nUnit tests must be completely independent. Test A must not rely on data leftover from Test B. Furthermore, the order in which tests run should not matter. If you have a shared \`List\` of users and Test A adds a user, Test B might fail unexpectedly because the list size is now 2 instead of 1. We must reset the environment.\n\n**\`@BeforeEach\` (Instance Level):**\nThis annotation replaces JUnit 4's \`@Before\`. A method marked with this will execute immediately before *every single* \`@Test\` method in the class.\n- **Use Case:** Instantiating fresh mock objects, clearing out a database table, or resetting a global variable counter so that every test starts with a clean slate.\n\n**\`@BeforeAll\` (Class Level):**\nThis annotation replaces JUnit 4's \`@BeforeClass\`. A method marked with this executes exactly **once**, before any tests run, and before the test class itself is even instantiated.\n- **Constraint:** Because the class object hasn't been created yet, this method **must be \`static\`**.\n- **Use Case:** Booting up a heavy resource that all tests will share but takes too long to start before *every* test, such as starting a Docker Testcontainer database, opening a network socket, or loading a massive 50MB config file into memory.`,
        important_points: `- **Tear Down:** Corresponding annotations exist for cleanup: \`@AfterEach\` (clean up Mockito state or drop DB schemas after a test) and \`@AfterAll\` (shut down the Docker container entirely).\n- **Lifecycle Rule:** If a class has 5 \`@Test\` methods, \`@BeforeAll\` executes 1 time. \`@BeforeEach\` executes 5 times.`,
        code_example: `\`\`\`java
import org.junit.jupiter.api.*;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.assertEquals;

class DatabaseServiceTest {

    private List<String> databaseTable;

    // 1. CLASS LEVEL: Happens exactly ONCE before everything
    // MUST BE STATIC
    @BeforeAll
    static void startHeavyDockerContainer() {
        System.out.println("1. Booting up Postgres Docker Container (Takes 5 seconds)");
        // dockerContainer.start();
    }

    // 2. INSTANCE LEVEL: Happens before EVERY @Test method
    @BeforeEach
    void resetData() {
        System.out.println("2. Resetting the database table to empty");
        // Guaranteeing test isolation!
        databaseTable = new ArrayList<>(); 
    }

    @Test
    void testInsertUser() {
        System.out.println("3. Running testInsert...");
        databaseTable.add("Alice");
        assertEquals(1, databaseTable.size());
    }

    @Test
    void testDeleteUser() {
        System.out.println("4. Running testDelete...");
        // If we didn't have @BeforeEach, size might be 1 here because of Alice!
        // Thanks to @BeforeEach, we know the list is safely empty.
        databaseTable.add("Bob");
        databaseTable.remove("Bob");
        assertEquals(0, databaseTable.size());
    }

    // 3. CLEANUP: Shut down the heavy resources
    @AfterAll
    static void stopHeavyDockerContainer() {
        System.out.println("5. Shutting down Postgres Docker Container");
        // dockerContainer.stop();
    }
}
\`\`\``,
        speakable_answer: `BeforeEach and BeforeAll are lifecycle annotations used to manage test state. The golden rule of unit testing is Isolation: tests should not share state, and their execution order shouldn't matter.\n\n'@BeforeEach' executes a block of configuration code immediately prior to every single '@Test' method in the class. We use it to wipe the slate clean. If my tests mutate a mock database, I use '@BeforeEach' to completely clear that database back to zero, ensuring that the next test doesn't fail due to leftover data side-effects.\n\n'@BeforeAll', however, runs exactly one time at the very beginning of the test suite. Because it runs before the test class's constructor is even called, it must be declared as a 'static' method. We reserve '@BeforeAll' for extremely expensive, heavy operations that we don't want to repeat—like booting up a Docker Testcontainer, establishing a massive database connection pool, or reading large CSV files from the hard drive into memory.`,
        followup_questions: `- In JUnit 5, is it possible to change the Test Instance Lifecycle so that \`@BeforeAll\` does NOT have to be a static method?\n- If a method annotated with \`@BeforeEach\` throws a NullPointerException, what happens to the \`@Test\` method scheduled to run after it?\n- Why is having tests depend on the execution order (e.g., Test A must run before Test B) considered a dangerous anti-pattern?`,
      }
    },
    {
      title: 'How do you test JPA Repositories in Spring Boot using @DataJpaTest',
      metaTitle: 'Spring Boot Testing: Slicing with @DataJpaTest',
      metaDesc: 'Learn how to write efficient integration tests for Spring Data JPA repositories using @DataJpaTest slices and in-memory databases like H2.',
      concepts: ['@DataJpaTest', 'Spring Data JPA', 'Test Slicing', 'H2 Database'],
      quiz: { q: 'By default, what does the `@DataJpaTest` annotation do regarding your database configuration?', opts: ['It connects to your production PostgreSQL database to ensure realistic tests', 'It scans for `@RestController` and `@Service` annotations to load the entire app', 'It ignores your `application.properties` database url and dynamically auto-configures an embedded in-memory database like H2', 'It creates a Docker container for testing'], ans: 'It ignores your `application.properties` database url and dynamically auto-configures an embedded in-memory database like H2' },
      sections: {
        interviewer_expectation: `Testing repositories properly is a core Spring Boot skill. Candidates must understand the concept of "Test Slicing"—not loading the whole app just to test a database query.\n\nExpectations:\n- Defining \`@DataJpaTest\` as a test slice.\n- Explaining that it only loads \`@Entity\` and \`@Repository\` classes, ignoring \`@Controller\` and \`@Service\`.\n- Mentioning the automatic fallback to an in-memory database (like H2).\n- Mentioning that it wraps every test in a transaction and rolls it back.`,
        core_concepts: `**The Problem with \`@SpringBootTest\`:**\nIf you want to test a custom SQL query in your \`UserRepository\`, you *could* slap \`@SpringBootTest\` on the class. However, this boots up the ENTIRE application context—Tomcat web server, Security filters, Kafka listeners, and all Services. This is incredibly slow and completely unnecessary for testing a SQL query.\n\n**The Solution: Test Slices (\`@DataJpaTest\`):**\nSpring Boot provides "Slicing" annotations. \`@DataJpaTest\` tells Spring: "I only want to test the Database layer. Boot up the smallest possible context required to make Spring Data JPA work."\nIt scans your code, registers your \`@Entity\` classes, creates the Hibernate session, and initializes your Spring Data \`@Repository\` interfaces. It strictly ignores all \`@Service\` and \`@RestController\` beans, making the test boot up lightning fast.\n\n**Auto-Configured In-Memory DB:**\nBy default, \`@DataJpaTest\` is destructive. It ignores your actual \`spring.datasource.url\` (e.g., your Postgres server) and looks for an embedded database library like H2 in your classpath. It instantly builds a fresh, ephemeral database in RAM, runs the tests against it, and throws it away.\n\n**Auto-Rollback:**\nBy default, \`@DataJpaTest\` places an \`@Transactional\` annotation on every test. When the test finishes, Spring rolls back the database transaction. This ensures that records inserted by Test A do not pollute the database for Test B.`,
        important_points: `- **Real Databases:** If you specifically *want* to test against a real Testcontainers Postgres database instead of H2 (because you are using Postgres-specific features like JSONB), you must add \`@AutoConfigureTestDatabase(replace = Replace.NONE)\` to stop it from swapping out your datasource.\n- **TestEntityManager:** Spring provides a \`TestEntityManager\` bean in this slice, allowing you to insert mock data into the database bypassing the repository you are trying to test.`,
        code_example: `\`\`\`java
@Entity
public class Employee {
    @Id @GeneratedValue
    private Long id;
    private String department;
    private Double salary;
    // constructors, getters, setters
}

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // We wrote a custom JPQL query that we want to test!
    @Query("SELECT e FROM Employee e WHERE e.department = :dept AND e.salary > :min")
    List<Employee> findHighlyPaidByDept(String dept, Double min);
}

// -------- THE TEST --------

@DataJpaTest // 1. Slice the context! Boots fast. Swaps to H2 in-memory DB.
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private TestEntityManager entityManager; // Alternative to save data bypassing the repo

    @Test
    void testFindHighlyPaidByDept() {
        // 1. ARRANGE: Set up data in the ephemeral H2 database
        Employee e1 = new Employee("IT", 90000.0);
        Employee e2 = new Employee("IT", 120000.0);
        Employee e3 = new Employee("HR", 150000.0);

        // testEntityManager bypasses the repository layer to arrange raw data
        entityManager.persist(e1);
        entityManager.persist(e2);
        entityManager.persist(e3);
        entityManager.flush();

        // 2. ACT: Call the custom query we want to test
        List<Employee> results = employeeRepository.findHighlyPaidByDept("IT", 100000.0);

        // 3. ASSERT
        assertEquals(1, results.size()); // Should only find e2!
        assertEquals(120000.0, results.get(0).getSalary());
    } 
    // 4. Test ends -> Spring automatically ROLLS BACK the transaction so the DB is empty.
}
\`\`\``,
        speakable_answer: `To test Spring Data JPA Repositories efficiently, we use the '@DataJpaTest' annotation. \n\nThis is a 'Slice Test' annotation. If you use '@SpringBootTest', Spring loads your entire application—security, web servers, caching layers—which is horribly slow just to test a SQL query. '@DataJpaTest' instructs Spring to boot up only the bare minimum infrastructure required for the Persistence layer. It registers your Entities, initializes your Repositories, and ignores everything else.\n\nSecondly, by default, it actively searches your classpath for an embedded in-memory database, like H2, and automatically replaces your PostgreSQL connection with it. This creates a blazingly fast, ephemeral database in RAM just for the test.\n\nFinally, the annotation wraps every single test method in a Transaction. When the test assertion is complete, Spring automatically rolls back that transaction. This guarantees that data inserted during one test method doesn't permanently alter the table and interfere with subsequent tests.`,
        followup_questions: `- If your custom query uses specific PostgreSQL native functions (like arrays or JSONB), why will \`@DataJpaTest\` fail by default, and how do you fix it?\n- Why does Spring inject a \`TestEntityManager\` into a DataJpaTest context instead of relying entirely on the existing \`JpaRepository.save()\` methods to arrange test data?\n- What happens if you try to use \`@Autowired\` on your \`@Service\` class inside a class annotated strictly with \`@DataJpaTest\`?`,
      }
    },
    {
      title: 'How do you test REST Controllers in Spring Boot using @WebMvcTest',
      metaTitle: 'Spring Boot Testing: Slicing Controllers with @WebMvcTest',
      metaDesc: 'Learn how to isolate and test the web tier in Spring Boot using @WebMvcTest and MockMvc to simulate HTTP requests and assert JSON responses.',
      concepts: ['@WebMvcTest', 'MockMvc', 'Controller Testing', 'JSON Path'],
      quiz: { q: 'When writing a `@WebMvcTest`, the real Service layer is not loaded into the Spring Context. How do you provide the Service layer to the Controller?', opts: ['You must load the entire application using @SpringBootTest instead', 'Spring automatically writes a fake service layer for you', 'You inject standard Mockito Mocks using @Mock', 'You use `@MockBean` to place a Mockito mock of the service directly into the Spring Context'], ans: 'You use `@MockBean` to place a Mockito mock of the service directly into the Spring Context' },
      sections: {
        interviewer_expectation: `Testing the Web layer without starting a massive Tomcat instance is crucial. Candidates must understand MockMvc and the @MockBean interaction.\n\nExpectations:\n- Defining \`@WebMvcTest\` as a test slice (ignores services/repositories).\n- Explaining the use of \`MockMvc\` to simulate HTTP requests (GET/POST) and HTTP assertions (status code 200/400).\n- Explaining the mandatory use of \`@MockBean\` to satisfy the Controller's service dependencies.`,
        core_concepts: `**The Web Tier Slice (\`@WebMvcTest\`):**\nWhen you need to test a \`@RestController\`, you want to test whether the HTTP routing, HTTP status codes (200 OK vs 404), JSON serialization, and \`@Valid\` validation annotations work properly. \nYou do NOT want to start a real Tomcat web server on port 8080. \`@WebMvcTest(UserController.class)\` tells Spring to boot up a "mock" web environment. It strictly isolates the Web layer, loading your Controllers and JSON serializers, but completely ignoring your \`@Service\` and \`@Repository\` classes.\n\n**Simulating HTTP with MockMvc:**\nSpring injects a \`MockMvc\` object into the test. This acts like a fake Postman or \`curl\` client. You use it to "perform" fake HTTP requests against your controller, simulating headers, JSON bodies, and path variables.\n\n**Faking the Missing Services (\`@MockBean\`):**\nBecause the slice ignored the \`UserService\`, your \`UserController\` will fail to boot because its dependency is missing from the Spring Context. You must use the \`@MockBean\` annotation on the \`UserService\`. This tells Spring: "Create a Mockito mock of this interface and inject it into the application context so the Controller has something to talk to."`,
        important_points: `- **JSON Path:** The power of MockMvc is asserting on the JSON response body. It uses \`jsonPath("$.username")\` to dive into the JSON payload and assert specific fields without needing to manually deserialize the string back into a Java Object.\n- **Security:** If you have Spring Security enabled, \`@WebMvcTest\` WILL load your security filters. You often have to use annotations like \`@WithMockUser\` to bypass 401 Unauthorized errors during controller tests.`,
        code_example: `\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService; // Dependency

    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

// -------- THE TEST --------

// 1. Slice it! Only load the UserController and web components.
@WebMvcTest(UserController.class)
class UserControllerTest {

    // 2. The fake HTTP client
    @Autowired
    private MockMvc mockMvc;

    // 3. We MUST provide a fake Service, otherwise the Controller won't load
    @MockBean
    private UserService userService;

    @Test
    void testGetUser_Returns200AndJson() throws Exception {
        // Arrange the Mock
        UserDTO fakeUser = new UserDTO(1L, "Alice_Admin");
        when(userService.findById(1L)).thenReturn(Optional.of(fakeUser));

        // Act & Assert using MockMvc
        mockMvc.perform(get("/api/users/1")    // Fake a GET request
                .accept(MediaType.APPLICATION_JSON))    
            
            // Assert Http Status 200 OK
            .andExpect(status().isOk())                 
            
            // Assert Content-Type header
            .andExpect(content().contentType(MediaType.APPLICATION_JSON)) 
            
            // Assert the JSON payload body
            .andExpect(jsonPath("$.id").value(1L))
            .andExpect(jsonPath("$.username").value("Alice_Admin"));
    }

    @Test
    void testGetUser_Returns404WhenNotFound() throws Exception {
        // Arrange the mock to return empty
        when(userService.findById(99L)).thenReturn(Optional.empty());

        // We expect the controller to return a 404 Not Found HTTP code
        mockMvc.perform(get("/api/users/99"))
               .andExpect(status().isNotFound());
    }
}
\`\`\``,
        speakable_answer: `To test a Controller layer effectively, we use the '@WebMvcTest' slice annotation combined with 'MockMvc'.\n\nWhen we test a REST controller, we want to verify HTTP routing, JSON marshaling, parameter validation, and appropriate HTTP Status codes. We don't want to load databases or heavy business logic.\n\n'@WebMvcTest' isolates the Spring Context. It boots up the Servlet architecture and loads our Controllers, but it actively ignores our Service and Repository classes. \nBecause the Controller requires a Service to function, we must use the '@MockBean' annotation to inject a Mockito mock of that service directly into the Spring Context to replace the missing piece.\n\nOnce the context is loaded, we use the injected 'MockMvc' object to execute simulated HTTP requests. It acts like an internal version of Postman. We tell it to 'perform' a GET request, and we chain assertions—or 'andExpect' statements—to verify that the resulting HTTP status code was a 200 OK, and use JSONPath expressions to dive into the returned payload and verify the individual JSON fields.`,
        followup_questions: `- How does an integration test using \`@SpringBootTest\` coupled with a \`TestRestTemplate\` differ architecturally from \`@WebMvcTest\` with \`MockMvc\`?\n- If your controller receives a POST request with an invalid \`@RequestBody\` (failing \`@Valid\` logic), what HTTP status should \`MockMvc\` expect to assert?\n- How do you handle authentication in \`MockMvc\` tests if Spring Security is enabled in your project?`,
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
