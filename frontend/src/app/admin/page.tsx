'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  Rss,
  Eye,
  MousePointerClick,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import api from '@/lib/api';

interface Stats {
  total_products: number;
  total_categories: number;
  total_feeds: number;
  total_views: number;
  total_clicks: number;
}

interface Activity {
  id: string;
  feed_id: string;
  started_at: string;
  finished_at: string;
  duration: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, activityData] = await Promise.all([
        api.getDashboardStats(),
        api.getRecentActivity(),
      ]);
      setStats(statsData);
      setActivity(activityData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Products',
      value: stats?.total_products || 0,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      href: '/admin/products',
    },
    {
      title: 'Categories',
      value: stats?.total_categories || 0,
      icon: FolderTree,
      color: 'from-purple-500 to-purple-600',
      href: '/admin/categories',
    },
    {
      title: 'Active Feeds',
      value: stats?.total_feeds || 0,
      icon: Rss,
      color: 'from-green-500 to-green-600',
      href: '/admin/feeds',
    },
    {
      title: 'Total Views',
      value: stats?.total_views || 0,
      icon: Eye,
      color: 'from-orange-500 to-orange-600',
      href: '/admin/products',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to EshopBuilder v3 Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="card card-hover p-6 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-4 text-sm text-gray-400 group-hover:text-blue-400 transition-colors">
              <span>View details</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Feed Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <Rss className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Feed Import</h2>
              <p className="text-gray-400 text-sm">Import products from external feeds</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            Supports Heureka XML, CSV, and JSON formats. Automatically map fields and import thousands of products.
          </p>
          <Link href="/admin/feeds" className="btn-primary inline-flex items-center gap-2">
            Manage Feeds
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Add Product Card */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Products</h2>
              <p className="text-gray-400 text-sm">Manage your product catalog</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4">
            Add, edit, and organize products. Bulk actions available for efficient management.
          </p>
          <Link href="/admin/products" className="btn-secondary inline-flex items-center gap-2">
            View Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Import Activity</h2>
        
        {activity.length === 0 ? (
          <div className="text-center py-12">
            <Rss className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No import activity yet</p>
            <Link href="/admin/feeds" className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block">
              Create your first feed →
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {activity.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(item.status)}
                  <div>
                    <p className="text-white font-medium">
                      Import {item.status}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(item.started_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-green-400">+{item.created} created</span>
                    <span className="text-blue-400">{item.updated} updated</span>
                    {item.errors > 0 && (
                      <span className="text-red-400">{item.errors} errors</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">
                    Duration: {formatDuration(item.duration)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
