'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Plus, Trash2, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Transaktion = {
  id: string
  beschreibung: string
  betrag: number
  kategorie: string
  datum: string
  typ: 'Einnahme' | 'Ausgabe'
}

const FARBEN = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

// IndexedDB Funktionen (angepasst für Transaktionen)
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FinanzTrackerDB', 2)
    request.onerror = () => reject('IndexedDB konnte nicht geöffnet werden')
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      db.createObjectStore('transaktionen', { keyPath: 'id' })
    }
  })
}

const addTransaktion = async (transaktion: Transaktion) => {
  const db = await initDB() as IDBDatabase
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['transaktionen'], 'readwrite')
    const store = transaction.objectStore('transaktionen')
    const request = store.add(transaktion)
    request.onerror = () => reject('Fehler beim Hinzufügen der Transaktion')
    request.onsuccess = () => resolve(request.result)
  })
}

const getAllTransaktionen = async () => {
  const db = await initDB() as IDBDatabase
  return new Promise<Transaktion[]>((resolve, reject) => {
    const transaction = db.transaction(['transaktionen'], 'readonly')
    const store = transaction.objectStore('transaktionen')
    const request = store.getAll()
    request.onerror = () => reject('Fehler beim Abrufen der Transaktionen')
    request.onsuccess = () => resolve(request.result)
  })
}

const deleteTransaktion = async (id: string) => {
  const db = await initDB() as IDBDatabase
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['transaktionen'], 'readwrite')
    const store = transaction.objectStore('transaktionen')
    const request = store.delete(id)
    request.onerror = () => reject('Fehler beim Löschen der Transaktion')
    request.onsuccess = () => resolve(request.result)
  })
}

export default function PersönlicherFinanztracker() {
  const [transaktionen, setTransaktionen] = useState<Transaktion[]>([])
  const [beschreibung, setBeschreibung] = useState('')
  const [betrag, setBetrag] = useState('')
  const [kategorie, setKategorie] = useState('')
  const [datum, setDatum] = useState('')
  const [typ, setTyp] = useState<'Einnahme' | 'Ausgabe'>('Ausgabe')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const router = useRouter()

  useEffect(() => {
    const loadTransaktionen = async () => {
      try {
        const loadedTransaktionen = await getAllTransaktionen()
        setTransaktionen(loadedTransaktionen)
      } catch (error) {
        console.error('Fehler beim Laden der Transaktionen:', error)
      }
    }
    loadTransaktionen()
  }, [])

  const transaktionHinzufügen = async (e: React.FormEvent) => {
    e.preventDefault()
    if (beschreibung && betrag && kategorie && datum) {
      const neueTransaktion: Transaktion = {
        id: Date.now().toString(),
        beschreibung,
        betrag: parseFloat(betrag),
        kategorie,
        datum,
        typ
      }
      try {
        await addTransaktion(neueTransaktion)
        setTransaktionen([...transaktionen, neueTransaktion])
        setBeschreibung('')
        setBetrag('')
        setKategorie('')
        setDatum('')
        setTyp('Ausgabe')
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Transaktion:', error)
      }
    }
  }

  const transaktionEntfernen = async (id: string) => {
    try {
      await deleteTransaktion(id)
      setTransaktionen(transaktionen.filter(transaktion => transaktion.id !== id))
    } catch (error) {
      console.error('Fehler beim Entfernen der Transaktion:', error)
    }
  }

  const gesamtEinnahmen = transaktionen
    .filter(t => t.typ === 'Einnahme')
    .reduce((summe, t) => summe + t.betrag, 0)

  const gesamtAusgaben = transaktionen
    .filter(t => t.typ === 'Ausgabe')
    .reduce((summe, t) => summe + t.betrag, 0)

  const bilanz = gesamtEinnahmen - gesamtAusgaben

  const transaktionenNachKategorie = transaktionen.reduce((acc, t) => {
    const betrag = t.typ === 'Einnahme' ? t.betrag : -t.betrag
    acc[t.kategorie] = (acc[t.kategorie] || 0) + betrag
    return acc
  }, {} as Record<string, number>)

  const tortendiagrammDaten = Object.entries(transaktionenNachKategorie).map(([name, value]) => ({ name, value }))

  const monatlicheTransaktionen = transaktionen
    .filter(t => new Date(t.datum).getFullYear() === selectedYear && new Date(t.datum).getMonth() === selectedMonth)

  const monatlicheEinnahmen = monatlicheTransaktionen
    .filter(t => t.typ === 'Einnahme')
    .reduce((acc, t) => acc + t.betrag, 0)

  const monatlicheAusgaben = monatlicheTransaktionen
    .filter(t => t.typ === 'Ausgabe')
    .reduce((acc, t) => acc + t.betrag, 0)

  const monatlicheBilanz = monatlicheEinnahmen - monatlicheAusgaben

  const monatlicheTransaktionenNachKategorie = monatlicheTransaktionen.reduce((acc, t) => {
    const betrag = t.typ === 'Einnahme' ? t.betrag : -t.betrag
    acc[t.kategorie] = (acc[t.kategorie] || 0) + betrag
    return acc
  }, {} as Record<string, number>)

  const monatlichesDiagrammDaten = Object.entries(monatlicheTransaktionenNachKategorie).map(([name, value]) => ({ name, value }))

  const jährlicheTransaktionenNachMonat = MONATE.map((monat, index) => {
    const monatlicheTransaktionen = transaktionen.filter(t =>
      new Date(t.datum).getFullYear() === selectedYear &&
      new Date(t.datum).getMonth() === index
    )
    const einnahmen = monatlicheTransaktionen
      .filter(t => t.typ === 'Einnahme')
      .reduce((acc, t) => acc + t.betrag, 0)
    const ausgaben = monatlicheTransaktionen
      .filter(t => t.typ === 'Ausgabe')
      .reduce((acc, t) => acc + t.betrag, 0)
    return {
      name: monat,
      einnahmen,
      ausgaben,
      bilanz: einnahmen - ausgaben
    }
  })

  const handleLogout = () => {
    router.push('/login')
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow">
          <p className="font-bold">{label}</p>
          <p>{`Betrag: ${payload[0].value.toFixed(2)} €`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Finanzplaner</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Abmelden
        </Button>
      </div>

      <Card className="mb-6 bg-gray-100">
        <CardHeader>
          <CardTitle>Neue Transaktion hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={transaktionHinzufügen} className="space-y-4">
            <div>
              <Label htmlFor="beschreibung">Beschreibung</Label>
              <Input
                id="beschreibung"
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
                placeholder="Transaktionsbeschreibung eingeben"
                required
              />
            </div>
            <div>
              <Label htmlFor="betrag">Betrag (€)</Label>
              <Input
                id="betrag"
                type="number"
                value={betrag}
                onChange={(e) => setBetrag(e.target.value)}
                placeholder="Betrag eingeben"
                required
              />
            </div>
            <div>
              <Label htmlFor="kategorie">Kategorie</Label>
              <Select value={kategorie} onValueChange={setKategorie} required>
                <SelectTrigger>
                  <SelectValue placeholder="Kategorie auswählen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Essen">Essen</SelectItem>
                  <SelectItem value="Kleidung">Kleidung</SelectItem>
                  <SelectItem value="Unterhaltung">Unterhaltung</SelectItem>
                  <SelectItem value="Nebenkosten">Nebenkosten</SelectItem>
                  <SelectItem value="Fixkosten">Fixkosten</SelectItem>
                  <SelectItem value="Gehalt">Gehalt</SelectItem>
                  <SelectItem value="Sonstiges">Sonstiges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="datum">Datum</Label>
              <Input
                id="datum"
                type="date"
                value={datum}
                onChange={(e) => setDatum(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Typ</Label>
              <RadioGroup value={typ} onValueChange={(value: 'Einnahme' | 'Ausgabe') => setTyp(value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Einnahme" id="einnahme" />
                  <Label htmlFor="einnahme">Einnahme</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Ausgabe" id="ausgabe" />
                  <Label htmlFor="ausgabe">Ausgabe</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" /> Transaktion hinzufügen
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs defaultValue="übersicht" className="space-y-4">
        <TabsList>
          <TabsTrigger value="übersicht">Übersicht</TabsTrigger>
          <TabsTrigger value="monatlich">Monatliche Analyse</TabsTrigger>
          <TabsTrigger value="jährlich">Jährliche Analyse</TabsTrigger>
        </TabsList>

        <TabsContent value="übersicht">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Letzte Transaktionen</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {transaktionen.slice().reverse().map((transaktion) => (
                    <li key={transaktion.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                      <span>
                        {transaktion.beschreibung} - {transaktion.betrag.toFixed(2)} €
                        ({transaktion.kategorie}) - {new Date(transaktion.datum).toLocaleDateString('de-DE')}
                        - {transaktion.typ}
                      </span>
                      <Button variant="ghost" size="icon" onClick={() => transaktionEntfernen(transaktion.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Finanzübersicht</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">

                    <PieChart>
                      <Pie
                        data={tortendiagrammDaten}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {tortendiagrammDaten.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={FARBEN[index % FARBEN.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-center">Gesamteinnahmen: {gesamtEinnahmen.toFixed(2)} €</p>
                  <p className="text-center">Gesamtausgaben: {gesamtAusgaben.toFixed(2)} €</p>
                  <p className="text-center font-bold">Bilanz: {bilanz.toFixed(2)} €</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monatlich">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Button variant="outline" size="icon" onClick={() => setSelectedMonth(prev => (prev - 1 + 12) % 12)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                Monat: {MONATE[selectedMonth]} {selectedYear}
                <Button variant="outline" size="icon" onClick={() => setSelectedMonth(prev => (prev + 1) % 12)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Transaktionen nach Kategorie</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={monatlichesDiagrammDaten}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {monatlichesDiagrammDaten.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={FARBEN[index % FARBEN.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Monatliche Übersicht</h3>
                  <p>Einnahmen diesen Monat: {monatlicheEinnahmen.toFixed(2)} €</p>
                  <p>Ausgaben diesen Monat: {monatlicheAusgaben.toFixed(2)} €</p>
                  <p className="font-bold">Bilanz diesen Monat: {monatlicheBilanz.toFixed(2)} €</p>
                  <ul className="mt-4 space-y-2">
                    {Object.entries(monatlicheTransaktionenNachKategorie).map(([kategorie, betrag]) => (
                      <li key={kategorie} className="flex justify-between">
                        <span>{kategorie}:</span>
                        <span>{betrag.toFixed(2)} €</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jährlich">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <Button variant="outline" size="icon" onClick={() => setSelectedYear(prev => prev - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                Jahr: {selectedYear}
                <Button variant="outline" size="icon" onClick={() => setSelectedYear(prev => prev + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Jährliche Finanzübersicht</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jährlicheTransaktionenNachMonat}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="einnahmen" fill="#4CAF50" />
                        <Bar dataKey="ausgaben" fill="#F44336" />
                        <Bar dataKey="bilanz" fill="#2196F3" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Jährliche Zusammenfassung</h3>
                  <p>Gesamteinnahmen dieses Jahr: {jährlicheTransaktionenNachMonat.reduce((sum, month) => sum + month.einnahmen, 0).toFixed(2)} €</p>
                  <p>Gesamtausgaben dieses Jahr: {jährlicheTransaktionenNachMonat.reduce((sum, month) => sum + month.ausgaben, 0).toFixed(2)} €</p>
                  <p className="font-bold">Jahresbilanz: {jährlicheTransaktionenNachMonat.reduce((sum, month) => sum + month.bilanz, 0).toFixed(2)} €</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}