'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PersönlicherFinanztracker from '../finanzplaner/page'
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('/api/user')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    const response = await fetch('/api/auth/logout', { method: 'POST' })
    if (response.ok) {
      router.push('/login')
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Financial Planner Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.username}!</span>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto mt-8">
        <PersönlicherFinanztracker />
      </main>
    </div>
  )
}