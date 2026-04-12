# Create Prototype

Create a new prototype in the playground. Accepts an optional name as argument: `/create-prototype my-feature`

## Steps

1. **Read the user's identity** from `claude.local.md` in the project root. Look for the `Username:` field. If `claude.local.md` doesn't exist, ask the user for their username and suggest they create the file by copying `claude.local.md.example`.

2. **Get the prototype name.** If provided as an argument, use it. Otherwise, ask: "What would you like to call this prototype?"

3. **Get a brief description.** Ask: "One-line description of what you're prototyping?"

4. **Choose a template.** Ask which template to use:
   - **blank** — Minimal page with just a title
   - **n8n-app** — Page with n8n sidebar chrome (uses PrototypeShell)

5. **Create the prototype directory** at `app/prototypes/{username}/{prototype-name}/` with:

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
       <div className="p-8">
         <h1 className="text-2xl font-semibold text-foreground">New Prototype</h1>
         <p className="text-muted-foreground mt-2">Start building here.</p>
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
         <div className="p-8">
           <h1 className="text-2xl font-semibold text-foreground">New Prototype</h1>
           <p className="text-muted-foreground mt-2">This prototype includes n8n app chrome with sidebar.</p>
         </div>
       </PrototypeShell>
     )
   }
   ```

6. **Report what was created:**
   - Directory path
   - Files created
   - URL to view it: `http://localhost:3000/prototypes/{username}/{prototype-name}`
   - Remind: "Run `pnpm dev` if the dev server isn't already running"
