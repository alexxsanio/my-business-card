/**
 * app/lib/opencv.ts
 *
 * Loads OpenCV.js once and returns a Promise that resolves
 * when cv is fully initialized.
 */

declare global {
  interface Window {
    cv: any;
  }
}

let openCVPromise: Promise<any> | null = null;

/**
 * Returns true if OpenCV has finished initializing.
 */
export function isOpenCVLoaded(): boolean {
  return (
    typeof window !== "undefined" &&
    !!window.cv &&
    typeof window.cv.Mat === "function"
  );
}

/**
 * Waits until OpenCV.js is ready.
 *
 * Usage:
 *   const cv = await loadOpenCV();
 */
export function loadOpenCV(): Promise<any> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("OpenCV can only be loaded in the browser.")
    );
  }

  if (isOpenCVLoaded()) {
    return Promise.resolve(window.cv);
  }

  if (openCVPromise) {
    return openCVPromise;
  }

  openCVPromise = new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(
        new Error(
          "Timed out waiting for OpenCV.js to initialize."
        )
      );
    }, 15000);

    const waitForCV = () => {
      if (
        window.cv &&
        typeof window.cv.Mat === "function"
      ) {
        clearTimeout(timeout);
        resolve(window.cv);
      } else {
        requestAnimationFrame(waitForCV);
      }
    };

    waitForCV();
  });

  return openCVPromise;
}