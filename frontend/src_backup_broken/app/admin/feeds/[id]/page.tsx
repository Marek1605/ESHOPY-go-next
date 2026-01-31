'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Play,
  Pause,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';

interface ImportProgress {
  feed_id: string;
  history_id: string;
  status: string;
  percent: number;
  total: number;
  processed: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  message: string;
  elapsed: number;
  eta: number;
  speed: number;
  logs: { time: string; level: string; message: string }[];
}

interface ImportHistory {
  id: string;
  started_at: string;
  finished_at: string;
  duration: number;
  total_items: number;
  created: number;
  updated: number;
  skipped: number;
  errors: number;
  status: string;
  error_message: string | null;
}

export default function FeedDetailPage() {
  const params = useParams();
  const router = useRouter();
  const feedId = params.id as string;

  const [feed, setFeed] = useState<any>(null);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [history, setHistory] = useState<ImportHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    loadData();
  }, [feedId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (polling) {
      interval = setInterval(async () => {
        try {
          const progressData = await api.getImportProgress(feedId);
          setProgress(progressData);

          if (progressData.status === 'completed' || progressData.status === 'failed') {
            setPolling(false);
            loadData();
            toast.success(progressData.status === 'completed' ? 'Import completed!' : 'Import failed');
          }
        } catch (error) {
          console.error('Failed to fetch progress:', error);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [polling, feedId]);

  const loadData = async () => {
    try {
      const [feedData, historyData, progressData] = await Promise.all([
        api.getFeed(feedId),
        api.getImportHistory(feedId),
        api.getImportProgress(feedId),
      ]);

      setFeed(feedData);
      setHistory(historyData);
      setProgress(progressData);

      if (progressData.status === 'running') {
        setPolling(true);
      }
    } catch (error) {
      toast.error('Failed to load feed');
      router.push('/admin/feeds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartImport = async () => {
    try {
      await api.startImport(feedId);
      setPolling(true);
      toast.success('Import started');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start import');
    }
  };

  const handleStopImport = async () => {
    try {
      await api.stopImport(feedId);
      toast.success('Stopping import...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to stop import');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this feed?')) return;

    try {
      await api.deleteFeed(feedId);
      toast.success('Feed deleted');
      router.push('/admin/feeds');
    } catch (error) {
      toast.error('Failed to delete feed');
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      completed: 'bg-green-500/20 text-green-400',
      failed: 'bg-red-500/20 text-red-400',
      running: 'bg-blue-500/20 text-blue-400',
      idle: 'bg-gray-500/20 text-gray-400',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.idle}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!feed) return null;

  const isRunning = progress?.status === 'running';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/feeds"
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{feed.name}</h1>
            <p className="text-gray-400 mt-1">{feed.feed_url}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={handleStopImport}
              className="btn-secondary flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <Pause className="w-5 h-5" />
              Stop Import
            </button>
          ) : (
            <button
              onClick={handleStartImport}
              className="btn-primary flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Import
            </button>
          )}
          <Link
            href={`/admin/feeds/${feedId}/edit`}
            className="btn-secondary flex items-center gap-2"
          >
            <Edit className="w-5 h-5" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Import Progress */}
      {isRunning && progress && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Import Progress</h2>
            <div className="flex items-center gap-2 text-blue-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Running...</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">{progress.message}</span>
              <span className="text-white font-medium">{progress.percent}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full progress-bar rounded-full transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{progress.processed}</p>
              <p className="text-gray-400 text-sm">Processed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{progress.created}</p>
              <p className="text-gray-400 text-sm">Created</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{progress.updated}</p>
              <p className="text-gray-400 text-sm">Updated</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">{progress.skipped}</p>
              <p className="text-gray-400 text-sm">Skipped</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-400">{progress.errors}</p>
              <p className="text-gray-400 text-sm">Errors</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{formatDuration(progress.elapsed)}</p>
              <p className="text-gray-400 text-sm">Elapsed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{progress.speed.toFixed(1)}/s</p>
              <p className="text-gray-400 text-sm">Speed</p>
            </div>
          </div>

          {/* Logs */}
          {progress.logs && progress.logs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Recent Logs</h3>
              <div className="bg-black/30 rounded-lg p-4 max-h-40 overflow-y-auto font-mono text-xs">
                {progress.logs.slice(-10).map((log, i) => (
                  <div key={i} className={`py-1 ${
                    log.level === 'error' ? 'text-red-400' :
                    log.level === 'warning' ? 'text-yellow-400' :
                    'text-gray-300'
                  }`}>
                    <span className="text-gray-500">[{new Date(log.time).toLocaleTimeString()}]</span>{' '}
                    {log.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feed Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Feed Configuration</h2>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-gray-400">Type</dt>
              <dd className="text-white font-medium">{feed.feed_type?.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Import Mode</dt>
              <dd className="text-white font-medium">{feed.import_mode}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Match By</dt>
              <dd className="text-white font-medium">{feed.match_by?.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Status</dt>
              <dd>{getStatusBadge(feed.status)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Total Products</dt>
              <dd className="text-white font-medium">{feed.total_products?.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Last Run</dt>
              <dd className="text-white font-medium">
                {feed.last_run ? new Date(feed.last_run).toLocaleString() : 'Never'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Field Mappings */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Field Mappings</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {feed.field_mappings && feed.field_mappings.length > 0 ? (
              feed.field_mappings.map((mapping: any, i: number) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
                  <span className="text-gray-400 font-mono text-sm">{mapping.source_field}</span>
                  <span className="text-gray-500">→</span>
                  <span className="text-white font-mono text-sm">{mapping.target_field}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No field mappings configured</p>
            )}
          </div>
        </div>
      </div>

      {/* Import History */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Import History</h2>

        {history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No import history yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Duration</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Created</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Updated</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Skipped</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Errors</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-3 px-4 text-gray-300">
                      {new Date(item.started_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-right text-gray-300">
                      {formatDuration(item.duration)}
                    </td>
                    <td className="py-3 px-4 text-right text-green-400">{item.created}</td>
                    <td className="py-3 px-4 text-right text-blue-400">{item.updated}</td>
                    <td className="py-3 px-4 text-right text-yellow-400">{item.skipped}</td>
                    <td className="py-3 px-4 text-right text-red-400">{item.errors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
