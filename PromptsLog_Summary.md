# Prompt Log — Major Examples & Reflections


## Ask Mode (high-level questions / requests)

#### Example 1 — PRD / project brief (this started everything):

```
I need a fully fleshed out Project Requirements Document (PRD) which clearly defines API endpoints, data models, and expected behaviors.. based on the criteria \"Build a backend-only REST API for a web application of your choice. The API must support full CRUD operations and be structured for future frontend integration.\"... I have decided my webapp will be a subscription service tracker, which will allow you to track which services (ex. Netflix, gpt plus, adobe creative cloud) you subscribe to. I'd like to be able to list the price of each service, how often (weekly, monthly, yearly, etc) and on which day their payment is processed, and be able to choose custom 'accounts' such as paypal or my visa so I know where they are being billed. Based on those dates it would be nice to be able to see my daily, weekly, monthly, yearly, so on cost of all subscriptions. Also categories to sort the items into such as entertainment, utility, work, perhaps 'add custom category' as well. I'd like you to create the PRD for me, if you have any questions or want further context while writing feel free to ask. If there are any features you think would be a good fit, lets hear them as well before completing the document.
```

Thoughts: This worked extremely well — a long, clear single prompt gave the assistant everything it needed to produce a thorough PRD and ask targeted clarifying questions. Big-picture prompts are high leverage.

#### Example 2 — Deployment question:

```
I asked you when we started to make it work with Render, didn't I? Would this be solved if I used Vercel instead? If not, please make any changes needed so I can deploy asap
```

Thoughts: Short and direct; it forced the assistant to consider platform constraints and recommend concrete changes (database dialect, dependencies). Good for platform-level decisions.

#### Example 3 — Functional test question (how to add data):

```
Ok it worked and I can hit it with \"https://subtrackerapi.onrender.com/api/subscriptions\" how do I actually add something to see if it works ? can I do that via the url or no ?
```

Thoughts: Practical, immediate, and got me a cURL/Postman example which was exactly what I needed to test the API.

---

## Edit Mode (requests to modify or improve code/UI)

#### Example 1 — Frontend scaffolding & style expectations:

```
So I need you to create a new folder in C:\\Users\\finch\\Documents\\SpecialTopics that will serve as the root for the front end. In there I'll need a markdown file similar to the one we have for the backend listing the Project requirements, as well as the frontend code and readme to acompany it. For style I'd like to find a balance between Glassmorphism & Flat Design, with good usage of Asymmetrical Elements.
```

Thoughts: Clear requirements and a design direction. Asking for a concrete folder and files made the assistant produce a usable frontend scaffold quickly.

#### Example 2 — Specific UI fixes (dropdowns, icons, modal scrolling):

```
Remove the \"start\" info from front end
- We had talked about being able to give services icons, can that still be done? maybe through Font Awesome?
- The design is ok, but a bit boring. Keep that in mind when adding the rest of these changes
- What is analytics actually showing? Does it have various modes?
- Still need to be able to add payments and service categories as well
- When adding a subscription I don't want to have to type category id, same with payment... I want a dropdown of available ones we have already added
```

Thoughts: This Edit-style prompt was effective because it listed specific UI and UX items. It resulted in concrete code edits (index.html/main.js/style.css). When I combine multiple related UI requests in one prompt it saves rounds.

Note: Some edits (Swagger integration, Chart.js wiring, Postgres switch) required many follow-ups and debugging—I intentionally didn't include every tiny "ok" or "fixed" message here.

---

## Agent Mode (ask the assistant to perform multi-step changes / deployments)

#### Example 1 — Make the backend deployable to Render (database fix):

```
Would this be solved if I used Vercel instead? If not, please make any changes needed so I can deploy asap
```

Resulting action: Assistant recommended switching from SQLite (sqlite3) to PostgreSQL, updated project dependencies (removed sqlite3, installed `pg`), and gave steps for creating a Postgres DB and setting `DATABASE_URL`.

Thoughts: This prompt moved the assistant from advisor to active agent — it performed package edits, ran install commands, and helped push fixes. Agent-mode prompts are great when you want the assistant to execute changes, but I still reviewed edits before accepting.

#### Example 2 — Add Swagger docs and make /api-docs available:

```
My requirements also state that I need 'API Documentation with Swagger'... I'm not 100% sure what that means but could you generate that as well ?
```

Resulting action: Assistant created a swagger.json, installed swagger-ui-express, and modified server startup to serve docs at `/api-docs`. This part required extra follow-ups because the local DB connection and path issues initially blocked the docs — so while the assistant implemented the feature, multiple cycles were needed.

Thoughts: Agent mode is powerful for scaffolding and infra changes. For complex infra features (docs + deployment), expect multiple back-and-forths and to validate the changes yourself.

---

## What worked best

- Large, descriptive Ask prompts that include the domain, goals, and constraints produced the best results (PRD, initial scaffolding).
- Edit prompts that grouped related UI/UX changes into one message (dropdowns + icons + modal fixes) saved many small cycles.
- Agent-mode requests to make the repo deployable were effective, but required careful review. The assistant can execute commands and change files, but I still checked builds and logs.
- Including logs and exact error messages (Render build logs, HTTP 422 responses) dramatically improved troubleshooting speed and accuracy.

What caused extra work:
- Native modules / platform mismatch (sqlite3 built on Windows) was an avoidable friction point. If I'd chosen Postgres earlier, we would've saved time.
- Swagger docs and the local DB connection issue needed many edit/agent cycles; for complex infra changes I should expect iterative debugging.

---

## Quick recommendations for future prompts

- Start with a full, focused Ask for the feature/PRD.
- Use Edit mode with grouped UI changes rather than one tiny tweak at a time.
- Use Agent mode for multi-file/infrastructure edits but verify builds/logs yourself.
- Always paste error logs when asking for deployment or runtime help.

---
