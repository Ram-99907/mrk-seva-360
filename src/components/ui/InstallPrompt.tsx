import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      || (navigator as any).standalone === true;
    if (isStandalone) return;

    // Check if dismissed recently
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed && Date.now() - Number(dismissed) < 24 * 60 * 60 * 1000) return;

    // iOS detection
    const ua = navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isiOS);

    if (isiOS) {
      // Show banner after 5 seconds on iOS
      const timer = setTimeout(() => setShowBanner(true), 5000);
      return () => clearTimeout(timer);
    }

    // Android / Desktop — listen for beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setShowIOSGuide(false);
    localStorage.setItem('pwa-install-dismissed', String(Date.now()));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Install Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-[100] animate-slide-up">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {showIOSGuide ? (
            /* iOS Guide */
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#1e3a8a] text-sm">Install on iPhone/iPad</h3>
                <button onClick={handleDismiss} className="p-1 hover:bg-slate-100 rounded-full">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <ol className="space-y-2 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Tap the <strong>Share</strong> button <span className="inline-block">⬆️</span> at the bottom of Safari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Tap <strong>"Add"</strong> — done! The app icon appears on your home screen</span>
                </li>
              </ol>
            </div>
          ) : (
            /* Standard install prompt */
            <div className="flex items-center gap-3 p-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0d9488] flex items-center justify-center shadow-lg">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1e3a8a]">Install MRK SEVA 360</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isIOS ? 'Add to your home screen for the best experience' : 'Install as app for faster access & offline support'}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={handleInstall}
                  className="flex items-center gap-1.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
