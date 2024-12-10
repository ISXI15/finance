export async function POST() {
  const response = NextResponse.json({ success: true })

  // Delete the token cookie
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  })

  // Also clear any other session-related cookies if they exist
  response.cookies.set('session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  })

  return response
}
```[v0-no-op-code-block-prefix]

```tsx file="src/app/finanzplaner/FinanzplanerContent.tsx" type="code" project="src/app/finanzplaner/FinanzplanerContent"
export default function FinanzplanerContent() {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // This ensures cookies are sent with the request
      })

      if (response.ok) {
        // Force a hard reload to clear any client-side state
        window.location.href = '/login'
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Rest of the component remains unchanged
}