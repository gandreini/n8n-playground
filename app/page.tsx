import type { Metadata } from "next"
import { scanPrototypes, scanTemplates, scanComponents } from "@/lib/prototypes"
import { Homepage } from "@/components/playground/homepage"

export const metadata: Metadata = {
  title: "n8n Playground",
  description: "Shared prototyping playground for the n8n design team",
}

export default async function PlaygroundPage() {
  const [prototypes, templates, components] = await Promise.all([
    scanPrototypes(),
    scanTemplates(),
    scanComponents(),
  ])

  const isDev = process.env.NODE_ENV === "development"

  return (
    <Homepage
      prototypes={prototypes}
      templates={templates}
      components={components}
      isDev={isDev}
    />
  )
}
