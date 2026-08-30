# Decision Log

## Key assumptions
- The user is deploying this as an internal tool, so it runs locally or on a private server.
- The UI should have a premium "dark mode" aesthetic suitable for executives.
- LLM is used primarily for query intent parsing, entity extraction, and final insight synthesis, NOT for direct quantitative calculations.

## Data interpretation
- (Pending) Awaiting actual Excel files to determine field mappings and data structures.
- It is assumed that we will encounter missing dates, inconsistent naming (e.g. sectors like 'Energy' vs 'energy sector'), and null values, which must be handled cleanly.

## Architecture decisions
- **Framework:** Next.js (App Router) for both the frontend dashboard and the backend API routes. This simplifies deployment and keeps the monolithic codebase easy to maintain.
- **Styling:** Tailwind CSS for rapid styling, focusing on dark, sophisticated enterprise aesthetics (restrained gradients, subtle glows).
- **Data Fetching:** Server-side fetching to the Monday.com API to hide the API token from the client.

## Tech-stack decisions
- **Frontend:** React, Next.js, Tailwind CSS, Recharts.
- **Backend:** Next.js API Routes (Node.js).
- **AI Integration:** Google Gemini via `@google/genai` or similar official SDK (can be swapped via provider abstraction).
- **Icons:** `lucide-react` for clean, modern iconography.

## Trade-offs
- **Monolithic vs Microservices:** Chose a monolithic Next.js app to speed up development and simplify deployment, trading off the ability to easily scale the analytics engine separately in Python.
- **Client-Side vs Server-Side Analytics:** Opted for Server-Side analytics (in API routes) to avoid sending large raw Monday.com datasets to the browser, improving performance and security.

## Data resilience strategy
- Any metric calculation (e.g., pipeline value) will programmatically exclude or separately flag records with missing data (e.g. missing close dates).
- The Data Quality Engine will run an audit pass on fetched records and attach a `health_score` and an array of `warnings` which the UI can surface.

## Query interpretation strategy
- The LLM will be given a specific set of typed "tools" (function calling) such as `get_deals(sector, timeframe)`.
- Ambiguity will be handled by the LLM deciding to request clarification rather than executing a tool if required parameters are missing.

## Leadership update interpretation
- "Leadership Update" is interpreted as a generated markdown or HTML brief that summarizes the top 3 metrics from Deals, top 3 from Operations, and surfaces any identified risks (e.g., stalled deals).

## What would be improved with more time
- Caching layer (e.g. Redis) to avoid hitting Monday.com API limits for frequent dashboard reloads.
- Historical trend analysis by persisting daily snapshots of the Monday.com boards to a database (since Monday API primarily gives current state).
- Role-based permissions to restrict certain financial data.
- MCP support to allow other internal agents to query this BI agent.
