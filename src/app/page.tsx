import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mein Finanzplaner</h1>
        <nav>
          <Link href="/login">
            <Button>Anmelden</Button>
          </Link>
        </nav>
      </header>
      <main>
        <h2 className="text-2xl mb-4">Willkommen bei Ihrem persönlichen Finanzplaner</h2>
        <p className="mb-4">Verwalten Sie Ihre Finanzen einfach und effektiv mit unserem Tool.</p>
        <Link href="/login">
          <Button size="lg">Jetzt starten</Button>
        </Link>
      </main>
    </div>
  )
}