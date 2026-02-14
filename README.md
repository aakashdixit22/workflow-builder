# Workflow Builder

basically a tool to chain together text processing steps using AI. where we can create workflows with 2-4 steps and run them on any text.

## How to Run

you need both the frontend and backend running

### Backend (Flask API)

```bash
cd flask-api
pip install -r requirements.txt
```

create a `.env` file in the flask-api folder:
```
GEMINI_API_KEY=your_api_key_here
```

then run:
```bash
python app.py
```

it'll run on http://localhost:5001

### Frontend (Next.js)

```bash
cd work-flow-builder
npm install
```

create a `.env.local` file:
```
MONGODB_URI=your_mongodb_connection_string
```

run it:
```bash
npm run dev
```

opens on http://localhost:3000

## What's Done

- ✅ Create workflows with 2-4 steps
- ✅ Four step types: clean text, summarize, extract key points, tag/categorize
- ✅ Run workflows on input text
- ✅ See results step by step
- ✅ Save workflows to MongoDB
- ✅ Load and reuse saved workflows
- ✅ Run history tracking (last 10 runs)
- ✅ Status page showing recent activity
- ✅ Basic error handling

## What's Not Done / Could Be Better

- ❌ Can't edit existing workflows (have to create new ones)
- ❌ Can't delete workflows
- ❌ No authentication (anyone can access everything)
- ❌ History is limited to last 10, can't search or filter
- ❌ No way to export results
- ❌ UI could be way better looking
- ❌ No tests
- ❌ Error messages are pretty basic
- ❌ Can't reorder steps in a workflow
- ❌ No loading states in some places

## Stack

- Next.js 14
- Flask for the API
- MongoDB for storage
- Google Gemini for the LLM stuff
- Tailwind for styling
