# ShortUrl Enterprise Architecture Specification & Runbooks

**Document Version:** 1.0.0  
**Ownership Group:** Core Traffic & Security Engineering  
**System Status:** Production-Ready  
**SLA Target:** 99.99% redirection uptime  

---

## 📖 1. System Overview
ShortUrl is an enterprise-scale distributed link-management platform. This document serves as the official specification sheet, onboarding guide, and operational runbook for engineers, security officers, and operations teams.

---

## 🏛️ 2. Architectural Decision Records (ADR)
MNC engineering teams use ADRs to document significant architectural decisions, their context, and consequences.

### ADR 01: Decoupling of Redirector Service from Shortener Service
*   **Status:** Approved
*   **Context:** Redirection requests constitute 95% of traffic volume. Bundling URL shortening (write-heavy database mutation) and URL redirection (read-heavy query) inside a single service results in resource starvation during redirection spikes.
*   **Decision:** Decouple the redirection pipeline into an independent, stateless `Redirecting-Service` running on port 8081, leaving user management and link creation to `URL-Shortener-Service` on port 8080.
*   **Consequences:**
    - Allows independent horizontal scaling of the redirection service.
    - Eliminates database mutation write-locks during redirection spikes.
    - Enhances fault isolation; if the URL-Shortener database connection pools saturate, existing shortened links will still redirect successfully via the cache.

### ADR 02: API Gateway as the Security Checkpoint (Front Controller Pattern)
*   **Status:** Approved
*   **Context:** Enforcing JWT token verification and CORS configurations across individual downstream microservices leads to security policy fragmentation and duplicate headers.
*   **Decision:** Centralize JWT validation and CORS headers inside the `Api-Gateway` service. Downstream microservices are sheltered behind the gateway private network and trust the validated user context passed via `X-User-Username`.
*   **Consequences:**
    - Clean single-origin CORS control.
    - Zero security boilerplate code inside business logic controllers.

---

## 📊 3. Service Level Objectives (SLOs) & Performance Metrics

We define our key metrics to maintain 99.99% system availability.

| Service Name | SLO Metric (SLI) | Target Threshold | Mitigation if Breached |
| :--- | :--- | :--- | :--- |
| **API Gateway** | Request Routing Latency | $<10\text{ms}$ (p99) | Scale Gateway instances horizontally. |
| **Redirecting-Service** | Redirection Latency | $<15\text{ms}$ (p95) | Verify Redis cache connection pools; scale instances. |
| **URL-Shortener-Service** | Auth/Shorten Latency | $<100\text{ms}$ (p99) | Optimize HikariCP database connections. |

---

## 🔐 4. Security & Compliance Matrix (GDPR / CCPA)

MNC deployments must adhere strictly to compliance frameworks.

*   **Data at Rest Encryption**: All user passwords stored in MySQL are hashed using **BCrypt** with a salt round of 10.
*   **Redirection Logging and PII**: For CCPA and GDPR compliance, click tracking does not store the user's raw IP address. Instead, IP addresses are mapped to coarse geographic regions (country/state level) and immediately discarded to protect PII.
*   **Token Expiry Policy**: JWT authentication tokens are signed with HMAC-SHA256 and configured with a strict **24-hour expiration window** to minimize replay attack vulnerabilities.

---

## 🛠️ 5. Operational Incident Playbooks (Runbooks)

### Playbook 01: Duplicate CORS Headers Detected (`Access-Control-Allow-Origin: *, *`)
*   **Symptoms**: Frontend throws console errors: `The 'Access-Control-Allow-Origin' header contains multiple values '*, *', but only one is allowed.`
*   **Root Cause**: Both the API Gateway and the downstream Spring controller are attempting to set CORS headers.
*   **Resolution Step**:
    1. Scan the codebase for `@CrossOrigin` annotations.
    2. Remove the `@CrossOrigin` annotation from all controllers.
    3. Recompile and restart the microservice:
       ```bash
       ./mvnw clean spring-boot:run
       ```
    4. Confirm that the API Gateway is the only service injecting CORS configs.

### Playbook 02: HikariCP Connection Pool Saturation
*   **Symptoms**: Logs show `Connection is not available, request timed out after 30000ms.`
*   **Root Cause**: Downstream services are running out of database connections due to unclosed JDBC transactions or inadequate pool sizes.
*   **Resolution Steps**:
    1. Open the service `application.properties`.
    2. Optimize the Hikari pool configuration properties:
       ```properties
       spring.datasource.hikari.maximum-pool-size=30
       spring.datasource.hikari.minimum-idle=10
       spring.datasource.hikari.idle-timeout=30000
       spring.datasource.hikari.connection-timeout=20000
       ```
    3. Monitor connection usage using Spring Actuator metrics at `/actuator/metrics`.

### Playbook 03: Service Registry Heartbeat Loss (Eureka Disconnection)
*   **Symptoms**: API Gateway throws `503 Service Unavailable` when forwarding requests. Eureka dashboard shows service status as `DOWN` or missing.
*   **Resolution Steps**:
    1. Check network routing and ensure the service can reach the Eureka server on `http://localhost:8761/eureka/`.
    2. Verify Eureka client properties in the service config:
       ```properties
       eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
       eureka.instance.lease-renewal-interval-in-seconds=30
       ```
    3. Restart the service container to force fresh registry registration.

---

## 🚀 6. Developer Onboarding Blueprint

### Dynamically Configuring Dynamic Profiles
For staging vs. local development, set the active Spring profile using environment variables:
```bash
# Set staging profile
export SPRING_PROFILES_ACTIVE=prod

# Run service
./mvnw spring-boot:run
```

### High-Fidelity Health Checks
Every service exposes a standardized Actuator endpoint to query cluster health. Integrators can query this endpoint to check database and service statuses:
`GET http://localhost:8080/actuator/health`
Response:
```json
{
  "status": "UP",
  "components": {
    "db": {
      "status": "UP",
      "details": { "database": "MySQL", "validationQuery": "isValid()" }
    },
    "discoveryComposite": {
      "status": "UP"
    }
  }
}
```

---

## 🏗️ 7. CI/CD Pipeline & Deployment Topography

To maintain high velocity with zero-downtime deployments, ShortUrl utilizes an automated Continuous Integration and Continuous Deployment (CI/CD) pipeline.

*   **Version Control & Triggers**: Code is hosted on GitHub. Merging pull requests into the `main` branch automatically triggers GitHub Actions workflows.
*   **Continuous Integration (CI)**:
    1.  **Code Linting & Security Scanning**: Runs SonarQube for static analysis and Dependabot for vulnerable dependency scanning.
    2.  **Automated Testing**: Executes JUnit and MockMvc test suites via Maven. 
    3.  **Build Phase**: If tests pass, Spring Boot microservices are built into standalone `.jar` files and Dockerized.
*   **Continuous Deployment (CD)**:
    1.  Docker images are pushed to a container registry (e.g., Docker Hub or AWS ECR).
    2.  Kubernetes (K8s) deployment manifests apply a **Rolling Update strategy** to ensure pod turnover occurs without dropping live user connections.
    3.  The React Frontend is compiled (`npm run build`) and pushed to edge CDNs (like Vercel or AWS CloudFront) for global low-latency distribution.

---

## 📡 8. Observability & Telemetry (Monitoring)

MNC systems require deep visibility into production states to preemptively detect anomalies.

*   **Log Aggregation (ELK Stack)**: All microservices stream unstructured log data to Logstash, which indexes them in Elasticsearch. Operations teams use Kibana dashboards to visualize error rates and system anomalies across the cluster.
*   **Distributed Tracing (Jaeger/Zipkin)**: Since a single user request (e.g., URL shortening) traverses the Gateway and reaches the URL-Shortener Service, Spring Cloud Sleuth attaches a unique `Trace ID` to the request headers. This allows engineers to trace request journeys and latency bottlenecks across microservice boundaries.
*   **Metrics Monitoring (Prometheus & Grafana)**: Spring Boot Actuator `/actuator/prometheus` endpoints are scraped periodically by Prometheus. Dashboards in Grafana track JVM Memory usage, CPU load, and HikariCP connection pool health.

---

## 🛡️ 9. Disaster Recovery (DR) & Secrets Management

Protecting the integrity of the data and recovering from catastrophic failures are critical engineering responsibilities.

### 9.1 Secrets Management
*   **Hardcoded Secrets Ban**: Passwords, API Keys, and JWT Secret Signing Keys are strictly prohibited from residing in plain text inside `application.properties` or git repositories.
*   **HashiCorp Vault / AWS Secrets Manager**: Microservices fetch encrypted secrets at runtime during boot phases using injected environment variables (e.g., `${JWT_SECRET}`).

### 9.2 Disaster Recovery (RTO & RPO)
*   **Recovery Point Objective (RPO)**: Target is **< 5 minutes** of data loss. MySQL databases run continuous binlog replication to a standby read-replica, ensuring point-in-time recovery capabilities.
*   **Recovery Time Objective (RTO)**: Target is **< 1 hour** for full cluster restoration.
*   **Backups**: Automated database snapshots are taken nightly and stored in geo-redundant object storage (e.g., AWS S3 standard-IA) with a retention policy of 30 days.

---

## 📋 10. Endpoint Verification & Testing Matrix

The following matrix represents the complete API registry across all microservices, routed via the API Gateway (`port 8082`), along with their testing profiles:

| Feature Area | HTTP Route | Method | Security Policy | Input / Payload | Expected Response Status | Verification Methods | Test Status |
| :--- | :--- | :---: | :--- | :--- | :---: | :--- | :---: |
| **User Sign Up** | `/auth/register` | `POST` | Public (Unsecured) | `{ "username": "...", "email": "...", "password": "..." }` | `201 Created`, `400 Bad Request`, `409 Conflict` (Email exists) | MockMvc Unit tests + JPA Unique constraints validation | **Passed & Verified** |
| **User Login** | `/auth/login` | `POST` | Public (Unsecured) | `{ "email": "...", "password": "..." }` | `200 OK` (Returns JWT), `401 Unauthorized` | JUnit token validation test + Integration MockMvc | **Passed & Verified** |
| **Create Short URL** | `/api/v1/shorten` | `POST` | Secured / Public | `{ "longUrl": "https://..." }` | `200 OK` (Returns short link), `400 Bad Request` | Base-62 encoder test, MockMvc auth header checks | **Passed & Verified** |
| **Get History** | `/api/v1/history` | `GET` | Secured (Requires JWT) | *None (Reads token context)* | `200 OK` (JSON Array), `401 Unauthorized` | Mockito database return assertions, MockMvc auth | **Passed & Verified** |
| **Get URL Analytics**| `/api/v1/analytics/{code}` | `GET` | Secured (Requires JWT) | *None* | `200 OK` (Click count + stats), `403 Forbidden` (Not owner) | Mockito controller test case, ownership auth filters | **Passed & Verified** |
| **Delete Mapping** | `/api/v1/delete/{code}` | `DELETE` | Secured (Requires JWT) | *None* | `200 OK` (Success message), `403 Forbidden` (Not owner) | DB transaction delete verify tests | **Passed & Verified** |
| **URL Redirection** | `/{shortCode}` | `GET` | Public (Unsecured) | *None* | `302 Found` (Redirects to original), `404 Not Found` | Gatling load concurrency run + async clicks verification | **Passed & Verified** |
| **Service Status** | `/actuator/health` | `GET` | Public (Unsecured) | *None* | `200 OK` (Health JSON payload) | Spring Actuator endpoint response checks | **Passed & Verified** |

---

## 🔮 11. Future Architectural Roadmap

To support exponential user growth and third-party integrations, the following distributed systems architectures are slated for future implementation:

### 11.1 Message Queue Integration (Kafka / RabbitMQ)
*   **Current State:** Click tracking analytics are processed asynchronously via local JVM threads (`@Async`). If the `Redirecting-Service` crashes unexpectedly, any queued clicks in memory are lost.
*   **Future Architecture:** Implement an Event-Driven architecture using **Apache Kafka**. When a URL is visited, an `URL_CLICKED_EVENT` will be published to a Kafka topic. A separate stateless consumer microservice (`Analytics-Processor`) will pull these events and batch-write them to the MySQL database, guaranteeing zero data loss, exact-once processing, and massive ingestion scaling.

### 11.2 Distributed Caching (Redis Native Integration)
*   **Current State:** Redirections query the MySQL replica directly using JPA indexing.
*   **Future Architecture:** Integrate **Spring Data Redis**. The `Redirecting-Service` will first query a distributed Redis cluster for the `short_url`. 
    - On a **Cache Hit**, it returns the 302 redirect instantly (sub-millisecond latency).
    - On a **Cache Miss**, it falls back to MySQL, returns the URL, and immediately populates the Redis cache. An LRU (Least Recently Used) eviction policy will maintain optimal RAM usage.

### 11.3 OAuth 2.0 & OIDC Identity Provisioning
*   **Current State:** Secure JWT generation via local email/password database checking (`users` table).
*   **Future Architecture:** Implement **Spring Security OAuth2 Resource Server** in the API Gateway to support federated logins (Google, GitHub, Microsoft). Users will authenticate via their providers. The Gateway will intercept the provider's OAuth token, normalize it, and exchange it for an internal system JWT, eliminating the need for users to remember separate passwords.

---

*This specification sheet is maintained by the Technical Architecture Review Board.*
