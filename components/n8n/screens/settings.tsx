'use client'

import { useState } from 'react'
import { User, CreditCard, Users, Key, Shield, Terminal, ExternalLink } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Switch } from '@/components/shadcn/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'

const settingsCategories = [
  { id: 'personal', label: 'Personal Settings', icon: User },
  { id: 'usage', label: 'Usage and plan', icon: CreditCard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'api', label: 'API', icon: Key },
  { id: 'sso', label: 'SSO', icon: Shield },
  { id: 'ldap', label: 'LDAP', icon: Shield },
  { id: 'audit', label: 'Audit logs', icon: Terminal },
  { id: 'external', label: 'External secrets', icon: ExternalLink },
]

export function SettingsScreen() {
  const [activeCategory, setActiveCategory] = useState('personal')
  const [settings, setSettings] = useState({
    firstName: 'Giulio',
    lastName: 'Andreini',
    email: 'giulio@n8n.io',
    theme: 'system',
    notifications: true,
    emailNotifications: false,
    language: 'en',
    timezone: 'Europe/Rome',
  })

  return (
    <div className="n8n-settings">
      {/* Settings sidebar */}
      <div className="settings-sidebar">
        <h2 className="sidebar-title">Settings</h2>
        <nav className="category-nav">
          {settingsCategories.map((category) => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                data-active={activeCategory === category.id ? 'true' : undefined}
                className="category-btn"
              >
                <Icon style={{ width: 16, height: 16 }} />
                {category.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Settings content */}
      <div className="settings-content">
        {activeCategory === 'personal' && (
          <div className="panel">
            <div>
              <h3 className="panel-title">Personal Settings</h3>

              {/* Profile section */}
              <div className="stack lg">
                <div className="avatar-row">
                  <div className="avatar">GA</div>
                  <div>
                    <Button variant="outline" size="sm">
                      Change photo
                    </Button>
                    <p className="hint">JPG, GIF or PNG. Max size 800KB</p>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <Label>First name</Label>
                    <Input
                      value={settings.firstName}
                      onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <Label>Last name</Label>
                    <Input
                      value={settings.lastName}
                      onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="field">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Preferences section */}
            <div className="section">
              <h4 className="section-title">Preferences</h4>

              <div className="stack md">
                <div className="row">
                  <div>
                    <Label>Theme</Label>
                    <p className="hint">Select your preferred theme</p>
                  </div>
                  <Select
                    value={settings.theme}
                    onValueChange={(value) => setSettings({ ...settings, theme: value })}
                  >
                    <SelectTrigger style={{ width: 160 }}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="row">
                  <div>
                    <Label>Language</Label>
                    <p className="hint">Select your preferred language</p>
                  </div>
                  <Select
                    value={settings.language}
                    onValueChange={(value) => setSettings({ ...settings, language: value })}
                  >
                    <SelectTrigger style={{ width: 160 }}>
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

                <div className="row">
                  <div>
                    <Label>Timezone</Label>
                    <p className="hint">Set your local timezone</p>
                  </div>
                  <Select
                    value={settings.timezone}
                    onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                  >
                    <SelectTrigger style={{ width: 160 }}>
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
            <div className="section">
              <h4 className="section-title">Notifications</h4>

              <div className="stack md">
                <div className="row">
                  <div>
                    <Label>Push notifications</Label>
                    <p className="hint">Receive push notifications in your browser</p>
                  </div>
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, notifications: checked })
                    }
                  />
                </div>

                <div className="row">
                  <div>
                    <Label>Email notifications</Label>
                    <p className="hint">Receive email notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="save-row">
              <Button className="save-btn">Save changes</Button>
            </div>
          </div>
        )}

        {activeCategory === 'usage' && (
          <div className="panel">
            <h3 className="panel-title">Usage and Plan</h3>

            <div className="card">
              <div className="card-head">
                <div>
                  <h4 className="card-title">Pro Plan</h4>
                  <p className="card-sub">Your current plan</p>
                </div>
                <Button variant="outline">Manage subscription</Button>
              </div>

              <div className="usage-grid">
                <div>
                  <p className="usage-value">2,259</p>
                  <p className="usage-label">Executions this month</p>
                </div>
                <div>
                  <p className="usage-value">308</p>
                  <p className="usage-label">Active workflows</p>
                </div>
                <div>
                  <p className="usage-value">38h</p>
                  <p className="usage-label">Time saved</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCategory === 'api' && (
          <div className="panel">
            <h3 className="panel-title">API Keys</h3>
            <p className="panel-desc">
              Create and manage API keys to access your n8n instance programmatically.
            </p>

            <Button className="save-btn">Create API key</Button>

            <div className="empty-card">
              <Key style={{ width: 48, height: 48, color: 'var(--muted-foreground)' }} />
              <p className="empty-text">No API keys created yet</p>
            </div>
          </div>
        )}

        {(activeCategory === 'users' ||
          activeCategory === 'sso' ||
          activeCategory === 'ldap' ||
          activeCategory === 'audit' ||
          activeCategory === 'external') && (
          <div className="panel">
            <h3 className="panel-title capitalize">
              {activeCategory === 'sso'
                ? 'SSO'
                : activeCategory === 'ldap'
                  ? 'LDAP'
                  : activeCategory}
            </h3>
            <div className="empty-card">
              <Shield style={{ width: 48, height: 48, color: 'var(--muted-foreground)' }} />
              <p className="empty-text">This feature is available on Enterprise plans.</p>
              <Button variant="outline" className="upgrade-btn">
                Upgrade to Enterprise
              </Button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .n8n-settings {
          display: flex;
          height: 100%;
          background-color: var(--background);
        }

        .settings-sidebar {
          width: 256px;
          border-right: 1px solid var(--border);
          padding: var(--spacing--sm);
        }
        .sidebar-title {
          font-size: var(--font-size--md);
          font-weight: var(--font-weight--bold);
          color: var(--foreground);
          margin-bottom: var(--spacing--sm);
        }
        .category-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--5xs);
        }
        .category-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
          padding: var(--spacing--3xs) var(--spacing--2xs);
          font-size: var(--font-size--sm);
          border: 0;
          background: transparent;
          border-radius: var(--radius--xs);
          color: var(--muted-foreground);
          text-align: left;
          cursor: pointer;
          transition:
            background-color var(--duration--snappy) var(--easing--ease-out),
            color var(--duration--snappy) var(--easing--ease-out);
        }
        .category-btn:hover {
          background-color: var(--muted);
          color: var(--foreground);
        }
        .category-btn[data-active='true'] {
          background-color: color-mix(in srgb, var(--color--orange-500) 10%, transparent);
          color: var(--color--orange-500);
        }

        .settings-content {
          flex: 1;
          padding: var(--spacing--xl);
          overflow-y: auto;
        }
        .panel {
          max-width: 672px;
          display: flex;
          flex-direction: column;
          gap: var(--spacing--xl);
        }
        .panel-title {
          font-size: var(--font-size--xl);
          font-weight: var(--font-weight--bold);
          color: var(--foreground);
          margin-bottom: var(--spacing--lg);
        }
        .panel-desc {
          color: var(--muted-foreground);
        }

        .stack {
          display: flex;
          flex-direction: column;
        }
        .stack.lg {
          gap: var(--spacing--lg);
        }
        .stack.md {
          gap: var(--spacing--sm);
        }

        .avatar-row {
          display: flex;
          align-items: center;
          gap: var(--spacing--lg);
        }
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: color-mix(in srgb, var(--color--orange-500) 20%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size--xl);
          font-weight: var(--font-weight--bold);
          color: var(--color--orange-500);
        }
        .hint {
          font-size: var(--font-size--2xs);
          color: var(--muted-foreground);
          margin-top: var(--spacing--5xs);
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing--xs);
        }
        .field {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--4xs);
        }

        .section {
          padding-top: var(--spacing--lg);
          border-top: 1px solid var(--border);
        }
        .section-title {
          font-weight: var(--font-weight--bold);
          color: var(--foreground);
          margin-bottom: var(--spacing--sm);
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing--sm);
        }

        .save-row {
          padding-top: var(--spacing--lg);
        }
        .save-btn {
          background-color: var(--color--orange-500) !important;
          color: #fff !important;
        }
        .save-btn:hover {
          background-color: var(--color--orange-600) !important;
        }

        .card {
          border: 1px solid var(--border);
          border-radius: var(--radius--xs);
          background-color: var(--card);
          padding: var(--spacing--lg);
        }
        .card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--spacing--sm);
        }
        .card-title {
          font-weight: var(--font-weight--bold);
          color: var(--foreground);
        }
        .card-sub {
          font-size: var(--font-size--sm);
          color: var(--muted-foreground);
        }
        .usage-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing--sm);
          padding-top: var(--spacing--sm);
          border-top: 1px solid var(--border);
        }
        .usage-value {
          font-size: var(--font-size--xl);
          font-weight: var(--font-weight--bold);
          color: var(--foreground);
        }
        .usage-label {
          font-size: var(--font-size--sm);
          color: var(--muted-foreground);
        }

        .empty-card {
          border: 1px solid var(--border);
          border-radius: var(--radius--xs);
          padding: var(--spacing--xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--spacing--sm);
          text-align: center;
        }
        .empty-text {
          color: var(--muted-foreground);
        }
        .upgrade-btn {
          margin-top: var(--spacing--xs);
        }
        .capitalize {
          text-transform: capitalize;
        }
      `}</style>
    </div>
  )
}
