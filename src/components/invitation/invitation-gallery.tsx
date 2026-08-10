"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { weddingConfig } from "@/config/wedding";

const DESKTOP_MIN_WIDTH = 1024;
const SWIPE_THRESHOLD_PX = 48;
const SWIPE_AXIS_RATIO = 1.2;
const AUTOPLAY_MS = 2000;
const PHOTO_WIDTH = 2400;
const PHOTO_HEIGHT = 3600;
const READY_FAILSAFE_MS = 180;
const SWIPE_MS = 480;

function subscribeDesktop(onChange: () => void) {
  const media = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`).matches;
}

function getServerDesktopSnapshot() {
  return false;
}

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

type BufferState = {
  page: number;
  token: number;
};

type SwipeDirection = "next" | "prev";

type SwipeState = {
  from: 0 | 1;
  to: 0 | 1;
  direction: SwipeDirection;
};

type PanelRole = "active" | "loading" | "exit" | "enter" | "hidden";

type SlidePanelProps = {
  page: number;
  perView: number;
  photos: readonly string[];
  partnerOne: string;
  partnerTwo: string;
  role: PanelRole;
  swipeDirection: SwipeDirection;
  expectedLoads: number;
  loadToken: number;
  onReady: (token: number) => void;
  onSwipeEnd?: () => void;
};

function roleClassName(role: PanelRole, direction: SwipeDirection): string {
  switch (role) {
    case "active":
      return "relative z-10";
    case "loading":
      return "pointer-events-none absolute inset-0 z-0 opacity-0";
    // Keep exit in flow so the track height does not collapse mid-swipe.
    case "exit":
      return direction === "next"
        ? "relative z-10 gallery-swipe-out-next"
        : "relative z-10 gallery-swipe-out-prev";
    case "enter":
      return direction === "next"
        ? "absolute inset-0 z-20 gallery-swipe-in-next"
        : "absolute inset-0 z-20 gallery-swipe-in-prev";
    case "hidden":
    default:
      return "hidden";
  }
}

function SlidePanel({
  page,
  perView,
  photos,
  partnerOne,
  partnerTwo,
  role,
  swipeDirection,
  expectedLoads,
  loadToken,
  onReady,
  onSwipeEnd,
}: SlidePanelProps) {
  const loadedRef = useRef(0);
  const readySentRef = useRef(false);
  const slidePhotos = photos.slice(page * perView, page * perView + perView);
  const isLoadingTarget = role === "loading";

  const markReady = useCallback(() => {
    if (readySentRef.current) return;
    readySentRef.current = true;
    onReady(loadToken);
  }, [loadToken, onReady]);

  useEffect(() => {
    if (!isLoadingTarget) return;
    loadedRef.current = 0;
    readySentRef.current = false;
    const failsafe = window.setTimeout(markReady, READY_FAILSAFE_MS);
    return () => window.clearTimeout(failsafe);
  }, [isLoadingTarget, loadToken, markReady]);

  const handleLoad = useCallback(() => {
    if (!isLoadingTarget) return;
    loadedRef.current += 1;
    if (loadedRef.current >= expectedLoads) {
      markReady();
    }
  }, [expectedLoads, isLoadingTarget, markReady]);

  return (
    <div
      className={[
        "w-full min-w-0 max-w-full transform-gpu will-change-transform",
        roleClassName(role, swipeDirection),
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden={role !== "active" && role !== "enter"}
      onAnimationEnd={(event) => {
        // Only the incoming panel should finish the swipe pair.
        if (role === "enter" && event.target === event.currentTarget) {
          onSwipeEnd?.();
        }
      }}
    >
      <div
        className={
          perView === 2
            ? "grid w-full min-w-0 grid-cols-2 gap-4 px-4 sm:gap-6 sm:px-6 lg:gap-6 lg:px-8 [&>*]:min-w-0"
            : "grid w-full min-w-0 grid-cols-1"
        }
      >
        {slidePhotos.map((src, index) => {
          const absoluteIndex = page * perView + index;
          return (
            <div
              key={`${loadToken}-${src}`}
              className={
                perView === 2
                  ? "flex w-full min-w-0 items-start justify-center overflow-hidden rounded-2xl"
                  : "flex w-full min-w-0 items-start justify-center overflow-hidden"
              }
            >
              <Image
                src={src}
                alt={`${partnerOne} y ${partnerTwo}, foto ${absoluteIndex + 1}`}
                width={PHOTO_WIDTH}
                height={PHOTO_HEIGHT}
                className={
                  perView === 2
                    ? "gallery-slide-photo gallery-slide-photo--desktop"
                    : "gallery-slide-photo gallery-slide-photo--mobile"
                }
                sizes={
                  perView === 2 ? "(max-width: 1024px) 50vw, 50vw" : "100vw"
                }
                unoptimized
                priority={absoluteIndex < 4 || isLoadingTarget}
                onLoad={handleLoad}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function panelRole(
  index: 0 | 1,
  activeBuffer: 0 | 1,
  loadingBuffer: 0 | 1 | null,
  swipe: SwipeState | null,
): PanelRole {
  if (swipe) {
    if (index === swipe.from) return "exit";
    if (index === swipe.to) return "enter";
    return "hidden";
  }
  if (index === activeBuffer) return "active";
  if (index === loadingBuffer) return "loading";
  return "hidden";
}

/**
 * Dual-buffer gallery with horizontal swipe transition once the next slide is ready.
 */
export function InvitationGallery() {
  const { couple, assets } = weddingConfig;
  const photos = assets.gallery;

  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  );
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  const perView = isDesktop ? 2 : 1;

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(photos.length / perView)),
    [photos.length, perView],
  );

  const tokenSeq = useRef(1);
  const directionRef = useRef<SwipeDirection>("next");
  const activeBufferRef = useRef<0 | 1>(0);
  const [activeBuffer, setActiveBuffer] = useState<0 | 1>(0);
  const [buffers, setBuffers] = useState<[BufferState, BufferState]>(() => [
    { page: 0, token: 0 },
    { page: 0, token: 0 },
  ]);
  const [loadingBuffer, setLoadingBuffer] = useState<0 | 1 | null>(null);
  const [swipe, setSwipe] = useState<SwipeState | null>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const isBusy = loadingBuffer !== null || swipe !== null;
  const activePage = Math.min(buffers[activeBuffer].page, pageCount - 1);

  const finishSwipe = useCallback(() => {
    setSwipe((current) => {
      if (!current) return null;
      activeBufferRef.current = current.to;
      setActiveBuffer(current.to);
      setLoadingBuffer(null);
      return null;
    });
  }, []);

  const handleBufferReady = useCallback(
    (token: number) => {
      setLoadingBuffer((loading) => {
        if (loading === null) return null;

        setBuffers((bufs) => {
          if (bufs[loading].token !== token) return bufs;

          if (prefersReducedMotion) {
            activeBufferRef.current = loading;
            setActiveBuffer(loading);
            return bufs;
          }

          // Start swipe only after the incoming photos are ready.
          setSwipe({
            from: activeBufferRef.current,
            to: loading,
            direction: directionRef.current,
          });
          return bufs;
        });

        // Keep "loading" until swipe finishes so roles stay stable; if reduced motion, clear now.
        if (prefersReducedMotion) return null;
        return loading;
      });
    },
    [prefersReducedMotion],
  );

  // Failsafe if animationend is missed.
  useEffect(() => {
    if (!swipe) return;
    const id = window.setTimeout(finishSwipe, SWIPE_MS + 80);
    return () => window.clearTimeout(id);
  }, [finishSwipe, swipe]);

  const goTo = useCallback(
    (index: number, direction: SwipeDirection = "next") => {
      if (isBusy) return;

      const next = Math.max(0, Math.min(index, pageCount - 1));
      if (next === activePage) return;

      directionRef.current = direction;
      const inactive = (activeBufferRef.current === 0 ? 1 : 0) as 0 | 1;
      const token = tokenSeq.current++;

      setBuffers((prev) => {
        const copy: [BufferState, BufferState] = [
          { ...prev[0] },
          { ...prev[1] },
        ];
        copy[inactive] = { page: next, token };
        return copy;
      });
      setLoadingBuffer(inactive);
    },
    [activePage, isBusy, pageCount],
  );

  const goNext = useCallback(() => {
    goTo((activePage + 1) % pageCount, "next");
  }, [activePage, goTo, pageCount]);

  const goPrev = useCallback(() => {
    goTo((activePage - 1 + pageCount) % pageCount, "prev");
  }, [activePage, goTo, pageCount]);

  useEffect(() => {
    if (!isDesktop) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const root = sectionRef.current;
      if (!root) return;
      const activeEl = document.activeElement;
      const focusInside =
        activeEl === root ||
        (activeEl instanceof Node && root.contains(activeEl));
      const rect = root.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!focusInside && !inView) return;

      event.preventDefault();
      if (event.key === "ArrowRight") goNext();
      else goPrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goNext, goPrev, isDesktop]);

  useEffect(() => {
    if (isPaused || prefersReducedMotion || pageCount <= 1 || isBusy) {
      return;
    }
    const id = window.setInterval(goNext, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [goNext, isBusy, isPaused, pageCount, prefersReducedMotion]);

  const expectedFor = (page: number) =>
    Math.max(1, Math.min(perView, photos.length - page * perView));

  const arrowButtonClass =
    "absolute top-1/2 z-30 hidden size-12 -translate-y-1/2 items-center justify-center rounded-full border-2 border-cover-cta-fg/40 bg-cream-figma/90 text-cover-cta-fg shadow-sm transition-[transform,opacity] hover:bg-cream-figma focus-visible:ring-2 focus-visible:ring-gallery-dot focus-visible:outline-none active:scale-95 disabled:opacity-40 lg:flex";

  const swipeDirection = swipe?.direction ?? "next";

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      aria-label="Galería"
      aria-roledescription="carrusel"
      className="overflow-x-hidden bg-accent pb-6 outline-none lg:py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div
        className="relative w-full max-w-full overflow-hidden touch-pan-y"
        onTouchStart={(event) => {
          if (isDesktop) return;
          const touch = event.changedTouches[0];
          if (!touch) return;
          setIsPaused(true);
          setTouchStart({ x: touch.clientX, y: touch.clientY });
        }}
        onTouchEnd={(event) => {
          if (isDesktop) {
            setIsPaused(false);
            return;
          }
          if (touchStart === null) {
            setIsPaused(false);
            return;
          }
          const touch = event.changedTouches[0];
          if (!touch) {
            setTouchStart(null);
            setIsPaused(false);
            return;
          }
          const deltaX = touch.clientX - touchStart.x;
          const deltaY = touch.clientY - touchStart.y;
          const isHorizontal =
            Math.abs(deltaX) >= SWIPE_THRESHOLD_PX &&
            Math.abs(deltaX) >= Math.abs(deltaY) * SWIPE_AXIS_RATIO;

          if (isHorizontal && !isBusy) {
            if (deltaX < 0) goNext();
            else goPrev();
          }
          setTouchStart(null);
          setIsPaused(false);
        }}
        onTouchCancel={() => {
          setTouchStart(null);
          setIsPaused(false);
        }}
      >
        {isDesktop ? (
          <>
            <button
              type="button"
              aria-label="Diapositiva anterior"
              className={`${arrowButtonClass} left-3 xl:left-6`}
              onClick={goPrev}
              disabled={isBusy || pageCount <= 1}
            >
              <span aria-hidden className="text-2xl leading-none">
                ‹
              </span>
            </button>
            <button
              type="button"
              aria-label="Diapositiva siguiente"
              className={`${arrowButtonClass} right-3 xl:right-6`}
              onClick={goNext}
              disabled={isBusy || pageCount <= 1}
            >
              <span aria-hidden className="text-2xl leading-none">
                ›
              </span>
            </button>
          </>
        ) : null}

        <div className="relative w-full overflow-hidden">
          <SlidePanel
            page={Math.min(buffers[0].page, pageCount - 1)}
            perView={perView}
            photos={photos}
            partnerOne={couple.partnerOne}
            partnerTwo={couple.partnerTwo}
            role={panelRole(0, activeBuffer, loadingBuffer, swipe)}
            swipeDirection={swipeDirection}
            expectedLoads={expectedFor(Math.min(buffers[0].page, pageCount - 1))}
            loadToken={buffers[0].token}
            onReady={handleBufferReady}
            onSwipeEnd={finishSwipe}
          />
          <SlidePanel
            page={Math.min(buffers[1].page, pageCount - 1)}
            perView={perView}
            photos={photos}
            partnerOne={couple.partnerOne}
            partnerTwo={couple.partnerTwo}
            role={panelRole(1, activeBuffer, loadingBuffer, swipe)}
            swipeDirection={swipeDirection}
            expectedLoads={expectedFor(Math.min(buffers[1].page, pageCount - 1))}
            loadToken={buffers[1].token}
            onReady={handleBufferReady}
            onSwipeEnd={finishSwipe}
          />
        </div>
      </div>

      <div
        className="mt-4 flex flex-wrap items-center justify-center gap-2 px-4 sm:mt-6 sm:gap-3"
        role="tablist"
        aria-label="Diapositivas de la galería"
      >
        {Array.from({ length: pageCount }, (_, index) => {
          const isActive = index === activePage;
          return (
            <button
              key={`gallery-dot-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={`Ir a la diapositiva ${index + 1} de ${pageCount}`}
              onClick={() => goTo(index, index > activePage ? "next" : "prev")}
              disabled={isBusy}
              className={
                isActive
                  ? "size-3 rounded-full bg-gallery-dot transition-opacity"
                  : "size-3 rounded-full bg-gallery-dot/35 transition-opacity hover:bg-gallery-dot/55 disabled:opacity-40"
              }
            />
          );
        })}
      </div>
    </section>
  );
}
