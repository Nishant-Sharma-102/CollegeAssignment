Railway deployment guide

This repository contains a Spring Boot backend (`/backend`) and a Vite React frontend (`/frontend`). Below are steps to deploy both services on Railway using Dockerfile-based services.

1) Create a new project on Railway and connect your GitHub repository (or push this repo to Railway via CLI).

2) Add a MySQL plugin (if you want a managed DB) or use Railway's Postgres/MySQL add-on. Note connection details.

3) Create two services in Railway:
   - Backend service: Use Dockerfile in `/backend`.
     - Build command: Railway will build using the Dockerfile.
     - In Railway environment variables, set:
       - `SPRING_DATASOURCE_URL` — e.g. `jdbc:mysql://<HOST>:<PORT>/<DBNAME>?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
       - `SPRING_DATASOURCE_USERNAME` — DB username
       - `SPRING_DATASOURCE_PASSWORD` — DB password
       - `SERVER_PORT` — `8080` (optional)
       - Any other `jwt.secret` or application-specific env vars (e.g., `JWT_SECRET` mapped to `jwt.secret`).
   - Frontend service: Use Dockerfile in `/frontend`.
     - Railway will build the static site and serve it with nginx on port 80. Optionally, configure a custom domain.

4) Local testing with Docker (optional)

Backend:
```bash
# from repo root
cd backend
docker build -t pm-backend:dev .
docker run -e SPRING_DATASOURCE_URL="jdbc:h2:mem:testdb" -p 8080:8080 pm-backend:dev
```

Frontend:
```bash
cd frontend
docker build -t pm-frontend:dev .
docker run -p 8080:80 pm-frontend:dev
# then open http://localhost:8080
```

5) Notes
- The application `application.properties` uses H2 by default for development. In production (Railway), provide the DB connection via `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` environment variables.
- Consider adding a Maven wrapper (`mvnw`) if you want consistent Maven versions in CI/environments.
- To serve frontend from the backend (single service), you can build the frontend and copy `dist` into the backend resources and serve static files via Spring Boot; that requires changes to the build process.

If you want, I can:
- Add a Maven wrapper to the repo.
- Create Railway-specific `railway.json` or CI workflows for automatic deploys.
- Configure backend to read `JWT_SECRET` and other env vars in a 12-factor style.
 
GitHub Action (automatic deploy)

This repository includes a sample GitHub Actions workflow at `.github/workflows/deploy_to_railway.yml` that uses the Railway CLI to deploy both services on pushes to `main`.

Prerequisites for the workflow:
- Add a repository secret named `RAILWAY_TOKEN` containing a Railway API token (create one in your Railway account settings).
- Ensure the GitHub repository is connected to Railway (optional) or the Railway token has permissions to create/update projects.

How it works:
- On push to `main`, the workflow installs the Railway CLI and runs `railway up --detach` for the `backend` and `frontend` folders. The CLI will use the provided token to create or update services.

If you'd like, I can:
- Add a safer workflow that builds Docker images and pushes them to a container registry instead (Docker Hub / GitHub Packages), then deploy via Railway's registry integration.
- Generate a `mvnw` Maven wrapper and commit it so CI uses a consistent Maven version.
