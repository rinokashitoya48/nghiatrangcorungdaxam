import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

function createFirestoreInstance(): Firestore {
  try {
    // Force long polling so mobile networks and in-app browsers (Facebook, Messenger,
    // Discord, Zalo, iOS Safari) never hang or silently drop writes over WebChannel.
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
}

export const db = createFirestoreInstance();
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  };
}

function buildFirestoreErrorInfo(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  return {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData.map((provider) => ({
          providerId: provider.providerId,
          displayName: provider.displayName,
          email: provider.email,
          photoUrl: provider.photoURL,
        })) || [],
    },
    operationType,
    path,
  };
}

export function logFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): FirestoreErrorInfo {
  const errInfo = buildFirestoreErrorInfo(error, operationType, path);
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return errInfo;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo = logFirestoreError(error, operationType, path);
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const VISITOR_STORAGE_KEY = 'runga_da_xam_device_vid_v3';
const VISITOR_COOKIE_NAME = 'runga_da_xam_vid_v3';
const PENDING_OFFERINGS_KEY = 'runga_da_xam_pending_offerings_v3';

function getCookieVisitorId(): string | null {
  try {
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + VISITOR_COOKIE_NAME + '=([^;]*)')
    );
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

function setCookieVisitorId(vid: string): void {
  try {
    document.cookie = `${VISITOR_COOKIE_NAME}=${encodeURIComponent(
      vid
    )}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // ignore
  }
}

function readPendingOfferings(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(PENDING_OFFERINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {};
}

function writePendingOfferings(map: Record<string, boolean>): void {
  try {
    localStorage.setItem(PENDING_OFFERINGS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function markPendingOffering(characterId: string): void {
  const current = readPendingOfferings();
  current[characterId] = true;
  writePendingOfferings(current);
}

export function clearPendingOffering(characterId: string): void {
  const current = readPendingOfferings();
  if (current[characterId]) {
    delete current[characterId];
    writePendingOfferings(current);
  }
}

function generateUniqueDeviceToken(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `vid3_${crypto.randomUUID().replace(/-/g, '')}`;
    }
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `vid3_${hex}`;
    }
  } catch {
    // Fallback below
  }
  const fallbackHex = `${Date.now().toString(16)}${Math.random().toString(16).slice(2, 14)}${Math.random().toString(16).slice(2, 14)}`;
  return `vid3_${fallbackHex.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 36)}`;
}

let cachedVisitorIdPromise: Promise<string> | null = null;

/**
 * Resolves a persistent unique visitor ID per device/browser stored in both
 * localStorage and a 1-year cookie so each device contributes its own flower
 * to the global Firestore total while preventing duplicate clicks on the same device.
 */
export function resolveVisitorId(): Promise<string> {
  if (cachedVisitorIdPromise) {
    return cachedVisitorIdPromise;
  }

  cachedVisitorIdPromise = (async () => {
    try {
      const savedLocal = localStorage.getItem(VISITOR_STORAGE_KEY);
      if (savedLocal && /^[a-zA-Z0-9_-]{4,128}$/.test(savedLocal)) {
        setCookieVisitorId(savedLocal);
        return savedLocal;
      }
    } catch {
      // ignore
    }

    const cookieId = getCookieVisitorId();
    if (cookieId && /^[a-zA-Z0-9_-]{4,128}$/.test(cookieId)) {
      try {
        localStorage.setItem(VISITOR_STORAGE_KEY, cookieId);
      } catch {
        // ignore
      }
      return cookieId;
    }

    const newDeviceId = generateUniqueDeviceToken();

    try {
      localStorage.setItem(VISITOR_STORAGE_KEY, newDeviceId);
    } catch {
      // ignore
    }
    setCookieVisitorId(newDeviceId);
    return newDeviceId;
  })();

  return cachedVisitorIdPromise;
}

/**
 * Fetches authoritative live flower counts directly from the Firestore server
 * for all character IDs so stale local caches never hide the real global total.
 */
export async function fetchCharacterTributes(
  characterIds: string[]
): Promise<Record<string, number>> {
  const results: Record<string, number> = {};

  await Promise.all(
    characterIds.map(async (charId) => {
      const path = `tributes/${charId}`;
      const docRef = doc(db, 'tributes', charId);
      try {
        const snap = await getDocFromServer(docRef);
        if (snap.exists()) {
          const data = snap.data();
          results[charId] =
            typeof data.flowerCount === 'number' && data.flowerCount >= 0
              ? data.flowerCount
              : 0;
        } else {
          results[charId] = 0;
        }
      } catch (serverErr) {
        try {
          const fallbackSnap = await getDoc(docRef);
          if (fallbackSnap.exists()) {
            const data = fallbackSnap.data();
            results[charId] =
              typeof data.flowerCount === 'number' && data.flowerCount >= 0
                ? data.flowerCount
                : 0;
          }
        } catch {
          logFirestoreError(serverErr, OperationType.GET, path);
        }
      }
    })
  );

  return results;
}

export function subscribeToCharacterTributes(
  characterIds: string[],
  onCountChange: (charId: string, count: number) => void
): () => void {
  const unsubscribes = characterIds.map((charId) => {
    const path = `tributes/${charId}`;
    const docRef = doc(db, 'tributes', charId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          if (typeof data.flowerCount === 'number' && data.flowerCount >= 0) {
            onCountChange(charId, data.flowerCount);
          }
        } else if (!snap.metadata.fromCache) {
          onCountChange(charId, 0);
        }
      },
      (err) => {
        logFirestoreError(err, OperationType.GET, path);
      }
    );
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

/**
 * Checks Firestore to see which characters this device has already placed a flower on,
 * and automatically reconciles any locally offered or pending flowers that were not yet
 * persisted to the global Firestore counter.
 */
export async function syncVisitorOfferedStatus(
  characterIds: string[],
  localOfferedMap: Record<string, boolean>,
  onConfirmedOffered: (charId: string) => void,
  onCountSynced?: (charId: string, count: number) => void
): Promise<void> {
  const visitorId = await resolveVisitorId();
  const pendingOfferings = readPendingOfferings();

  await Promise.all(
    characterIds.map(async (charId) => {
      try {
        const visitorRef = doc(db, 'tributes', charId, 'visitors', visitorId);
        let snap;
        try {
          snap = await getDocFromServer(visitorRef);
        } catch {
          snap = await getDoc(visitorRef);
        }

        if (snap.exists()) {
          clearPendingOffering(charId);
          onConfirmedOffered(charId);
        } else if (localOfferedMap[charId] || pendingOfferings[charId]) {
          // Device previously placed a flower locally or while offline;
          // register its +1 into the global Firestore counter now.
          const res = await recordUniqueFlowerOffering(charId);
          clearPendingOffering(charId);
          onConfirmedOffered(charId);
          if (onCountSynced && typeof res.flowerCount === 'number' && res.flowerCount >= 1) {
            onCountSynced(charId, res.flowerCount);
          }
        }
      } catch {
        // Keep pending offering for retry when network recovers
      }
    })
  );
}

const MAX_TRANSACTION_ATTEMPTS = 3;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Atomically records a unique 1-time flower offering for (characterId, visitorId)
 * using a Firestore transaction with automatic retry on transient network/contention errors.
 * Creates /tributes/{characterId} with flowerCount = 1 on the very first offering, or
 * increments flowerCount by +1 on subsequent offerings from new devices.
 */
export async function recordUniqueFlowerOffering(
  characterId: string
): Promise<{ alreadyOffered: boolean; flowerCount: number }> {
  const visitorId = await resolveVisitorId();
  const tributePath = `tributes/${characterId}`;

  const visitorRef = doc(db, 'tributes', characterId, 'visitors', visitorId);
  const tributeRef = doc(db, 'tributes', characterId);

  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_TRANSACTION_ATTEMPTS; attempt++) {
    try {
      const result = await runTransaction(db, async (tx) => {
        const [visitorSnap, tributeSnap] = await Promise.all([
          tx.get(visitorRef),
          tx.get(tributeRef),
        ]);

        const currentCount =
          tributeSnap.exists() && typeof tributeSnap.data()?.flowerCount === 'number'
            ? tributeSnap.data().flowerCount
            : 0;

        if (visitorSnap.exists()) {
          return {
            alreadyOffered: true,
            flowerCount: Math.max(1, currentCount),
          };
        }

        const nextCount = currentCount + 1;

        tx.set(visitorRef, {
          characterId,
          visitorId,
          createdAt: serverTimestamp(),
        });

        if (!tributeSnap.exists()) {
          tx.set(tributeRef, {
            characterId,
            flowerCount: 1,
            updatedAt: serverTimestamp(),
          });
        } else {
          tx.update(tributeRef, {
            flowerCount: nextCount,
            updatedAt: serverTimestamp(),
          });
        }

        return {
          alreadyOffered: false,
          flowerCount: nextCount,
        };
      });

      clearPendingOffering(characterId);
      return result;
    } catch (err) {
      lastError = err;
      if (attempt < MAX_TRANSACTION_ATTEMPTS) {
        await sleep(300 * attempt);
      }
    }
  }

  handleFirestoreError(lastError, OperationType.WRITE, tributePath);
}
