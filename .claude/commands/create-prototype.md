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

5. **Choose a template.** Ask which template to use:
   - **blank** — Minimal page with just a title
   - **n8n-app** — Page with n8n sidebar chrome (uses PrototypeShell)

6. **Create the prototype directory** at `app/prototypes/{username}/{prototype-name}/` with:

   A `metadata.json` like this:
   ```json
   {
     "title": "My Prototype",
     "description": "What it does",
     "author": "username",
     "date": "2026-04-12",
     "externalUrl": null,
     "featured": false,
     "template": false
   }
   ```

   A `page.tsx` — if using the **blank** template:
   ```tsx
   export default function BlankPrototype() {
     return (
       <div className="blank-prototype">
         <h1 className="title">New Prototype</h1>
         <p className="subtitle">Start building here.</p>

         <style jsx>{`
           .blank-prototype {
             padding: var(--spacing--lg);
           }
           .title {
             font-size: var(--font-size--xl);
             font-weight: var(--font-weight--semibold);
             color: var(--color--neutral-800);
           }
           .subtitle {
             margin-top: var(--spacing--3xs);
             color: var(--color--neutral-400);
           }
         `}</style>
       </div>
     )
   }
   ```

   If using the **n8n-app** template:
   ```tsx
   "use client"

   import { PrototypeShell } from "@/components/n8n/prototype-shell"

   export default function N8nAppPrototype() {
     return (
       <PrototypeShell>
         <div className="n8n-prototype">
           <h1 className="title">New Prototype</h1>
           <p className="subtitle">This prototype includes n8n app chrome with sidebar.</p>

           <style jsx>{`
             .n8n-prototype {
               padding: var(--spacing--lg);
             }
             .title {
               font-size: var(--font-size--xl);
               font-weight: var(--font-weight--semibold);
               color: var(--color--neutral-800);
             }
             .subtitle {
               margin-top: var(--spacing--3xs);
               color: var(--color--neutral-400);
             }
           `}</style>
         </div>
       </PrototypeShell>
     )
   }
   ```

   **Styling convention:** every prototype uses **styled-jsx** (built into Next.js). Each component ends with a `<style jsx>{...}</style>` block; give elements semantic class names and reference n8n design tokens directly (`var(--color--orange-500)`, `var(--spacing--md)`). Do not write Tailwind utility classes — Tailwind is quarantined to the vendored `components/shadcn/` library.

7. **Report what was created:**
   - Directory path
   - Files created
   - URL to view it: `http://localhost:3000/prototypes/{username}/{prototype-name}`
   - Remind: "Run `pnpm dev` if the dev server isn't already running"
