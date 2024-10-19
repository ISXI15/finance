'use client'

import { useState, useEffect } from 'react'

export default function BitcoinStatus() {
  const [price, setPrice] = useState<number | null>(null)
  const [change, setChange] = useState<number | null>(null)

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const priceResponse = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
        const priceData = await priceResponse.json()

        const statsResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
        const statsData = await statsResponse.json()

        setPrice(parseFloat(priceData.price))
        setChange(parseFloat(statsData.priceChangePercent))
      } catch (error) {
        console.error('Error fetching Bitcoin data:', error)
      }
    }

    fetchBitcoinData()
    const interval = setInterval(fetchBitcoinData, 10000)

    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'USD' }).format(price)
  }

  const formatChange = (change: number) => {
    return change.toFixed(2)
  }

  return (
    <div className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2 text-gray-800">Bitcoin Status</h2>
      {price !== null && change !== null ? (
        <div>
          <p className="text-xl font-bold mb-1">{formatPrice(price)}</p>
          <p className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? '▲' : '▼'} {formatChange(change)}%
          </p>
        </div>
      ) : (
        <p className="text-gray-600">Lade Bitcoin-Daten...</p>
      )}
    </div>
  )
}