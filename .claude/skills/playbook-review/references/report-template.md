# Report Template

Use this structure for the GO/NO-GO review report.

```markdown
# Playbook Review Report: {companyName}

**Date:** {YYYY-MM-DD}
**Client slug:** {slug}
**Reviewer:** Automated (playbook-review skill v1)
**Sections reviewed:** {count} of {total} ({track description})
**Developer track:** {enabled/disabled}

## Verdict: {GO / NO-GO}

{One-paragraph summary}

## Blocking Issues ({count})

### Issue 1: {title}
- **File:** {file path and line number}
- **Detail:** {what is wrong}
- **Fix:** {recommended fix}

## Advisory Issues ({count})

### Issue 1: {title}
- **File:** {file path}
- **Detail:** {what could be improved}
- **Fix:** {recommended fix}

## Informational Notes ({count})

### Note 1: {title}
- **Detail:** {observation}

## Section-by-Section Results

| Section | Code | Status | Notes |
|---------|------|--------|-------|
| Welcome & Orientation (1.1) | PASS | GO | Uses `trainingDate`, `hasDeveloperTrack`, etc. |
| How Context Works (1.2) | PASS | GO | Generic section — no parameterisation expected |
...

## Config Completeness

- **Required fields:** {N}/18 present and non-empty — {PASS/FAIL}
- **Developer fields:** {N}/10 present — {PASS/FAIL} (only if hasDeveloperTrack)
- **Optional fields:** {status} — {PASS/FAIL}
- **Placeholder detection:** {status} — {PASS/FAIL}
- **Brand voice:** {status} — {PASS/FAIL}
- **Recurring tasks:** {N} examples — {PASS/FAIL}
- **ROI examples:** {N} examples — {PASS/FAIL}
- **Starter kit categories:** {categories} — {PASS/FAIL}
- **Named individuals:** {status} — {PASS/FAIL}

## Review Metadata

- Total agents spawned: {N}
- Code agents: {N} (all completed successfully / {details})
- Known issues skipped: {N} (from known-issues.md)
```
