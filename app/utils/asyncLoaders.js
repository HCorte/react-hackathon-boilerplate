export const errorLoading = err => {
  console.error('Dynamic page loading failed', err) // eslint-disable-line no-console
}

// Used by routes to async load reducers
export const loadModule = cb => componentModule => {
  cb(null, componentModule.default)
}
