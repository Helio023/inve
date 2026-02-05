"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ComparisonChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
        <YAxis fontSize={10} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
          cursor={{ fill: '#f8fafc' }}
        />
        <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
        <Bar dataKey="casamentos" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Casamentos" />
        <Bar dataKey="corporativo" fill="#10b981" radius={[4, 4, 0, 0]} name="Corporativo" />
        <Bar dataKey="aniversarios" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Aniversários" />
      </BarChart>
    </ResponsiveContainer>
  );
}