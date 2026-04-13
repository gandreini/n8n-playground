'use client'

import { cn } from '@/lib/utils'
import {
  Clock,
  GitBranch,
  Mail,
  Calendar,
  MessageSquare,
  Code,
  Webhook,
  Zap,
  Bot,
  FileText,
  Database,
  Globe,
  Music,
  Hash
} from 'lucide-react'

const serviceColors: Record<string, string> = {
  'google-calendar': '#4285F4',
  'gmail': '#EA4335',
  'slack': '#4A154B',
  'spotify': '#1DB954',
  'github': '#333',
  'notion': '#000',
  'discord': '#5865F2',
  'telegram': '#26A5E4',
  'openai': '#10A37F',
  'anthropic': '#CC785C',
  'clock': '#22C55E',
  'switch': '#3B82F6',
  'code': '#6366F1',
  'webhook': '#F97316',
  'http': '#8B5CF6'
}

interface ServiceIconProps {
  service: string
  size?: number
  className?: string
}

export function ServiceIcon({ service, size = 24, className }: ServiceIconProps) {
  const color = serviceColors[service] || '#6B7280'
  
  const iconProps = {
    width: size,
    height: size,
    className: cn('n8n-service-icon flex-shrink-0', className)
  }
  
  // Google Calendar icon (colorful calendar)
  if (service === 'google-calendar') {
    return (
      <svg {...iconProps} viewBox="0 0 40 40" fill="none">
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
      <svg {...iconProps} viewBox="0 0 40 40" fill="none">
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
      <svg {...iconProps} viewBox="0 0 40 40" fill="none">
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
      <svg {...iconProps} viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="16" fill="#1DB954"/>
        <path d="M27 16C22.5 13.5 15 14 12 15" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M26 21C22 19 16 19.5 13 20.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M25 26C21.5 24.5 17 24.5 14 25.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
  
  // Clock/Schedule icon
  if (service === 'clock') {
    return (
      <div 
        className={cn('n8n-service-icon flex items-center justify-center rounded-[var(--radius--xs)]', className)}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: 'var(--color--green-100)'
        }}
      >
        <Clock 
          size={size * 0.6} 
          className="text-[var(--color--green-600)]"
        />
      </div>
    )
  }
  
  // Switch/Router icon
  if (service === 'switch') {
    return (
      <div 
        className={cn('n8n-service-icon flex items-center justify-center rounded-[var(--radius--xs)]', className)}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: 'var(--color--blue-100)'
        }}
      >
        <GitBranch 
          size={size * 0.6} 
          className="text-[var(--color--blue-600)]"
        />
      </div>
    )
  }
  
  // Code icon
  if (service === 'code') {
    return (
      <div 
        className={cn('n8n-service-icon flex items-center justify-center rounded-[var(--radius--xs)]', className)}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: 'var(--color--purple-100)'
        }}
      >
        <Code 
          size={size * 0.6} 
          className="text-[var(--color--purple-600)]"
        />
      </div>
    )
  }
  
  // Webhook icon
  if (service === 'webhook') {
    return (
      <div 
        className={cn('n8n-service-icon flex items-center justify-center rounded-[var(--radius--xs)]', className)}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: 'var(--color--orange-100)'
        }}
      >
        <Webhook 
          size={size * 0.6} 
          className="text-[var(--color--orange-600)]"
        />
      </div>
    )
  }
  
  // HTTP Request icon
  if (service === 'http') {
    return (
      <div 
        className={cn('n8n-service-icon flex items-center justify-center rounded-[var(--radius--xs)]', className)}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: 'var(--color--purple-100)'
        }}
      >
        <Globe 
          size={size * 0.6} 
          className="text-[var(--color--purple-600)]"
        />
      </div>
    )
  }
  
  // AI/Bot icon
  if (service === 'openai' || service === 'anthropic' || service === 'ai') {
    return (
      <div 
        className={cn('n8n-service-icon flex items-center justify-center rounded-[var(--radius--xs)]', className)}
        style={{ 
          width: size, 
          height: size, 
          backgroundColor: 'var(--color--green-100)'
        }}
      >
        <Bot 
          size={size * 0.6} 
          className="text-[var(--color--green-600)]"
        />
      </div>
    )
  }
  
  // Default fallback
  return (
    <div 
      className={cn('flex items-center justify-center rounded-[var(--radius--xs)]', className)}
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: 'var(--color--neutral-100)'
      }}
    >
      <Zap 
        size={size * 0.6} 
        className="text-[var(--color--neutral-500)]"
      />
    </div>
  )
}
