'use client';

import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { inr } from '@/lib/utils';

export const PALETTE = ['#e51111', '#0ea5e9', '#f59e0b', '#10b981', '#8b5cf6', '#64748b'];

const axis = { stroke: '#8291ac', fontSize: 11, tickLine: false, axisLine: false };

const tooltipStyle = {
  borderRadius: 12,
  border: '1px solid #d4d9e3',
  boxShadow: '0 10px 30px rgba(11,14,20,.10)',
  fontSize: 12,
};

export function RevenueAreaChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e51111" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#e51111" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} tickFormatter={(v) => inr(Number(v), true)} width={70} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [inr(Number(v)), 'Revenue']} />
        <Area type="monotone" dataKey="revenue" stroke="#e51111" strokeWidth={2.5} fill="url(#revFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function HBarChart({ data, height = 300 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" horizontal={false} />
        <XAxis type="number" {...axis} tickFormatter={(v) => inr(Number(v), true)} />
        <YAxis type="category" dataKey="name" {...axis} width={128} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [inr(Number(v)), 'Revenue']} cursor={{ fill: '#f6f7f9' }} />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function VBarChart({ data, keys }: { data: Record<string, string | number>[]; keys: { key: string; label: string; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis dataKey="name" {...axis} />
        <YAxis {...axis} tickFormatter={(v) => inr(Number(v), true)} width={70} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => inr(Number(v))} cursor={{ fill: '#f6f7f9' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {keys.map((k) => (
          <Bar key={k.key} dataKey={k.key} name={k.label} fill={k.color} radius={[8, 8, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({ data, height = 300 }: { data: { name: string; value: number }[]; height?: number }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2}>
          {data.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => inr(Number(v))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ data }: { data: { name: string; target: number; achieved: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eceef2" vertical={false} />
        <XAxis dataKey="name" {...axis} />
        <YAxis {...axis} tickFormatter={(v) => inr(Number(v), true)} width={70} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => inr(Number(v))} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="target" name="Target" stroke="#8291ac" strokeWidth={2} strokeDasharray="5 5" dot={false} />
        <Line type="monotone" dataKey="achieved" name="Achieved" stroke="#e51111" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
