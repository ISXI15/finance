import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Willkommen bei Ihrem Finanzplaner</h1>
      <div className="space-y-4 w-full max-w-md">
        <Link href="/login" className="block w-full">
          <button className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
            Anmelden
          </button>
        </Link>
        <Link href="/register" className="block w-full">
          <button className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">
            Registrieren
          </button>
        </Link>
      </div>
      <p className="mt-8 text-gray-600 text-center">
        Verwalten Sie Ihre Finanzen einfach und effektiv mit unserem Finanzplaner.
      </p>
    </div>
  );
}