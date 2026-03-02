# AGENTS.md

## Project Context
- This repository is an Astro docs/blog project.
- Documentation content is stored under `src/content/docs/`.
- Prefer concise Traditional Chinese responses unless the user requests another language.

## Working Rules
- Preserve existing directory and file naming conventions.
- Do not rename or move files unless explicitly requested.
- Keep heading hierarchy and links stable when editing docs.
- Generate Markdown that is compatible with Astro content collections.

## Skills
A skill is a local instruction set stored in a `SKILL.md` file.

### Available skills
- astro-post-converter: Convert finished drafts into Astro-compatible Markdown with consistent frontmatter and docs path conventions. (file: /Users/charchar/code/blog/.codex/skills/astro-post-converter/SKILL.md)

### How to use skills
- Trigger rules:
  - Use a skill when the user explicitly names it.
  - Use a skill when the request clearly matches its description.
- If a skill is missing or unreadable, report briefly and continue with the best fallback.
- If multiple skills could apply, use the minimal set and state order briefly.

## Astro Content Standard
When creating or converting articles:
1. Include YAML frontmatter at the top.
2. Default frontmatter key order:
   - `title`
   - `description`
   - `pubDate`
   - `tags`
   - `draft`
3. Markdown structure rules:
   - Exactly one `#` title.
   - Use meaningful `##` / `###` sections.
   - Use fenced code blocks with language labels.
4. Output path conventions:
   - English: `src/content/docs/en/<slug>.md`
   - Traditional Chinese: `src/content/docs/zh-tw/<slug>.md` (if the folder exists)

## Safety
- Do not run destructive git or file operations unless explicitly requested.
- Ask before adding dependencies or changing project-wide config.
