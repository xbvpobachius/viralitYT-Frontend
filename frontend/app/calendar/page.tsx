'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api, Upload, Account } from '@/lib/api'

export default function CalendarPage() {
  const [uploads, setUploads] = useState<Upload[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [selectedAccount])

  const loadData = async () => {
    try {
      const [uploadsRes, accountsRes] = await Promise.all([
        api.listUploads(selectedAccount || undefined, undefined, 500),
        api.listAccounts(),
      ])
      setUploads(uploadsRes.uploads)
      setAccounts(accountsRes.accounts)
    } catch (err) {
      console.error('Error loading calendar:', err)
    } finally {
      setLoading(false)
    }
  }

  const getUploadsByDate = () => {
    const byDate: Record<string, Upload[]> = {}
    
    uploads.forEach((upload) => {
      const date = new Date(upload.scheduled_for).toISOString().split('T')[0]
      if (!byDate[date]) {
        byDate[date] = []
      }
      byDate[date].push(upload)
    })

    return byDate
  }

  const getNext14Days = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const day = new Date(today)
      day.setDate(today.getDate() + i)
      days.push(day)
    }
    return days
  }

  const uploadsByDate = getUploadsByDate()
  const days = getNext14Days()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500'
      case 'scheduled': return 'bg-blue-500'
      case 'uploading': return 'bg-yellow-500'
      case 'failed': return 'bg-red-500'
      case 'retry': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold">Viralit-YT</h1>
          </Link>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <Link href="/themes">
              <Button variant="outline">Themes</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Upload Calendar</h2>
              <p className="text-muted-foreground">View scheduled uploads across all accounts</p>
            </div>
            <div className="w-64">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
              >
                <option value="">All Accounts</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {account.display_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Legend */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Uploading</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Done</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Failed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Retry</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Grid */}
          <div className="grid gap-4">
            {days.map((day) => {
              const dateKey = day.toISOString().split('T')[0]
              const dayUploads = uploadsByDate[dateKey] || []
              const isToday = new Date().toISOString().split('T')[0] === dateKey

              return (
                <Card key={dateKey} className={isToday ? 'ring-2 ring-primary' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        {isToday && <Badge className="ml-2">Today</Badge>}
                      </CardTitle>
                      <CardDescription>{dayUploads.length} uploads</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {dayUploads.length > 0 ? (
                      <div className="space-y-2">
                        {dayUploads
                          .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime())
                          .map((upload) => (
                            <div
                              key={upload.id}
                              className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                            >
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(upload.status)}`} />
                              <div className="flex-1">
                                <p className="font-medium text-sm">{upload.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {upload.account_name} • {new Date(upload.scheduled_for).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {upload.status}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No uploads scheduled
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Scheduled</p>
                  <p className="text-2xl font-bold">
                    {uploads.filter(u => u.status === 'scheduled').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {uploads.filter(u => u.status === 'done').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {uploads.filter(u => u.status === 'failed').length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {uploads.filter(u => u.status === 'uploading').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

