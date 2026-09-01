# AffiliateTresur — Agent-Native Deal & Product Discovery

> A dual-interface web application built for the **WebMCP Challenge**, bridging human browsing with browser-native AI agent interoperability via the Web Model Context Protocol (WebMCP).

 **Live Demo:** [affiliatetresur.com](https://affiliatetresur.com)  
 **Deployment:** Cloudflare Pages (Edge Hosted)

---

##  Overview

**AffiliateTresur** reimagines e-commerce affiliate platforms by exposing its product catalog, filtering system, and discount engine directly to browser-based AI agents. 

Rather than relying on brittle DOM scraping or computer vision to navigate the web, AffiliateTresur uses **Declarative WebMCP** and **Programmatic Tool Registration**. Human visitors enjoy a responsive, fast user interface, while autonomous AI agents (such as ChatGPT browser agent or Chrome Agentic workflows) receive structured JSON schemas and execute client-side tools with direct JSON feedback loops.

---

##  Architecture & Single Source of Truth

AffiliateTresur is built around the **"One Product Action, Two Interfaces"** principle:


┌───────────────────────────────┐ │ affiliatetresur.com │ │ (Cloudflare Pages Edge) │ └───────────────┬───────────────┘ │ ┌────────────────────────┴────────────────────────┐ ▼ ▼ ┌──────────────────┐ ┌──────────────────┐ │ Human Interface │ │ Agent Interface │ ├──────────────────┤ ├──────────────────┤ │ • Responsive CSS │ │ • WebMCP Engine │ │ • DOM Renderers │ │ • Form Schema │ │ • Live Tool Cues │ │ • e.respondWith()│ └────────┬─────────┘ └────────┬─────────┘ │ │ └────────────────────────┬────────────────────────┘ ▼ ┌───────────────────────────────┐ │ Core Query & Store Logic │ │ (Single Source of Validation) │ └───────────────────────────────┘

* **No Ghost State:** AI agents and human users interact with the exact same underlying validation and catalog query pipelines.
* **Shared UI Feedback:** When an agent inspects or fills the search tool, real-time CSS pseudo-classes (`form:tool-form-active`, `button:tool-submit-active`) provide visual cues to the human user.
* **Edge-Optimized:** Hosted on Cloudflare Pages over HTTPS to comply with browser secure-context requirements for WebMCP APIs.

---

##  Registered WebMCP Tools

### 1. `search_affiliate_deals` (Declarative Form Tool)
Exposed directly through HTML5 attributes on `<form>` and input elements using declarative WebMCP.

* **Tool Name:** `search_affiliate_deals`
* **Description:** Search affiliate offers, discounted tech, hardware, and accessories by keyword and optional budget limit.
* **Mode:** Declarative (`toolautosubmit` enabled).
* **Input Schema:**
  ```json
  {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search keyword or product name (e.g. 'Raspberry Pi', 'desk')"
      },
      "maxPrice": {
        "type": "number",
        "description": "Optional maximum budget threshold in USD"
      }
    },
    "required": ["query"]
  }

Output: Returns a structured list of product objects including title, price, discount percentage, summary, and affiliate referral link.
2. get_trending_deals (Programmatic Tool)
Registered via navigator.modelContext.registerTool to let agents pull curated, top-discounted products without form manipulation.
Tool Name: get_trending_deals
Input Schema:
{
  "type": "object",
  "properties": {
    "limit": {
      "type": "number",
      "description": "Maximum number of items to return (default 5)"
    }
  }
}


 Testing & Verification Guide (for Judges)
Prerequisites
Open Google Chrome (v146+ or Canary).
Navigate to chrome://flags/#enable-webmcp-testing.
Set WebMCP for testing to Enabled and click Relaunch.
Step-by-Step Verification
Option A: DevTools Console
Visit affiliatetresur.com.
Open DevTools (F12 or Cmd+Option+I) > Console.
Verify tool discovery:
const tools = await navigator.modelContextTesting.listTools();
console.log("Discovered WebMCP Tools:", tools);


Execute an agent-invoked search tool call:
const res = await navigator.modelContextTesting.executeTool(
  "search_affiliate_deals",
  JSON.stringify({ query: "Raspberry", maxPrice: 75 })
);
console.log("Agent Response:", res);


Option B: WebMCP DevTools Extension
Install the Model Context Tool Inspector or WebMCP DevTools Chrome extension.
Open the extension side panel while on the site to inspect the auto-generated JSON schemas, validate inputs, or simulate multi-step tool calls.
📁 Repository Structure
├── index.html        # Main landing page with declarative WebMCP forms & UI styling
├── app.js            # Catalog engine, submit listener with e.respondWith(), and programmatic tools
├── package.json      # Scripts and development dependencies
└── README.md         # Challenge documentation and architecture overview

 Local Development
# Clone the repository
git clone [https://github.com/](https://github.com/)<your-username>/affiliatetresur-webmcp.git
cd affiliatetresur-webmcp

# Start local server
npm start
# (Runs on http://localhost:3000)


---

**How to save it to your project:**
1. Create a file named **`README.md`** in your project root.
2. Paste the snippet above.
3. Commit and push:
   ```bash
   git add README.md
   git commit -m "Add WebMCP challenge README for judges"
   git push origin main
