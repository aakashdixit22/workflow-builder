# AI Usage Notes

## What I Used AI For

honestly i used AI (copilot/chatgpt) for quite a bit of this:


- **MongoDB models and schemas** - got help with mongoose schema definitions
- **Flask routes boilerplate** - the basic structure of the API endpoints
- **Tailwind styling** - i'used AI to help with the layout and making it look somewhat decent
- **Error handling patterns** - used AI to add try-catch blocks and proper error responses
- **The workflow execution logic** - particularly the part that chains steps together sequentially
- **Some React hooks logic** - useEffect dependencies and state management stuff


## What I Checked/Wrote Myself
- **Initial project structure** - setup the nextjs project

- **API integration between frontend/backend** - tested all endpoints manually in browser and postman
- **The actual LLM prompts** - tweaked these myself to get better responses, AI's initial prompts were too verbose
- **Database connection** - verified MongoDB connections and queries work properly
- **Step types and their implementations** - tested each step type (clean, summarize, etc) with different inputs
- **Navigation and routing** - made sure all pages load correctly
- **Environment variable setup** - configured .env files myself
- **The overall UX flow** - decided what pages to have and how they connect
- **Some React hooks logic** - useEffect dependencies and state management stuff

## LLM Provider: Google Gemini 2.5 Flash

**Model:** `gemini-2.5-flash`

### Why Gemini?

1. **Free tier is generous** - 15 requests/minute on free tier is enough for this demo
2. **Fast responses** - flash model is quick, don't want users waiting forever
3. **Good enough for text processing** - for basic stuff like cleaning text and summarizing it works well
4. **Easy API** - google-generativeai python package is simple to use
5. **No credit card required** - can just grab an API key and start using it

considered OpenAI but honestly didn't want to add payment info for a demo project. Claude would've been good too but same issue. Gemini flash is perfect for this - it's fast, free, and does the job.
