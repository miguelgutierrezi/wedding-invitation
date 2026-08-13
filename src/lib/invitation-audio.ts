/**
 * Module / global Audio so playback survives client navigations
 * (cover → invitacion → inspiracion → back) without remounting a React tree.
 */

const PLAY_INTENT_KEY = "invitation-music-play";
const MUTED_KEY = "invitation-music-muted";
const GLOBAL_AUDIO_KEY = "__weddingInvitationAudio";

type InvitationAudioStore = {
  element: HTMLAudioElement | null;
};

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

function getAudioStore(): InvitationAudioStore {
  const globalRef = globalThis as typeof globalThis & {
    [GLOBAL_AUDIO_KEY]?: InvitationAudioStore;
  };

  if (!globalRef[GLOBAL_AUDIO_KEY]) {
    globalRef[GLOBAL_AUDIO_KEY] = { element: null };
  }

  return globalRef[GLOBAL_AUDIO_KEY];
}

function readSessionFlag(key: string): boolean {
  if (!canUseDom()) {
    return false;
  }
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeSessionFlag(key: string, value: boolean): void {
  if (!canUseDom()) {
    return;
  }
  try {
    if (value) {
      sessionStorage.setItem(key, "1");
    } else {
      sessionStorage.removeItem(key);
    }
  } catch {
    // sessionStorage may be blocked (private mode).
  }
}

function attachAudioToDocument(element: HTMLAudioElement): void {
  if (element.isConnected || !document.body) {
    return;
  }

  element.setAttribute("data-invitation-audio", "true");
  element.setAttribute("playsinline", "true");
  element.className = "pointer-events-none fixed h-px w-px opacity-0";
  element.tabIndex = -1;
  document.body.appendChild(element);
}

export function getInvitationAudio(src: string): HTMLAudioElement | null {
  if (!canUseDom() || !src) {
    return null;
  }

  const store = getAudioStore();

  if (!store.element || store.element.dataset.src !== src) {
    store.element?.pause();
    store.element?.remove();
    store.element = new Audio(src);
    store.element.dataset.src = src;
    store.element.loop = true;
    store.element.preload = "auto";
    store.element.volume = 0.55;
    attachAudioToDocument(store.element);
  } else {
    attachAudioToDocument(store.element);
  }

  return store.element;
}

/** Mark that the guest intended music when opening the invitation. */
export function setInvitationMusicPlayIntent(): void {
  writeSessionFlag(PLAY_INTENT_KEY, true);
  writeSessionFlag(MUTED_KEY, false);
}

export function consumeInvitationMusicPlayIntent(): boolean {
  if (!readSessionFlag(PLAY_INTENT_KEY)) {
    return false;
  }
  writeSessionFlag(PLAY_INTENT_KEY, false);
  return true;
}

export function hasInvitationMusicPlayIntent(): boolean {
  return readSessionFlag(PLAY_INTENT_KEY);
}

export function isInvitationMusicMutedByUser(): boolean {
  return readSessionFlag(MUTED_KEY);
}

/**
 * Start (or resume) invitation soundtrack. Best called from a user gesture
 * (cover CTA, inspiration links, back). Safe to call again on body routes.
 */
export async function startInvitationMusic(src: string): Promise<boolean> {
  const element = getInvitationAudio(src);
  if (!element) {
    return false;
  }

  setInvitationMusicPlayIntent();

  try {
    await element.play();
    return true;
  } catch {
    return false;
  }
}

/**
 * Keep playing across soft navigations when the guest has not muted.
 * No-op if there was never play intent or the user muted.
 */
export async function continueInvitationMusicIfNeeded(
  src: string,
): Promise<boolean> {
  if (!hasInvitationMusicPlayIntent() || isInvitationMusicMutedByUser()) {
    return isInvitationMusicPlaying();
  }

  const element = getInvitationAudio(src);
  if (!element) {
    return false;
  }

  if (!element.paused) {
    return true;
  }

  try {
    await element.play();
    return true;
  } catch {
    return false;
  }
}

export async function pauseInvitationMusic(): Promise<void> {
  getAudioStore().element?.pause();
}

export async function toggleInvitationMusic(src: string): Promise<boolean> {
  const element = getInvitationAudio(src);
  if (!element) {
    return false;
  }

  if (!element.paused) {
    element.pause();
    writeSessionFlag(MUTED_KEY, true);
    return false;
  }

  writeSessionFlag(MUTED_KEY, false);
  writeSessionFlag(PLAY_INTENT_KEY, true);

  try {
    await element.play();
    return true;
  } catch {
    return false;
  }
}

export function isInvitationMusicPlaying(): boolean {
  const element = getAudioStore().element;
  return Boolean(element && !element.paused);
}
