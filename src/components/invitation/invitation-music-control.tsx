"use client";

import { useEffect, useState } from "react";

import { weddingConfig } from "@/config/wedding";
import {
  getInvitationAudio,
  hasInvitationMusicPlayIntent,
  isInvitationMusicMutedByUser,
  isInvitationMusicPlaying,
  startInvitationMusic,
  toggleInvitationMusic,
} from "@/lib/invitation-audio";

/**
 * Floating mute/unmute for invitation music.
 * Picks up playback started from the cover CTA when possible.
 */
export function InvitationMusicControl() {
  const musicSrc = weddingConfig.assets.music;
  const enabled = weddingConfig.features.music && Boolean(musicSrc);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!enabled || !musicSrc) {
      return;
    }

    const audio = getInvitationAudio(musicSrc);
    if (!audio) {
      return;
    }

    const sync = () => setPlaying(!audio.paused);

    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    sync();

    // Resume if the cover set intent and the guest has not muted.
    const shouldPlay =
      (hasInvitationMusicPlayIntent() || isInvitationMusicPlaying()) &&
      !isInvitationMusicMutedByUser();
    if (shouldPlay) {
      void startInvitationMusic(musicSrc).then((ok) => setPlaying(ok));
    }

    return () => {
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
    };
  }, [enabled, musicSrc]);

  if (!enabled || !musicSrc) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label={playing ? "Silenciar la música" : "Reproducir la música"}
      aria-pressed={playing}
      onClick={() => {
        void toggleInvitationMusic(musicSrc).then(setPlaying);
      }}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 inline-flex size-12 min-h-11 min-w-11 items-center justify-center rounded-full border-2 border-cover-cta-fg bg-cream-figma/95 text-cover-cta-fg shadow-sm transition-[transform,opacity] hover:opacity-90 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none active:scale-95 sm:right-6 sm:bottom-6"
    >
      <span aria-hidden className="text-lg leading-none">
        {playing ? "♪" : "♩"}
      </span>
      <span className="sr-only">
        {playing ? "Música activa" : "Música en pausa"}
      </span>
    </button>
  );
}
