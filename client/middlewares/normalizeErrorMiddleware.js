export default function normalizeErrorMiddleware() {
  return () => next => action => {
    if (action && action.type.endsWith('_REJECTED') && action.payload) {
      // Try to get the default error message from the response.
      let message = action.payload.statusText || action.payload.status || 'Unknown Server Error';

      const status = (action.payload.response && action.payload.response.status) || 500;
      // Maybe some data is available.
      let error = action.payload.data && action.payload.data.message;
      if (!error) {
        error = action.payload.response && action.payload.response.data && action.payload.response.data.message;
      }

      if (error) {
        message = error.message || error;
      }

      action.errorData = {
        type: action.type.replace('_REJECTED', ''),
        message,
        status
      };
    }

    next(action);
  };
}
