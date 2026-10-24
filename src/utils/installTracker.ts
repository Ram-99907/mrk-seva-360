// PWA Install Tracker for MEDI SEVA 360

interface InstallRecord {
  id: string;
  timestamp: string;
  userAgent: string;
  platform: string;
  standalone: boolean;
  referrer: string;
}

const INSTALL_KEY = 'mediseva-installs';
const VISIT_KEY = 'mediseva-visits';

/** Track a new visit */
export function trackVisit(): void {
  const visits: { timestamp: string; userAgent: string; path: string }[] = 
    JSON.parse(localStorage.getItem(VISIT_KEY) || '[]');
  
  // Only track once per session
  const sessionKey = 'mediseva-session-tracked';
  if (sessionStorage.getItem(sessionKey)) return;
  sessionStorage.setItem(sessionKey, 'true');

  visits.push({
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    path: window.location.pathname,
  });

  // Keep last 200 visits
  if (visits.length > 200) visits.splice(0, visits.length - 200);
  localStorage.setItem(VISIT_KEY, JSON.stringify(visits));

  // Send to server
  fetch('/api/track-install', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'visit', userAgent: navigator.userAgent, path: window.location.pathname }),
  }).catch(() => {});
}

/** Check if running as installed PWA */
export function isRunningAsPWA(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes('android-app://')
  );
}

/** Initialize install tracking */
export function initInstallTracker(): void {
  // Track visit
  trackVisit();

  // Track if opened as PWA
  if (isRunningAsPWA()) {
    const pwaOpens: string[] = JSON.parse(localStorage.getItem('mediseva-pwa-opens') || '[]');
    const sessionKey = 'mediseva-pwa-session-tracked';
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, 'true');
      pwaOpens.push(new Date().toISOString());
      if (pwaOpens.length > 100) pwaOpens.splice(0, pwaOpens.length - 100);
      localStorage.setItem('mediseva-pwa-opens', JSON.stringify(pwaOpens));

      fetch('/api/track-install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'pwa_open', userAgent: navigator.userAgent }),
      }).catch(() => {});
    }
  }

  // Listen for install event
  window.addEventListener('appinstalled', () => {
    const installs: InstallRecord[] = JSON.parse(localStorage.getItem(INSTALL_KEY) || '[]');
    const record: InstallRecord = {
      id: 'install-' + Date.now(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      platform: navigator.platform || 'unknown',
      standalone: isRunningAsPWA(),
      referrer: document.referrer || 'direct',
    };
    installs.push(record);
    localStorage.setItem(INSTALL_KEY, JSON.stringify(installs));

    // Send to server
    fetch('/api/track-install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'install', ...record }),
    }).catch(() => {});
  });

  // Listen for beforeinstallprompt (tracks install prompt shown)
  window.addEventListener('beforeinstallprompt', () => {
    fetch('/api/track-install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'install_prompt_shown', userAgent: navigator.userAgent }),
    }).catch(() => {});
  });
}

/** Get local install records */
export function getLocalInstalls(): InstallRecord[] {
  return JSON.parse(localStorage.getItem(INSTALL_KEY) || '[]');
}

/** Get local visit count */
export function getLocalVisits(): any[] {
  return JSON.parse(localStorage.getItem(VISIT_KEY) || '[]');
}

/** Get PWA open count */
export function getPWAOpens(): string[] {
  return JSON.parse(localStorage.getItem('mediseva-pwa-opens') || '[]');
}

/** Get today's stats */
export function getTodayStats() {
  const today = new Date().toISOString().split('T')[0];
  const visits = getLocalVisits().filter(v => v.timestamp?.startsWith(today));
  const installs = getLocalInstalls().filter(i => i.timestamp?.startsWith(today));
  const pwaOpens = getPWAOpens().filter(t => t.startsWith(today));

  return {
    visitsToday: visits.length,
    installsToday: installs.length,
    pwaOpensToday: pwaOpens.length,
    totalVisits: getLocalVisits().length,
    totalInstalls: getLocalInstalls().length,
    totalPWAOpens: getPWAOpens().length,
    isCurrentlyPWA: isRunningAsPWA(),
  };
}
