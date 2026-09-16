# Post Manager (Spring Boot + Simple Frontend)

This project is a minimal, scalable starting point:
- Spring Boot backend (RESTful CRUD for `Post`) with validation, standardized `ApiResponse`, global error handling, H2 in-memory DB and CORS enabled.
- Single-page frontend (`frontend/index.html`) using Bootstrap and plain JS for a polished, fast UI.

Prerequisites
- Java 17+
- Maven

Run backend
```bash
mvn -f "c:/Users/Jerin Provaaaaaa/OneDrive/Desktop/post manager/exp 5/pom.xml" spring-boot:run
```
The API will be available at `http://localhost:8080/api/posts` and H2 console at `http://localhost:8080/h2-console`.

Run frontend
- Option A (quick): Open `frontend/index.html` in your browser. CORS is enabled on the backend, so direct file open works.
- Option B (serve): from the project root run `python -m http.server 3000 --directory frontend` and open `http://localhost:3000`.

What's included
- Backend: `src/main/java/com/example/postmanager/*`
- Frontend: `frontend/index.html`, `frontend/app.js`, `frontend/styles.css`

Next steps / improvements
- Add authentication, pagination, search, file attachments
- Replace in-memory DB with Postgres and add Flyway/Liquibase migrations
- Build a React/TypeScript frontend with Material UI for advanced UX

If you want, I can now run the app (if you allow), or commit these files to git next.