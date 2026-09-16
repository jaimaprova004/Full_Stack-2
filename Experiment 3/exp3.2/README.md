RBAC Demo

A tiny Express app demonstrating role-based access control with a cute vibrant frontend.

Quick start:

```bash
cd "post manager/rbac-demo"
npm install
npm run dev
# open http://localhost:3000
```

Users:
- alice / password — admin
- bob / password — editor
- carol / password — viewer

Endpoints:
- POST /api/login { username, password } => { token }
- GET /api/posts (requires read:posts)
- POST /api/posts (requires write:posts)
- GET /api/admin (requires admin:access)

Notes: This is a demo. Do not use the secret or in-memory store in production.
