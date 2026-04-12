import fs from "fs"
import path from "path"

// --- Types ---

export interface PrototypeMetadata {
  title: string
  description: string
  author: string
  date: string // YYYY-MM-DD
  externalUrl: string | null
  featured: boolean
  template: boolean
}

export interface PrototypeEntry extends PrototypeMetadata {
  slug: string // "{username}/{prototype-name}"
  path: string // "/prototypes/{username}/{prototype-name}"
  hasPage: boolean // false for external-only prototypes
}

export interface ComponentEntry {
  name: string
  path: string // repo-relative, e.g. "components/n8n/sidebar.tsx"
  category: "n8n" | "ui"
}

// --- Scanning ---

export async function scanPrototypes(): Promise<PrototypeEntry[]> {
  const prototypesDir = path.join(process.cwd(), "app/prototypes")
  const entries: PrototypeEntry[] = []

  let userDirs: string[]
  try {
    userDirs = fs.readdirSync(prototypesDir)
  } catch {
    return entries
  }

  for (const userDir of userDirs) {
    // Skip _templates and hidden dirs
    if (userDir.startsWith("_") || userDir.startsWith(".")) continue

    const userPath = path.join(prototypesDir, userDir)
    if (!fs.statSync(userPath).isDirectory()) continue

    let protoDirs: string[]
    try {
      protoDirs = fs.readdirSync(userPath)
    } catch {
      continue
    }

    for (const protoDir of protoDirs) {
      if (protoDir.startsWith(".")) continue

      const protoPath = path.join(userPath, protoDir)
      if (!fs.statSync(protoPath).isDirectory()) continue

      const metadataPath = path.join(protoPath, "metadata.json")
      if (!fs.existsSync(metadataPath)) continue

      try {
        const raw = fs.readFileSync(metadataPath, "utf-8")
        const metadata: PrototypeMetadata = JSON.parse(raw)
        const hasPage = fs.existsSync(path.join(protoPath, "page.tsx"))
        const slug = `${userDir}/${protoDir}`

        entries.push({
          ...metadata,
          slug,
          path: `/prototypes/${slug}`,
          hasPage,
        })
      } catch (e) {
        console.warn(`Skipping malformed metadata: ${metadataPath}`, e)
      }
    }
  }

  // Sort by date descending
  entries.sort((a, b) => (b.date || "").localeCompare(a.date || ""))
  return entries
}

export async function scanTemplates(): Promise<PrototypeEntry[]> {
  const templatesDir = path.join(process.cwd(), "app/prototypes/_templates")
  const entries: PrototypeEntry[] = []

  let dirs: string[]
  try {
    dirs = fs.readdirSync(templatesDir)
  } catch {
    return entries
  }

  for (const dir of dirs) {
    if (dir.startsWith(".")) continue

    const templatePath = path.join(templatesDir, dir)
    if (!fs.statSync(templatePath).isDirectory()) continue

    const metadataPath = path.join(templatePath, "metadata.json")
    if (!fs.existsSync(metadataPath)) continue

    try {
      const raw = fs.readFileSync(metadataPath, "utf-8")
      const metadata: PrototypeMetadata = JSON.parse(raw)
      const hasPage = fs.existsSync(path.join(templatePath, "page.tsx"))

      entries.push({
        ...metadata,
        slug: `_templates/${dir}`,
        path: `/prototypes/_templates/${dir}`,
        hasPage,
      })
    } catch (e) {
      console.warn(`Skipping malformed template metadata: ${metadataPath}`, e)
    }
  }

  return entries
}

export async function scanComponents(): Promise<ComponentEntry[]> {
  const entries: ComponentEntry[] = []

  const scanDir = (dirPath: string, category: "n8n" | "ui") => {
    let items: string[]
    try {
      items = fs.readdirSync(dirPath)
    } catch {
      return
    }

    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        scanDir(fullPath, category)
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        const repoRelative = path.relative(process.cwd(), fullPath)
        // Derive display name from filename: kebab-case → Title Case
        const baseName = item.replace(/\.(tsx|ts)$/, "")
        const displayName = baseName
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")

        entries.push({
          name: displayName,
          path: repoRelative,
          category,
        })
      }
    }
  }

  scanDir(path.join(process.cwd(), "components/n8n"), "n8n")
  scanDir(path.join(process.cwd(), "components/ui"), "ui")

  return entries
}

// --- Creation ---

export async function createPrototype(params: {
  name: string
  description: string
  username: string
  template?: string
  externalUrl?: string
}): Promise<{ path: string; slug: string }> {
  const { name, description, username, template, externalUrl } = params

  // Derive slug from name: lowercase, replace spaces/special chars with hyphens
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

  const dirPath = path.join(process.cwd(), "app/prototypes", username, slug)

  if (fs.existsSync(dirPath)) {
    throw new Error(`Prototype already exists: ${username}/${slug}`)
  }

  fs.mkdirSync(dirPath, { recursive: true })

  // Write metadata
  const today = new Date().toISOString().split("T")[0]
  const metadata: PrototypeMetadata = {
    title: name,
    description,
    author: username,
    date: today,
    externalUrl: externalUrl || null,
    featured: false,
    template: false,
  }
  fs.writeFileSync(
    path.join(dirPath, "metadata.json"),
    JSON.stringify(metadata, null, 2) + "\n"
  )

  // Skip page.tsx for external-only prototypes
  if (!externalUrl) {
    // Copy template page.tsx or use blank
    const templateName = template || "blank"
    const templatePagePath = path.join(
      process.cwd(),
      "app/prototypes/_templates",
      templateName,
      "page.tsx"
    )

    if (fs.existsSync(templatePagePath)) {
      const content = fs.readFileSync(templatePagePath, "utf-8")
      fs.writeFileSync(path.join(dirPath, "page.tsx"), content)
    } else {
      // Fallback if template doesn't exist
      const fallback = `export default function Prototype() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-foreground">${name}</h1>
      <p className="text-muted-foreground mt-2">${description}</p>
    </div>
  )
}
`
      fs.writeFileSync(path.join(dirPath, "page.tsx"), fallback)
    }
  }

  return {
    path: `/prototypes/${username}/${slug}`,
    slug: `${username}/${slug}`,
  }
}
