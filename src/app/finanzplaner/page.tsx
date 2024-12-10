import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FinanzplanerContent from './FinanzplanerContent'

export default function FinanzplanerPage() {
  // Get the cookie store
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  // If there's no token, redirect to login
  if (!token) {
    redirect('/login')
  }

  // If we have a token, render the finanzplaner content
  return <FinanzplanerContent />
}