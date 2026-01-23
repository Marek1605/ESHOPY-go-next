'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Rss,
  Plus,
  Play,
  Pause,
  Trash2,
  Edit,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Database,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface Feed {
  id: string;
  name: string;
  description: string;
  feed_url: string;
  feed_type: string;
  active: boolean;
  status: string;
  last_run: string | null;
  last_error: string | null;
  total_products: number;
  created_at: string;
}

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewFeed, setShowNewFeed] = useState(false);

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = async () => {
    try {
      const data = await api.getFeeds();
      setFeeds(data);
    } catch (error) {
      toast.error('Failed to load feeds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feed?')) return;

    try {
      await api.deleteFeed(id);
      toast.success('Feed deleted');
      loadFeeds();
    } catch (error) {
      toast.error('Failed to delete feed');
    }
  };

  const handleStartImport = async (id: string) => {
    try {
      await api.startImport(id);
      toast.success('Import started');
      loadFeeds();
    } catch (error: any) {
      toast.error(error.message || 'Failed to start import');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-500/20 text-green-400 border-green-500/30',
      running: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    };

    const icons: Record<string, React.ReactNode> = {
      active: <CheckCircle className="w-3 h-3" />,
      running: <RefreshCw className="w-3 h-3 animate-spin" />,
      error: <XCircle className="w-3 h-3" />,
      paused: <Pause className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.active}`}>
        {icons[status] || icons.active}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getFeedTypeIcon = (type: string) => {
    switch (type) {
      case 'xml':
        return <FileText className="w-5 h-5 text-orange-400" />;
      case 'csv':
        return <Database className="w-5 h-5 text-green-400" />;
      case 'json':
        return <FileText className="w-5 h-5 text-blue-400" />;
      default:
        return <Rss className="w-5 h-5 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Feed Import</h1>
          <p className="text-gray-400 mt-1">Import products from Heureka XML, CSV, or JSON feeds</p>
        </div>
        <Link href="/admin/feeds/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Feed
        </Link>
      </div>

      {/* Feeds Grid */}
      {feeds.length === 0 ? (
        <div className="card p-12 text-center">
          <Rss className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No feeds configured</h2>
          <p className="text-gray-400 mb-6">
            Create your first feed to start importing products automatically
          </p>
          <Link href="/admin/feeds/new" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create First Feed
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {feeds.map((feed) => (
            <div key={feed.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {getFeedTypeIcon(feed.feed_type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{feed.name}</h3>
                      {getStatusBadge(feed.status)}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{feed.description || 'No description'}</p>
                    <p className="text-gray-500 text-xs mt-2 font-mono truncate max-w-md">
                      {feed.feed_url}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {feed.status !== 'running' && (
                    <button
                      onClick={() => handleStartImport(feed.id)}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      title="Start Import"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  )}
                  <Link
                    href={`/admin/feeds/${feed.id}`}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/admin/feeds/${feed.id}/edit`}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit Feed"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(feed.id)}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Feed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Type</p>
                  <p className="text-white font-medium mt-1">{feed.feed_type.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Products</p>
                  <p className="text-white font-medium mt-1">{feed.total_products.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Last Run</p>
                  <p className="text-white font-medium mt-1">
                    {feed.last_run ? new Date(feed.last_run).toLocaleDateString() : 'Never'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide">Created</p>
                  <p className="text-white font-medium mt-1">
                    {new Date(feed.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Error message */}
              {feed.last_error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-red-400 text-sm">{feed.last_error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div className="card p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <h3 className="text-lg font-semibold text-white mb-2">Supported Feed Formats</h3>
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-orange-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">Heureka XML</p>
              <p className="text-gray-400 text-sm">Standard Czech price comparison format with SHOPITEM elements</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">CSV</p>
              <p className="text-gray-400 text-sm">Comma or semicolon separated values with header row</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-white font-medium">JSON</p>
              <p className="text-gray-400 text-sm">Array of product objects or nested structure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
