import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Erweiterter Persönlicher Finanztracker',
  description: 'Ein Tool zur Verwaltung Ihrer persönlichen Finanzen',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/dollar-icon.svg', type: 'image/svg+xml' },
      { url: '/dollar-icon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/dollar-icon-32x32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [
      { url: '/dollar-icon-180x180.png', type: 'image/png', sizes: '180x180' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>{children}</body>
    </html>
  )
}