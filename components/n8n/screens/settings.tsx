"use client"

import { useState } from "react"
import { User, CreditCard, Users, Key, Shield, Bell, Globe, Palette, Terminal, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const settingsCategories = [
  { id: "personal", label: "Personal Settings", icon: User },
  { id: "usage", label: "Usage and plan", icon: CreditCard },
  { id: "users", label: "Users", icon: Users },
  { id: "api", label: "API", icon: Key },
  { id: "sso", label: "SSO", icon: Shield },
  { id: "ldap", label: "LDAP", icon: Shield },
  { id: "audit", label: "Audit logs", icon: Terminal },
  { id: "external", label: "External secrets", icon: ExternalLink },
]

export function SettingsScreen() {
  const [activeCategory, setActiveCategory] = useState("personal")
  const [settings, setSettings] = useState({
    firstName: "Giulio",
    lastName: "Andreini",
    email: "giulio@n8n.io",
    theme: "system",
    notifications: true,
    emailNotifications: false,
    language: "en",
    timezone: "Europe/Rome"
  })

  return (
    <div className="n8n-settings flex h-full bg-background">
      {/* Settings sidebar */}
      <div className="w-64 border-r border-border p-4">
        <h2 className="text-lg font-semibold text-foreground mb-4">Settings</h2>
        <nav className="space-y-1">
          {settingsCategories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  activeCategory === category.id
                    ? "bg-n8n-primary/10 text-n8n-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {category.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {activeCategory === "personal" && (
          <div className="max-w-2xl space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-6">Personal Settings</h3>
              
              {/* Profile section */}
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-n8n-primary/20 flex items-center justify-center text-2xl font-semibold text-n8n-primary">
                    GA
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change photo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, GIF or PNG. Max size 800KB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First name</Label>
                    <Input 
                      value={settings.firstName}
                      onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last name</Label>
                    <Input 
                      value={settings.lastName}
                      onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Preferences section */}
            <div className="pt-6 border-t border-border">
              <h4 className="font-medium text-foreground mb-4">Preferences</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Theme</Label>
                    <p className="text-xs text-muted-foreground">Select your preferred theme</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({...settings, theme: value})}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Language</Label>
                    <p className="text-xs text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Timezone</Label>
                    <p className="text-xs text-muted-foreground">Set your local timezone</p>
                  </div>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Rome">Europe/Rome</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New York</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los Angeles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Notifications section */}
            <div className="pt-6 border-t border-border">
              <h4 className="font-medium text-foreground mb-4">Notifications</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive push notifications in your browser</p>
                  </div>
                  <Switch 
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email notifications</Label>
                    <p className="text-xs text-muted-foreground">Receive email notifications for important events</p>
                  </div>
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="pt-6">
              <Button className="bg-n8n-primary hover:bg-n8n-primary/90 text-white">
                Save changes
              </Button>
            </div>
          </div>
        )}

        {activeCategory === "usage" && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-semibold text-foreground">Usage and Plan</h3>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-medium text-foreground">Pro Plan</h4>
                  <p className="text-sm text-muted-foreground">Your current plan</p>
                </div>
                <Button variant="outline">Manage subscription</Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-2xl font-semibold text-foreground">2,259</p>
                  <p className="text-sm text-muted-foreground">Executions this month</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">308</p>
                  <p className="text-sm text-muted-foreground">Active workflows</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">38h</p>
                  <p className="text-sm text-muted-foreground">Time saved</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === "api" && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-semibold text-foreground">API Keys</h3>
            <p className="text-muted-foreground">
              Create and manage API keys to access your n8n instance programmatically.
            </p>
            
            <Button className="bg-n8n-primary hover:bg-n8n-primary/90 text-white">
              Create API key
            </Button>

            <div className="border border-border rounded-lg p-8 text-center">
              <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No API keys created yet</p>
            </div>
          </div>
        )}

        {(activeCategory === "users" || activeCategory === "sso" || activeCategory === "ldap" || activeCategory === "audit" || activeCategory === "external") && (
          <div className="max-w-2xl space-y-6">
            <h3 className="text-xl font-semibold text-foreground capitalize">{activeCategory === "sso" ? "SSO" : activeCategory === "ldap" ? "LDAP" : activeCategory}</h3>
            <div className="border border-border rounded-lg p-8 text-center">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">This feature is available on Enterprise plans.</p>
              <Button variant="outline" className="mt-4">
                Upgrade to Enterprise
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
