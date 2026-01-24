'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, Users, Store, CreditCard, Database,
  ArrowRight, Activity, Server, AlertTriangle, CheckCircle,
  Clock, Zap, Globe, BarChart3
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 1247,
    usersChange: 8.5,
    totalShops: 856,
    shopsChange: 12.3,
    monthlyRevenue: 48750,
    revenueChange: 15.2,
    activeFeeds: 342,
    feedsChange: 5.8,
  });

  const platformStats = [
    { label: 'CPU', value: 23, color: 'bg-blue-500' },
    { label: 'RAM', value: 67, color: 'bg-purple-500' },
    { label: 'Disk', value: 45, color: 'bg-green-500' },
    { label: 'Network', value: 12, color: 'bg-orange-500' },
  ];

  const recentUsers = [
    { name: 'Martin Kováč', email: 'martin@example.com', shop: 'TechShop.sk', plan: 'Business', date: 'pred 2 hod' },
    { name: 'Jana Nováková', email: 'jana@example.com', shop: 'ModaDnes.sk', plan: 'Starter', date: 'pred 5 hod' },
    { name: 'Peter Horváth', email: 'peter@example.com', shop: 'BioFood.sk', plan: 'Enterprise', date: 'pred 8 hod' },
    { name: 'Eva Szabová', email: 'eva@example.com', shop: 'KidsWorld.sk', plan: 'Business', date: 'pred 12 hod' },
  ];

  const recentFeeds = [
    { name: 'Heureka XML', shop: 'TechShop.sk', products: 1247, status: 'success', time: 'pred 15 min' },
    { name: 'Google Shopping', shop: 'ModaDnes.sk', products: 856, status: 'running', time: 'práve teraz' },
    { name: 'Custom CSV', shop: 'BioFood.sk', products: 324, status: 'error', time: 'pred 1 hod' },
    { name: 'Allegro Feed', shop: 'ElektroMax.sk', products: 2156, status: 'success', time: 'pred 2 hod' },
  ];

  const systemAlerts = [
    { type: 'warning', message: 'Vysoké využitie RAM na serveri EU-1', time: 'pred 10 min' },
    { type: 'info', message: 'Nová verzia API 2.5 je dostupná', time: 'pred 1 hod' },
    { type: 'success', message: 'Zálohovanie databázy dokončené', time: 'pred 3 hod' },
  ];

  const statusColors: Record<string, { bg: string; text: string }> = {
    success: { bg: 'bg-green-500/20', text: 'text-green-400' },
    running: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    error: { bg: 'bg-red-500/20', text: 'text-red-400' },
    warning: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
    info: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  };

  const planColors: Record<string, string> = {
    Starter: 'badge-info',
    Business: 'badge-success',
    Enterprise: 'badge-warning',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">Prehľad celej platformy EshopBuilder</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            Posledná aktualizácia: pred 2 min
          </span>
          <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl font-medium hover:opacity-90 transition">
            Exportovať report
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.usersChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.usersChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.usersChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-1">Celkom používateľov</p>
        </div>

        {/* Shops */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Store className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.shopsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.shopsChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.shopsChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalShops.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-1">Aktívnych obchodov</p>
        </div>

        {/* Revenue */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <CreditCard className="w-6 h-6 text-green-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.revenueChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.revenueChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">€{stats.monthlyRevenue.toLocaleString()}</p>
          <p className="text-gray-400 text-sm mt-1">Mesačné tržby</p>
        </div>

        {/* Feeds */}
        <div className="stats-card">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <Database className="w-6 h-6 text-orange-400" />
            </div>
            <div className={`flex items-center gap-1 text-sm ${stats.feedsChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.feedsChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(stats.feedsChange)}%
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.activeFeeds}</p>
          <p className="text-gray-400 text-sm mt-1">Aktívnych feedov</p>
        </div>
      </div>

      {/* System Health & Alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Server className="w-5 h-5 text-gray-400" />
              Stav systému
            </h2>
            <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
              <CheckCircle className="w-4 h-4" />
              Online
            </span>
          </div>
          <div className="space-y-4">
            {platformStats.map((stat) => (
              <div key={stat.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">{stat.label}</span>
                  <span className="text-sm font-medium">{stat.value}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${stat.color} rounded-full transition-all`}
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-400">99.98%</p>
                <p className="text-xs text-gray-400">Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">45ms</p>
                <p className="text-xs text-gray-400">Avg. Response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-gray-400" />
              Upozornenia
            </h2>
            <Link href="/admin/alerts" className="text-blue-400 text-sm hover:text-blue-300">
              Všetky
            </Link>
          </div>
          <div className="space-y-3">
            {systemAlerts.map((alert, i) => (
              <div key={i} className={`p-3 rounded-xl ${statusColors[alert.type].bg}`}>
                <p className={`text-sm font-medium ${statusColors[alert.type].text}`}>
                  {alert.message}
                </p>
                <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feeds */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-gray-400" />
              Feed importy
            </h2>
            <Link href="/admin/feeds" className="text-blue-400 text-sm hover:text-blue-300">
              Všetky
            </Link>
          </div>
          <div className="space-y-3">
            {recentFeeds.map((feed, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                <div>
                  <p className="font-medium text-sm">{feed.name}</p>
                  <p className="text-xs text-gray-400">{feed.shop}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{feed.products.toLocaleString()} produktov</p>
                  <span className={`inline-flex items-center gap-1 text-xs ${statusColors[feed.status].text}`}>
                    {feed.status === 'running' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />}
                    {feed.status === 'success' ? 'Dokončené' : feed.status === 'running' ? 'Prebieha' : 'Chyba'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold">Noví používatelia</h2>
          <Link href="/admin/users" className="flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition">
            Zobraziť všetkých
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Používateľ</th>
                <th>Obchod</th>
                <th>Plán</th>
                <th>Registrácia</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, i) => (
                <tr key={i}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{user.shop}</td>
                  <td>
                    <span className={`badge ${planColors[user.plan]}`}>{user.plan}</span>
                  </td>
                  <td className="text-gray-400">{user.date}</td>
                  <td>
                    <Link href={`/admin/users/${i}`} className="text-blue-400 hover:text-blue-300 text-sm">
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/users" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-blue-500/50 transition">
          <Users className="w-8 h-8 text-blue-400 mb-3" />
          <h3 className="font-semibold">Správa používateľov</h3>
          <p className="text-sm text-gray-400 mt-1">Zobraziť a spravovať účty</p>
        </Link>

        <Link href="/admin/feeds" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-purple-500/50 transition">
          <Database className="w-8 h-8 text-purple-400 mb-3" />
          <h3 className="font-semibold">Feed Import</h3>
          <p className="text-sm text-gray-400 mt-1">Spravovať importy produktov</p>
        </Link>

        <Link href="/admin/analytics" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-green-500/50 transition">
          <BarChart3 className="w-8 h-8 text-green-400 mb-3" />
          <h3 className="font-semibold">Analytika</h3>
          <p className="text-sm text-gray-400 mt-1">Detailné štatistiky platformy</p>
        </Link>

        <Link href="/admin/settings" className="group p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-orange-500/50 transition">
          <Globe className="w-8 h-8 text-orange-400 mb-3" />
          <h3 className="font-semibold">Nastavenia</h3>
          <p className="text-sm text-gray-400 mt-1">Konfigurácia platformy</p>
        </Link>
      </div>
    </div>
  );
}
