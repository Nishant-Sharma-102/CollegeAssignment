# Project Build and Run Guide

## Project Summary
This is a **Full-Stack Project Management System** with:
- **Backend**: Spring Boot 3.3.2 (Java 21) REST API
- **Frontend**: React 19 with Vite 8.0.10

## Build Status ✅
- ✅ Backend: Successfully compiled and packaged as JAR
- ✅ Frontend: Successfully built for production

## Artifacts Generated
- **Backend JAR**: `backend/target/project-manager-backend-1.0.0.jar`
- **Frontend Build**: `frontend/dist/` (Ready for deployment)

## Prerequisites
Before running the project, ensure you have:

1. **MySQL Server** installed and running
   - Create a database: `CREATE DATABASE taskmanagerr;`
   - Default credentials (configurable in application.properties):
     - Username: `root`
     - Password: `Pass@123`

2. **Java 21** (or higher)
   - Current system: OpenJDK 25.0.2 ✅

3. **Node.js 18+** (for frontend development)
   - Already installed ✅

## How to Run

### Backend (REST API Server)

#### Option 1: Run the Built JAR
```bash
cd backend
java -jar target/project-manager-backend-1.0.0.jar
```

#### Option 2: Run with Maven
```bash
cd backend
set MAVEN_OPTS=-XX:+IgnoreUnrecognizedVMOptions --add-opens=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED
mvn spring-boot:run
```

**Server will start on**: http://localhost:8080

### Frontend (React Development Server)

#### Development Mode
```bash
cd frontend
npm run dev
```
**Access on**: http://localhost:5173

#### Production Build (Already Generated)
```bash
cd frontend
npm run preview
```

## Configuration Details

### Backend (application.properties)
- **Port**: 8080
- **Database**: taskmanagerr
- **Database URL**: jdbc:mysql://localhost:3306/taskmanagerr
- **Database User**: root
- **Database Password**: Pass@123
- **JWT Secret**: Configured (see application.properties)
- **JWT Expiration**: 24 hours (86400000 ms)
- **CORS**: Allows http://localhost:5173 (Frontend)
- **Hibernate DDL**: auto (automatically creates/updates tables)

### Frontend
- **API Base URL**: http://localhost:8080
- **Development Port**: 5173
- **Build Tool**: Vite
- **Framework**: React 19

## Project Features
Based on the structure, this project includes:

### Backend Features
- User Authentication & Authorization (JWT)
- Role-based Access Control (Admin, User, etc.)
- Project Management
- Task Management
- Team Management
- Comment System
- Dashboard/Analytics
- REST API endpoints for all operations

### Frontend Features
- Login/Registration
- Dashboard
- Projects Management
- Tasks Management
- Teams Management
- User Profiles
- Admin Dashboard (for user management)
- Protected Routes based on roles

## Database Schema
The application uses Hibernate ORM with auto-update DDL mode. On first run:
- Entities will be automatically created in the database
- Sample data will be seeded via DataSeeder.java

## Troubleshooting

### Backend Compilation Issues
If you encounter Lombok-related compilation errors:
```bash
cd backend
set MAVEN_OPTS=-XX:+IgnoreUnrecognizedVMOptions --add-opens=jdk.compiler/com.sun.tools.javac.code=ALL-UNNAMED
mvn clean package -DskipTests
```

### Database Connection Issues
1. Verify MySQL is running
2. Check database name: `taskmanagerr`
3. Verify credentials in `backend/src/main/resources/application.properties`
4. Ensure port 3306 is accessible

### Frontend Build Issues
```bash
cd frontend
npm install  # Reinstall dependencies if needed
npm run build
```

## Default Credentials (After First Run)
Check the DataSeeder.java class for default test users created on startup.

## API Documentation
Once the backend is running, you can access:
- **Swagger UI** (if Spring Fox is added): http://localhost:8080/swagger-ui.html
- **REST endpoints**: http://localhost:8080/api/*

## Next Steps
1. Start MySQL server
2. Run the backend server (JAR or Maven)
3. Run the frontend development server or preview build
4. Access the application at http://localhost:5173

---
**Build Date**: May 2, 2026  
**System**: Windows with OpenJDK 25.0.2
