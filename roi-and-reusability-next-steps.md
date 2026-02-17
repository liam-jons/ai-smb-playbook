## ROI Section Actions

- Use impeccable /audit on the ROI section page
- Change the tab order for before/after - 'All' should come last, as showing all examples when the user first scrolls creates a state of overwhelm, as there are many
- Needs an improved introduction section at the beginning so that users understand the purpose of the section, and the tools that are available
- A new tool that we add to the page is creating a template similar to what we've done for the governance template but instead focused on creating a feasibility study for a selected initial use case and once we've walked the client through creating their first feasibility study we need to enable the process to be repeatable

## Reusability Next Steps

- In preparation for Workstream D (Reusability/template system) we should complete research and analysis, so that we understand what options are available here, to ensure we select the correct approach. The initial reusability audit was completed reasonably early on in the apps development, and is a valuable  starting point, but is exactly that, a starting point - available here: .planning/research/reusability-audit.md.
    - Before completing any tier 2 changes, for example, we will need to check whether it is logical to make the ~50 inline few references across 16 content sections parametrised or whether some of these could/should be made more generic anyway, to enable reusability
    - Some of the tier 3 items could be valuable across multiple clients e.g., Phew use Ghost Inspector, other clients will use something different, and many clients won't be building software, so the section is irrelavant to them - we need to account for all inevitablities
    - Similarly, rather than the brand voice work being something that was specific to Phew!, this could actually be a really helpful section if made generic, to help SMBs start to build context/knowledge base files, that they can use and build upon, providing Claude (or their chosen LLM) with valuable context during their sessions
    - Creating a content schema that separates structure (components, routing) from content (text, examples, code snippets) is suggested, and something we should be persuing:
        - Think about how this works if we scaled - e.g., 50, 1000, 10,000 clients - what's the best approach - security, analytics and codebase management are three areas to consider in depth
        - The latest section to be built (ROI section) should have been built with these aspects in mind, but we need to verify that it was or if more is required (original plan here: /.planning/plan-files/roi-section-implementation.md)
        - Not all clients will yet be using Claude, even though it's Claude that we will be talking to them about. So this is just something we need to keep in mind for any Claude references throughout the playbook.
    - The Repeatable Workflow Process Doc and section should be removed from the app - it's purpose is only for us as an internal document
        - This document needs to be reviewed, as the information contained provides extremely valuable context for how the application will need to function, to allow us to easily repeat the process for a new client
    
    - **We also need to complete further content reviews:**
        - .planning/client-specific/00-phew/continuation-prompts/continuation-prompt-12-audit-fixes-content-review.md contains the full page catalog for the app, which will be valuable for this work, however, important to note is that section numbers will be out of date as we've now added the ROI section
        - Audit each page's 'introduction' section(s) and review the content suitability. We need to make sure that the text correctly references the content that's available in the section, pulling everything together, so that our clients understand why it's there, and how they can make the best use of it
        - We also need to review every page for (i) Editorial notes left in Production Content (previous example found “Honest about the gaps. This builds trust — the playbook is not overselling.”), (ii) Any third person language, (iii) Overused meta-narrative context - there should only be one reference in the app
        - Should the `{{PLACEHOLDER}}` values in `starter-kit/templates/governance-policy-template.md` be editable - if so, they're not currently

Whilst workstream D in the continuation prompt outlines the requirement to make the application reusable, I'm not sure that we currently have enough information for what this actually means, or any real plan for doing so. This research and analysis is critical, to move us from an application which is entirely client-specific, to instead being able to easily replicate this for any client, and for the client to gain maximum benefits from using their personalised playbook.