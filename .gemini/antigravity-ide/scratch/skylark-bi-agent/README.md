# SKYLARK // EXECUTIVE INTELLIGENCE
**Business Intelligence Command Center**

A production-quality, visually impressive Business Intelligence Agent for Skylark Drones. It connects dynamically to Monday.com and answers founder-level business questions using Deals and Work Orders boards.

## Features
- **Live Monday.com Integration:** Dynamically fetches deals and work orders data.
- **Agentic Query Planning:** Uses LLM for natural language understanding and function calling.
- **Deterministic Analytics:** Core BI calculations (e.g. pipeline value) are done deterministically for accuracy.
- **Data Resilience & Auditing:** Handles messy data, normalizes formats, and presents a Data Health score.
- **Cross-Board Intelligence:** Analyzes both Deals and Operations together.
- **Executive Leadership Briefing:** Generates automated leadership updates.
- **Evidence-Backed Insights:** Provides traceability for every data point shown.

## Tech Stack
- **Frontend:** Next.js (React), Tailwind CSS, Recharts
- **Backend:** Next.js API Routes (Node.js/TypeScript)
- **AI Agent:** LLM integration via API
- **Data Source:** Monday.com GraphQL API

## Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env.local` and configure it:
   ```env
   # Set to 'false' to use live Monday.com API. Set to 'true' to use the local Mock Excel data.
   USE_MOCK_DATA=true

   # Monday.com API Configuration
   MONDAY_API_TOKEN=your_monday_api_token
   DEALS_BOARD_ID=your_deals_board_id
   WORK_ORDERS_BOARD_ID=your_work_orders_board_id

   # AI SDK Configuration
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Architecture Overview
The application follows a structured agent architecture:
1. **User Query** is received via the chat interface.
2. **Intent Detection & Query Planning:** The LLM parses the query and decides which analytics functions to call.
3. **Data Retrieval & Normalization:** The Next.js API securely fetches data from Monday.com and normalizes messy fields (dates, categories).
4. **Deterministic BI Engine:** Executes the requested analysis programmatically.
5. **LLM Synthesis:** The LLM summarizes the deterministic results into an executive-level answer.

## Example Questions
- "How is our pipeline looking this quarter?"
- "Which sector has the strongest pipeline?"
- "What are our biggest opportunities?"
- "Which deals need attention?"
- "Compare Energy sales with Energy operations."
- "Give me an executive update."
