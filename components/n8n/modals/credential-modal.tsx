"use client"

import { useState } from "react"
import { X, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ServiceIcon } from "../shared/service-icon"
import { useStore, type Credential } from "@/lib/store"

interface CredentialModalProps {
  credential: Credential
  onClose: () => void
}

export function CredentialModal({ credential, onClose }: CredentialModalProps) {
  const { updateCredential, deleteCredential } = useStore()
  const [activeTab, setActiveTab] = useState("connection")
  const [formData, setFormData] = useState({
    name: credential.name,
    clientId: "498586711441-2g8u7bniqe694ng8rk12lhlao9aj7dpi.apps.googleusercontent.com",
    clientSecret: "••••••••••••••••••••••••••••••••••••••••••••••••••",
    allowedDomains: "All"
  })
  const [isConnected, setIsConnected] = useState(true)

  const handleSave = () => {
    updateCredential(credential.id, { name: formData.name })
    onClose()
  }

  const handleDelete = () => {
    deleteCredential(credential.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <ServiceIcon service={credential.service} size={32} />
            <div>
              <h2 className="font-semibold text-foreground">{credential.name}</h2>
              <p className="text-sm text-muted-foreground">{credential.apiType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex">
          {/* Sidebar tabs */}
          <div className="w-48 border-r border-border p-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="flex flex-col w-full h-auto bg-transparent gap-1">
                <TabsTrigger 
                  value="connection" 
                  className="w-full justify-start px-3 py-2 data-[state=active]:bg-muted data-[state=active]:text-n8n-primary"
                >
                  Connection
                </TabsTrigger>
                <TabsTrigger 
                  value="sharing" 
                  className="w-full justify-start px-3 py-2 data-[state=active]:bg-muted data-[state=active]:text-n8n-primary"
                >
                  Sharing
                </TabsTrigger>
                <TabsTrigger 
                  value="details" 
                  className="w-full justify-start px-3 py-2 data-[state=active]:bg-muted data-[state=active]:text-n8n-primary"
                >
                  Details
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content area */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {activeTab === "connection" && (
              <div className="space-y-6">
                {/* Help banner */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">
                    Need help filling out these fields?{" "}
                    <a href="#" className="text-n8n-primary hover:underline">Read our docs</a>
                  </p>
                </div>

                {/* Account connected status */}
                <div className="border border-border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Account connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Reconnect:</span>
                    <Button variant="outline" className="gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Sign in with Google
                    </Button>
                  </div>
                </div>

                {/* OAuth Redirect URL */}
                <div className="space-y-2">
                  <Label className="text-foreground">OAuth Redirect URL</Label>
                  <Input 
                    value="https://oauth.n8n.cloud/oauth2/callback" 
                    readOnly 
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    In Google Calendar, use the URL above when prompted to enter an OAuth callback or redirect URL
                  </p>
                </div>

                {/* Client ID */}
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Client ID <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    value={formData.clientId}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                  />
                </div>

                {/* Client Secret */}
                <div className="space-y-2">
                  <Label className="text-foreground">
                    Client Secret <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    type="password"
                    value={formData.clientSecret}
                    onChange={(e) => setFormData({...formData, clientSecret: e.target.value})}
                  />
                </div>

                {/* Allowed HTTP Request Domains */}
                <div className="space-y-2">
                  <Label className="text-foreground">Allowed HTTP Request Domains</Label>
                  <Select value={formData.allowedDomains} onValueChange={(value) => setFormData({...formData, allowedDomains: value})}>
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
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-0.5">ⓘ</span>
                  <span>
                    Enterprise plan users can pull in credentials from external vaults.{" "}
                    <a href="#" className="text-n8n-primary hover:underline">More info</a>
                  </span>
                </div>
              </div>
            )}

            {activeTab === "sharing" && (
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Sharing Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can access this credential in your workspace.
                </p>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    This credential is currently private and only visible to you.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Created</Label>
                    <p className="text-sm text-foreground">{credential.created}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Last Updated</Label>
                    <p className="text-sm text-foreground">{credential.lastUpdated}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Type</Label>
                    <p className="text-sm text-foreground">{credential.apiType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Owner</Label>
                    <p className="text-sm text-foreground">Personal</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-n8n-primary hover:bg-n8n-primary/90 text-white">
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}
