export function registerSW() {
  return () => {};
}

export function useRegisterSW() {
  return {
    offlineReady: [false, () => {}],
    needRefresh: [false, () => {}],
    updateServiceWorker: () => Promise.resolve()
  };
}
