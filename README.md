# ShortUrl — High-Performance URL Shortener Microservices

ShortUrl is an enterprise-grade, high-performance, and secure URL shortening and analytics platform. It is engineered with a modern microservices architecture using Spring Boot (Spring Cloud, Eureka Discovery, API Gateway) and a React frontend styled with Tailwind CSS v4.

---

## 🚀 Key Features

*   **Fast Shortening Engine**: Convert long URLs into compact 6-character unique codes instantly.
*   **Secure JWT Authentication**: Full registration and sign-in flow utilizing BCrypt password hashing and JWT token issuance.
*   **Dynamic Analytics**: Track click counts for every generated link in real time.
*   **User Dashboard**: Clean data table to view url history, copy short links with a single click, or delete unwanted redirections.
*   **Theme Switcher**: Fluid dark/light theme switching with stored state persistence.
*   **Modern Info Overlays**: Interactive modals for API documentation, system architecture charts, payment checkout simulation, support forms, and FAQ guides.
*   **Resilient Redirection Cache**: Designed to separate redirection traffic from core data mutation pipelines, allowing maximum throughput.

---

## 📸 Screenshots

| Landing Page (Light Mode) | Dashboard (Dark Mode) |
| --- | --- |
| <img src="https://github.com/user-attachments/assets/e3258ca7-51c7-4bcd-aef8-a8bab7ff104f" width="100%" alt="Landing Page"/> | <img src="https://github.com/user-attachments/assets/5fa74ac6-81e9-491b-aa2c-fecffd324f84" width="100%" alt="Dashboard"/> |

| JWT Authentication Modal | Sign Up Form |
| --- | --- |
| <img src="https://github.com/user-attachments/assets/08555fff-cafc-485a-be4e-053650fe03fb" width="100%" alt="Auth Modal"/> | <img src="https://github.com/user-attachments/assets/919dd0db-95f6-46fa-a3b9-f121b2ae95e4" width="100%" alt="Sign Up"/> |

| Pricing Page | Link Analytics Lookup |
| --- | --- |
| <img src="https://github.com/user-attachments/assets/26559486-b591-4d4b-a36c-86e99c5086d1" width="100%" alt="Pricing Page"/> | <img src="https://github.com/user-attachments/assets/51d7a8a3-31d0-4d3c-b988-22ee1f63f92b" width="100%" alt="Analytics Lookup"/> |

---

## 🛠️ Tech Stack

### Frontend
*   **React 19** & **Vite 8**
*   **Tailwind CSS v4** (Utility styling)
*   **React Router v7** (Routing)
*   **Lucide React** (Vector iconography)

### Backend (Spring Boot Microservices)
*   **Spring Boot 3.x**
*   **Spring Cloud Netflix Eureka** (Service Discovery)
*   **Spring Cloud Gateway WebMVC** (API Routing)
*   **Spring Data JPA** (Hibernate ORM)
*   **Spring Security Crypto** (BCrypt)
*   **JJWT (Java JWT)** (Token validation/issuance)
*   **MySQL & Redis Cache**

---

## 🏗️ System Architecture

ShortUrl distributes request processing across multiple microservices to optimize data storage, security boundaries, and cache redirection latency.

```mermaid
graph TD
    Client[React Frontend - Port 5173] -->|API Requests| Gateway[API Gateway - Port 8082]
    Client -->|Direct Redirection| Gateway
    
    Gateway -->|JWT Authentication Filter| Shortener[URL Shortener Service - Port 8080]
    Gateway -->|Public Passthrough| Redirector[Redirect Service - Port 8081]
    
    Shortener -->|Saves URL Mapping / Users| MySQL[(MySQL Database)]
    Redirector -->|Reads Original URL / Logs Clicks| Cache[(Redis Cache / Shared MySQL)]
    
    Discovery[Eureka Discovery Server - Port 8761] <.->|Service Registry| Gateway
    Discovery <.->|Service Registry| Shortener
    Discovery <.->|Service Registry| Redirector
```

---

## 🔌 API Endpoints

All client requests route through the **API Gateway (Port 8082)**.

### Authentication Endpoints (Public)
*   `POST /auth/register`: Create a new user account.
    ```json
    { "username": "example", "password": "securepassword" }
    ```
*   `POST /auth/login`: Authenticate and receive a JWT.
    ```json
    { "username": "example", "password": "securepassword" }
    ```
    *Returns:*
    ```json
    {
      "token": "eyJhbGciOi...",
      "username": "example",
      "message": "Login successful"
    }
    ```

### URL Operations (Secured/Public)
*   `POST /api/v1/shorten` (Public/Authorized): Generate a short link. Supply a `Authorization: Bearer <token>` header to map the link to your history.
    ```json
    { "longUrl": "https://example.com/very-long-link-to-be-shortened" }
    ```
    *Returns:*
    ```json
    { "shortUrl": "http://localhost:8082/xyzabc" }
    ```
*   `GET /api/v1/history` (Authorized): Retrieve the authenticated user's shortening history.
*   `DELETE /api/v1/delete/{shortCode}` (Authorized): Remove a shortened URL mapping.

### Redirection Endpoint (Public)
*   `GET /{shortCode}`: Performs a HTTP 302 redirection to the original destination and logs analytics click counters.

---

## 💻 Running Locally

### Prerequisites
*   Java 21 JDK
*   Node.js (v18+)
*   MySQL Instance running at `localhost:3306` with database `url_shortener` (Password: `root`, Username: `root`)

### 1. Launch Backend Services
Start the services in the following order:
1.  **Discovery Service** (Port 8761)
2.  **API Gateway** (Port 8082)
3.  **URL Shortener Service** (Port 8080)
4.  **Redirecting Service** (Port 8081)

Run this command inside each service directory:
```bash
./mvnw spring-boot:run
```

### 2. Start Frontend App
From the `Frontend` directory, run:
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

*Developed by [Shivansh](https://github.com/shivanshmishra54) — Connect on [LinkedIn](https://www.linkedin.com/in/shivansh-mishra54/)*
