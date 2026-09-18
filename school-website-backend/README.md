# Admission Pitara — Backend Architecture Notice

## Authoritative API Layer
Admission Pitara's production API layer is natively integrated within the Next.js App Router (`/src/app/api/...`). All production client requests, authentication, data queries, and mutations execute directly through these Next.js API routes.

## Express Prototype Server (`/school-website-backend`)
The contents of this folder (`school-website-backend/server.js`) represent an early standalone Express prototype created during initial development. It is preserved solely for legacy reference and compatibility testing.

Do not route production traffic to this standalone Express server. Production endpoints reside under `/src/app/api/...`.
