'use client';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye } from 'lucide-react';

export default function AnalyticsPage() {
  const salesData = [
    { day: 'Po', value: 1200 },
    { day: 'Ut', value: 1800 },
    { day: 'St', value: 1400 },
    { day: 'Št', value: 2200 },
    { day: 'Pi', value: 2800 },
    { day: 'So', value: 1900 },
    { day: 'Ne', value: 1100 },
  ];
  const maxValue = Math.max(...salesData.map(d => d.value));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Analytika</h1>
        <p className="text-gray-400">Prehľad výkonnosti vášho e-shopu</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Tržby', value: '€12,847', change: '+15.3%', up: true, icon: DollarSign },
          { label: 'Objednávky', value: '342', change: '+8.2%', up: true, icon: ShoppingCart },
          { label: 'Návštevníci', value: '8,421', change: '+23.1%', up: true, icon: Eye },
          { label: 'Noví zákazníci', value: '89', change: '-2.4%', up: false, icon: Users },
        ].map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className={`flex items-center gap-1 text-sm ${stat.up ? 'text-green-400' : 'text-red-400'}`}>
                {stat.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-semibold mb-6">Tržby za posledných 7 dní</h3>
          <div className="flex items-end justify-between gap-2 h-48">
            {salesData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-slate-800 rounded-t-lg relative" style={{ height: `${(day.value / maxValue) * 100}%` }}>
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg opacity-80" />
                </div>
                <span className="text-xs text-gray-400">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-6">Top kategórie</h3>
          <div className="space-y-4">
            {[
              { name: 'Elektronika', value: 45, color: 'blue' },
              { name: 'Oblečenie', value: 28, color: 'purple' },
              { name: 'Domácnosť', value: 18, color: 'green' },
              { name: 'Ostatné', value: 9, color: 'gray' },
            ].map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{cat.name}</span>
                  <span className="text-sm text-gray-400">{cat.value}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-${cat.color}-500 rounded-full`} style={{ width: `${cat.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
