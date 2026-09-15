# System Design & Architecture Research Paper: ShortUrl

**Author:** Shivansh Mishra  
**Date:** July 2026  
**Document Classification:** Technical Architecture & System Blueprint

---

## Abstract
This paper presents the architectural design, security model, and implementation workflow of **ShortUrl**, an enterprise-grade, high-performance, and horizontally scalable URL shortening and analytics platform. Monolithic URL shorteners frequently encounter performance degradation during high-concurrency redirection events (read-heavy operations) due to shared resources with data mutation operations (write-heavy link generation). To address this bottleneck, ShortUrl implements a modern microservices architecture utilizing Spring Boot, Spring Cloud, Netflix Eureka Service Discovery, an intelligent API Gateway with custom JWT authentication filters, and an asynchronous read/write separation topology backed by Redis caching.

---

## 1. Introduction
URL shortening services are structurally unique: they face highly disproportionate traffic patterns. Over 95% of request volume is dedicated to reading and redirecting shortened URLs, while less than 5% involves link registration (mutating writes). 

In a monolithic architecture, a surge in redirection requests can starve the CPU and connection pool resources required for user signup, JWT authentication, and URL generation. ShortUrl decouples these concerns into isolated, containerizable microservices that communicate asynchronously, ensuring high availability, sub-millisecond redirect latencies, and hardened security boundaries.

---

## 2. Codebase Directory Topology

### 2.1 Backend Package Layout
```text
Backend/
├── Discovery-Service/                  # Eureka Server registry
├── Api-Gateway/                        # Routing and JWT security gateway
│   └── src/main/java/dev/shivansh/apiGateway/
│       ├── Config/
│       │   └── JwtAuthFilter.java     # Filters and forwards valid JWTs
│       └── ApiGatewayApplication.java  # Exposes public/private route beans
├── URL-Shortener-Service/              # Auth, User DB & URL creation
│   └── src/main/java/dev/shivansh/urlsservice/
│       ├── Config/
│       │   ├── AppConfig.java          # Cryptography and password encoding
│       │   └── JwtUtil.java            # JJWT token encoder/decoder
│       ├── Controllers/
│       │   ├── AuthController.java     # /auth/register and /auth/login
│       │   ├── RedirectController.java # Public local redirect fallback
│       │   └── UrlController.java      # Secured URL shortening and analytics
│       ├── Entity/
│       │   ├── User.java               # JPA user mapping with unique email
│       │   └── Url.java                # JPA link mapping and analytics
│       ├── Repository/
│       │   ├── UserRepository.java
│       │   └── UrlRepository.java
│       └── Services/
│           ├── AuthService.java
│           └── UrlService.java
└── Redirecting-Service/                # Read-optimized redirects
    └── src/main/java/dev/shivansh/redirectService/
        ├── Controllers/
        │   └── RedirectController.java # Resolves HTTP 302 redirects
        └── Services/
            ├── RedirectServices.java   # Pulls cache and fires async tracking
            └── ClickTrackerService.java # Asynchronous click updater
```

### 2.2 Frontend Project Layout
```text
Frontend/
├── public/
│   └── favicon.svg                     # Custom brand chain-link icon
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AuthModal.jsx               # Sign in / Sign up popup with password eye toggle
│   │   ├── Footer.jsx                  # Persistent footer with InfoModal links
│   │   ├── Header.jsx                  # Header with theme context & notification drawer
│   │   └── UrlShortenerForm.jsx        # Dashboard URL generation form
│   ├── context/
│   │   └── ThemeContext.jsx            # Dark/Light theme provider
│   ├── pages/
│   │   ├── LandingPage.jsx             # Marketing landing page
│   │   ├── Dashboard.jsx               # Authenticated dashboard table (Copy/Delete)
│   │   ├── Features.jsx                # Standalone SaaS features page
│   │   ├── Pricing.jsx                 # Dynamic plans & FAQ page
│   │   └── Analysis.jsx                # Interactive URL stats search lookup page
│   ├── App.jsx                         # Main router configuration and state manager
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

---

## 3. Microservice Decomposition
The platform is composed of five distinct components coordinated through a centralized service registry:

```
                                 +-------------------------+
                                 |  React SPA (Port 5173)   |
                                 +------------+------------+
                                              |
                                              | HTTPS Requests (Port 8082)
                                              v
                                 +------------+------------+
                                 |  API Gateway (Port 8082)|
                                 +-----+--------------+----+
                                       |              |
                /auth/** (Passthrough) |              | /api/v1/** (Token Validated)
                                       v              v
        +----------------------------------+      +-----------------------------------+
        | URL Shortener Service (Port 8080)|      |    Redirect Service (Port 8081)   |
        +----------------+-----------------+      +-----------------+-----------------+
                         |                                          |
                         +--------------------+---------------------+
                                              |
                                              v
                                  +-----------+-----------+
                                  |    Shared MySQL DB    |
                                  | (Shared schema/cache) |
                                  +-----------------------+
```

### 3.1 Discovery Server (Netflix Eureka)
*   **Port:** `8761`
*   **Role:** Acts as the lookup coordinator. Each microservice registers its hostname and dynamic IP address upon startup. The API Gateway queries Eureka to balance and route incoming client traffic to live service instances.

### 3.2 API Gateway (Spring Cloud Gateway)
*   **Port:** `8082`
*   **Role:** The single entry point for all traffic. It manages CORS policies globally and applies a custom `JwtAuthFilter`. 
    - Routes matching `/auth/**` (Registration/Login) pass straight through.
    - Routes matching `/api/v1/**` require a valid JWT token. The Gateway validates the token signature and forwards the extracted username downstream using the `X-User-Username` header.

### 3.3 URL Shortener Service (Core Logic & Auth)
*   **Port:** `8080`
*   **Role:** Manages stateful write operations, user profile persistence, JWT token generation (using JJWT), and MySQL relational mapping. 

### 3.4 Redirecting Service
*   **Port:** `8081`
*   **Role:** A highly optimized, read-only service dedicated to resolving short codes back into original long destination URLs. 
*   **Optimization**: Implements async click tracking (`ClickTrackerService`) to immediately return HTTP 302 redirects to the user, offloading DB write operations to a background thread.

---

## 4. Core System Workflows

### 4.1 Authentication Workflow (JWT & Password Hashing)
```
  Client                   API Gateway               Auth Service               Database
    |                           |                         |                         |
    |-- 1. POST /auth/login --->|                         |                         |
    |   (Email & Password)      |-- 2. Forward payload -->|                         |
    |                           |                         |-- 3. findByEmail() ---->|
    |                           |                         |                         |<-- User Entity --
    |                           |                         |-- 4. BCrypt Match ------|
    |                           |                         |-- 5. Generate JWT ------|
    |                           |<-- 6. Token Response ---|                         |
    |<-- 7. Token saved in -----|                         |                         |
    |   LocalStorage            |                         |                         |
```

### 4.2 URL Shortening & Collision Avoidance Algorithm
When a user shortens a link, the service generates a Base-62 identifier using the character set:
`0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`

To prevent collisions:
1.  A random 6-character code is generated (`62^6 = 56.8 Billion` possible combinations).
2.  The service performs a fast database lookup check: `existsByShortUrl(shortCode)`.
3.  If a collision occurs (code already exists), a loop regenerates the code until a unique code is secured, ensuring data integrity.
4.  The mapping is stored in the database. If a JWT token was provided in the headers, the Gateway extracts the user context and maps the link to that user's history.

#### 4.2.1 Mathematical Analysis of Code Space & Collision Probability
The total size of the hash space for a 6-character Base-62 identifier is:
$$N = 62^6 = 56,800,235,584 \approx 56.8\text{ Billion}$$

Using the **Birthday Paradox**, we can estimate the probability $P(k)$ of a collision occurring after shortening $k$ URLs:
$$P(k) \approx 1 - e^{-\frac{k(k-1)}{2N}} \approx 1 - e^{-\frac{k^2}{2N}}$$

*   For $k = 1,000,000$ active shortened URLs:
    $$P(1,000,000) \approx 1 - e^{-\frac{10^{12}}{2 \times 56.8 \times 10^9}} \approx 1 - e^{-0.0088} \approx 0.88\%$$
*   This proves that even at **1 Million active links**, the probability of a random collision on the first attempt is less than **1%**. The recursive loop in `UrlService.java` resolves any rare collision immediately with negligible performance cost.

### 4.3 Asynchronous Redirection Flow
To keep redirections close to O(1) latency:
1.  Client requests `GET /xyzabc`.
2.  Gateway routes the request to the `Redirecting-Service`.
3.  The Redirecting Service checks the Redis cache (or Database) for the original destination mapping.
4.  The service returns an immediate `HTTP 302 Found` response with the `Location` header set to the destination URL.
5.  Simultaneously, the service triggers an asynchronous thread to increment the click count in the database:
    ```java
    @Async
    public void incrementClickCountAsync(String shortUrl) {
        // Asynchronous SQL update avoiding blocking HTTP response
    }
    ```

---

## 5. Database Schema Design & Indexing Optimization

The relational schema consists of two tables linked via user context. To prevent table scan bottlenecks during concurrent redirections and lookup queries, **B-Tree indexes** are explicitly configured.

```
       users                                  urls
  +--------------+                      +-----------------+
  | id (PK)      |                      | id (PK)         |
  | username     |                      | url             |
  | email (UQ)   |                      | short_url (UQ)  | <--- [B-Tree Indexed]
  | password     |                      | username (FK)   |
  +--------------+                      | created_at      |
                                        | clicks          |
                                        +-----------------+
```

### 5.1 Users Table (`users`)
Holds user records with secure passwords and unique emails.
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE, -- Index automatically created for UNIQUE constraint
    password VARCHAR(255) NOT NULL
);
```

### 5.2 URLs Table (`urls`)
Holds mappings and analytics counters.
```sql
CREATE TABLE urls (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    url TEXT NOT NULL,                  
    short_url VARCHAR(15) NOT NULL UNIQUE, -- Indexed: Resolves SELECT URL in O(log N)
    username VARCHAR(50) DEFAULT NULL,   
    created_at TIMESTAMP NOT NULL,
    clicks INT DEFAULT 0
);

-- Explicitly created index for user history retrieval optimization
CREATE INDEX idx_urls_username ON urls(username);
```

---

## 6. Security, Gateway routing & CORS Case Study

### 6.1 Gateway Security Filtering
The API Gateway acts as the security firewall of the cluster.

```java
// Logic inside Gateway's JwtAuthFilter.java
if (isSecured(request)) {
    String token = extractToken(request);
    if (jwtUtils.isTokenExpired(token) || !jwtUtils.validateToken(token)) {
        return handleUnauthorized(exchange);
    }
    // Inject username into downstream headers
    String username = jwtUtils.extractUsername(token);
    exchange.getRequest().mutate()
            .header("X-User-Username", username)
            .build();
}
```
This isolates downstream microservices from security logic, allowing them to remain stateless and focus entirely on core business operations.

### 6.2 CORS Case Study: Resolving the Duplicate Origin Header Issue
During initial development, the frontend encountered the following error in the browser console:
> *Access to fetch at 'http://localhost:8082/api/v1/shorten' from origin 'http://localhost:5173' has been blocked by CORS policy: The 'Access-Control-Allow-Origin' header contains multiple values '*, *', but only one is allowed.*

*   **The Cause**: The `@CrossOrigin(origins = "*")` annotation was placed on individual Spring `@RestController` classes (e.g. `UrlController.java`), while the API Gateway (`ApiGatewayApplication.java`) was also configured to inject CORS headers globally.
*   **The Consequence**: When a request was processed, both the Gateway and the downstream microservice appended `Access-Control-Allow-Origin: *`. The browser intercepted a response header with duplicate origins (`*, *`) and blocked it for security reasons.
*   **The Resolution**: We removed `@CrossOrigin` annotations from all downstream microservices, configuring the API Gateway as the single CORS management checkpoint:
    ```java
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }
    ```

## 7. Scalability Model

To sustain high user acquisition rates and traffic spikes, the ShortUrl infrastructure is engineered for dual-axis scalability.

### 7.1 Dynamic Horizontal Scaling (HPA)
Since all core services (Gateway, Shortener, Redirector) are stateless, they can scale on-demand.
*   **Metrics Trigger**: Services are deployed in containerized clusters (e.g., Kubernetes). A **Horizontal Pod Autoscaler (HPA)** is configured to spin up new replicas of the `Redirecting-Service` when CPU utilization exceeds $70\%$ or average HTTP queue length climbs above $1000$ concurrent requests.
*   **Gateway Load Balancing**: Newly registered instances register themselves with Eureka. The API Gateway automatically routes incoming requests to the new pods using a round-robin load-balancing algorithm.

### 7.2 Read/Write SQL Partitioning
To prevent database I/O saturation:
*   **Write Operations**: Link shortening and user registration queries go directly to a MySQL **Primary database instance**.
*   **Read Operations**: Redirections and history queries target **Read Replicas** distributed across availability zones, ensuring database lock contention is kept to a minimum.

### 7.3 Cache Eviction and Memory Boundedness
To prevent Redis memory saturation:
*   An **LRU (Least Recently Used)** eviction policy is configured in Redis:
    ```properties
    maxmemory 2gb
    maxmemory-policy allkeys-lru
    ```
*   This ensures only high-frequency redirect mappings remain in RAM, while cold link mappings are evicted automatically to be retrieved from MySQL on the next redirect event.

---

## 8. Failover, Resiliency & Fault Tolerance

Microservices operate in environments prone to transient network partitions. ShortUrl integrates defensive programming and failover triggers to prevent cascading failures.

### 8.1 Circuit Breaker Implementation (Resilience4j)
To prevent a slow downstream service from locking threads in the API Gateway, we implement the **Circuit Breaker Pattern**:
```yaml
# Gateway Resilience4j Configuration
resilience4j.circuitbreaker:
  instances:
    shortenerService:
      slidingWindowSize: 20
      failureRateThreshold: 50
      waitDurationInOpenState: 15000
```
*   **Behavior**: If the `URL-Shortener-Service` experiences a connection failure or database deadlock and fails $50\%$ of requests in a sliding window of 20, the Gateway trips the circuit to **OPEN**.
*   **Graceful Fallback**: Subsequent calls immediately receive a localized mock response or a clean cached response rather than keeping user HTTP connections hanging.

### 8.2 Database Outage & Graceful Degradation
*   If the primary MySQL database fails completely, the `Redirecting-Service` enters a degraded operation state. 
*   It continues to resolve redirections for any URL mappings already backfilled in the **Redis Cache**, preserving redirection availability even during a complete relational database outage. A banner warns users trying to generate *new* links that the shortening service is temporarily under maintenance.

### 8.3 HikariCP Connection Recovery
To recover from network blips:
- Hikari connection timeout limits are tuned to check database connection health dynamically before handing connections to queries. If a connection drops, Hikari recovers it asynchronously behind the scenes.

---

## 9. Testing Methodologies

Our verification model guarantees code correctness, system integration stability, and load capacity prior to production deployment.

### 9.1 Unit & Integration Testing (JUnit & Mockito)
*   **MockMvc API Tests**: Controller methods (e.g. `AuthController`, `UrlController`) are unit-tested without booting up server instances by mock-simulating request/response cycles.
*   **Testcontainers Integration**: To ensure JPA repository tests run against a production-like environment (instead of inaccurate in-memory databases), integration tests boot up temporary **Docker containers** running real MySQL and Redis instances on the fly.
    ```java
    @Container
    static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8.0");
    ```

### 9.2 High-Throughput Load & Stress Testing (Gatling / JMeter)
Before release, the system is subjected to simulated high-stress test suites:
*   **Scenario**: Simulating a traffic surge of **10,000 requests/second** hitting the redirection Gateway `/api/v1/history` and redirection endpoints.
*   **Objective**: Confirming that under heavy traffic, the p95 response time for redirect resolution remains **below 15 milliseconds**, and validating that Redis successfully handles the load while SQL connection pools remain below $50\%$ capacity.

---

## 10. Conclusion
ShortUrl demonstrates how decoupling read and write traffic through microservice boundaries, caching mapping data, and securing clusters at a single gateway checkpoint creates a highly resilient system. By separating URL generation from redirection pipelines, the application guarantees continuous system uptime and sub-second performance metrics even under high redirection load.

