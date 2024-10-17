'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Plus, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
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

// Simples Speicherarray als Ersatz für IndexedDB
const initialAusgaben: Ausgabe[] = []

export default function ErweiterterPersönlicherFinanztracker() {
  const [ausgaben, setAusgaben] = useState<Ausgabe[]>(initialAusgaben)
  const [beschreibung, setBeschreibung] = useState('')
  const [betrag, setBetrag] = useState('')
  const [kategorie, setKategorie] = useState('')
  const [datum, setDatum] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const router = useRouter()

  useEffect(() => {
    // Daten könnten hier z. B. von einem Backend abgerufen werden
    setAusgaben(initialAusgaben)
  }, [])

  const ausgabeHinzufügen = (e: React.FormEvent) => {
    e.preventDefault()
    if (beschreibung && betrag && kategorie && datum) {
      const neueAusgabe: Ausgabe = {
        id: Date.now().toString(),
        beschreibung,
        betrag: parseFloat(betrag),
        kategorie,
        datum
      }
      setAusgaben([...ausgaben, neueAusgabe])
      setBeschreibung('')
      setBetrag('')
      setKategorie('')
      setDatum('')
    }
  }

  const ausgabeEntfernen = (id: string) => {
    setAusgaben(ausgaben.filter(ausgabe => ausgabe.id !== id))
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

      <Tabs defaultValue="übersicht">
        <TabsList>
          <TabsTrigger value="übersicht">Übersicht</TabsTrigger>
          <TabsTrigger value="statistiken">Statistiken</TabsTrigger>
        </TabsList>

        <TabsContent value="übersicht">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gesamtausgaben</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{gesamtausgaben.toFixed(2)} €</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monatliche Ausgaben</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="flex items-center justify-between">
              <button onClick={() => setSelectedYear(selectedYear - 1)}>
                <ChevronLeft />
               </button>
              <span>{selectedYear}</span>
              <button onClick={() => setSelectedYear(selectedYear + 1)}>
                 <ChevronRight />
                </button>
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => setSelectedMonth((selectedMonth - 1 + 12) % 12)}>
                    <ChevronLeft />
                  </button>
                  <span>{MONATE[selectedMonth]} {selectedYear}</span>
                  <button onClick={() => setSelectedMonth((selectedMonth + 1) % 12)}>
                    <ChevronRight />
                  </button>
                </div>
                <p className="text-2xl font-bold mt-4">{monatlicheAusgaben.toFixed(2)} €</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistiken">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Ausgaben nach Kategorien</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={tortendiagrammDaten} dataKey="value" nameKey="name">
                      {tortendiagrammDaten.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={FARBEN[index % FARBEN.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Jährliche Ausgaben</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={jährlicheAusgabenNachMonat}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="betrag" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
