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
  'aws': [
    {
      title: 'Explain the difference between vertical and horizontal scaling in AWS',
      metaTitle: 'Vertical vs Horizontal Scaling in AWS Architecture',
      metaDesc: 'Understand the fundamental differences between scaling up (vertical) and scaling out (horizontal) in cloud architectures like AWS.',
      concepts: ['Scaling', 'AWS EC2', 'Auto Scaling'],
      quiz: { q: 'Which AWS service is designed specifically to automate Horizontal Scaling based on traffic metrics?', opts: ['AWS Elastic Beanstalk', 'Amazon EC2 Auto Scaling', 'AWS Lambda', 'Amazon Route 53'], ans: 'Amazon EC2 Auto Scaling' },
      sections: {
        interviewer_expectation: `This is the foundation of cloud computing. Interviewers want to know you understand the limitations of single-server setups and the philosophy of distributed systems.\n\nExpectations:\n- Defining Vertical Scaling (Scale Up) and Horizontal Scaling (Scale Out).\n- Explaining the hard limits and downtime risks associated with vertical scaling.\n- Explaining the stateless requirement for horizontal scaling.\n- Mentioning relevant AWS services (EC2 Instance Types vs Auto Scaling Groups).`,
        core_concepts: `**Vertical Scaling (Scaling Up/Down):**\nThis means adding more power to an existing server. In AWS, this involves stopping an EC2 instance, changing its instance type (e.g., from a \`t3.micro\` with 1GB RAM to an \`m5.4xlarge\` with 64GB RAM), and starting it again. \n\n**Horizontal Scaling (Scaling Out/In):**\nThis means adding more servers to a pool of resources. Instead of one massive server, you have 10 smaller servers sharing the load behind an Elastic Load Balancer (ELB). In AWS, this is managed by an Auto Scaling Group (ASG) which dynamically launches new EC2 instances when CPU or network traffic spikes.`,
        important_points: `- **Vertical Limitations:** Vertical scaling has a hard hardware ceiling (you can't buy an infinite-RAM server). It also inherently requires downtime to resize the machine, and leaves you with a Single Point of Failure (SPOF). If that one super-server crashes, the whole app goes down.\n- **Horizontal Requirements:** To scale horizontally, your application MUST be stateless. If Server A saves a user's session in its local RAM, and the next request hits Server B, the user is logged out. Sessions must be moved to a shared external store like Redis.\n- **Database Scaling:** Relational databases (like PostgreSQL on RDS) are notoriously difficult to scale horizontally for writes. They usually scale vertically for the primary node, and horizontally for read-replicas. NoSQL databases (like DynamoDB) naturally scale horizontally.`,
        code_example: `\`\`\`json
// Conceptual AWS Auto Scaling Group Configuration snippet
{
  "AutoScalingGroupName": "MyApp-ASG",
  "MinSize": 2, // Always keep at least 2 servers running across different Availability Zones
  "MaxSize": 10, // Never launch more than 10 to prevent billing explosions
  "DesiredCapacity": 3,
  "TargetGroupARNs": ["arn:aws:elasticloadbalancing:us-east-1:1234:targetgroup/myapp/5678"],
  "TrackingConfiguration": {
    "TargetValue": 70.0, // Scale OUT if average CPU hits 70%. Scale IN if it drops below.
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    }
  }
}
\`\`\``,
        speakable_answer: `Vertical scaling, or scaling up, means throwing more power at a single machine. In AWS terms, this means stopping your EC2 instance, changing it to a larger instance type to get more CPU and RAM, and restarting it. It's easy to do, but it has a hard hardware limit, requires downtime, and creates a single point of failure.\n\nHorizontal scaling, or scaling out, means adding more machines to a pool. Instead of one giant server, you use an Auto Scaling Group to spin up five, ten, or a hundred smaller EC2 instances, and put them behind an Elastic Load Balancer. As traffic increases, AWS automatically adds servers; as traffic dies down, it terminates them to save money.\n\nHorizontal scaling provides high availability and infinite scale, but it requires your application architecture to be completely stateless. Any server might die at any second, so no server can hold local session data or uploaded files—those must be moved to external services like Redis or S3.`,
        followup_questions: `- How does an Elastic Load Balancer (ELB) distribute traffic across horizontally scaled instances?\n- Why is horizontal scaling difficult for traditional SQL relational databases?\n- What is the difference between an Availability Zone and a Region in AWS?\n- How does a "Stateless Architecture" survive server termination?`,
      }
    },
    {
      title: 'What are the main differences between S3, EBS, and EFS in AWS',
      metaTitle: 'AWS Storage Comparison: S3 vs EBS vs EFS',
      metaDesc: 'Understand the three primary storage classes in AWS: Object Storage (S3), Block Storage (EBS), and File Storage (EFS), and when to use each.',
      concepts: ['AWS S3', 'AWS EBS', 'AWS EFS', 'Cloud Storage'],
      quiz: { q: 'Which AWS storage service acts as a network-attached hard drive that can be mounted to multiple EC2 instances simultaneously?', opts: ['Amazon S3', 'Amazon EBS', 'Amazon EFS', 'Amazon Glacier'], ans: 'Amazon EFS' },
      sections: {
        interviewer_expectation: `Choosing the wrong storage type in AWS can cost thousands of dollars and cripple application performance. Interviewers want to see you differentiate between storage paradigms.\n\nExpectations:\n- Defining S3 (Object storage, infinite scale, HTTP access).\n- Defining EBS (Block storage, attached to one EC2 instance, high-speed).\n- Defining EFS (File storage, NFS, multi-attach).\n- Providing real-world use cases for each.`,
        core_concepts: `**1. Amazon EBS (Elastic Block Store):**\nThis is a virtual "hard drive" plugged into your EC2 instance over the network. It provides block-level storage. \n- **Key trait:** By default, it can only be attached to **one** EC2 instance at a time.\n- **Use case:** The root operating system drive, databases, or high-performance transaction logs.\n\n**2. Amazon EFS (Elastic File System):**\nThis is a managed Network File System (NFS).\n- **Key trait:** It can be mounted to **hundreds** of EC2 instances simultaneously across different Availability Zones.\n- **Use case:** Shared application files, older CMS platforms like WordPress where multiple web servers need to read/write to the same \`/wp-content/uploads\` folder concurrently.\n\n**3. Amazon S3 (Simple Storage Service):**\nThis is Object Storage. Data is not stored in a traditional file system hierarchy; it's stored conceptually in a flat bucket using unique keys.\n- **Key trait:** Infinite scale, serverless, and accessed via API (HTTP) rather than mounted to an OS.\n- **Use case:** Storing user uploads (images, videos), static website hosting (HTML/CSS), backups, and data lakes.`,
        important_points: `- **Cost perspective:** S3 is incredibly cheap. EBS is moderately priced but bills you for the provisioned size even if it's empty. EFS is generally the most expensive per GB.\n- **EBS Lifecycles:** When you terminate an EC2 instance, you must choose whether the attached EBS volume is deleted with it or preserved.\n- **S3 Durability:** S3 is designed to provide 99.999999999% (11 9's) of durability by automatically replicating objects across multiple Availability Zones in a region.`,
        code_example: `\`\`\`bash
# 1. EBS (Block Storage)
# Act like a normal linux drive. You format it, mount it, and use it locally.
sudo mkfs -t xfs /dev/xvdf
sudo mount /dev/xvdf /var/lib/postgresql/data

# 2. EFS (File Storage)
# Mounted over the network using NFS protocol on multiple servers
sudo mount -t nfs4 -o nfsvers=4.1 fs-12345678.efs.us-east-1.amazonaws.com:/ /shared-app-data

# 3. S3 (Object Storage)
# Touched via API/CLI, not mounted. 
aws s3 cp my-backup.zip s3://my-company-backups-bucket/2023/
\`\`\``,
        speakable_answer: `AWS provides three distinct paradigms for storage: EBS, EFS, and S3, and knowing which one to use is critical for both performance and cost.\n\nEBS, or Elastic Block Store, acts like a virtual hard drive physically plugged into your EC2 instance. It provides incredibly fast, block-level storage, making it the perfect choice for running an operating system or a high-performance database. However, a standard EBS volume can only be attached to one EC2 server at a time.\n\nIf you have horizontally scaled your app to 10 servers and they all need to read and write to the exact same shared folder, you use EFS, or Elastic File System. It acts like a network-attached storage drive via the NFS protocol, allowing simultaneous mounting across multiple servers and Availability Zones. It's great for shared CMS uploads.\n\nFinally, there is S3, the Simple Storage Service. This is object storage. S3 doesn't mount to a server at all; it's a serverless, infinitely scalable bucket accessed over the internet via HTTP REST APIs. It is extremely cheap and offers eleven-nines of durability, making it the absolute best choice for storing user-uploaded images, document backups, and hosting static website assets.`,
        followup_questions: `- What are S3 Storage Classes (like Standard vs Glacier) and how do they impact cost?\n- Can you host an entire dynamic Spring Boot application directly on S3?\n- What happens to an EBS volume by default when you terminate the EC2 instance it is attached to?\n- Explain what IOPS means in the context of choosing an EBS volume type.`,
      }
    },
    {
      title: 'What is Amazon SQS and how does it decouple microservices',
      metaTitle: 'Microservice Decoupling with Amazon SQS (Simple Queue Service)',
      metaDesc: 'Explore how Amazon SQS provides reliable message queuing to enable asynchronous communication and decoupling in distributed systems.',
      concepts: ['AWS SQS', 'Microservices', 'Message Queues', 'Decoupling'],
      quiz: { q: 'Which SQS queue type guarantees that messages are processed in the exact order they were sent?', opts: ['Standard Queue', 'FIFO Queue', 'LIFO Queue', 'Dead Letter Queue'], ans: 'FIFO Queue' },
      sections: {
        interviewer_expectation: `Message broker knowledge is essential for moving past monolithic architectures. Interviewers look for:\n\n- Understanding synchronous vs asynchronous communication.\n- Explaining the concept of "Decoupling".\n- Knowing how SQS prevents data loss during traffic spikes.\n- Understanding the difference between Standard and FIFO queues.`,
        core_concepts: `**The Problem with Synchronous Microservices:**\nImagine an E-commerce app: The \`OrderService\` receives an order and synchronously calls the \`EmailService\` via an HTTP REST API to send a receipt. If the \`EmailService\` crashes, or if its database locks up and takes 10 seconds to respond, the \`OrderService\` also hangs, and the customer's checkout fails. This is known as "tight coupling."\n\n**The SQS Solution (Decoupling):**\nAmazon Simple Queue Service (SQS) is a fully managed message queue. Instead of calling the Email Service directly, the \`OrderService\` drops a JSON message confirming the order into the SQS Queue and instantly tells the customer "Checkout Successful!"\nThe \`EmailService\` acts as a consumer, checking the queue at its own pace. If it crashes, the messages stay safely in the queue. When it reboots, it picks up where it left off. The services are now "decoupled."`,
        important_points: `- **Traffic Spikes (Buffering):** If thousands of orders arrive on Black Friday, the \`OrderService\` easily pushes them to the queue. The \`EmailService\` might fall behind, but the system doesn't crash; the queue just acts as a massive shock-absorber.\n- **Standard vs FIFO Queues:**\n  - *Standard:* Infinite throughput, but "Best-Effort Ordering" (messages might arrive slightly out of order) and "At-Least-Once Delivery" (a message might occasionally be delivered twice).\n  - *FIFO (First-In-First-Out):* Strict ordering and exactly-once processing, but capped at a lower throughput limit.\n- **Visibility Timeout:** When a consumer grabs a message, SQS hides it from other consumers for a set time (e.g., 30s). If the consumer successfully processes it, it deletes it. If the consumer crashes before deleting it, the timeout expires and the message safely reappears in the queue for another worker to try.`,
        code_example: `\`\`\`json
// Conceptual flow of SQS Decoupling

// 1. OrderService (Producer) pushes to SQS
POST https://sqs.us-east-1.amazonaws.com/123/OrderQueue
MessageBody: {
  "orderId": "A-123",
  "customerEmail": "user@example.com",
  "total": 45.99
}

// 2. Queue safely holds the message for up to 14 days

// 3. EmailService (Consumer) polls SQS
GET https://sqs.us-east-1.amazonaws.com/123/OrderQueue

// 4. EmailService processes the email, then actively DELETES the message
DELETE https://sqs.us-east-1.amazonaws.com/123/OrderQueue?ReceiptHandle=abcd...
\`\`\``,
        speakable_answer: `Amazon SQS is a fully managed message queuing service used primarily to decouple distributed systems. \n\nIn a tightly coupled system, if Service A relies on an HTTP REST call to Service B, and Service B goes down, Service A fails too. \n\nWith SQS, we introduce asynchronous communication. Service A, acting as the producer, simply drops a message into the SQS queue and immediately returns a success response to the user. Service A doesn't care if Service B is currently online. \n\nService B, the consumer, continually polls the queue to retrieve and process messages at its own pace. This decoupling means that if an enormous spike of traffic occurs, the queue acts as a massive shock-absorber. Service B might fall hours behind, but no data is lost and the customer-facing checkout process remains lightning fast.\n\nSQS also provides a 'Visibility Timeout' feature. When a worker grabs a message, SQS hides it. Make the worker finish processing and explicitly delete the message. If the worker crashes mid-task, the timeout expires, and the message reappears on the queue so another healthy worker can pick it up, guaranteeing fault tolerance.`,
        followup_questions: `- What is a Dead Letter Queue (DLQ) and why is it important?\n- Explain the 'Visibility Timeout' concept in SQS and what happens if your processing takes longer than the timeout.\n- How does SQS ensure "At-Least-Once" delivery in standard queues, and how should your application handle it?\n- What are the throughput limitations of a FIFO queue compared to a Standard queue?`,
      }
    },
    {
      title: 'What is Amazon SNS and how does it differ from SQS',
      metaTitle: 'AWS Pub/Sub Messaging: Comparing SNS and SQS',
      metaDesc: 'Learn the architectural differences between Amazon SNS (Pub/Sub) and Amazon SQS (Queuing), and how combining them creates the powerful Fan-out pattern.',
      concepts: ['AWS SNS', 'Pub/Sub', 'AWS SQS', 'Fan-out Pattern'],
      quiz: { q: 'Which AWS service is designed to push identical messages to thousands of subscribers simultaneously?', opts: ['Amazon SQS', 'Amazon SNS', 'AWS Lambda', 'Amazon MQ'], ans: 'Amazon SNS' },
      sections: {
        interviewer_expectation: `This clarifies the difference between Queues and Topics. Junior developers often confuse SQS and SNS use cases.\n\nExpectations:\n- Defining SNS as a Pub/Sub (Publish/Subscribe) service.\n- Explaining that SNS *pushes* messages, whereas SQS requires consumers to *poll* for messages.\n- Explaining the "Fan-Out" architecture pattern (SNS topic pushing to multiple SQS queues).`,
        core_concepts: `**Amazon SNS (Simple Notification Service):**\nSNS is a Publish/Subscribe (Pub/Sub) messaging service. A publisher sends a single message to an SNS "Topic". The Topic instantly "pushes" that exact same message to any number of subscribers (which can be email addresses, SMS phone numbers, HTTP endpoints, or SQS queues).\n\n**The Primary Differences:**\n1.  **Delivery Method:** SQS is a **Pull** mechanism (consumers must proactively ask the queue "do you have messages?"). SNS is a **Push** mechanism (it actively fires the message at the subscriber).\n2.  **Persistence:** SQS stores messages safely on disk for up to 14 days until they are processed. SNS does not persist messages; if a subscriber (like an HTTP endpoint) is offline when SNS pushes the message, that message is lost forever to that subscriber.\n3.  **Consumption:** In SQS, one message is processed by **one** worker. In SNS, one message is simultaneously received by **all** subscribers.`,
        important_points: `- **The Fan-Out Pattern:** This is the most common enterprise use case. An \`OrderService\` publishes an "OrderPlaced" event to a single SNS Topic. Subscribed to that topic are three separate SQS Queues: an \`EmailQueue\`, an \`InventoryQueue\`, and an \`AnalyticsQueue\`. \n  - SNS pushes the event to all three queues instantly.\n  - The respective services safely poll their own queues at their own pace.\n  - This guarantees delivery to multiple disconnected microservices without risk of data loss if one of them is temporarily down.`,
        code_example: `\`\`\`json
// Conceptual Fan-out Architecture

                  [ Publisher: OrderService ]
                              | (Publishes 1 message)
                              v
                      (SNS TOPIC: "OrderEvents")
                      /           |            \
       (Pushes Copy) /      (Pushes Copy)       \ (Pushes Copy)
                    /             |              \
                   v              v               v
            [Email Queue]  [Inventory Queue]  [Analytics Queue] (SQS)
                 |                |                 |
            (Polls)            (Polls)           (Polls)
           [EmailApp]       [InventoryApp]    [AnalyticsApp] (Consumers)

// Result: Generating 1 event triggered 3 completely independent, 
// resilient backend processes.
\`\`\``,
        speakable_answer: `While SQS and SNS are both messaging services, they serve entirely different architectural purposes. \n\nSQS is a Queuing service. It uses a 'Pull' model where workers actively poll the queue for work. A message in SQS is meant to be processed by one, and only one, consumer, and SQS safely stores that message for days until it is successfully handled.\n\nSNS, or Simple Notification Service, is a Publish/Subscribe service. It uses a 'Push' model. A publisher sends an event to an SNS Topic, and SNS immediately pushes a copy of that event to every single subscriber simultaneously. An SNS Topic has no memory—if an HTTP subscriber is offline when SNS fires, that message is lost.\n\nBecause of this, we almost never use SNS to push directly to applications. Instead, we use the 'Fan-out' pattern. We set up an SNS Topic, and subscribe multiple different SQS queues to that topic. When an order is placed, we publish to SNS, which instantly fans out copies of the message into an Email Queue, an Inventory Queue, and an Analytics Queue. Then, the respective microservices pull from their own safe, persistent decoupled queues at their own pace.`,
        followup_questions: `- What do we mean when we say an SQS Queue is a "subscriber" to an SNS Topic?\n- If an SNS message is pushed to an HTTP endpoint and the endpoint returns a 500 error, what does SNS do?\n- Can publishers to an SNS topic know how many subscribers received the message?\n- Explain a scenario where you would use SNS to send an SMS text directly rather than using the Fan-out pattern.`,
      }
    },
    {
      title: 'What Serverless computing is and how AWS Lambda works',
      metaTitle: 'AWS Lambda and Serverless Architecture: Pros and Cons',
      metaDesc: 'Discover the concept of Serverless computing, how AWS Lambda executes code on demand without provisioning servers, and the challenge of Cold Starts.',
      concepts: ['Serverless', 'AWS Lambda', 'Cold Starts', 'Event-Driven'],
      quiz: { q: 'What is the primary pricing model for AWS Lambda?', opts: ['You pay a flat monthly fee per function', 'You pay per millisecond of execution time and number of requests', 'You pay based on the amount of disk space the code consumes', 'You pay for the underlying EC2 instance running 24/7'], ans: 'You pay per millisecond of execution time and number of requests' },
      sections: {
        interviewer_expectation: `Serverless is a major buzzword, but candidates need to understand its actual mechanics and limitations to know when to use it over containers or EC2.\n\nExpectations:\n- Defining "Serverless" (you don't manage the underlying OS/servers).\n- Explaining the Lambda execution model (Event-driven, scales to zero).\n- Identifying the pricing benefit (pay-per-millisecond).\n- Explaining the "Cold Start" problem, especially highly relevant for Java functions.`,
        core_concepts: `**What is Serverless?**\nServerless does not mean there are no servers; it means the cloud provider (AWS) manages the servers, the operating system patching, the capacity provisioning, and the high availability. You simply upload your code, and AWS runs it.\n\n**AWS Lambda:**\nLambda is an event-driven, serverless computing service. You write a function (in Java, Node.js, Python, etc.) and configure a trigger (like an HTTP request via API Gateway, a file uploaded to S3, or a message in an SQS queue). \nWhen the event fires, AWS instantly provisions an isolated container, runs your function, returns the result, and immediately destroys or freezes the container.`,
        important_points: `- **The Cost Model:** With EC2, you pay for the server 24/7, even if no one is using your app. With Lambda, you pay *strictly* for the compute time utilized, down to the millisecond. If your function runs zero times in a month, you pay $0.\n- **Infinite Scale vs Scaling to Zero:** If 10,000 requests hit API Gateway simultaneously, AWS instantly spins up 10,000 independent Lambda containers to handle them. When traffic stops, it scales back to zero.\n- **The Cold Start Problem:** When a new Lambda container is spun up for the first time, AWS has to download your code, start the language runtime (like spinning up the JVM), and initialize your code before executing it. This can take several seconds, resulting in a horrible user experience for that first request. For Java, which has a notoriously heavy JVM startup time, cold starts are a major architectural concern.`,
        code_example: `\`\`\`java
// A simple AWS Lambda Function written in Java
// It implements the RequestHandler interface provided by the AWS SDK
public class S3UploadHandler implements RequestHandler<S3Event, String> {

    @Override
    public String handleRequest(S3Event event, Context context) {
        // The logger is provided by the AWS Context
        context.getLogger().log("Event received: " + event.toJson());
        
        // Extract data from the trigger event
        String bucketName = event.getRecords().get(0).getS3().getBucket().getName();
        String fileKey = event.getRecords().get(0).getS3().getObject().getKey();
        
        context.getLogger().log("File uploaded to Bucket: " + bucketName + ", Key: " + fileKey);
        
        // Perform business logic (e.g., resize an image)
        processFile(bucketName, fileKey);
        
        return "Success";
    }
}
\`\`\``,
        speakable_answer: `Serverless computing is an execution model where the cloud provider completely abstracts away server management. With a service like AWS Lambda, you never SSH into a machine, update an OS, or configure an Auto Scaling Group. You just upload your code.\n\nLambda is event-driven. You attach your function to a trigger—like a user making an HTTP request through API Gateway, or an image being uploaded to an S3 bucket. When that event happens, AWS instantly provisions a tiny, isolated container underlying your code, executes the function, and then freezes or destroys the container.\n\nThis leads to three massive benefits: First, effortless infinite scaling; if 5,000 events happen simultaneously, AWS provisions 5,000 parallel executions. Second, zero maintenance operations. Third, the pricing model. You pay per millisecond of execution. If your app gets zero traffic overnight, you pay absolutely zero dollars.\n\nHowever, there is a major drawback known as the Cold Start. When AWS spins up a completely fresh container for your code, it takes time to initialize the runtime environment. For languages like Python or Node, this is quick, but for Java, starting the JVM and loading Spring Boot can take several seconds, causing a huge latency spike for whichever user triggered that initial request.`,
        followup_questions: `- What are some strategies to mitigate Java Cold Starts in AWS Lambda?\n- What is the maximum execution duration for an AWS Lambda function before it times out?\n- Explain what AWS API Gateway is and how it integrates with Lambda for REST APIs.\n- Since Lambda functions are stateless and ephemeral, where do you store persistent data or background states?`,
      }
    }
  ],
  'docker': [
    {
      title: 'What is a Docker Container and how does it differ from a Virtual Machine',
      metaTitle: 'Docker Containers vs Virtual Machines: Core Differences',
      metaDesc: 'A clear explanation of what Docker containers are, why they are so lightweight, and how they differ fundamentally from traditional Virtual Machines (VMs).',
      concepts: ['Docker', 'Containers', 'Virtual Machines', 'Images'],
      quiz: { q: 'Which component is required by a Virtual Machine but NOT required by a Docker container, making containers so lightweight?', opts: ['A Guest Operating System', 'CPU allocations', 'A network interface', 'An application binary'], ans: 'A Guest Operating System' },
      sections: {
        interviewer_expectation: `This is the absolute baseline Docker question. Candidates who don't understand the hypervisor vs OS-kernel-sharing relationship don't truly understand containerization.\n\nExpectations:\n- Explaining the "works on my machine" problem.\n- Defining a VM (Hypervisor + full Guest OS).\n- Defining a Container (Shares the Host OS kernel).\n- Highlighting the benefits: speed, size, and resource efficiency.`,
        core_concepts: `**The Problem:**\n"It works on my machine" is the classic developer excuse. A Java app might run fine on a developer's Mac, but crash on the Ubuntu production server because of different environment variables, missing system libraries, or different JDK versions.\n\n**Virtual Machines (VMs):**\nVMs solve this by virtualizing the physical hardware using a Hypervisor (like VMware). Every VM runs a complete, heavy "Guest Operating System" (e.g., a full 10GB Windows install or 2GB Linux install) underneath the application. This consumes massive amounts of RAM and CPU just to keep the OS running, and boots slowly.\n\n**Docker Containers:**\nContainers virtualize the Operating System, not the hardware. Docker uses the Host OS's kernel (via Linux namespaces and cgroups) to isolate processes. A container packages up the application code and *only* the specific bins/libraries it needs to run. It does **not** include a Guest OS. Thus, a container might be 50MB instead of 5GB.`,
        important_points: `- **Speed:** Because a container doesn't have an OS to boot, starting a container takes milliseconds, compared to the minutes it takes a VM to boot.\n- **Efficiency:** You might realistically run 50 Docker containers on a server that could only handle 4 VMs before running out of RAM.\n- **Immutability:** A Docker Image is a read-only template. Once built, it is immutable. A Container is the running, executable instance of that image. You test an image in QA, and you deploy that exact same, bit-for-bit image to Production, guaranteeing it behaves identically.`,
        code_example: `\`\`\`bash
# 1. Start a full Ubuntu environment in one second and run a bash shell
docker run -it ubuntu /bin/bash

# 2. Start an isolated Redis database instantly on port 6379, completely 
# separated from the host machine's software
docker run -d --name myredis -p 6379:6379 redis:latest

# 3. View running containers
docker ps
# Output will show the container ID, the 'redis' image, the port mapping, and status
\`\`\``,
        speakable_answer: `Docker was created to solve the 'it works on my machine' problem by packaging an application together with all of its dependencies, configurations, and libraries into a single, portable unit. \n\nHistorically, we isolated applications using Virtual Machines. A VM virtualizes the hardware. It sits on top of a hypervisor, and every single VM requires its own complete, heavy Guest Operating System. This means if you want to run three isolated apps, you have to run three full copies of Linux. This wastes gigabytes of RAM and takes minutes to boot.\n\nDocker containers, on the other hand, virtualize the operating system. All containers running on a host machine share the underlying Host OS's kernel. The container itself only packages the application code and the specific binary libraries it needs. \n\nBecause there is no Guest OS to boot, a container starts in milliseconds. Because it has no OS overhead, it might only be 50 megabytes in size, allowing you to run dozens or hundreds of containers on a server that could only support a handful of VMs. Crucially, because a Docker image is immutable, you are guaranteed that the exact same package you tested locally will behave identically on the production server.`,
        followup_questions: `- What are Linux Namespaces and Control Groups (cgroups) and how does Docker use them?\n- Can you run a native Windows Docker container on a pure Linux host machine?\n- Explain the relationship between a Dockerfile, a Docker Image, and a Docker Container.\n- What happens to files written inside a container when the container is deleted?`,
      }
    },
    {
      title: 'How do you write a Dockerfile to build a Java Spring Boot image',
      metaTitle: 'Writing a Multi-Stage Dockerfile for Spring Boot Applications',
      metaDesc: 'Learn how to write efficient, optimized Dockerfiles for Java backend apps, including the concept of Multi-Stage builds to reduce image security risks and size.',
      concepts: ['Dockerfile', 'Spring Boot', 'Multi-Stage Build', 'Layer Caching'],
      quiz: { q: 'In a Dockerfile, why is it beneficial to separate the `mvn clean package` build step from the final runtime image using a Multi-Stage build?', opts: ['To make the build process faster', 'To keep the final Docker image tiny and secure by excluding the JDK and source code', 'To allow running the container in multiple availability zones', 'To bypass dependency downloading'], ans: 'To keep the final Docker image tiny and secure by excluding the JDK and source code' },
      sections: {
        interviewer_expectation: `Writing a production-ready Dockerfile is a necessary skill. Interviewers look beyond just getting it to run; they look for size optimization and security.\n\nExpectations:\n- Knowing basic commands: \`FROM\`, \`COPY\`, \`RUN\`, \`EXPOSE\`, \`ENTRYPOINT\` / \`CMD\`.\n- Addressing the JRE vs JDK distinction in the base image.\n- Understanding Docker layer caching.\n- Explaining the "Multi-Stage Build" pattern.`,
        core_concepts: `**The Dockerfile Basics:**\nA Dockerfile is a text document containing consecutive instructions to build an Image. Each instruction creates a "Layer" in the image. Docker caches these layers locally to speed up future builds.\n\n**The Base Image (FROM):**\nA Java application requires a JVM to run. For the final production image, you should use a base image containing only the JRE (Java Runtime Environment), not the full JDK (Java Development Kit). The JRE is much smaller and more secure, as tools like the java compiler aren't needed in production.\n\n**Multi-Stage Builds:**\nThe most modern, secure way to build Docker images. \n- **Stage 1 (The Builder):** Uses a heavy base image with the full JDK and Maven/Gradle. It copies in your source code and runs the build command.\n- **Stage 2 (The Runner):** Uses a tiny, lightweight JRE base image. It copies *only* the compiled \`.jar\` file from Stage 1. The massive JDK and source code are left behind and discarded, resulting in a tiny, secure final container.`,
        important_points: `- **Layer Caching:** Docker builds top-down. If a layer hasn't changed, Docker reuses it from the cache. Always copy your \`pom.xml\` and download dependencies *before* copying your source code. Source code changes constantly; dependencies change rarely. This prevents Docker from re-downloading the internet on every single build.\n- **ENTRYPOINT vs CMD:** For Spring Boot, use \`ENTRYPOINT ["java", "-jar", "/app.jar"]\`. It makes the container run like an executable. \`CMD\` is easily overridden by the user at runtime.`,
        code_example: `\`\`\`dockerfile
# --- STAGE 1: BUILD THE APPLICATION ---
# Use a heavy image that includes Maven and the full JDK
FROM maven:3.9.4-eclipse-temurin-17 AS builder
WORKDIR /build

# COPY pom.xml first to leverage Docker layer caching!
# By doing this, dependencies aren't re-downloaded unless the pom changes.
COPY pom.xml .
RUN mvn dependency:go-offline

# NOW copy the constantly changing source code
COPY src ./src
# Build the jar file, skipping tests for speed
RUN mvn clean package -DskipTests

# --- STAGE 2: CREATE THE LIGHTWEIGHT RUNTIME IMAGE ---
# Use a tiny image containing ONLY the Java Runtime Environment (JRE)
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy ONLY the compiled jar file from Stage 1. 
# The source code and Maven are discarded!
COPY --from=builder /build/target/my-spring-app-1.0.jar app.jar

# Document that the app runs on port 8080
EXPOSE 8080

# Execute the jar
ENTRYPOINT ["java", "-jar", "app.jar"]
\`\`\``,
        speakable_answer: `Writing a Dockerfile is how we define the recipe to build a Docker Image. For a Spring Boot application, the most professional approach is using a Multi-Stage build.\n\nA Docker image is built in layers. In the first stage, which we can call the 'builder', we start with a heavy base image that contains Maven and the full Java Development Kit. We copy our pom.xml over first and tell Maven to download all dependencies. We do this before copying our source code to leverage Docker's layer caching—this prevents Docker from re-downloading dependencies every time we change a line of Java code. Then we compile the application into a JAR file.\n\nHowever, we do not want to ship the JDK, Maven, or our source code to production—it bloats the image size to over 500 megabytes and poses a security risk. \n\nSo, we begin a second stage in the same Dockerfile using a tiny base image, like Alpine Linux with just the JRE (Java Runtime Environment). We instruct Docker to copy ONLY the compiled JAR file from the builder stage into this new image, and assign the 'java -jar' command as the Entrypoint. The final image shipped to the server is therefore incredibly small and secure.`,
        followup_questions: `- What is the difference between \`ENTRYPOINT\` and \`CMD\` in a Dockerfile?\n- Explain how Docker's Layer Caching works and why the order of instructions in a Dockerfile is critical.\n- What is Alpine Linux and why is it so commonly used for base Docker images?\n- How do you pass environment variables (like a database password) to a Spring Boot app running inside a container?`,
      }
    },
    {
      title: 'How do you handle persistent data in Docker containers',
      metaTitle: 'Docker Storage: Volumes vs Bind Mounts for Databases',
      metaDesc: 'Understand how Docker handles data storage, why container file systems are ephemeral, and how to use Docker Volumes to persist databases.',
      concepts: ['Docker Volumes', 'Bind Mounts', 'Ephemeral Storage', 'Stateful Apps'],
      quiz: { q: 'Which storage mechanism is managed entirely by Docker, highly performant, and the recommended way to persist database data?', opts: ['Bind Mounts', 'Docker Volumes', 'tmpfs Mounts', 'The Container Writable Layer'], ans: 'Docker Volumes' },
      sections: {
        interviewer_expectation: `If a developer runs PostgreSQL natively inside a Docker container without mapping a volume, they will lose all the company's data when they type \`docker rm\`. This tests critical production knowledge.\n\nExpectations:\n- Understanding that containers are ephemeral (stateless by default).\n- Explaining that deleting a container deletes its writable file-system layer.\n- Defining Docker Volumes.\n- Explaining Bind Mounts (mapping a specific host directory to the container).`,
        core_concepts: `**Ephemeral Storage (The Writable Layer):**\nWhen you start a container from a read-only image, Docker adds a thin "writable layer" on top. If your PostgreSQL container creates tables and writes data, it goes into this layer. However, this layer is tied tightly to the lifecycle of the container. If the container crashes or is deleted (\`docker stop && docker rm\`), **that writable layer, and all your data, is permanently destroyed.**\n\n**The Solution: Docker Volumes:**\nA Volume is a specialized directory managed directly by Docker, completely independent of the container lifecycle. You tell Docker to mount a Volume onto the database directory path inside the container. When the container writes data, it actually writes it to the Volume on the host machine. If you delete the container and spin up a new one attached to the same Volume, all the database data is still there.`,
        important_points: `- **Docker Volumes:** Best practice for persisting database data or application state. Managed by Docker, easy to back up, and work across Linux and Windows smoothly. Created via \`docker volume create my-db-data\`.\n- **Bind Mounts:** Maps a specific, absolute path on the Host OS (e.g., \`C:/Users/app/conf\`) directly into the container folder. Highly dependent on the host's folder structure. Mostly used in development to sync live source code into a container, or to inject configuration files into containers without baking them into the image.\n- **Database in production:** Standard practice dictates you should generally not run your primary relational database inside a Docker container in production (use managed services like AWS RDS instead). If you must, strict Volume management backing up to external storage is absolutely critical.`,
        code_example: `\`\`\`bash
# --- SCENARIO 1: THE DISASTER ---
# Spin up postgres. No volumes attached.
docker run -d --name tragedy_db -e POSTGRES_PASSWORD=pass postgres
# Write 10 years of company data to it...
docker stop tragedy_db
docker rm tragedy_db 
# ALL DATA IS GONE FOREVER.

# --- SCENARIO 2: THE CORRECT WAY (Docker Volumes) ---
# 1. Create a volume managed by docker
docker volume create pg_data

# 2. Mount the volume (-v) to the specific internal postgres data path
docker run -d --name safe_db \
  -e POSTGRES_PASSWORD=pass \
  -v pg_data:/var/lib/postgresql/data \
  postgres

# Even if we delete the safe_db container, 
# 'pg_data' still holds all the data on the host machine.


# --- SCENARIO 3: BIND MOUNTS ---
# Often used for config files. Mounts an explicit host directory.
docker run -d --name nginx \
  -v /var/www/mycompany/nginx.conf:/etc/nginx/nginx.conf \
  nginx
\`\`\``,
        speakable_answer: `By default, Docker containers are entirely ephemeral, meaning they are temporary and stateless. When a container runs, Docker provides it a thin writable file layer. This is where log files or database records are stored inside the container.\n\nHowever, if that container crashes, is updated, or is deleted, that writable layer is violently destroyed, and all data inside it is gone forever. Obviously, if you are running a database like PostgreSQL in a container, this is a catastrophe.\n\nTo solve this, we use Docker Volumes. A Volume is a persistent chunk of storage that lives on the host machine, managed entirely by Docker, existing completely independently of any container's lifecycle. When we start a database container, we mount that volume to the database's data folder path inside the container. Whenever the database thinks it's writing to its own internal drive, the data is actually flowing straight out into the persistence volume on the host.\n\nIf we delete that container and spin up a brand new, upgraded Postgres container and attach the same volume, the new container instantly has access to all the historical data.`,
        followup_questions: `- What is the difference between a Docker Volume and a Bind Mount?\n- How would you pass localized configuration files from a host machine into a pre-built Nginx container without rebuilding the image?\n- Why is it generally recommended to use Managed Database Services (like AWS RDS) instead of running databases in Docker containers for enterprise production?\n- How do you clean up and delete unused Docker volumes using the CLI?`,
      }
    },
    {
      title: 'What is Docker Compose and why is it used in local development',
      metaTitle: 'Docker Compose Explained: Orchestrating Multi-Container Apps',
      metaDesc: 'Learn how to use Docker Compose and the docker-compose.yml file to define and run complex, multi-container applications effortlessly.',
      concepts: ['Docker Compose', 'Multi-Container', 'YAML', 'Networking'],
      quiz: { q: 'In a docker-compose.yml file, how do different services (containers) communicate with each other by default?', opts: ['They cannot communicate for security reasons', 'By making HTTP requests to external public IP addresses', 'By pinging localhost followed by a port number', 'By using the service name defined in the YAML file as the DNS hostname'], ans: 'By using the service name defined in the YAML file as the DNS hostname' },
      sections: {
        interviewer_expectation: `It is extremely rare to run a backend application that doesn't talk to a database. The interviewer wants to ensure you know how to wire multiple containers together without manually typing 20-line CLI commands.\n\nExpectations:\n- Defining Docker Compose as an orchestration tool for multi-container apps.\n- Mentioning the \`docker-compose.yml\` configuration file.\n- Explaining the automatic internal networking (service discovery by name).\n- Showing how it solves local dev environments.`,
        core_concepts: `**The Multi-Container Problem:**\nA modern backend application isn't just one container. It's usually a Java Spring Boot backend, a PostgreSQL database, and maybe a Redis cache. Typing \`docker run\` three times with massive strings of environment variables, volume mappings, and network attach flags is incredibly tedious and prone to error.\n\n**Docker Compose:**\nCompose is a tool used for defining and running multi-container Docker applications. You define all your services, networks, and volumes in a single declarative YAML file (\`docker-compose.yml\`). With a single command (\`docker-compose up\`), Docker starts the database, starts the cache, builds the Java app, and wires them all together automatically.\n\n**Internal DNS / Networking:**\nThe true power of Compose is its automatic internal networking. Compose automatically places all the services defined in the YAML file onto the same virtual Docker network. Because it provides an internal DNS server, the Spring Boot app can connect to the database simply by using the service name (e.g., \`jdbc:postgresql://db_postgres:5432/mydb\`) instead of hunting down unpredictable IP addresses.`,
        important_points: `- **Port Publishing \`ports:\` vs Exposing:** The \`ports\` directive (e.g., \`- "8080:8080"\`) opens the container's port to the *host machine* (your laptop). If you don't declare ports for the database, the backend container can still talk to it perfectly internally via the Compose network, but your graphical DB tool (like pgAdmin or DBeaver) on your laptop won't be able to connect to it.\n- **Dependencies (\`depends_on\`):** Compose respects startup order. If the Spring app needs the DB, you declare \`depends_on: - db_postgres\`. Compose guarantees the DB container physically starts before the Java container (though it doesn't guarantee the DB *software* inside has finished booting).`,
        code_example: `\`\`\`yaml
# docker-compose.yml
version: '3.8'

services:
  # Service 1: The PostgreSQL Database
  db_postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: mysecretpassword
      POSTGRES_DB: interview_db
    ports:
      - "5432:5432" # Exposes DB to the host machine for local debugging
    volumes:
      - db_data:/var/lib/postgresql/data # Persist the data!

  # Service 2: The Spring Boot Backend
  backend_api:
    build: . # Tells Compose to look for a Dockerfile in this directory and build it
    ports:
      - "8080:8080"
    environment:
      # MAGIC HAPPENS HERE: Notice the host is exactly the name of Service 1 (db_postgres)
      SPRING_DATASOURCE_URL: jdbc:postgresql://db_postgres:5432/interview_db
      SPRING_DATASOURCE_USERNAME: user
      SPRING_DATASOURCE_PASSWORD: mysecretpassword
    depends_on:
      - db_postgres # Start DB first

volumes:
  db_data: # Define the managed volume
\`\`\``,
        speakable_answer: `Docker Compose is a tool that allows developers to define and run applications that consist of multiple interconnected containers. \n\nModern backend apps usually require a database, a cache, and the API itself. To start all of those manually using the Docker CLI would take hundreds of characters of flags, volume mappings, and environment variables. \n\nInstead, Docker Compose lets you define the entire infrastructure stack declaratively in a single file called docker-compose.yml. With one simple command—docker-compose up—the tool reads the file, spins up PostgreSQL, spins up Redis, builds the Dockerfile for the Spring Boot app, attaches the necessary volumes, and binds the ports.\n\nPerhaps its most powerful feature is that it automatically creates an isolated internal network for the stack. It acts as an internal DNS server, meaning your Spring Boot application can connect to the database container simply by using the database's service name as the hostname in the JDBC URL. You don't ever need to know the database's IP address. This completely standardizes the local development environment—if a new developer clones the repo, they type docker-compose up, and the entire architecture is running perfectly in seconds.`,
        followup_questions: `- Explain how internal DNS service discovery works within a Docker Compose network.\n- What does the \`depends_on\` directive do in a Compose file, and what is its major limitation regarding database readiness?\n- How does the \`ports:\` mapping array work and what is the difference between the host port and container port?\n- Can Docker Compose be used in enterprise production environments, or is it strictly for local development?`,
      }
    },
    {
      title: 'What is Kubernetes and how does it relate to Docker',
      metaTitle: 'Kubernetes vs Docker: Container Orchestration Explained',
      metaDesc: 'Understand the relationship between Docker containers and Kubernetes, the industry-standard container orchestration platform used for massive scale.',
      concepts: ['Kubernetes (K8s)', 'Container Orchestration', 'Docker', 'Pods'],
      quiz: { q: 'In Kubernetes, what is the smallest deployable unit that encapsulates one or more Docker containers?', opts: ['A Node', 'A Deployment', 'A Service', 'A Pod'], ans: 'A Pod' },
      sections: {
        interviewer_expectation: `While deep K8s knowledge might be reserved for DevOps/SREs, senior backend developers are expected to understand the orchestration layer running their code.\n\nExpectations:\n- Clearly separating Docker (the image builder/runner) from Kubernetes (the orchestra conductor).\n- Defining Container Orchestration (auto-scaling, self-healing, load balancing).\n- Explaining what a "Pod" is in relation to a container.\n- Knowing what "Self-Healing" means.`,
        core_concepts: `**The Problem with raw Docker:**\nDocker is fantastic for running a container on a server. But what if you have an application that receives millions of requests? You need to run 100 identical containers spread across 10 physical servers. If Server #4 catches on fire, you need a system to notice the 10 dead containers and instantly restart them on surviving servers. You also need a load balancer to automatically route traffic only to the healthy containers. Managing this manually with Docker commands is impossible.\n\n**Kubernetes (K8s):**\nKubernetes is a Container Orchestration platform originally built by Google. \n- Docker's job is to build the application into an image and run the underlying process locally.\n- Kubernetes' job is to take those Docker images and manage their lifecycle across a massive cluster of servers in the cloud, ensuring high availability, automatic scaling, and load balancing.\n\n**The Pod:**\nKubernetes does not manage individual containers directly. It manages **Pods**. A Pod is the smallest deployable unit in K8s. It is essentially an envelope that holds one (or sometimes multiple closely coupled) Docker containers. All containers inside the same Pod share the exact same IP address and local storage network.`,
        important_points: `- **Self-Healing:** This is K8s' superpower. You provide a YAML declarative file saying, "I want exactly 5 Pods of my Java backend running." Kubernetes runs a constant control loop observing the cluster. If it sees only 4 pods because one crashed with a Java \`OutOfMemoryError\`, it immediately intervenes and asks a server to spin up a new Pod to restore the desired state of 5.\n- **Horizontal Auto-Scaling (HPA):** Instead of a fixed number of Pods, you can tell K8s: "Scale between 2 and 50 pods based on average CPU usage."\n- **Services (Networking):** Since Pods are constantly dying and being reborn with new IP addresses, K8s provides a \`Service\` abstraction. It acts as a permanent, internal load balancer. The Frontend microservice just talks to the Backend \`Service\` name, and K8s routes the traffic to whatever healthy Pods currently exist underneath it.`,
        code_example: `\`\`\`yaml
# Conceptual Kubernetes Deployment YAML
# This tells K8s to orchestrate 3 identical containers based on our Docker image
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-spring-backend
spec:
  replicas: 3 # The desired state: ALWAYS keep 3 running
  selector:
    matchLabels:
      app: spring-backend
  template: # This defines the Pod
    metadata:
      labels:
        app: spring-backend
    spec:
      containers:
      - name: java-app # The Docker container inside the Pod
        image: mycompany/my-spring-app:1.2.0
        ports:
        - containerPort: 8080
        resources:
          requests: # Tell K8s this app needs at least this much RAM to boot
            memory: "512Mi"
          limits: # Tell K8s to kill the container if it uses more than this
            memory: "1Gi" 
\`\`\``,
        speakable_answer: `To conceptualize it, think of Docker as individual musicians, and Kubernetes as the orchestra conductor.\n\nDocker is a tool for packaging code into an image and running it as an isolated container on a single machine. But in an enterprise environment, we don't run one container on one server. We run a cluster of dozens of servers hosting hundreds of identical front-end and back-end containers. If a server physically crashes, or a container dies from a memory leak, someone has to restart them. Manual management is impossible at scale.\n\nThat is the problem Container Orchestrators like Kubernetes solve. Kubernetes sits above the servers and manages the entire fleet. You provide it a declarative YAML file stating your desired state: for example, 'I always want exactly five instances of my Spring Boot container running.'\n\nKubernetes wraps your Docker container inside its own deployment unit called a Pod. It then distributes those 5 Pods across your available servers. It constantly monitors their health. If a container crashes, Kubernetes exhibits 'self-healing'—it notices the actual state is 4 Pods, realizes this violates the desired state of 5, and automatically spins up a new instance to replace the dead one. It also handles automatic load balancing and horizontal auto-scaling based on CPU load.`,
        followup_questions: `- What is a Kubernetes Pod, and why might you run more than one container inside a single Pod?\n- How does a Kubernetes "Service" differ from a "Deployment"?\n- Explain the concept of "Self-Healing" in container orchestration.\n- How does a Kubernetes Ingress Controller expose services to the public internet?`,
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
