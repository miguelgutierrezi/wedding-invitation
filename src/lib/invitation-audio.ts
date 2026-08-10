/**
 * Module-level Audio so playback survives client navigations
 * (cover → /invitacion) without remounting a React tree.
 */

const PLAY_INTENT_KEY = "invitation-music-play";

let audio: HTMLAudioElement | null = null;

function canUseDom(): boolean {
  return typeof window !== "undefined";
}

export function getInvitationAudio(src: string): HTMLAudioElement | null {
  if (!canUseDom() || !src) {
    return null;
  }

  if (!audio || audio.dataset.src !== src) {
    audio?.pause();
    audio = new Audio(src);
    audio.dataset.src = src;
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0.55;
  }

  return audio;
}

/** Mark that the guest intended music when opening the invitation. */
export function setInvitationMusicPlayIntent(): void {
  if (!canUseDom()) {
    return;
  }
  try {
    sessionStorage.setItem(PLAY_INTENT_KEY, "1");
  } catch {
    // sessionStorage may be blocked (private mode).
  }
}

export function consumeInvitationMusicPlayIntent(): boolean {
  if (!canUseDom()) {
    return false;
  }
  try {
    const value = sessionStorage.getItem(PLAY_INTENT_KEY);
    if (value === "1") {
      sessionStorage.removeItem(PLAY_INTENT_KEY);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

export function hasInvitationMusicPlayIntent(): boolean {
  if (!canUseDom()) {
    return false;
  }
  try {
    return sessionStorage.getItem(PLAY_INTENT_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Start (or resume) invitation soundtrack. Best called from a user gesture
 * (cover CTA). Safe to call again on the body route.
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

export async function pauseInvitationMusic(): Promise<void> {
  audio?.pause();
}

export async function toggleInvitationMusic(src: string): Promise<boolean> {
  const element = getInvitationAudio(src);
  if (!element) {
    return false;
  }

  if (!element.paused) {
    element.pause();
    return false;
  }

  try {
    await element.play();
    return true;
  } catch {
    return false;
  }
}

export function isInvitationMusicPlaying(): boolean {
  return Boolean(audio && !audio.paused);
}
