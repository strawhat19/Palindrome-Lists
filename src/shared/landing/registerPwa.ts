export const registerPwa = () => {
  if (!__DEV__ && typeof navigator !== `undefined` && `serviceWorker` in navigator) {
    navigator.serviceWorker.register(`/service-worker.js`).catch(() => {
      // Browsing remains available when offline support cannot be registered.
    });
  }
};
