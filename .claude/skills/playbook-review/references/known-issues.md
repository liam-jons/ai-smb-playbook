# Known Issues

Issues discovered during previous reviews. Agents should check whether these have been fixed but should not report them as new findings.

*Updated after each review session. Format: date, client, issue, status.*

## Active Known Issues

### Generic sections without parameterisation
- **Date:** 2026-02-19
- **Affects:** All clients
- **Sections:** Context (1.2), Reliable Output (1.3b), Skills & Extensions (1.4)
- **Detail:** These educational sections have zero client-specific content. This is by design for Context and Reliable Output (universal Claude concepts), but Skills & Extensions has a hardcoded line "Your team has Claude Teams licences for all staff and Claude Code access for developers" that should be config-driven.
- **Status:** Documented as future enhancement. Do not flag as blocking.
- **Planned fix:** Session 37 — parameterise the hardcoded licence line in SkillsExtensionsSection; add a client-relevant example to ReliableOutputSection.

### ReliableOutputSection generic example
- **Date:** 2026-02-19
- **Affects:** Non-design-agency clients
- **Detail:** Uses "a client proposal for a new website redesign project" as an example, which fits Phew (design agency) but not other industries.
- **Status:** Documented as future enhancement.
- **Planned fix:** Session 37 — parameterise or overlay this example.

## Resolved Issues

*None yet — this file was created on 2026-02-19.*
