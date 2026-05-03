# Create Prototype

Create a new prototype in the playground. Accepts an optional name as argument: `/create-prototype my-feature`

## Steps

1. **Read the user's identity** from `claude.local.md` in the project root. Look for the `Username:` field. If `claude.local.md` doesn't exist, ask the user for their username and suggest they create the file by copying `claude.local.md.example`.

2. **Get the prototype name.** If provided as an argument, use it. Otherwise, ask: "What would you like to call this prototype?"

3. **Check git branch.** Run `git branch --show-current`.

   The expected branch for this prototype is `{username}/{prototype-name}`.

   If on `main`:
   > "You're on the main branch. It's best to create your prototype on its own branch — this keeps your work separate and makes deploying easier later."
   > "I'd suggest creating a branch called `{username}/{prototype-name}`. Want me to do that?"

   If the user agrees, switch to the branch:
   - Check if it exists locally: `git branch --list {username}/{prototype-name}`
   - If it exists locally: `git checkout {username}/{prototype-name}`
   - If not local, check remote: `git ls-remote --heads origin {username}/{prototype-name}`
   - If it exists on the remote: `git checkout -b {username}/{prototype-name} origin/{username}/{prototype-name}`
   - If it doesn't exist anywhere: `git checkout -b {username}/{prototype-name}`
   - If checkout fails due to uncommitted changes, offer to stash first: `git stash`, switch, then `git stash pop`
   > "Switched to branch `{username}/{prototype-name}` — your prototype files will be created here."

   If the user declines:
   > "No problem — I'll create the prototype on `main`. You can always move to a branch later with `/deploy`."

   If already on a matching feature branch:
   > "You're on branch `{branch}` — I'll create the prototype here."

   If on a different or unrelated branch:
   > "You're on branch `{branch}`, which doesn't look related to this prototype. Want me to create a new branch `{username}/{prototype-name}`, or keep working here?"

4. **Get a brief description.** Ask: "One-line description of what you're prototyping?"

5. **Choose a template.** Discover templates dynamically — never hardcode the list.

   - List the directories in `app/prototypes/_templates/` (e.g. `ls app/prototypes/_templates/`).
   - For each template directory, read its `metadata.json` and use the `title` + `description` fields to present it to the user.
   - Show the templates as a numbered list (one line per template: `**{title}** — {description}`) and ask the user which one to use.

   This way, adding a new template (a new folder under `_templates/` with its own `metadata.json` and `page.tsx`) makes it appear here automatically — no edits to this command needed.

6. **Create the prototype** by copying the chosen template, then customizing its metadata. Do NOT inline `page.tsx` content here — always copy from the template directory so the templates stay the single source of truth.

   - Copy the template directory:
     ```bash
     cp -R app/prototypes/_templates/{template}/ app/prototypes/{username}/{prototype-name}/
     ```
   - Overwrite `app/prototypes/{username}/{prototype-name}/metadata.json` with the user's values:
     ```json
     {
       "title": "{prototype name, human-friendly}",
       "description": "{the one-liner from step 4}",
       "author": "{username}",
       "date": "{today's date as YYYY-MM-DD}",
       "externalUrl": null,
       "featured": false,
       "template": false
     }
     ```
     `template` MUST be `false` — copying a template directory inherits `template: true`, which would make the new prototype show up in the Templates tab instead of Prototypes.
   - Leave `page.tsx` (and any other files in the template) untouched. The user iterates from there.

   **Styling convention reminder:** every prototype uses **styled-jsx** (built into Next.js). Each component ends with a `<style jsx>{...}</style>` block; give elements semantic class names and reference n8n design tokens directly (`var(--color--orange-500)`, `var(--spacing--md)`). Do not write Tailwind utility classes — Tailwind is quarantined to the vendored `components/shadcn/` library.

7. **Report what was created:**
   - Template used
   - Directory path
   - Files copied
   - URL to view it: `http://localhost:3000/prototypes/{username}/{prototype-name}`
   - Remind: "Run `pnpm dev` if the dev server isn't already running"
