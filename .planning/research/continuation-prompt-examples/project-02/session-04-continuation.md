# Session 04: Adversarial Review of `wf` Spec v0.3

## Context

Sessions 01-02 researched open questions and produced the spec through v0.2. Session 03 reviewed architecture feedback, accepted all 7 reviewer proposals (cut JSONL sync, merge Phase 3, add UserPromptSubmit hook, simplify verification/reflections, reduce deps to 4, add stale claims, add `wf log`), promoted SubagentStop from "future" to Phase 4 (leveraging existing `parse-subagents.py`), and made all phases the MVP. The result is v0.3.

**Repo:** `/Users/liamj/Documents/development/workflow/`

## Read This File

`.planning/research/wf-spec-v0.3.md` — the complete SDD (~1,250 lines, 13 sections)

## The Job

Take this SDD apart. Give me 20 points that are underspecified, weird, or inconsistent.

Look for:
- **Underspecified:** Described at the "what" level but missing the "how" — enough to write a section header but not enough to write the code
- **Weird:** Design choices that don't follow from the stated constraints, or that contradict each other
- **Inconsistent:** Places where two sections disagree, where a command is referenced but not defined, where a field is used but never populated, where a workflow assumes something another section contradicts
- **Silent assumptions:** Things the spec takes for granted without stating — error handling conventions, concurrency edge cases, what happens when X doesn't exist
- **Missing interactions:** Commands or workflows that should compose but don't, or that compose in ways the spec doesn't address

Be specific. For each point, cite the section(s) and quote the relevant text. Don't flag stylistic issues or minor wording problems — focus on things that would cause implementation ambiguity or bugs.

## What This Is NOT

This is not a "is this the right tool?" review (Session 03 already did that). The architecture is settled. This is a pre-implementation audit: if Claude sat down to build Phase 1 tomorrow, what would it get stuck on or get wrong because the spec is ambiguous?

## Constraints

- Go, `modernc.org/sqlite`, Kong v1.0, 2 dependencies
- All code written by Claude — verbose spec prevents ambiguity, which is the goal
- Local-only, single machine, single user
- The tool is for a human-AI pair using Claude Code
