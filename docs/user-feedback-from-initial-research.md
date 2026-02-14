## UK-English Report

- Recommend options 1, 3, 6, and 8, for users not using Claude Code
    - Report suggests pasting the skill into Project instructions, but this isn't necessary - the skill should be uploaded via either claude.ai or Claude Desktop, and then invoked, which the report does reference - but there's no need to mention pasting in project instructions here        
    - We will need to walk users through uploading a skill
        - I've already created and saved the content as /uk-english/SKILL.md to the starter kit, so no required as a copyable block
    - For option 3, just the one-line being added to project custom instructions is required
- For the Claude Code users, recommend option 2, and then provide option 7 as an advanced option, if any issues are found by only having the reference in CLAUDE.md
- For option 8 - brand-review skill: we should just include a line in the 'Style Guide Compliance' section of the command file which is in the starter kit, as well as specifying in the style guide which will be created when the brand-voice skill is used - ALL content that is ever reviewed for Phew! will always required UK conventions
    - The report puts a big focus on why using brand-review as an enforcement method could be 'overkill', and a 'massive overhead' - for clarity, it was never the intention for this to be the main method of enforcement - it's just another place where issues could get caught, when using the skill and command to review any content
    - As is noted in a separate report, slash commands aren't used in claude.ai/claude desktop, so we can't include things like "Then run /brand-review against content to check compliance" - however, we'll review the findings of the 'commands' report separately, to identify what we will do as an alternative

- We'll need to update the sections which reference what needs to go into the playbook and starter kit, to ensure alignment to the above feedback

## Command & Skill Availability Report

- As suggested in the report, for the users using claude.ai and Claude Desktop, we'll instead package the Commands as Skills - for now, this will involve converting /starter-kit/commands/brand-review.md and creating a new session handoff skill (see below)
- Create a session handoff/continuation prompt skill, which users can invoke - the skill could begin by assessing token usage, and then react accordingly - I'll provide example prompts which we've used previously, and which can be used to both define the handoff protocol, and also adapted to become reference documents
    - As the report suggests, this will be an admin-provisioned organisation skill
    - We'll create this and provide it with the starter kit (including optional supporting scripts/templates)

- We'll need to update the recommendations section based on the above feedback, which is mostly aligned

## Tech Stack Report

- Happy with almost all suggestions, but please note the following points:
    - (i) For the context visualisation, we should research whether using remotion would be a better alternative - it's an easy install, and we have a specific skill file - we should deploy a subagent to research this as an option, and then outline pros and cons of the two methods available
    - (ii) We have lots of frontend skills available, both in terms of design and coding patterns, as well as context7 - before we build, we should ensure we have reviewed these, and integrated findings that would be beneficial for our pursposes, accordingly.
        - Skill files to review: 
            - /Users/liamj/Documents/development/follow-up-and-feedback/.claude/skills/canvas-design
            - /Users/liamj/Documents/development/follow-up-and-feedback/.claude/skills/frontend-design
            - /Users/liamj/Documents/development/follow-up-and-feedback/.claude/skills/interaction-design
            - /Users/liamj/Documents/development/follow-up-and-feedback/.claude/skills/remotion-best-practices
            - /Users/liamj/Documents/development/follow-up-and-feedback/.claude/skills/vercel-react-best-practices
            - /Users/liamj/Documents/development/follow-up-and-feedback/.claude/skills/web-design-guidelines

## Brand Voice Workflow Report

- Something was confused in terms of the research requirement here - we weren't under any illusions that this was a step-by-step wizard - from our perspective in terms of the app, we just need to help 'walk' users through the process e.g., making them aware of what using the skill will do when invoked for the first time, providing them with a list of inputs to have ready (they are a well-established company, and will have content for all of the items that are 'strongly recommended' in the report, and likely examples for the 'Nice to have' items too.
    - We also ran the website scrape in this research phase, so we should check if we have anything valuable which we could use e.g., existing website copy. The more seamless we can make this experience for the client, the better
- We'll need to provide guidance and recommendations for where to save the brand voice document, as outlined in the report, and ensuring alignment with any other related actions we take for brand-review and brand-voice e.g., based on the feedback from the other reports
- The copyable prompt looks useful, as something we can include in the application, but no requirement to include the simpler version
    - Importantly, we'll need to ensure we provide guidance on when to use the brand-review functionality - it's currently a command, but will be reworked to become a skill, so along with the skill file itself having guidance on invocation, we should provide example sentences/prompts that can be used, as well as guidance on how/when e.g., something we will be focusing on is context/session management - if the user has used most tokens in a session by creating an output, it would make more sense to create a session handoff/continuation prompt, and then move to a new session for the brand-review - or in some cases it will be as straightforward as starting a new session, adding the content, and then invoking the skill - remember, AI doesn't make sense to everyone, and our role is to help users both understand why we would do something a particular way, and also make this as easy as possible for them, to ensure they achieve the best outputs

## Phew Site Content Report

- We should now follow up with any suggested further scrapes
- One point to note which doesn't need to be in the app, but I'm providing here for context - the correct number of employees is 9-11, and I have names for the 9 meeting attendees below:
    - Andrew Tate, Jelka Witherall, Matt Bushby, Matthew Burgess, Nick McCallum, Scott Rowley, Suzanne Tanser, Amanda Kelly, Stuart Hunter

## Capabilities Audit Report

- Key point to keep in mind when we add this content to the playbook decision tree is that we have two types of users - technical and non-technical, where non-technical will only be using claude.ai & claude desktop, though they will also use CoWork soon too, and were the technical team will use claude.ai & claude desktop, but also claude code.
- Small side note for this report - accuracy of the capabilities file wasn't ever in question, I think this is something which became confused in the request.

Please also note, I've renamed `continuation-prompt.md` to `continuation-prompt-01.md` and moved under `docs/continuation-prompts/`