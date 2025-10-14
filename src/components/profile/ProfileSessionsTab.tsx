'use client';

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import SessionItem from '@/components/profile/SessionItem'

interface BaseSession {
  id: string
  sessionType?: string
  oauthProvider?: string
  userAgent?: string
  ip?: string
  createdAt: string | Date
  expiresAt: string | Date
}

interface Props {
  activeSessions?: BaseSession[]
  oauthSessions?: BaseSession[]
  onUnlink: (provider: string) => void
}

export default function ProfileSessionsTab({ activeSessions, oauthSessions, onUnlink }: Props) {
  const activeOrMock = (activeSessions && activeSessions.length > 0)
    ? activeSessions
    : [
        { id: 'm1', sessionType: 'PASSWORD', userAgent: 'Chrome on macOS', ip: '192.168.1.10', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now()+86400000).toISOString() },
        { id: 'm2', sessionType: 'PASSWORD', userAgent: 'Safari on iOS', ip: '10.0.0.2', createdAt: new Date(Date.now()-3600_000).toISOString(), expiresAt: new Date(Date.now()-60000).toISOString() },
      ]

  const oauthOrMock = (oauthSessions && oauthSessions.length > 0)
    ? oauthSessions
    : [
        { id: 'om1', oauthProvider: 'GOOGLE', userAgent: 'Chrome on Windows', ip: '172.16.0.5', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now()+2*86400000).toISOString() },
        { id: 'om2', oauthProvider: 'GITHUB', userAgent: 'Firefox on Linux', ip: '172.16.0.6', createdAt: new Date(Date.now()-7200_000).toISOString(), expiresAt: new Date(Date.now()-300000).toISOString() },
        { id: 'om3', oauthProvider: 'FACEBOOK', userAgent: 'Safari on iOS', ip: '10.1.1.8', createdAt: new Date().toISOString(), expiresAt: new Date(Date.now()+3600_000).toISOString() },
      ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-medium">Active Sessions</h2>
          <div className="space-y-2">
            {activeOrMock.map((s) => (
              <SessionItem key={s.id} session={s} />
            ))}
            {!activeSessions && (
              <div className="text-xs text-muted-foreground">Showing mock data (no sessions fetched).</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h2 className="text-lg font-medium">OAuth Sessions</h2>
          <div className="space-y-2">
            {oauthOrMock.map((s) => (
              <SessionItem key={s.id} session={s} onUnlink={(provider) => onUnlink(provider)} />
            ))}
            {!oauthSessions && (
              <div className="text-xs text-muted-foreground">Showing mock data (no OAuth sessions fetched).</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


