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

type Ausgabe = {
  id: string
  beschreibung: string
  betrag: number
  kategorie: string
  datum: string
}

const FARBEN = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']
const MONATE = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

// IndexedDB Funktionen (unverändert)
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('FinanzTrackerDB', 1)
    request.onerror = () => reject('IndexedDB konnte nicht geöffnet werden')
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      db.createObjectStore('ausgaben', { keyPath: 'id' })
    }
  })
}

const addAusgabe = async (ausgabe: Ausgabe) => {
  const db = await initDB() as IDBDatabase
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['ausgaben'], 'readwrite')
    const store = transaction.objectStore('ausgaben')
    const request = store.add(ausgabe)
    request.onerror = () => reject('Fehler beim Hinzufügen der Ausgabe')
    request.onsuccess = () => resolve(request.result)
  })
}

const getAllAusgaben = async () => {
  const db = await initDB() as IDBDatabase
  return new Promise<Ausgabe[]>((resolve, reject) => {
    const transaction = db.transaction(['ausgaben'], 'readonly')
    const store = transaction.objectStore('ausgaben')
    const request = store.getAll()
    request.onerror = () => reject('Fehler beim Abrufen der Ausgaben')
    request.onsuccess = () => resolve(request.result)
  })
}

const deleteAusgabe = async (id: string) => {
  const db = await initDB() as IDBDatabase
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['ausgaben'], 'readwrite')
    const store = transaction.objectStore('ausgaben')
    const request = store.delete(id)
    request.onerror = () => reject('Fehler beim Löschen der Ausgabe')
    request.onsuccess = () => resolve(request.result)
  })
}

export default function PersönlicherFinanztracker() {
  const [ausgaben, setAusgaben] = useState<Ausgabe[]>([])
  const [beschreibung, setBeschreibung] = useState('')
  const [betrag, setBetrag] = useState('')
  const [kategorie, setKategorie] = useState('')
  const [datum, setDatum] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const router = useRouter()

  useEffect(() => {
    const loadAusgaben = async () => {
      try {
        const loadedAusgaben = await getAllAusgaben()
        setAusgaben(loadedAusgaben)
      } catch (error) {
        console.error('Fehler beim Laden der Ausgaben:', error)
      }
    }
    loadAusgaben()
  }, [])

  const ausgabeHinzufügen = async (e: React.FormEvent) => {
    e.preventDefault()
    if (beschreibung && betrag && kategorie && datum) {
      const neueAusgabe: Ausgabe = {
        id: Date.now().toString(),
        beschreibung,
        betrag: parseFloat(betrag),
        kategorie,
        datum
      }
      try {
        await addAusgabe(neueAusgabe)
        setAusgaben([...ausgaben, neueAusgabe])
        setBeschreibung('')
        setBetrag('')
        setKategorie('')
        setDatum('')
      } catch (error) {
        console.error('Fehler beim Hinzufügen der Ausgabe:', error)
      }
    }
  }

  const ausgabeEntfernen = async (id: string) => {
    try {
      await deleteAusgabe(id)
      setAusgaben(ausgaben.filter(ausgabe => ausgabe.id !== id))
    } catch (error) {
      console.error('Fehler beim Entfernen der Ausgabe:', error)
    }
  }

  const gesamtausgaben = ausgaben.reduce((summe, ausgabe) => summe + ausgabe.betrag, 0)

  const ausgabenNachKategorie = ausgaben.reduce((acc, ausgabe) => {
    acc[ausgabe.kategorie] = (acc[ausgabe.kategorie] || 0) + ausgabe.betrag
    return acc
  }, {} as Record<string, number>)

  const tortendiagrammDaten = Object.entries(ausgabenNachKategorie).map(([name, value]) => ({ name, value }))

  const monatlicheAusgaben = ausgaben
    .filter(ausgabe => new Date(ausgabe.datum).getFullYear() === selectedYear && new Date(ausgabe.datum).getMonth() === selectedMonth)
    .reduce((acc, ausgabe) => acc + ausgabe.betrag, 0)

  const jährlicheAusgaben = ausgaben
    .filter(ausgabe => new Date(ausgabe.datum).getFullYear() === selectedYear)
    .reduce((acc, ausgabe) => acc + ausgabe.betrag, 0)

  const monatlicheAusgabenNachKategorie = ausgaben
    .filter(ausgabe => new Date(ausgabe.datum).getFullYear() === selectedYear && new Date(ausgabe.datum).getMonth() === selectedMonth)
    .reduce((acc, ausgabe) => {
      acc[ausgabe.kategorie] = (acc[ausgabe.kategorie] || 0) + ausgabe.betrag
      return acc
    }, {} as Record<string, number>)

  const monatlichesDiagrammDaten = Object.entries(monatlicheAusgabenNachKategorie).map(([name, value]) => ({ name, value }))

  const jährlicheAusgabenNachMonat = MONATE.map((monat, index) => ({
    name: monat,
    betrag: ausgaben
      .filter(ausgabe => new Date(ausgabe.datum).getFullYear() === selectedYear && new Date(ausgabe.datum).getMonth() === index)
      .reduce((acc, ausgabe) => acc + ausgabe.betrag, 0)
  }))

  const handleLogout = () => {
    // Here you would typically handle logout logic
    router.push('/login')
  }

  return (
    <div className="container mx-auto p-4 bg-white text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Persönlicher Finanztracker</h1>
        <Button onClick={handleLogout} variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Abmelden
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Neue Ausgabe hinzufügen</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={ausgabeHinzufügen} className="space-y-4">
            <div>
              <Label htmlFor="beschreibung">Beschreibung</Label>
              <Input
                id="beschreibung"
                value={beschreibung}
                onChange={(e) => setBeschreibung(e.target.value)}
                placeholder="Ausgabenbeschreibung eingeben"
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
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Unterhaltung">Unterhaltung</SelectItem>
                  <SelectItem value="Nebenkosten">Nebenkosten</SelectItem>
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
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" /> Ausgabe hinzufügen
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
                <CardTitle>Letzte Ausgaben</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {ausgaben.slice().reverse().map((ausgabe) => (
                    <li key={ausgabe.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                      <span>{ausgabe.beschreibung} - {ausgabe.betrag.toFixed(2)} € ({ausgabe.kategorie}) - {new Date(ausgabe.datum).toLocaleDateString('de-DE')}</span>
                      <Button variant="ghost" size="icon" onClick={() => ausgabeEntfernen(ausgabe.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ausgabenübersicht</CardTitle>
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
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center mt-4">Gesamtausgaben: {gesamtausgaben.toFixed(2)} €</p>
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
                Monatliche Analyse: {MONATE[selectedMonth]} {selectedYear}
                <Button variant="outline" size="icon" onClick={() => setSelectedMonth(prev => (prev + 1) % 12)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Ausgaben nach Kategorie</h3>
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
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Monatliche Übersicht</h3>
                  <p>Gesamtausgaben diesen Monat: {monatlicheAusgaben.toFixed(2)} €</p>
                  <ul className="mt-4 space-y-2">
                    {Object.entries(monatlicheAusgabenNachKategorie).map(([kategorie, betrag]) => (
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
                Jährliche Analyse: {selectedYear}
                <Button variant="outline" size="icon" onClick={() => setSelectedYear(prev => prev + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Jährliche Ausgabenübersicht</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={jährlicheAusgabenNachMonat}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="betrag" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Jährliche Zusammenfassung</h3>
                  <p>Gesamtausgaben dieses Jahr: {jährlicheAusgaben.toFixed(2)} €</p>
                  <p>Durchschnittliche monatliche Ausgaben: {(jährlicheAusgaben / 12).toFixed(2)} €</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}