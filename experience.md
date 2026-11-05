# Professional Experience & Technical Architecture: EasyInsights

## 1. Company Overview
- **Company:** EasyInsights Pvt. Ltd. (New Delhi, India)
- **Internship Duration:** 10 August 2026 – November 2026 (Paid Internship)
- **Role:** Full Stack Developer Intern
- **Domain:** Marketing Analytics, Multi-touch Attribution, Lead Tracking, and Distributed Event Processing.


## 2. Platform Architecture & Data Pipeline

```
[ Data Ingestion Sources ]
  (Pixels, CRMs, SDKs, CSV Chunks, Google Sheets, Ad Webhooks)
               │
               ▼
       [ NGINX Endpoint ]
               │
       [ DigitalOcean Spaces ] (Raw Event Storage)
               │
       [ RabbitMQ Message Queues ]
               │
     [ 14 Distributed Workers ]
   (Batch download, normalize & validate)
               │
               ▼
          [ Databases ]
     ├── eventdb: Processed client events, leads, funnels
     ├── ei-signals DB: Workspace configs, attribution rules
     └── managedb: User auth, permissions, ad credentials
               │
        [ Django Backend (ei-signals-package) ]
               │
        [ Next.js Frontend (ei-cloud-antd-v2) ]
```


## 3. Key Projects & Responsibilities

### A. Python Automation & Infrastructure Monitoring
#### 1. RabbitMQ Queue Monitoring & Telegram Alert Bot (In-Depth Technical Specification)
- **Official Project Title:** RabbitMQ Queue Monitoring Automation Using Telegram Bot
- **Core Technology Stack:** Python, RabbitMQ Management API, `python-telegram-bot` (JobQueue extension), `requests`, PostgreSQL.
- **Key Scripts & Modules:** `bot.py`, `worker.py`, `producer.py`, `main_test.py`, `error_test.py`, `test_queues.py`.

##### Architecture & Execution Workflow:
```
[ Telegram Bot (bot.py) Starts ]
               │
   [ JobQueue Scheduler ] (app.job_queue.run_repeating)
               │ (Triggers every 60s, first run at 10s)
               ▼
     [ monitor_queues() ]
               │
      [ get_data() ] ──HTTP GET with Auth──▶ [ RabbitMQ Management API ]
                                             (http://<host>:15672/api/queues)
               │
    [ Parse JSON Queues ]
               │
    [ For each Queue: check messages > MAX_TASKS (20) ]
        ├── Yes ──▶ [ Print Console Alert ] ──▶ [ context.bot.send_message(CHAT_ID) ]
        └── No  ──▶ [ Continue / Sleep 60s ]
```

##### Exact Code Implementation:
1. **API Data Fetcher (`get_data`):**
   ```python
   def get_data(url):
       response = requests.get(
           url,
           auth=Auth,  # e.g., ("guest", "guest") or production user
           timeout=5
       )
       response.raise_for_status()
       return response.json()
   ```
2. **Periodic Queue Monitor Function (`monitor_queues`):**
   ```python
   MAX_TASKS = 20

   async def monitor_queues(context: ContextTypes.DEFAULT_TYPE):
       try:
           queues = get_data(Queues_url + "api/queues")
           for queue in queues:
               name = queue.get("name")
               tasks = queue.get("messages", 0)

               if tasks > MAX_TASKS:
                   message = (
                       f"Queue {name} has exceeded "
                       f"the maximum task limit: {tasks}"
                   )
                   print(message)
                   await context.bot.send_message(
                       chat_id=CHAT_ID,
                       text=message,
                       disable_notification=False
                   )
       except requests.RequestException as error:
           print(f"RabbitMQ monitoring error: {error}")
       except Exception as error:
           print(f"Monitoring error: {error}")
   ```
3. **Scheduler Registration (`JobQueue` in `main()`):**
   ```python
   # Inside main(), before app.run_polling()
   app.job_queue.run_repeating(
       monitor_queues,
       interval=60,
       first=10
   )
   ```

##### Multi-Angle Project Summaries (For Resumes, Interviews & Docs):

###### 1. Executive Summary (High-Level Overview):
> "Automated distributed task queue monitoring for EasyInsights' high-throughput event pipeline by embedding a periodic health check engine inside the company's existing Python Telegram bot. Replaced manual dashboard checking with real-time, threshold-based alerts whenever worker capacity or task depth exceeded safe limits."

###### 2. Deep Technical Summary (Architecture & Flow):
> "Engineered an asynchronous monitoring daemon using Python, `python-telegram-bot[job-queue]`, and the RabbitMQ Management API. The scheduler triggers `monitor_queues()` every 60 seconds (with a 10s initial delay), pulling queue statistics via an authenticated HTTP GET request with a 5-second timeout. It evaluates queue depth against `MAX_TASKS = 20` using strict greater-than logic (`tasks > 20`), dispatches real-time Telegram alerts to `CHAT_ID`, and integrates PostgreSQL error telemetry. Network errors (`requests.RequestException`) and runtime exceptions are isolated to guarantee 100% bot event-loop uptime."

###### 3. Operational Specs Summary (The Metrics):
- **Polling Interval:** 60 seconds (`interval=60`, initial run `first=10`).
- **Threshold Limit:** `MAX_TASKS = 20` (Triggers on 21+ messages; clean at 20).
- **HTTP Timeout:** 5 seconds (Guards against connection deadlocks).
- **Worker Scale:** Monitored ~14 distributed event-processing workers.
- **Process Supervisor:** `systemd` / Supervisor for automatic daemon recovery.

###### 4. STAR Method Summary (Interview Ready):
- **Situation:** EasyInsights' distributed workers process millions of marketing events from DigitalOcean Spaces into PostgreSQL; worker stalls created silent RabbitMQ backlogs that went undetected without manual checks.
- **Task:** Build an autonomous, zero-overhead monitoring feature integrated into the existing internal Telegram bot to track queue health and worker capacity.
- **Action:** Implemented periodic queue polling using `python-telegram-bot` JobQueue and RabbitMQ REST endpoints, configured threshold alert triggers, and added PostgreSQL error telemetry.
- **Result:** Completely eliminated manual queue checks, provided instant mobile alerts when queues backed up, and enabled immediate debugging through bot commands.

#### 2. DigitalOcean Live Server Detection Script
- Automated script to detect the active production server instance among available droplets.


### B. Third-Party API Integrations
#### 3. Meta Graph API (v23 & v24) Landing Page Extractor
- Extracted destination landing pages from ad campaigns, handling redirects and Facebook short links (`fb.me`).
#### 4. Google Ads API (v24) Landing Page Extractor
- Integrated Google Ads API endpoints, handling authentication scopes and access tokens.
#### 5. Zoho CRM External API Integration
- Exchanged lead and pipeline data through `ei_external_api` with Zoho CRM authentication.
#### 6. Meritto (NoPaperForms) Metadata & Onboarding Workflow
- Scripted metadata extraction with automated pagination handling and client onboarding workflows.


### C. Frontend Development (React.js, Next.js, Ant Design, Redux)
#### 7. Chunk-Based CSV Upload & Import History System
- Developed 20MB chunked file uploader to safely ingest large CSV datasets without request timeouts.
- Built import history dashboard displaying status, total rows, accepted/rejected counts, and timestamps.
#### 8. Full Funnel Overview Analytics Dashboard
- Implemented dynamic table column generation based on backend analytics schemas.
- Integrated campaign search, multi-level platform filters, sorting, pagination, and Redux state.
- Successfully merged PR into main codebase after senior developer code review.
#### 9. Lead Attributes Explorer
- Managed custom attributes (`__attribute01__` through `__attribute05__`) with dynamic update APIs.
#### 10. Reusable `EITable.js` Enhancements
- Refactored reusable table component across `AudiencesPanel`, `LeadExplorer`, `OrdersExplorerTab`, etc.


### D. PostgreSQL & Data Operations
- Large dataset imports: `tasks.csv`, `task_activity.csv`.
- Database environments handled: `eventdb_temp`, `local_eventdb`, `local_managedb`.
- Complex SQL queries on `funnel_analytics`, `funnel_step_link`, `channelevent`.
