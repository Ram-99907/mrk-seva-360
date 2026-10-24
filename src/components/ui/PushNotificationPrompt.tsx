import { useState, useEffect } from 'react';
import { Bell, BellOff, X, Check } from 'lucide-react';
import {
  isPushSupported,
  getPermissionStatus,
  requestNotificationPermission,
  subscribeToPush,
  isSubscribed,
} from '../../utils/pushNotifications';
import { useAppStore } from '../../store/appStore';

export default function PushNotificationPrompt() {
  const { currentUser } = useAppStore();
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<'idle' | 'subscribing' | 'subscribed' | 'denied'>('idle');

  useEffect(() => {
    // Only show for logged-in users
    if (!currentUser) return;
    if (!isPushSupported()) return;

    const dismissed = localStorage.getItem('push-prompt-dismissed');
    if (dismissed) return;

    const permission = getPermissionStatus();
    if (permission === 'granted') {
      // Already granted, subscribe silently
      isSubscribed().then(sub => {
        if (!sub) subscribeToPush();
      });
      return;
    }
    if (permission === 'denied') return;

    // Show prompt after 2 seconds
    const timer = setTimeout(() => setShow(true), 2000);
    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleEnable = async () => {
    setStatus('subscribing');
    const permission = await requestNotificationPermission();
    if (permission === 'granted') {
      await subscribeToPush();
      setStatus('subscribed');
      setTimeout(() => setShow(false), 2000);
    } else {
      setStatus('denied');
      setTimeout(() => {
        setShow(false);
        localStorage.setItem('push-prompt-dismissed', 'true');
      }, 2000);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('push-prompt-dismissed', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-sm animate-in slide-in-from-bottom-4">
      <div className="rounded-2xl bg-white border border-slate-200 shadow-2xl p-5">
        {status === 'subscribed' ? (
          <div className="flex items-center gap-3 text-green-600">
            <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
              <Check className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Notifications Enabled!</p>
              <p className="text-xs text-slate-500">You'll receive updates from MEDI SEVA 360</p>
            </div>
          </div>
        ) : status === 'denied' ? (
          <div className="flex items-center gap-3 text-red-600">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
              <BellOff className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Permission Denied</p>
              <p className="text-xs text-slate-500">You can enable later in browser settings</p>
            </div>
          </div>
        ) : (
          <>
            <button onClick={handleDismiss} className="absolute top-3 right-3 text-slate-400 hover:text-slate-600">
              <X className="size-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#1e3a8a]/10">
                <Bell className="size-5 text-[#1e3a8a]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Enable Notifications</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get instant updates on appointments, hospital alerts & health tips from MEDI SEVA 360
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleEnable}
                disabled={status === 'subscribing'}
                className="flex-1 rounded-xl bg-[#1e3a8a] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0f2056] transition-colors disabled:opacity-60"
              >
                {status === 'subscribing' ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enabling...
                  </span>
                ) : (
                  'Enable Notifications'
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Later
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
