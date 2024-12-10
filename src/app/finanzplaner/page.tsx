import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import FinanzplanerContent from './FinanzplanerContent'

export default function FinanzplanerPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  if (!token) {
    redirect('/login')
  }

  return <FinanzplanerContent />
}