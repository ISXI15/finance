import Link from 'next/link'
import Image from 'next/image'
import BitcoinStatus from '../components/BitcoinStatus'

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center bg-gray-100">
      <Image
        src="/background-image.jpg"
        alt="Background"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0 opacity-50"
      />
      <div className="z-10 w-full max-w-4xl p-4 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-12 text-black text-center">
          Willkommen bei Ihrem Sparkompass
        </h1>
        <div className="w-full max-w-md space-y-4 bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
          <Link href="/login" className="block w-full">
            <button className="w-full px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 font-semibold">
              Anmelden
            </button>
          </Link>
          <Link href="/register" className="block w-full">
            <button className="w-full px-4 py-3 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 font-semibold">
              Registrieren
            </button>
          </Link>
        </div>
        <p className="mt-8 text-black text-center text-lg">
          Verwalten Sie Ihre Finanzen einfach und effektiv mit unserem Finanzplaner um ein besseres sparen zu ermöglichen.
        </p>
      </div>
      <div className="absolute top-4 left-4 z-20">
        <BitcoinStatus />
      </div>
    </div>
  )
}