'use client'

import { useState } from 'react'
import { X, Trash2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { ServiceIcon } from '../shared/service-icon'
import { useStore, type Credential } from '@/lib/store'

interface CredentialModalProps {
  credential: Credential
  onClose: () => void
}

export function CredentialModal({ credential, onClose }: CredentialModalProps) {
  const { updateCredential, deleteCredential } = useStore()
  const [activeTab, setActiveTab] = useState('connection')
  const [formData, setFormData] = useState({
    name: credential.name,
    clientId: '498586711441-2g8u7bniqe694ng8rk12lhlao9aj7dpi.apps.googleusercontent.com',
    clientSecret: '••••••••••••••••••••••••••••••••••••••••••••••••••',
    allowedDomains: 'All',
  })

  const handleSave = () => {
    updateCredential(credential.id, { name: formData.name })
    onClose()
  }

  const handleDelete = () => {
    deleteCredential(credential.id)
    onClose()
  }

  return (
    <div className="n8n-credential-modal">
      <div className="dialog">
        {/* Header */}
        <div className="head">
          <div className="head-left">
            <ServiceIcon service={credential.service} size={32} />
            <div>
              <h2 className="title">{credential.name}</h2>
              <p className="sub">{credential.apiType}</p>
            </div>
          </div>
          <div className="head-actions">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="icon-btn danger"
            >
              <Trash2 style={{ width: 16, height: 16 }} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="icon-btn">
              <X style={{ width: 16, height: 16 }} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="body">
          {/* Sidebar tabs */}
          <div className="tabs-side">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              orientation="vertical"
              style={{ width: '100%' }}
            >
              <TabsList className="vtabs-list">
                <TabsTrigger value="connection" className="vtab">
                  Connection
                </TabsTrigger>
                <TabsTrigger value="sharing" className="vtab">
                  Sharing
                </TabsTrigger>
                <TabsTrigger value="details" className="vtab">
                  Details
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content area */}
          <div className="body-main">
            {activeTab === 'connection' && (
              <div className="stack">
                {/* Help banner */}
                <div className="help-banner">
                  <p>
                    Need help filling out these fields?{' '}
                    <a href="#" className="link">
                      Read our docs
                    </a>
                  </p>
                </div>

                {/* Account connected status */}
                <div className="connected-card">
                  <div className="connected-ok">
                    <CheckCircle style={{ width: 20, height: 20 }} />
                    <span>Account connected</span>
                  </div>
                  <div className="reconnect">
                    <span className="reconnect-label">Reconnect:</span>
                    <Button variant="outline" className="google-btn">
                      <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Sign in with Google
                    </Button>
                  </div>
                </div>

                {/* OAuth Redirect URL */}
                <div className="field">
                  <Label className="field-label">OAuth Redirect URL</Label>
                  <Input
                    value="https://oauth.n8n.cloud/oauth2/callback"
                    readOnly
                    className="muted-input"
                  />
                  <p className="hint">
                    In Google Calendar, use the URL above when prompted to enter an OAuth callback
                    or redirect URL
                  </p>
                </div>

                {/* Client ID */}
                <div className="field">
                  <Label className="field-label">
                    Client ID <span className="required">*</span>
                  </Label>
                  <Input
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  />
                </div>

                {/* Client Secret */}
                <div className="field">
                  <Label className="field-label">
                    Client Secret <span className="required">*</span>
                  </Label>
                  <Input
                    type="password"
                    value={formData.clientSecret}
                    onChange={(e) => setFormData({ ...formData, clientSecret: e.target.value })}
                  />
                </div>

                {/* Allowed HTTP Request Domains */}
                <div className="field">
                  <Label className="field-label">Allowed HTTP Request Domains</Label>
                  <Select
                    value={formData.allowedDomains}
                    onValueChange={(value) =>
                      setFormData({ ...formData, allowedDomains: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Specific">Specific domains only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enterprise notice */}
                <div className="enterprise-note">
                  <span className="info-mark">ⓘ</span>
                  <span>
                    Enterprise plan users can pull in credentials from external vaults.{' '}
                    <a href="#" className="link">
                      More info
                    </a>
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'sharing' && (
              <div className="stack md">
                <h3 className="section-title">Sharing Settings</h3>
                <p className="muted">
                  Control who can access this credential in your workspace.
                </p>
                <div className="plain-card">
                  <p className="muted">
                    This credential is currently private and only visible to you.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="stack md">
                <div className="details-grid">
                  <div>
                    <Label className="tiny-label">Created</Label>
                    <p className="detail-value">{credential.created}</p>
                  </div>
                  <div>
                    <Label className="tiny-label">Last Updated</Label>
                    <p className="detail-value">{credential.lastUpdated}</p>
                  </div>
                  <div>
                    <Label className="tiny-label">Type</Label>
                    <p className="detail-value">{credential.apiType}</p>
                  </div>
                  <div>
                    <Label className="tiny-label">Owner</Label>
                    <p className="detail-value">Personal</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="foot">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="save-btn">
            Save
          </Button>
        </div>
      </div>

      <style jsx>{`
        .n8n-credential-modal {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        .dialog {
          background-color: var(--background);
          border-radius: var(--radius--md);
          box-shadow:
            0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 8px 10px -6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 672px;
          max-height: 90vh;
          overflow: hidden;
        }

        .head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing--sm);
          border-bottom: 1px solid var(--border);
        }
        .head-left {
          display: flex;
          align-items: center;
          gap: var(--spacing--3xs);
        }
        .title {
          font-weight: var(--font-weight--bold);
          color: var(--foreground);
        }
        .sub {
          font-size: var(--font-size--sm);
          color: var(--muted-foreground);
        }
        .head-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing--4xs);
        }
        .head-actions :global(.icon-btn) {
          color: var(--muted-foreground) !important;
        }
        .head-actions :global(.icon-btn.danger:hover) {
          color: var(--destructive) !important;
        }

        .body {
          display: flex;
        }
        .tabs-side {
          width: 192px;
          border-right: 1px solid var(--border);
          padding: var(--spacing--4xs);
        }
        .tabs-side :global(.vtabs-list) {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: auto;
          background-color: transparent;
          gap: var(--spacing--5xs);
        }
        .tabs-side :global(.vtab) {
          width: 100%;
          justify-content: flex-start;
          padding: var(--spacing--3xs) var(--spacing--2xs);
        }
        .tabs-side :global(.vtab[data-state='active']) {
          background-color: var(--muted);
          color: var(--color--orange-500);
        }

        .body-main {
          flex: 1;
          padding: var(--spacing--lg);
          overflow-y: auto;
          max-height: calc(90vh - 140px);
        }

        .stack {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--lg);
        }
        .stack.md {
          gap: var(--spacing--sm);
        }

        .help-banner {
          background-color: color-mix(in srgb, var(--destructive) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--destructive) 25%, transparent);
          border-radius: var(--radius--xs);
          padding: var(--spacing--sm);
        }
        .help-banner p {
          font-size: var(--font-size--sm);
          color: var(--destructive);
        }
        .link {
          color: var(--color--orange-500);
        }
        .link:hover {
          text-decoration: underline;
        }

        .connected-card {
          border: 1px solid var(--border);
          border-radius: var(--radius--xs);
          padding: var(--spacing--sm);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .connected-ok {
          display: flex;
          align-items: center;
          gap: var(--spacing--4xs);
          color: var(--color--green-600);
        }
        .connected-ok span {
          font-size: var(--font-size--sm);
          font-weight: var(--font-weight--medium);
        }
        .reconnect {
          display: flex;
          align-items: center;
          gap: var(--spacing--4xs);
        }
        .reconnect-label {
          font-size: var(--font-size--sm);
          color: var(--muted-foreground);
        }
        .reconnect :global(.google-btn) {
          gap: var(--spacing--4xs);
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: var(--spacing--4xs);
        }
        .field :global(.field-label) {
          color: var(--foreground);
        }
        .required {
          color: var(--destructive);
        }
        .field :global(.muted-input) {
          background-color: var(--muted) !important;
        }
        .hint {
          font-size: var(--font-size--2xs);
          color: var(--muted-foreground);
        }

        .enterprise-note {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing--4xs);
          font-size: var(--font-size--sm);
          color: var(--muted-foreground);
        }
        .info-mark {
          margin-top: 2px;
        }

        .section-title {
          font-weight: var(--font-weight--medium);
          color: var(--foreground);
        }
        .muted {
          font-size: var(--font-size--sm);
          color: var(--muted-foreground);
        }
        .plain-card {
          border: 1px solid var(--border);
          border-radius: var(--radius--xs);
          padding: var(--spacing--sm);
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing--sm);
        }
        .details-grid :global(.tiny-label) {
          color: var(--muted-foreground);
          font-size: var(--font-size--2xs);
        }
        .detail-value {
          font-size: var(--font-size--sm);
          color: var(--foreground);
        }

        .foot {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--spacing--3xs);
          padding: var(--spacing--sm);
          border-top: 1px solid var(--border);
        }
        .foot :global(.save-btn) {
          background-color: var(--color--orange-500) !important;
          color: #fff !important;
        }
        .foot :global(.save-btn:hover) {
          background-color: var(--color--orange-600) !important;
        }
      `}</style>
    </div>
  )
}
