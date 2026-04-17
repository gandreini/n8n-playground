#!/usr/bin/env bash
# SessionStart hook for n8n Prototype Playground.
# Injects onboarding context based on whether claude.local.md exists.
# Output must be valid JSON on stdout (consumed by Claude Code).
#
# Fails silently to avoid breaking the session — if anything goes wrong
# we just emit an empty additionalContext and let CLAUDE.md advisory
# text take over.

set -u

emit() {
  # $1 = additionalContext string
  jq -n --arg ctx "$1" \
    '{hookSpecificOutput: {hookEventName: "SessionStart", additionalContext: $ctx}}' 2>/dev/null \
    || printf '{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":""}}\n'
}

# Locate claude.local.md. It's gitignored, so in a git worktree it only
# exists in the main repo root — check there as a fallback.
LOCAL_MD="claude.local.md"
if [ ! -f "$LOCAL_MD" ]; then
  COMMON_DIR=$(git rev-parse --git-common-dir 2>/dev/null || echo "")
  if [ -n "$COMMON_DIR" ] && [ -f "$COMMON_DIR/../claude.local.md" ]; then
    LOCAL_MD="$COMMON_DIR/../claude.local.md"
  fi
fi

# ===== PREFLIGHT: required CLI tools =====
# These are needed for normal playground workflows:
#   pnpm → runs the app, `pnpm dev` / `pnpm build` / `pnpm lint`
#   node → pnpm prerequisite
#   git  → version control
#   gh   → opens PRs during `/deploy`
MISSING_TOOLS=""
for tool in pnpm node git gh; do
  command -v "$tool" >/dev/null 2>&1 || MISSING_TOOLS+="$tool "
done
MISSING_TOOLS=$(echo "${MISSING_TOOLS}" | xargs)

PREFLIGHT=""
if [ -n "$MISSING_TOOLS" ]; then
  INSTALL_HINTS=""
  for t in $MISSING_TOOLS; do
    case "$t" in
      pnpm) hint='> - **pnpm** — `npm install -g pnpm`' ;;
      node) hint='> - **node** (v20+) — [nodejs.org](https://nodejs.org/) or `brew install node`' ;;
      git)  hint='> - **git** — [git-scm.com](https://git-scm.com/) or `brew install git`' ;;
      gh)   hint='> - **gh** (GitHub CLI) — `brew install gh` or [cli.github.com](https://cli.github.com/). Needed by `/deploy` to open PRs.' ;;
      *)    hint="" ;;
    esac
    INSTALL_HINTS+="$hint"$'\n'
  done

  PREFLIGHT="

⚠️ PREFLIGHT FAILURE — these required CLI tools are missing on the user's machine: ${MISSING_TOOLS}

BEFORE anything else (even asking for a username, even greeting), your FIRST response must warn the user:

> ⚠️ Before we start, you're missing some required tools:
>
${INSTALL_HINTS}>
> Install them, then say \"ready\" and we'll continue.

Do not proceed with any other work — not onboarding, not prototype creation — until the user confirms the missing tools are installed. When they do, re-check silently (they may have also installed more) and only then continue."
fi

# MCP verification — the bash script can't see which MCPs are connected
# (those are runtime state), so we instruct Claude to check its own tool list.
MCP_CHECK="

SETUP VERIFICATION — Silently check your available tools list for at least ONE browser-automation MCP (needed for the mandatory self-verification rule in CLAUDE.md — screenshotting every UI change). Look for tool names starting with:
- \`mcp__chrome-devtools__\`
- \`mcp__plugin_playwright_playwright__\`
- \`mcp__Claude_in_Chrome__\`

If at least one is available → stay quiet, everything's fine.

If NONE are available → at a natural point in your first reply (after any preflight warning, before inviting them to build), tell the user:

> ⚠️ I don't have a browser-automation MCP connected. I need one to take screenshots of your prototypes (the self-verification rule in CLAUDE.md). Install one of:
> - Playwright MCP
> - Chrome DevTools MCP
> - Claude-in-Chrome MCP
>
> Add it via \`/mcp\` in Claude Code, or through your plugin config. Once installed, restart Claude Code."

# ----- NEW JOINER -----
if [ ! -f "$LOCAL_MD" ]; then
  CTX="NEW_JOINER_DETECTED — the user has no \`claude.local.md\` yet. This is their first time in the n8n Prototype Playground.

YOUR FIRST REPLY MUST FOLLOW THIS FLOW — do not act on whatever the user types first, do not answer unrelated questions until onboarding is complete:

**Step 1 — Ask for their username FIRST (nothing else):**

Send exactly this message:

> 👋 Welcome to the n8n Prototype Playground! I don't have you on file yet — let me set you up.
>
> **What username would you like?** Use your first name or GitHub handle (lowercase, no spaces). This becomes your namespace: \`app/prototypes/{username}/\`.

**Step 2 — Once they reply with a username (call it {name}):**

Create \`claude.local.md\` at the project root with exactly this content:

\`\`\`markdown
# Claude Local Config

username: {name}
prototype-directory: app/prototypes/{name}/
\`\`\`

**Step 3 — Confirm + explain + offer next step:**

Send this message:

> ✅ You're set up as \`{name}\`. Your config is saved locally (gitignored — it's personal to your machine).
>
> **How the playground works:**
>
> **While you build (the 90% case):** you run the app locally with \`pnpm dev\` and open [http://localhost:3000](http://localhost:3000). That's where you see your prototype. Every edit hot-reloads in the browser — fast feedback loop, no deploys needed. You iterate with me here until it's ready.
>
> **When you're ready to share:** run \`/deploy\`. I push your branch and Vercel gives you two things:
>
> 1. **A personal preview URL** — a unique link for your branch. Send it to anyone; they click and try it. Every new push updates the same URL.
> 2. **A spot on the shared gallery** — once the PR is merged to \`main\`, your prototype appears at [v0-n8n-playground.vercel.app](https://v0-n8n-playground.vercel.app) alongside everyone else's.
>
> **Ready to build?** Say \"yes\" (or run \`/create-prototype\`) and I'll scaffold your first one and start the dev server.${PREFLIGHT}${MCP_CHECK}"

  emit "$CTX"
  exit 0
fi

# ----- RETURNING USER -----
USERNAME=$(grep -E '^username:' "$LOCAL_MD" 2>/dev/null | head -1 | sed 's/^username:[[:space:]]*//' | tr -d '\r' | xargs)
BRANCH=$(git branch --show-current 2>/dev/null || echo "")

PROTO_DIR="app/prototypes/${USERNAME}"
PROTOTYPES=""
if [ -n "$USERNAME" ] && [ -d "$PROTO_DIR" ]; then
  PROTOTYPES=$(find "$PROTO_DIR" -mindepth 1 -maxdepth 1 -type d 2>/dev/null \
    | xargs -I{} basename {} \
    | grep -v '^_' \
    | sort \
    | tr '\n' ',' \
    | sed 's/,$//; s/,/, /g')
fi

# Is the current branch a prototype branch for this user? ({username}/{something})
ON_PROTOTYPE_BRANCH=false
CURRENT_PROTOTYPE=""
if [ -n "$USERNAME" ] && [[ "$BRANCH" == "$USERNAME"/* ]]; then
  ON_PROTOTYPE_BRANCH=true
  CURRENT_PROTOTYPE="${BRANCH#$USERNAME/}"
fi

CTX="RETURNING_USER_SESSION — the user is already set up. Context:

- Username: ${USERNAME:-<unknown>}
- Current branch: ${BRANCH:-<none>}
- Existing prototypes: ${PROTOTYPES:-<none yet>}
- On a prototype branch: ${ON_PROTOTYPE_BRANCH}${CURRENT_PROTOTYPE:+ (prototype: $CURRENT_PROTOTYPE)}

YOUR FIRST REPLY MUST greet the user by name and offer a short menu. Do NOT start working on whatever they asked until they pick. Use this shape (adapt the middle option based on whether they have prototypes):

> Hey ${USERNAME:-there}! 👋
>
> What would you like to do?
>
> 1. **Create a new prototype** — I'll run \`/create-prototype\` and scaffold everything on a fresh \`${USERNAME}/{name}\` branch.
> 2. **Work on an existing prototype** — I'll run \`/select-prototype\` to list yours (${PROTOTYPES:-none yet}) and switch to the right branch.$(if [ "$ON_PROTOTYPE_BRANCH" = "true" ]; then echo "
> 3. **Continue on \`${CURRENT_PROTOTYPE}\`** — you're already on this branch; keep iterating."; fi)
>
> Or tell me something specific and I'll skip the menu.

Branch-handling rules when the user picks an option:

- **New prototype** → invoke \`/create-prototype\`. It creates \`${USERNAME}/{prototype-name}\` from \`main\`.
- **Existing prototype** → invoke \`/select-prototype\`. It handles:
  - Branch exists locally → \`git checkout {username}/{prototype-name}\`
  - Branch on remote only → \`git checkout -b {username}/{prototype-name} origin/{username}/{prototype-name}\`
  - Branch missing → create fresh from \`main\`
  - Uncommitted changes blocking checkout → offer \`git stash\` → switch → \`git stash pop\`
- **Continue on current branch** → no git action needed; just proceed.

If the user types something concrete unrelated to the menu (e.g. \"fix the sidebar in n8n-pulse\"), still acknowledge the context briefly but then just help them.${PREFLIGHT}${MCP_CHECK}"

emit "$CTX"
