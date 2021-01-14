/**
 * This module allows us to visually test both dark and light versions
 * of all stories
 */
import React from "react";
import { ThemeProvider } from "../src/theme";

declare global {
  // eslint-disable-next-line functional/prefer-type-literal
  interface Window {
    __dark__: boolean;
    __snapshot__: boolean;
    snaps: {
      animationsDisabled: boolean;
      waitForAnimations: () => Promise<void>;
      teardown: () => void;
    };
  }
}

window.snaps = {
  animationsDisabled: false,
  waitForAnimations: () => Promise.resolve(),
  teardown: () => {},
};

/**
 * Credits to `loki` for this helper function
 *
 * https://github.com/oblador/loki/blob/d3465e85588eb3ddfb4a68aa12bba4faae8d7a6e/packages/browser/src/disable-animations.js
 */
const disableAnimations = (): void => {
  const DISABLE_CSS_ANIMATIONS_STYLE = `
  *, :before, :after {
    -webkit-transition: none !important;
    transition: none !important;
    -webkit-animation: none !important;
    animation: none !important;
    will-change: auto !important;
  }
  `;

  const frameDuration = 16;
  const maxFrames = 100;
  let currentFrame = 0;
  const callbacks: FrameRequestCallback[] = [];
  const overflowCallbacks: FrameRequestCallback[] = [];
  const resolvedListeners: { cb: () => void; cancelTimeout: () => void }[] = [];
  let resolveRAFTimer: NodeJS.Timeout | null;

  // Speed up with 10x, but beware stepping too fast might cause
  // react-motion to pause them instead.
  const now = (): number => currentFrame * 10 * frameDuration;

  // In the case of multiple concurrent animations we want to
  // advance them together just like rAF would.
  const scheduleFrame = (): void => {
    // Cancel the timouts of any
    // current listeners, as we know that we will
    // resolve them very soon
    resolvedListeners.forEach(({ cancelTimeout }) => cancelTimeout());
    setTimeout(() => {
      currentFrame += 1;
      callbacks.splice(0).forEach((c) => c(now()));

      // Assume no new invocations for 50ms means we've ended
      resolveRAFTimer = setTimeout(() => {
        resolvedListeners.splice(0).forEach(({ cb }) => cb());
        resolveRAFTimer = null;
      }, 50);
    }, 0);

    if (resolveRAFTimer) {
      clearTimeout(resolveRAFTimer);
      resolveRAFTimer = null;
    }
  };

  const previousRequestAnimationFrame = window.requestAnimationFrame;

  // Monkey patch rAF to resolve immediately. This makes JS
  // based animations run until the end within a few milliseconds.
  // In case they run infinitely or more than 1000 frames/16 "seconds",
  // we just force them to a pause.
  window.requestAnimationFrame = (callback) => {
    // Avoid infinite loop by only allowing 1000 frames
    if (currentFrame < maxFrames) {
      callbacks.push(callback);
      if (callbacks.length === 1) {
        scheduleFrame();
      }
    } else {
      overflowCallbacks.push(callback);
    }
    return -1;
  };

  const previousPerformanceNow = window.performance.now;
  // For implementations of JS transitions that don't use the rAF
  // timestamp callback argument, we need to monkey patch `performance.now`
  // too. Potentially need to include `Date.now` in the future.
  window.performance.now = now;

  const styleElement = window.document.createElement("style");
  // Disable CSS animations/transitions by forcing style.
  // Potentially not effective enough if `!important` is used
  // elsewhere in the story stylesheet/inline CSS.
  window.document.addEventListener("DOMContentLoaded", () => {
    window.document.documentElement.appendChild(styleElement);
    styleElement.sheet?.insertRule(DISABLE_CSS_ANIMATIONS_STYLE);
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.querySelector("body")!.style.padding = "initial";

  window.snaps = {
    animationsDisabled: true,
    waitForAnimations: () =>
      new Promise((resolve) => {
        let timeout: number;
        if (callbacks.length < 1) {
          timeout = setTimeout(resolve, 100);
        }
        resolvedListeners.push({
          cancelTimeout: () => clearTimeout(timeout),
          cb: resolve,
        });
      }),
    teardown: () => {
      window.snaps.animationsDisabled = false;
      window.requestAnimationFrame = previousRequestAnimationFrame;
      window.performance.now = previousPerformanceNow;
      overflowCallbacks.splice(0).forEach((c) => c(now()));
      styleElement.remove();
    },
  };
};

const AutoTheme: React.FC<{ theme: { dark: boolean } }> = ({
  theme,
  children,
}) => {
  // eslint-disable-next-line no-underscore-dangle
  const snapshot = window.__snapshot__;
  // eslint-disable-next-line no-underscore-dangle
  const dark = snapshot ? window.__dark__ : theme.dark;
  if (!window.snaps.animationsDisabled && snapshot) {
    disableAnimations();
  }

  return <ThemeProvider theme={{ dark }}>{children}</ThemeProvider>;
};

export default AutoTheme;
