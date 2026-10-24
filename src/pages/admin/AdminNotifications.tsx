import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell, Send, Users, CheckCircle2, AlertCircle, Clock,
  Megaphone, Smartphone, Globe, Trash2, Eye,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import { sendPushToAll, sendLocalNotification, isPushSupported } from '../../utils/pushNotifications';
import { useTranslation } from 'react-i18next';

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  url: string;
  sentAt: string;
  sent: number;
  failed: number;
}

function AdminNotificationsContent() {
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [url, setUrl] = useState('/');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null);
  const [error, setError] = useState('');
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  // Load notification history
  useEffect(() => {
    const stored = localStorage.getItem('push-notification-logs');
    if (stored) setLogs(JSON.parse(stored));

    // Fetch subscriber count
    fetch('/api/push-subscribe')
      .then(r => r.json())
      .then(data => setSubscriberCount(data.totalSubscribers ?? 0))
      .catch(() => setSubscriberCount(0));
  }, []);

  const saveLogs = (newLogs: NotificationLog[]) => {
    setLogs(newLogs);
    localStorage.setItem('push-notification-logs', JSON.stringify(newLogs));
  };

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Title and message are required');
      return;
    }

    setSending(true);
    setError('');
    setResult(null);

    try {
      // Send push notification to all subscribers
      const pushResult = await sendPushToAll(title.trim(), body.trim(), url.trim() || '/');
      
      // Also send a local notification as preview
      await sendLocalNotification(title.trim(), body.trim(), url.trim() || '/');

      // Add to notification store
      const { addNotification } = useAppStore.getState();
      if (addNotification) {
        addNotification({
          userId: 'all',
          title: title.trim(),
          message: body.trim(),
          type: 'system_alert',
          read: false,
        });
      }

      setResult(pushResult);

      // Save to log
      const logEntry: NotificationLog = {
        id: 'log-' + Date.now(),
        title: title.trim(),
        body: body.trim(),
        url: url.trim() || '/',
        sentAt: new Date().toISOString(),
        sent: pushResult.sent,
        failed: pushResult.failed,
      };
      saveLogs([logEntry, ...logs].slice(0, 50));

      // Clear form
      setTitle('');
      setBody('');
      setUrl('/');

      // Refresh subscriber count
      fetch('/api/push-subscribe')
        .then(r => r.json())
        .then(data => setSubscriberCount(data.totalSubscribers ?? 0))
        .catch(() => {});
    } catch (err) {
      setError('Failed to send notification. Try again.');
    } finally {
      setSending(false);
    }
  };

  const handlePreview = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Title and message are required');
      return;
    }
    await sendLocalNotification(title.trim(), body.trim(), url.trim() || '/');
    setPreviewMode(true);
    setTimeout(() => setPreviewMode(false), 3000);
  };

  const clearLogs = () => {
    saveLogs([]);
  };

  // Quick templates
  const templates = [
    { title: '🏥 New Hospital Added', body: 'A new hospital has been added to MEDI SEVA 360. Check it out now!', url: '/hospitals' },
    { title: '📅 Appointment Reminder', body: 'You have upcoming appointments. Please check your dashboard.', url: '/patient/dashboard' },
    { title: '🔔 System Update', body: 'MEDI SEVA 360 has been updated with new features! Explore now.', url: '/' },
    { title: '💊 Health Tip', body: 'Stay hydrated and get regular check-ups. Your health matters!', url: '/' },
    { title: '⚡ Emergency Alert', body: 'Important health advisory. Please check the app for details.', url: '/' },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl text-white p-6"
        style={{ background: 'linear-gradient(135deg, #0f2056 0%, #1e3a8a 50%, #0d9488 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black flex items-center gap-2">
              <Megaphone className="size-6" /> Push Notifications
            </h2>
            <p className="text-sm text-white/70 mt-1">
              Send push notifications to all users who have installed the MEDI SEVA 360 app
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/15 px-4 py-2.5 text-center">
              <p className="text-2xl font-black">{subscriberCount ?? '—'}</p>
              <p className="text-xs text-white/60">Subscribers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
          <Users className="size-5 text-[#1e3a8a] mx-auto" />
          <p className="text-xl font-bold mt-1">{subscriberCount ?? 0}</p>
          <p className="text-xs text-slate-500">Active Subscribers</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
          <Send className="size-5 text-[#0d9488] mx-auto" />
          <p className="text-xl font-bold mt-1">{logs.length}</p>
          <p className="text-xs text-slate-500">Notifications Sent</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
          <CheckCircle2 className="size-5 text-green-600 mx-auto" />
          <p className="text-xl font-bold mt-1">{logs.reduce((s, l) => s + l.sent, 0)}</p>
          <p className="text-xs text-slate-500">Delivered</p>
        </div>
        <div className="rounded-xl bg-white border border-slate-200 p-4 text-center">
          <AlertCircle className="size-5 text-red-500 mx-auto" />
          <p className="text-xl font-bold mt-1">{logs.reduce((s, l) => s + l.failed, 0)}</p>
          <p className="text-xs text-slate-500">Failed</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Compose Form */}
        <div className="lg:col-span-3 rounded-xl bg-white border border-slate-200 p-6">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Send className="size-4 text-[#1e3a8a]" /> Compose Notification
          </h3>

          {/* Quick Templates */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 mb-2">QUICK TEMPLATES</p>
            <div className="flex flex-wrap gap-2">
              {templates.map((t, i) => (
                <button
                  key={i}
                  onClick={() => { setTitle(t.title); setBody(t.body); setUrl(t.url); }}
                  className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-[#1e3a8a]/5 hover:border-[#1e3a8a]/20 transition-colors"
                >
                  {t.title}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Notification Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., New Feature Available!"
                maxLength={100}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">{title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Message Body *</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your notification message..."
                rows={3}
                maxLength={300}
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">{body.length}/300</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Click URL (optional)</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="/"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1e3a8a]/20 focus:border-[#1e3a8a] outline-none"
              />
              <p className="text-xs text-slate-400 mt-1">Page to open when notification is clicked</p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" /> {error}
              </div>
            )}

            {result && (
              <div className="rounded-xl bg-green-50 border border-green-200 p-3 text-sm text-green-700 flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                Notification sent! {result.sent} delivered, {result.failed} failed
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSend}
                disabled={sending || !title.trim() || !body.trim()}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#1e3a8a] px-6 py-3 text-sm font-bold text-white hover:bg-[#0f2056] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send to All ({subscriberCount ?? 0} subscribers)
                  </>
                )}
              </button>
              <button
                onClick={handlePreview}
                disabled={!title.trim() || !body.trim()}
                className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <Eye className="size-4" />
                {previewMode ? '✓ Sent!' : 'Preview'}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Card */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Preview */}
          <div className="rounded-xl bg-white border border-slate-200 p-5">
            <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
              <Smartphone className="size-4" /> Notification Preview
            </h3>
            <div className="rounded-xl bg-slate-900 p-4 text-white">
              <div className="flex items-start gap-3">
                <img src="/logo.jpg" alt="" className="size-8 rounded-lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold">MEDI SEVA 360</span>
                    <span className="text-xs text-slate-400">now</span>
                  </div>
                  <p className="text-sm font-bold truncate">{title || 'Notification Title'}</p>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{body || 'Your notification message will appear here...'}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">How it appears on user's device</p>
          </div>

          {/* Info */}
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2">
              <Globe className="size-4" /> How it works
            </h4>
            <ul className="mt-2 text-xs text-blue-700 space-y-1.5">
              <li>• Users get a prompt to enable notifications when they log in</li>
              <li>• Notifications work even when the app is closed (PWA)</li>
              <li>• Clicking a notification opens the app at the specified URL</li>
              <li>• Invalid subscriptions are automatically cleaned up</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Notification History */}
      <div className="rounded-xl bg-white border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Clock className="size-4 text-[#1e3a8a]" /> Notification History
          </h3>
          {logs.length > 0 && (
            <button onClick={clearLogs} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
              <Trash2 className="size-3" /> Clear
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            <Bell className="size-8 mx-auto text-slate-300 mb-2" />
            No notifications sent yet
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 rounded-lg bg-slate-50 p-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#1e3a8a]/10">
                  <Send className="size-3.5 text-[#1e3a8a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{log.title}</p>
                  <p className="text-xs text-slate-500 truncate">{log.body}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-green-600">{log.sent} sent</span>
                    {log.failed > 0 && <span className="text-xs text-red-500">{log.failed} failed</span>}
                    <span className="text-xs text-slate-400">
                      {new Date(log.sentAt).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminNotifications() {
  const { t } = useTranslation();

  const sidebarItems = [
    { label: 'Overview', icon: 'LayoutDashboard', href: '/admin/dashboard' },
    { label: 'Hospitals', icon: 'Building2', href: '/admin/hospitals' },
    { label: 'Users', icon: 'Users', href: '/admin/users' },
    { label: 'Appointments', icon: 'Calendar', href: '/admin/appointments' },
    { label: 'Push Notifications', icon: 'Megaphone', href: '/admin/notifications', active: true },
    { label: 'Reports', icon: 'BarChart2', href: '/admin/reports' },
    { label: 'Audit Logs', icon: 'Shield', href: '/admin/audit' },
    { label: 'Settings', icon: 'Settings', href: '/admin/settings' },
  ];

  return (
    <ProtectedRoute requiredRole="admin">
      <DashboardLayout sidebarItems={sidebarItems} userRole="admin" headerTitle="Push Notifications">
        <AdminNotificationsContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
