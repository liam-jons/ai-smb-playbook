# Repeatable Workflow: Post-Training Follow-Up Deliverables

> A practical process guide for producing structured follow-up materials after AI training sessions. Written for consultants delivering AI upskilling to UK SMBs. The Phew Design Limited engagement (February 2026) serves as the worked example throughout — and this document was itself produced by the process it describes.

## Overview

This workflow turns a training session into a polished, interactive deliverable in seven steps: record, summarise, plan, spec, build, deploy, deliver. Each step uses AI tooling (primarily Claude and Claude Code) to reduce manual effort without sacrificing quality. The Phew! project — two training sessions delivered on 11 February 2026, resulting in an interactive playbook, starter kit, and this process document — demonstrates the full pipeline. A single consultant completed the end-to-end process in approximately five working days.

---

## The Process

### Step 1 — Record and Transcribe

Deliver the training session and capture a full transcript using a passive recording tool.

- **Tools:** Granola (macOS — sits on top of the meeting, captures audio, produces structured notes), Otter.ai (browser-based alternative), video call platform (Google Meet, Zoom, or Teams)
- **Time:** The duration of the training itself. Recording adds no overhead.
- **Output:** Timestamped transcript with AI-generated summary

> **Tips:**
> - Use Granola's real-time note-taking to capture observations the AI summary might miss.
> - Keep separate transcripts for sessions aimed at different audiences — this preserves segmentation later.
> - Confirm recording consent beforehand. UK GDPR applies.

> **Phew! example:** Two sessions delivered on 11 Feb 2026 — "AI and the Art of the Possible" (broad audience) and "Claude Code, QA Approaches" (dev/QA focus). Both recorded via Granola, producing structured summaries with action items.

---

### Step 2 — Summarise and Identify Focus Areas

Review the AI-generated summary, cross-reference with your notes, and identify the topics and requests that should shape the deliverable.

- **Tools:** Granola's built-in AI summary, manual review
- **Time:** 15–30 minutes per transcript
- **Output:** Annotated summary with key themes, explicit client requests, and audience segmentation notes

> **Tips:**
> - Pay close attention to questions the client asked — these reveal confusion or desire for depth.
> - Capture explicit requests verbatim. Direct quotes become requirements.
> - Note which topics resonated with which audience group — this informs whether you need multiple tracks.

> **Phew! example:** Key themes identified: context management, skills/extensions, governance, session handling. The MD specifically requested "a summary document or cheat-sheet highlighting the core techniques." The dev session surfaced CLAUDE.md files, codebase mapping, regression testing, and MCP safety. These became the playbook's two-track structure (General and Developer).

---

### Step 3 — Provide Context to Claude and Plan

Load the session summaries, client feedback, and background materials into Claude. Ask for a structured plan.

- **Tools:** Claude (claude.ai, Claude Desktop, or Claude Code), session summaries from Step 2, client website content (scraped via Firecrawl or similar for personalisation)
- **Time:** 1–2 hours, including iteration
- **Output:** Structured plan with deliverable format, content sections, audience tracks, and phased build approach

> **Tips:**
> - Start a fresh session for planning — do not continue from a session used for other work.
> - Provide summaries as file attachments rather than pasting inline.
> - Ask for options before committing to a structure.

> **Phew! example:** Session summaries, client feedback, initial thoughts document, and a Phew! website scrape were loaded as context. Claude proposed the three-output structure (interactive playbook, starter kit, process doc), the two-track approach, and the phased build process. This was iterated over several sessions, producing the handoff document.

**Template prompt — Planning:**
```
I've just delivered AI training to [CLIENT NAME]. Attached are:
1. Session summary/transcript from the training
2. Client feedback received after the session
3. [Any other relevant context — website scrape, existing materials, etc.]

Based on the training content and client feedback, I need to create a structured follow-up deliverable. Please:
- Identify the key topics and pain points from the training
- Recommend a format for the deliverable (consider the client's technical level and team size)
- Propose a content structure with sections and suggested depth
- Flag any topics where the client explicitly requested more detail
- Suggest what starter materials (templates, prompts, config files) would be most valuable
```

---

### Step 4 — Produce Detailed Specs

Break the plan into section-level specifications. Each spec must be self-contained — a build agent reading only that spec should have everything needed.

- **Tools:** Claude (or Claude Code), the plan from Step 3, source context documents
- **Time:** 30–60 minutes per spec. A 15-section playbook: 1–2 days.
- **Output:** One spec per section, each defining purpose, source references, content outline, and acceptance criteria

> **Tips:**
> - Invest time here — thorough specs prevent rework during the build.
> - Group specs by the agent that will build them. Ensure no spec depends on another agent's incomplete output.
> - Run research tasks first if any specs need technical findings.

> **Phew! example:** Phase 0 ran seven research tasks in parallel (website scrape, UK English enforcement, command availability, brand voice workflow, context window mechanics, capabilities audit, app tech stack). Phase 1 then wrote 17 specs — one per playbook section, plus the starter kit and this process document.

**Template prompt — Spec writing:**
```
I need to write a build spec for the following section of the deliverable:

[SECTION TITLE AND BRIEF DESCRIPTION]

The spec will be consumed by a build agent that works ONLY from this spec and referenced files. It must include:
- Purpose (what this section achieves)
- Source references (which files to read)
- Content outline (detailed breakdown of what to cover)
- Acceptance criteria (how to verify the section is complete)

Here is the overall plan for context: [ATTACH OR PASTE PLAN]
Here are the relevant source documents: [ATTACH SOURCES]
```

---

### Step 5 — Build with Parallel Agents

Execute the build using Claude Code, ideally with multiple agents working in parallel. Each agent receives its spec and works independently.

- **Tools:** Claude Code, Git, the specs from Step 4
- **Time:** Varies. A React app with 15+ sections: 4–8 hours of agent time (less wall-clock time with parallelism).
- **Output:** Working application code, content, and configuration

> **Tips:**
> - Set up the project shell first (scaffolding, routing, shared components) before dispatching content agents.
> - Each parallel agent gets a fresh 200k token context window — this is the key advantage over a single agent.
> - Use a CLAUDE.md file in the project root to give all agents shared context.
> - Review agent outputs as they complete. Fix integration issues early.

> **Phew! example:** Six parallel agents allocated: (1) App shell, (2) Context and session sections, (3) Skills, governance, and brand, (4) Developer track, (5) Starter kit, (6) Welcome, process doc, and integration. Each worked from its spec independently.

**Template prompt — Agent dispatch:**
```
You are a build agent for a client deliverable project. Your task is to build the section(s) defined in your spec.

Read the following spec carefully: [SPEC FILE PATH]
Read the project's CLAUDE.md for shared conventions: [CLAUDE.md PATH]

Build exactly what the spec describes. Do not add features beyond the spec. Do not modify files outside your designated output area unless the spec explicitly instructs you to.

When complete, verify your output against the acceptance criteria in the spec.
```

---

### Step 6 — Deploy the Deliverable

Integrate all agent outputs, run checks, and deploy.

- **Tools:** Vercel (zero-config for Vite/React), GitHub, Claude Code for integration fixes
- **Time:** 1–2 hours
- **Output:** Live URL with the finished deliverable

> **Tips:**
> - Cross-reference the original plan: does every item appear in the final deliverable?
> - Test interactive elements: copy buttons, navigation, responsive layout, keyboard accessibility.
> - Verify tone consistency across sections built by different agents.
> - Deploy to a preview URL first.

> **Phew! example:** The React app deployed to Vercel. The GitHub repo contained the app source, starter kit files, and this document. A preview URL was shared before the final deployment.

---

### Step 7 — Bundle and Deliver

Package the deliverable with a clear delivery note.

- **Tools:** Email, the deployed app URL, the starter kit
- **Time:** 30 minutes
- **Output:** Delivery email with the URL, adoption guidance, and follow-up offer

> **Tips:**
> - Suggest a specific adoption order. Do not dump everything at once — recommend quick wins first.
> - Offer a follow-up session. The deliverable raises new questions once people start using it.
> - Note which elements are reusable (governance template, skills) — this positions future work naturally.

> **Phew! example:** The delivery email included the app URL, an explanation of the two-track structure, suggested first steps (context management, then CLAUDE.md setup), how to provide feedback, and an offer for a follow-up session.

**Template prompt — Delivery note:**
```
I need to write a brief delivery email to [CLIENT NAME] for the AI training follow-up materials I've prepared. The deliverable includes:

[LIST WHAT'S INCLUDED]

The email should:
- Explain what's included in plain language (no jargon)
- Suggest a practical adoption order (quick wins first)
- Explain how to provide feedback
- Offer a follow-up session
- Keep it under 300 words — respect their time
```

---

## Adapting for Different Clients

- **Simpler deliverables:** For a client who just needs a cheat-sheet, skip Steps 4 and 5. Go from plan to a single Claude session producing the document.
- **Non-technical clients:** Replace the interactive app with a well-structured PDF or Notion page. The process steps remain the same; only the output format changes.
- **Larger teams:** For clients with multiple departments, consider more than two audience tracks. The spec-per-section approach scales naturally — add more specs and agents.
- **Ongoing engagements:** If the relationship extends beyond a single follow-up, add a feedback loop between Step 7 and Step 1. The follow-up session becomes the next input.
- **Different tech stacks:** The Vite + React + Vercel stack can be swapped for any framework. The workflow principles (record, summarise, plan, spec, build, deploy, deliver) remain constant.
- **Budget constraints:** Parallelism is optional. A single Claude Code session working through specs sequentially achieves the same output — it just takes longer.

---

## Template Prompts

All four template prompts from the process steps above, collected for quick reference:

### Planning (Step 3)
```
I've just delivered AI training to [CLIENT NAME]. Attached are:
1. Session summary/transcript from the training
2. Client feedback received after the session
3. [Any other relevant context — website scrape, existing materials, etc.]

Based on the training content and client feedback, I need to create a structured follow-up deliverable. Please:
- Identify the key topics and pain points from the training
- Recommend a format for the deliverable (consider the client's technical level and team size)
- Propose a content structure with sections and suggested depth
- Flag any topics where the client explicitly requested more detail
- Suggest what starter materials (templates, prompts, config files) would be most valuable
```

### Spec Writing (Step 4)
```
I need to write a build spec for the following section of the deliverable:

[SECTION TITLE AND BRIEF DESCRIPTION]

The spec will be consumed by a build agent that works ONLY from this spec and referenced files. It must include:
- Purpose (what this section achieves)
- Source references (which files to read)
- Content outline (detailed breakdown of what to cover)
- Acceptance criteria (how to verify the section is complete)

Here is the overall plan for context: [ATTACH OR PASTE PLAN]
Here are the relevant source documents: [ATTACH SOURCES]
```

### Agent Dispatch (Step 5)
```
You are a build agent for a client deliverable project. Your task is to build the section(s) defined in your spec.

Read the following spec carefully: [SPEC FILE PATH]
Read the project's CLAUDE.md for shared conventions: [CLAUDE.md PATH]

Build exactly what the spec describes. Do not add features beyond the spec. Do not modify files outside your designated output area unless the spec explicitly instructs you to.

When complete, verify your output against the acceptance criteria in the spec.
```

### Delivery Note (Step 7)
```
I need to write a brief delivery email to [CLIENT NAME] for the AI training follow-up materials I've prepared. The deliverable includes:

[LIST WHAT'S INCLUDED]

The email should:
- Explain what's included in plain language (no jargon)
- Suggest a practical adoption order (quick wins first)
- Explain how to provide feedback
- Offer a follow-up session
- Keep it under 300 words — respect their time
```
