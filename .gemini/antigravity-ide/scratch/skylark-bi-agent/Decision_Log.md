# Decision Log

## Architecture & Tech Stack
**Stack Chosen:** Next.js (React), Tailwind CSS v4, Vercel AI SDK, Google Gemini 1.5 Pro.
**Why:**
- **Next.js & Serverless:** Given the 6-hour timeline, a unified framework for both the frontend and backend API (for AI streaming) is the most efficient choice. 
- **Vercel AI SDK + Gemini:** Instead of manually building LLM reasoning loops, the Vercel AI SDK provides seamless tool/function calling and UI streaming. Gemini 1.5 Pro is highly capable of understanding intent and correctly mapping parameters to the BI functions.
- **Tailwind v4:** Allows for ultra-fast, premium styling (dark mode, glassmorphism) without overhead.

## Data Resilience & Assumptions
**Assumption:** The Monday.com data will be as messy as the uploaded Excel files (nulls, string-based dates, inconsistent spelling).
**Trade-offs:** 
- Instead of using the LLM to parse and clean raw data dynamically (which is token-heavy, slow, and prone to hallucination), I built a **Deterministic BI Engine**. 
- The data layer standardizes missing values (e.g., empty `Close Date`, null `Masked Deal value`) into typed nulls, and standardizes dates to ISO strings before calculations.
- The LLM only receives aggregated, clean JSON responses from the BI Engine tools (like `getTotalPipelineValue`). This ensures calculations are mathematically 100% accurate, leaving the LLM to do what it does best: synthesizing and presenting insights.

## "Leadership Updates" Interpretation
I interpreted "The agent should help prepare data for leadership updates" as the need for a one-click executive briefing. 
- **Implementation:** I added a specific LLM tool (`generateLeadershipBriefing`) that aggregates pipeline value, top 3 deals, total billed value, and critical risks (projects with pending billing) into one payload. 
- **UX:** A "Prepare Leadership Update" button was added to the UI, allowing founders to instantly trigger a formatted, markdown-ready executive summary without typing a prompt.

## What I'd Do Differently With More Time
1. **Dynamic Board Discovery:** Currently, the Monday.com column names are hardcoded mappings based on the provided sample data. I would add a configuration UI to map Monday.com columns dynamically, in case the board structure changes.
2. **Caching:** The Monday.com API or Mock provider currently fetches all items per query. I would implement Redis or Next.js cache revalidation to store the board state and only invalidate on a webhook trigger from Monday.com to improve response times.
3. **Conversational Memory:** Add a persistent database (like PostgreSQL + Drizzle) to store chat history, allowing founders to resume previous analysis sessions.
