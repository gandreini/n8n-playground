# Deploy

Deploy your prototype to production. This command handles everything — branching, linting, committing, pushing, and creating a pull request.

Communicate every step in plain, friendly English so designers who aren't familiar with git can follow along and learn.

---

## Phase 1: Prerequisites

Check that the required tools are installed and authenticated. If anything is missing, walk the user through setting it up step by step.

### 1.1 Check git
Run `git --version`. If not found, tell the user:
> "Git isn't installed on your computer. You can install it from https://git-scm.com/downloads or by running `xcode-select --install` on macOS."

### 1.2 Check GitHub CLI
Run `gh --version`. If not found, tell the user:
> "The GitHub CLI isn't installed. You can install it with `brew install gh` (macOS) or from https://cli.github.com/"

### 1.3 Check GitHub authentication
Run `gh auth status`. If not authenticated, tell the user:
> "You're not logged into GitHub. Run this command and follow the prompts:"
> ```
> gh auth login
> ```

If all prerequisites pass, tell the user:
> "All good — git and GitHub CLI are ready. Let's deploy your prototype."

---

## Phase 2: Deploy Pipeline

### 2.1 Check branch
Run `git branch --show-current`.

If on `main`:
> "You're on the main branch — I'll create a feature branch so your changes stay separate from everyone else's work."

Create a branch named `{username}/{prototype-name}` based on what files changed. If you can't determine the prototype name from the changes, use a descriptive name like `{username}/prototype-updates`.

```bash
git checkout -b {branch-name}
```

If already on a feature branch:
> "You're already on branch `{branch}` — I'll use this one."

### 2.2 Lint
> "Checking for code errors before we share this..."

Run `pnpm lint`. If there are errors:
> "Found some lint errors — fixing them now."

Fix the errors automatically, then run lint again to confirm they're resolved.

### 2.3 Stage and commit
> "Saving your changes with a description..."

Stage only the files that changed (don't use `git add .`). Create a commit with an emoji-prefixed message following the project convention:
- ✨ New feature/prototype
- 🐛 Bug fix
- ♻️ Refactor
- 📝 Documentation

### 2.4 Push
> "Uploading your branch to GitHub..."

```bash
git push -u origin {branch-name}
```

### 2.5 Create PR
> "Creating a pull request so the team can see your work..."

```bash
gh pr create --fill
```

### 2.6 Open in browser
> "Opening the pull request in your browser — this is where your work lives on GitHub."

```bash
gh pr view --web
```

### 2.7 Monitor CI
> "Now I'll keep an eye on the automated checks. If anything fails, I'll try to fix it."

Poll CI status every 60 seconds using `gh pr checks`. If a check fails:
1. Read the error details
2. Try to fix the issue automatically
3. Stage, commit, and push the fix
4. Continue monitoring

Keep looping until all checks pass, or stop after 3 iterations with no progress.

When all checks pass:
> "All checks passed! Let me grab your preview link..."

### 2.8 Get Vercel preview URL
> "Every branch you push gets its own live preview on Vercel — this is a real URL anyone can visit."

Get the preview URL from the PR's deployment status:
```bash
gh api repos/{owner}/{repo}/pulls/{pr-number} --jq '.head.sha' | xargs -I{} gh api repos/{owner}/{repo}/deployments --jq '[.[] | select(.sha == "{}") | select(.environment == "Preview")] | first | .statuses_url' | xargs -I{} gh api {} --jq '.[0].target_url'
```

If the URL isn't available yet (deployment still in progress), wait 30 seconds and try again. Try up to 3 times.

Once you have the URL, tell the user:
> "Your prototype is live! Here's your preview link:"
> `{preview-url}`
>
> "⚠️ **Heads up — this link is public.** Anyone with the URL can see your prototype, so keep that in mind if it contains anything sensitive or unfinished."
>
> "Share this link with your team for feedback. It'll update automatically every time you push to this branch."

If the URL can't be retrieved after 3 attempts:
> "The preview is still building. Check your PR on GitHub — the Vercel bot will post the link there once it's ready."

---

## Important notes

- Never push directly to `main`
- Preview URLs are **public** — remind the user every time
- If something goes wrong, explain what happened in plain language
- If you can't fix a CI failure after 3 attempts, explain the issue and suggest next steps
