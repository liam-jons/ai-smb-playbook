# Meeting: Claude Code, QA approaches

Wed, 11 Feb 26 · Amanda Kelly, Matt Bushby, Matthew Burgess, Andrew Tate, Nick McCallum

### AI Skills and Workflow Optimization Overview

- Skills function as specialized AI capabilities that can be shared and reused
  - Available individually or at company level through Cowork
  - Auto-triggered by context or manually invoked
  - Can be installed globally or at project level
- Workflow involves breaking complex tasks into atomic components
  - Each subtask gets full 200k token allocation
  - Higher quality output through granular task definition
  - Prevents AI from defaulting to “quick fix” solutions

### Skills Management and Implementation

- Installation via Vercel marketplace (reasonably trusted, anyone can publish)
- Project-level organization using symlinks to global repository
  - Keeps context lightweight
  - Avoids token waste on unused capabilities
- Current token usage: 50k at session start (target: 20-25k)
  - 2.8k tokens for skills (acceptable level)
  - Can optimize by removing unused agents/plugins per project

### [Claude.md](http://Claude.md) Files for Project Context

- Critical for providing structured project knowledge
  - Tech stack specifications
  - Development commands and architecture references
  - Authentication patterns and database schemas
- Best practices for optimization:
  - Keep files concise (AI stops reading if too long)
  - Use project-specific files rather than monolithic approach
  - Include “no real users” note for development environments
  - Reference external documentation in docs folder

### Advanced Automation Workflows

- Multi-agent parallel processing for complex tasks
  - Each agent uses separate 200k token allocation
  - Main Claude limited to own context window
  - Sub-agents produce rich content often unseen in main session
- Automated monitoring and self-updating skills
  - Website change detection via Deal monitoring
  - Automatic knowledge base updates with verification
  - Closed-loop skill maintenance system

### Browser Automation and Computer Control

- Cowork enables direct browser manipulation
  - Orange hue indicates AI control
  - Can handle login, navigation, form filling
  - Integrates with tools like Loom for video creation
- Computer use extensions for broader application control
  - Script generation for complex workflows
  - Cross-application automation capabilities

### Development and Code Review Integration

- Code analysis and debugging capabilities
  - Multi-file cross-reference analysis
  - Automatic architecture documentation generation
  - Tech debt identification (21kb concerns file generated)
- Integration with development tools:
  - Windsurf/Cursor IDE alternatives
  - Warp terminal with built-in Claude sessions
  - Agent harness for structured optimization

### Business Application Opportunities

- Regression testing automation
  - Browser-based testing workflows
  - Integration with existing tools or custom solutions
  - Potential Ghost Inspector replacement
- Bid management system development
  - Structured data extraction from documents
  - Automated response generation from knowledge base
  - Competitor analysis via web scraping (Fire Crawl)

### Implementation Recommendations

- Start with [Claude.md](http://Claude.md) files across all projects immediately
- Focus on high-value, time-saving applications first
  - Avoid rabbit holes and scope creep
  - 95% of AI projects fail due to overwhelming scope
- Establish structured workflows:
  - Break tasks into atomic components
  - Maintain documentation and verification processes
  - Build reusable skills for common operations
- Consider API budget implications for autonomous operations
  - Claude Max: £180/month for extensive usage
  - Token management critical for cost control

---

Chat with meeting transcript: [https://notes.granola.ai/t/66340bcb-86e4-42d6-addf-ef6fa66664a8-00demib2](https://notes.granola.ai/t/66340bcb-86e4-42d6-addf-ef6fa66664a8-00demib2)