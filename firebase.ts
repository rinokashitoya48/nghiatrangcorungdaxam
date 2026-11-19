import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  onSnapshot,
  setDoc,
  updateDoc,
  increment,
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

const VISITOR_STORAGE_KEY = 'runga_da_xam_visitor_fingerprint_v2';
const VISITOR_IP_CACHE_KEY = 'runga_da_xam_visitor_ip_v2';
const VISITOR_COOKIE_NAME = 'runga_da_xam_vid';

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

function hashStringDeterministic(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0, ch; i < input.length; i++) {
    ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hex1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const hex2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `${hex1}${hex2}`;
}

function getDeviceSignature(): string {
  const nav = typeof navigator !== 'undefined' ? navigator : null;
  const scr = typeof screen !== 'undefined' ? screen : null;
  const tz =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone || ''
      : '';
  const parts = [
    nav?.userAgent || '',
    nav?.language || '',
    String(nav?.hardwareConcurrency || ''),
    String(nav?.maxTouchPoints || ''),
    scr ? `${Math.min(scr.width, scr.height)}x${Math.max(scr.width, scr.height)}x${scr.colorDepth}` : '',
    tz,
  ];
  return parts.join('|');
}

let cachedVisitorIdPromise: Promise<string> | null = null;

/**
 * Resolves a stable, deterministic visitor ID combining public IP + device signature,
 * backed by localStorage and a 1-year cookie so returning visitors are always recognized
 * without needing to log in.
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

    let publicIp = '';
    try {
      publicIp = localStorage.getItem(VISITOR_IP_CACHE_KEY) || '';
    } catch {
      // ignore
    }

    if (!publicIp) {
      try {
        const controller = new AbortController();
        const timer = window.setTimeout(() => controller.abort(), 1600);
        const res = await fetch('https://api.ipify.org?format=json', {
          signal: controller.signal,
        });
        window.clearTimeout(timer);
        if (res.ok) {
          const data = (await res.json()) as { ip?: string };
          if (data?.ip) {
            publicIp = data.ip.trim();
            try {
              localStorage.setItem(VISITOR_IP_CACHE_KEY, publicIp);
            } catch {
              // ignore
            }
          }
        }
      } catch {
        // Fallback to device signature if IP service is unreachable
      }
    }

    const rawFingerprint = `${publicIp || 'noip'}::${getDeviceSignature()}`;
    const hA = hashStringDeterministic(rawFingerprint);
    const hB = hashStringDeterministic(`salt_runga_da_xam::${rawFingerprint}`);
    const deterministicId = `v_${hA}${hB}`;

    try {
      localStorage.setItem(VISITOR_STORAGE_KEY, deterministicId);
    } catch {
      // ignore
    }
    setCookieVisitorId(deterministicId);
    return deterministicId;
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
        console.warn(`Tribute sync warning for ${path}:`, err);
      }
    );
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
}

/**
 * Checks Firestore to see which characters this visitor (by IP + device fingerprint)
 * has already placed a flower on, restoring their unlocked status across sessions.
 */
export async function syncVisitorOfferedStatus(
  characterIds: string[],
  onConfirmedOffered: (charId: string) => void
): Promise<void> {
  const visitorId = await resolveVisitorId();
  await Promise.all(
    characterIds.map(async (charId) => {
      try {
        const visitorRef = doc(db, 'tributes', charId, 'visitors', visitorId);
        const snap = await getDoc(visitorRef);
        if (snap.exists()) {
          onConfirmedOffered(charId);
        }
      } catch {
        // Ignore transient offline error
      }
    })
  );
}

/**
 * Records a unique 1-time flower offering for (characterId, visitorId).
 * If this visitor already offered a flower to this character, it does NOT increment
 * the counter again, preventing duplicate/fake likes.
 */
export async function recordUniqueFlowerOffering(
  characterId: string
): Promise<{ alreadyOffered: boolean }> {
  const visitorId = await resolveVisitorId();
  const visitorPath = `tributes/${characterId}/visitors/${visitorId}`;
  const tributePath = `tributes/${characterId}`;

  const visitorRef = doc(db, 'tributes', characterId, 'visitors', visitorId);
  const tributeRef = doc(db, 'tributes', characterId);

  try {
    const existingVisitorSnap = await getDoc(visitorRef);
    if (existingVisitorSnap.exists()) {
      return { alreadyOffered: true };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, visitorPath);
  }

  // 1. Create the unique visitor receipt document
  try {
    await setDoc(visitorRef, {
      characterId,
      visitorId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    // If creation failed because it already exists, treat as already offered
    const code = (err as { code?: string })?.code || '';
    if (code === 'permission-denied') {
      return { alreadyOffered: true };
    }
    handleFirestoreError(err, OperationType.CREATE, visitorPath);
  }

  // 2. Increment the aggregate flowerCount on /tributes/{characterId} by exactly +1
  try {
    await updateDoc(tributeRef, {
      flowerCount: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const code = (err as { code?: string })?.code || '';
    if (code === 'not-found' || message.includes('No document to update')) {
      try {
        await setDoc(tributeRef, {
          characterId,
          flowerCount: 1,
          updatedAt: serverTimestamp(),
        });
      } catch (createErr) {
        handleFirestoreError(createErr, OperationType.CREATE, tributePath);
      }
    } else {
      handleFirestoreError(err, OperationType.UPDATE, tributePath);
    }
  }

  return { alreadyOffered: false };
}
