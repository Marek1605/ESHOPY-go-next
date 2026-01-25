'use client';
import { Users, Store, DollarSign, Database, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Celkom používateľov', value: '1,247', change: '+8.5%', icon: Users },
    { label: 'Aktívnych obchodov', value: '856', change: '+12.3%', icon: Store },
    { label: 'Mesačné tržby', value: '€48,750', change: '+15.2%', icon: DollarSign },
    { label: 'Aktívnych feedov', value: '342', change: '+5.8%', icon: Database },
  ];

  const recentUsers = [
    { name: 'Ján Novák', email: 'jan@email.sk', shop: 'TechShop.sk', date: 'Pred 2 hod' },
    { name: 'Mária Kováčová', email: 'maria@email.sk', shop: 'ModaDnes.sk', date: 'Pred 5 hod' },
    { name: 'Peter Horváth', email: 'peter@email.sk', shop: 'BioFood.sk', date: 'Pred 8 hod' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'Vysoké využitie RAM na serveri EU-1', time: 'pred 10 min' },
    { type: 'info', message: 'Nová verzia API 2.5 je dostupná', time: 'pred 1 hod' },
    { type: 'success', message: 'Zálohovanie databázy dokončené', time: 'pred 3 hod' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Prehľad celej platformy EshopBuilder</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-400" />
              </div>
              <span className="flex items-center gap-1 text-sm text-green-400">
                <TrendingUp className="w-4 h-4" />{stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-400 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Stav systému</h3>
            <span className="badge badge-success">Online</span>
          </div>
          <div className="space-y-4">
            {[
              { label: 'CPU', value: 23, color: 'green' },
              { label: 'RAM', value: 67, color: 'yellow' },
              { label: 'Disk', value: 45, color: 'green' },
              { label: 'Network', value: 12, color: 'green' },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">{item.label}</span>
                  <span className="text-sm">{item.value}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-${item.color}-500 rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4">Upozornenia</h3>
          <div className="space-y-3">
            {systemAlerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-lg ${alert.type === 'warning' ? 'bg-yellow-500/10' : alert.type === 'success' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                <div className={`flex items-center gap-2 ${alert.type === 'warning' ? 'text-yellow-400' : alert.type === 'success' ? 'text-green-400' : 'text-blue-400'}`}>
                  {alert.type === 'warning' ? <AlertTriangle className="w-4 h-4" /> : alert.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  <span className="text-sm">{alert.message}</span>
                </div>
                <div className="text-xs text-gray-500 mt-1 ml-6">{alert.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold mb-4">Noví používatelia</h3>
          <div className="space-y-3">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-sm text-gray-400 truncate">{user.shop}</div>
                </div>
                <div className="text-xs text-gray-500">{user.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
