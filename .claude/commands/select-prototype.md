# Select Prototype

Switch to an existing prototype to work on it. Handles branch switching automatically. Accepts an optional name as argument: `/select-prototype workflow-editor`

## Steps

1. **Read the user's identity** from `claude.local.md` in the project root. Look for the `Username:` field. If `claude.local.md` doesn't exist, ask the user for their username and suggest they create the file by copying `claude.local.md.example`.

2. **List existing prototypes.** Scan `app/prototypes/{username}/` for directories containing `metadata.json`. Display each with its title and description from the metadata.

   If no prototypes exist:
   > "You don't have any prototypes yet. Want to create one? Try `/create-prototype`"
   Stop here.

3. **Let the user pick.** If a name was provided as argument, match it against the list. Otherwise, ask which prototype they want to work on.

4. **Check git branch.** Run `git branch --show-current`.

   The expected branch for this prototype is `{username}/{prototype-name}`.

   If already on the correct branch:
   > "You're already on `{username}/{prototype-name}` — ready to go."

   If on `main`:
   > "You're on `main`. I'd recommend switching to `{username}/{prototype-name}` so your changes stay organized."
   > "Want me to switch branches?"

   If the user agrees, switch to the branch:
   - Check if it exists locally: `git branch --list {username}/{prototype-name}`
   - If it exists locally: `git checkout {username}/{prototype-name}`
   - If not local, check remote: `git ls-remote --heads origin {username}/{prototype-name}`
   - If it exists on the remote: `git checkout -b {username}/{prototype-name} origin/{username}/{prototype-name}`
   - If it doesn't exist anywhere: `git checkout -b {username}/{prototype-name}`
   - If checkout fails due to uncommitted changes, offer to stash first: `git stash`, switch, then `git stash pop`

   If the user declines:
   > "No problem — staying on `main`. You can always switch later or use `/deploy` when you're ready to share."

   If on a different feature branch:
   > "You're on `{current-branch}`, but the prototype you selected would normally be on `{username}/{prototype-name}`. Want me to switch?"

5. **Confirm ready.**
   > "You're set to work on **{prototype-title}** on branch `{branch}`."
   > "Files are at: `app/prototypes/{username}/{prototype-name}/`"
   > "View it at: `http://localhost:3000/prototypes/{username}/{prototype-name}`"
   > "Remind: Run `pnpm dev` if the dev server isn't already running."
