"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Dados simulados (receberá via props depois)
const data = [
  { name: "Casamento Ana", confirmados: 120, pendentes: 30 },
  { name: "Aniv. João", confirmados: 45, pendentes: 5 },
  { name: "Conf. Tech", confirmados: 200, pendentes: 150 },
  { name: "Chá Bebê", confirmados: 30, pendentes: 10 },
]

export function OverviewChart({ chartData }: { chartData?: any[] }) {
  const finalData = chartData || data;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Engajamento Recente</CardTitle>
        <p className="text-xs text-muted-foreground">Confirmados vs Pendentes nos últimos eventos</p>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={finalData}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
                cursor={{fill: 'transparent'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            {/* Azul Royal (Primary) */}
            <Bar dataKey="confirmados" fill="oklch(0.55 0.195 260)" radius={[4, 4, 0, 0]} name="Confirmados" />
            {/* Cinza (Muted) */}
            <Bar dataKey="pendentes" fill="oklch(0.90 0.02 240)" radius={[4, 4, 0, 0]} name="Pendentes" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}