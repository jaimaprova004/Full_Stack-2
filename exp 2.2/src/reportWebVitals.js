// Minimal reportWebVitals stub so CRA import resolves during development.
// Keeps the same API shape as the CRA template but does nothing by default.
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Optionally load web-vitals if the caller wants to measure performance.
    import('web-vitals')
      .then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        try {
          getCLS(onPerfEntry);
          getFID(onPerfEntry);
          getFCP(onPerfEntry);
          getLCP(onPerfEntry);
          getTTFB(onPerfEntry);
        } catch (e) {
          // ignore errors from web-vitals in dev
        }
      })
      .catch(() => {});
  }
};

export default reportWebVitals;
