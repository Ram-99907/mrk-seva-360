// IndexedDB helper — saves & loads the "Watch Story" video so it survives page refresh

const DB_NAME = 'mrk-seva-360';
const STORE   = 'videos';
const KEY     = 'story-video';
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

/** Save a video Blob to IndexedDB. */
export async function saveVideoBlob(blob: Blob): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).put(blob, KEY);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

/** Load the saved video Blob from IndexedDB. Returns null if nothing saved. */
export async function loadVideoBlob(): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(KEY);
    req.onsuccess = () => resolve((req.result as Blob) ?? null);
    req.onerror   = () => reject(req.error);
  });
}

/** Remove the saved video from IndexedDB. */
export async function clearVideoBlob(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).delete(KEY);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}
