export default function normalizeErrorMiddleware() {
  return () => next => action => {
    if (action && action.type.endsWith('_REJECTED') && action.payload) {
      // Try to get the default error message from the response.
      let errorMessage = action.payload.statusText || action.payload.status || 'Unknown Server Error';

      // Maybe some data is available.
      let error = action.payload.data && action.payload.data.message;
      if (!error) {
        error = action.payload.response && action.payload.response.data && action.payload.response.data.message;
      }

      if (error) {
        errorMessage = error.message || error;
      }

      action.errorMessage = errorMessage;
    }

    next(action);
  };
}
