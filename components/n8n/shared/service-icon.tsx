'use client'

import { cn } from '@/lib/utils'
import {
  Clock,
  GitBranch,
  Code,
  Webhook,
  Zap,
  Bot,
  Globe
} from 'lucide-react'

interface ServiceIconProps {
  service: string
  size?: number
  className?: string
  tinted?: boolean
}

// Wrapper style shared by all icon-in-tinted-square variants
function tintedStyle(size: number, background: string): React.CSSProperties {
  return {
    width: size,
    height: size,
    backgroundColor: background,
    borderRadius: 'var(--radius--xs)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }
}

export function ServiceIcon({ service, size = 24, className, tinted = true }: ServiceIconProps) {
  const svgStyle: React.CSSProperties = { flexShrink: 0 }

  // Google Calendar icon (colorful calendar)
  if (service === 'google-calendar') {
    return (
      <svg className={cn('n8n-service-icon', className)} style={svgStyle} width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="4" y="8" width="32" height="28" rx="3" fill="#FFFFFF" stroke="#4285F4" strokeWidth="2"/>
        <rect x="4" y="8" width="32" height="8" fill="#4285F4"/>
        <rect x="8" y="4" width="4" height="8" rx="2" fill="#4285F4"/>
        <rect x="28" y="4" width="4" height="8" rx="2" fill="#4285F4"/>
        <text x="20" y="30" fontSize="14" fontWeight="600" fill="#1A73E8" textAnchor="middle">31</text>
      </svg>
    )
  }

  // Gmail icon
  if (service === 'gmail') {
    return (
      <svg className={cn('n8n-service-icon', className)} style={svgStyle} width={size} height={size} viewBox="0 0 40 40" fill="none">
        <rect x="4" y="8" width="32" height="24" rx="2" fill="#FFFFFF"/>
        <path d="M4 10L20 22L36 10" stroke="#EA4335" strokeWidth="2" fill="none"/>
        <path d="M4 8V32H36V8L20 20L4 8Z" fill="#EA4335" fillOpacity="0.1"/>
        <rect x="4" y="8" width="32" height="24" rx="2" stroke="#EA4335" strokeWidth="2" fill="none"/>
      </svg>
    )
  }

  // Slack icon
  if (service === 'slack') {
    return (
      <svg className={cn('n8n-service-icon', className)} style={svgStyle} width={size} height={size} viewBox="0 0 40 40" fill="none">
        <path d="M15 8C13.3431 8 12 9.34315 12 11C12 12.6569 13.3431 14 15 14H18V11C18 9.34315 16.6569 8 15 8Z" fill="#E01E5A"/>
        <path d="M8 15C8 13.3431 9.34315 12 11 12C12.6569 12 14 13.3431 14 15V18H11C9.34315 18 8 16.6569 8 15Z" fill="#36C5F0"/>
        <path d="M25 32C26.6569 32 28 30.6569 28 29C28 27.3431 26.6569 26 25 26H22V29C22 30.6569 23.3431 32 25 32Z" fill="#2EB67D"/>
        <path d="M32 25C32 26.6569 30.6569 28 29 28C27.3431 28 26 26.6569 26 25V22H29C30.6569 22 32 23.3431 32 25Z" fill="#ECB22E"/>
        <rect x="18" y="12" width="4" height="10" fill="#36C5F0"/>
        <rect x="12" y="18" width="10" height="4" fill="#E01E5A"/>
        <rect x="18" y="18" width="4" height="10" fill="#2EB67D"/>
        <rect x="18" y="18" width="10" height="4" fill="#ECB22E"/>
      </svg>
    )
  }

  // Spotify icon
  if (service === 'spotify') {
    return (
      <svg className={cn('n8n-service-icon', className)} style={svgStyle} width={size} height={size} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" fill="#1DB954"/>
        <path d="M27 16C22.5 13.5 15 14 12 15" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M26 21C22 19 16 19.5 13 20.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 26C21.5 24.5 17 24.5 14 25.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }

  // Clock/Schedule icon
  if (service === 'clock') {
    if (!tinted) {
      return (
        <Clock
          className={cn('n8n-service-icon', className)}
          size={size}
          style={{ color: 'var(--color--green-600)', flexShrink: 0 }}
        />
      )
    }
    return (
      <div className={cn('n8n-service-icon', className)} style={tintedStyle(size, 'var(--color--green-100)')}>
        <Clock size={size * 0.6} style={{ color: 'var(--color--green-600)' }} />
      </div>
    )
  }

  // Switch/Router icon
  if (service === 'switch') {
    if (!tinted) {
      return (
        <GitBranch
          className={cn('n8n-service-icon', className)}
          size={size}
          style={{ color: 'var(--color--blue-600)', flexShrink: 0 }}
        />
      )
    }
    return (
      <div className={cn('n8n-service-icon', className)} style={tintedStyle(size, 'var(--color--blue-100)')}>
        <GitBranch size={size * 0.6} style={{ color: 'var(--color--blue-600)' }} />
      </div>
    )
  }

  // Code icon
  if (service === 'code') {
    if (!tinted) {
      return (
        <Code
          className={cn('n8n-service-icon', className)}
          size={size}
          style={{ color: 'var(--color--purple-600)', flexShrink: 0 }}
        />
      )
    }
    return (
      <div className={cn('n8n-service-icon', className)} style={tintedStyle(size, 'var(--color--purple-100)')}>
        <Code size={size * 0.6} style={{ color: 'var(--color--purple-600)' }} />
      </div>
    )
  }

  // Webhook icon
  if (service === 'webhook') {
    if (!tinted) {
      return (
        <Webhook
          className={cn('n8n-service-icon', className)}
          size={size}
          style={{ color: 'var(--color--orange-600)', flexShrink: 0 }}
        />
      )
    }
    return (
      <div className={cn('n8n-service-icon', className)} style={tintedStyle(size, 'var(--color--orange-100)')}>
        <Webhook size={size * 0.6} style={{ color: 'var(--color--orange-600)' }} />
      </div>
    )
  }

  // HTTP Request icon
  if (service === 'http') {
    if (!tinted) {
      return (
        <Globe
          className={cn('n8n-service-icon', className)}
          size={size}
          style={{ color: 'var(--color--purple-600)', flexShrink: 0 }}
        />
      )
    }
    return (
      <div className={cn('n8n-service-icon', className)} style={tintedStyle(size, 'var(--color--purple-100)')}>
        <Globe size={size * 0.6} style={{ color: 'var(--color--purple-600)' }} />
      </div>
    )
  }

  // AI/Bot icon
  if (service === 'openai' || service === 'anthropic' || service === 'ai') {
    if (!tinted) {
      return (
        <Bot
          className={cn('n8n-service-icon', className)}
          size={size}
          style={{ color: 'var(--color--green-600)', flexShrink: 0 }}
        />
      )
    }
    return (
      <div className={cn('n8n-service-icon', className)} style={tintedStyle(size, 'var(--color--green-100)')}>
        <Bot size={size * 0.6} style={{ color: 'var(--color--green-600)' }} />
      </div>
    )
  }

  // Default fallback
  if (!tinted) {
    return (
      <Zap
        className={cn('n8n-service-icon', className)}
        size={size}
        style={{ color: 'var(--color--neutral-500)', flexShrink: 0 }}
      />
    )
  }
  return (
    <div className={cn('n8n-service-icon', className)} style={tintedStyle(size, 'var(--color--neutral-100)')}>
      <Zap size={size * 0.6} style={{ color: 'var(--color--neutral-500)' }} />
    </div>
  )
}
