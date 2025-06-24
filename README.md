# Crud App

A full-stack CRUD application with a React (Vite) frontend and a Spring Boot backend. This project demonstrates many concepts of frontend and backend development, including TWT and OAuth2 authentication, state management, testing, and cloud-based media storage.

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/ZAID-BAARAB/crud-app.git
```

---

## 🖥️ Frontend (React + Vite)

### Navigate to the Frontend Directory
```bash
cd crud-app/Frontend/crud-app

```

### Install Dependencies
```bash
npm install
```

### Run the Development Server
```bash
npm run dev
```

Access the app at: [http://localhost:5173/](http://localhost:5173/)

#### ✨ Frontend Features
- **Tailwind CSS** for modern, responsive styling
- **Google OAuth2** authentication
- **Protected Routes** (Add Product requires login; also role-based access )
- **Redux** for state management
- **form validation**
- **Reusable Components** (Buttons, Inputs, etc.)
- **Separation of Concerns**: API logic in `/services`, UI in `.tsx` components
- **Unit Testing** with Jest
- **pagination**

#### 🧪 Running Frontend Unit Tests
```bash
npm test
```

---

## 🛠️ Backend (Spring Boot)

### Environment Profiles
- Uses **Spring Boot profiles** for environment-specific configs
- `local` profile: Connects to your local PostgreSQL
- `docker` profile: Connects to PostgreSQL in Docker Compose

### Image Management
- **Cloudinary** is used for product image storage on the cloud
- Only image URLs are stored in the database for performance and scalability
- Cloudinary provides CDN which makes images load faster

### ⚠️ Security Note
> **I hardcoded Credentials   in `application.yml` only for demo purposes to test code without extra setup from your part.**
> **in production** we Use environment variables for sensitive data.

---

## 🔹 Option 1: Run Locally (`local` profile)
**Requirements:** Java 17, Maven, PostgreSQL

1. **Start PostgreSQL**
   - Host: `localhost`
   - Port: `5433`
   - DB name: `hahn`
   - Username: `postgres`
   - Password: `Novel222`

2. **Run the Backend**
```bash
cd crud-app/backend
# With Maven Wrapper
./mvnw spring-boot:run
# Or with Maven installed
mvn spring-boot:run
```
> Uses `application-local.yml` configuration

---

## 🔹 Option 2: Run with Docker (`docker` profile)
**No local install needed!**

1. **Package the Application**
```bash
cd backend
./mvnw clean package
# Or with Maven installed
mvn clean package
```
2. **Start with Docker Compose**
```bash
docker-compose up --build
```
- Builds the Spring Boot image
- Starts a PostgreSQL container
- Runs backend with `application-docker.yml`

---
### API Documentation
Swagger UI is integrated for interactive API documentation. Access it at:
http://localhost:8080/swagger-ui.html

## 🧪 Running Backend Unit Tests (JUnit + Mockito)

- **Tests:** `AuthenticationServiceTest` and `ProductServiceTest` 
- **Purpose:** Validate service and repository logic

### Run All Tests
```bash
cd backend
./mvnw test
# Or with Maven installed
mvn test
```
## 🛠️ SQL Script

An SQL script is provided to initialize the database schema along with some sample data (Users and Products) for testing purposes.  
You can find the file at:

```bash
crud-app/Backend/src/main/resources/schema.sql
```
---

## 📄 Contacts

If you have any questions or would like to get in touch, feel free to reach out:

- 📧 **Email**: [baarabzaid42@gmail.com](mailto:baarabzaid42@gmail.com)  
- 📞 **Phone**: +212 6 58 57 20 07
