import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  onSnapshot,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
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

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
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
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, path);
      }
    );
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

/**
 * Checks Firestore to see which characters this device has already placed a flower on,
 * and automatically reconciles any locally offered flowers that were not yet persisted
 * to the global Firestore counter.
 */
export async function syncVisitorOfferedStatus(
  characterIds: string[],
  localOfferedMap: Record<string, boolean>,
  onConfirmedOffered: (charId: string) => void,
  onCountSynced?: (charId: string, count: number) => void
): Promise<void> {
  const visitorId = await resolveVisitorId();
  await Promise.all(
    characterIds.map(async (charId) => {
      try {
        const visitorRef = doc(db, 'tributes', charId, 'visitors', visitorId);
        const snap = await getDoc(visitorRef);
        if (snap.exists()) {
          onConfirmedOffered(charId);
        } else if (localOfferedMap[charId]) {
          // Device previously placed a flower locally before the Firestore transaction fix;
          // register its +1 into the global Firestore counter now.
          const res = await recordUniqueFlowerOffering(charId);
          onConfirmedOffered(charId);
          if (onCountSynced && typeof res.flowerCount === 'number' && res.flowerCount >= 1) {
            onCountSynced(charId, res.flowerCount);
          }
        }
      } catch {
        // Ignore transient offline error
      }
    })
  );
}

/**
 * Atomically records a unique 1-time flower offering for (characterId, visitorId)
 * using a Firestore transaction. Creates /tributes/{characterId} with flowerCount = 1
 * on the very first offering, or increments flowerCount by +1 on subsequent offerings
 * from new devices.
 */
export async function recordUniqueFlowerOffering(
  characterId: string
): Promise<{ alreadyOffered: boolean; flowerCount: number }> {
  const visitorId = await resolveVisitorId();
  const tributePath = `tributes/${characterId}`;

  const visitorRef = doc(db, 'tributes', characterId, 'visitors', visitorId);
  const tributeRef = doc(db, 'tributes', characterId);

  try {
    return await runTransaction(db, async (tx) => {
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
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, tributePath);
    throw err;
  }
}
