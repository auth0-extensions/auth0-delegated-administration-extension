const defaultMessages = {
  defaultErrorMessage: 'Unknown Error',
  FETCH_ACCESS_LEVEL: { default: 'An error occurred while loading the settings: {message}' },
  FETCH_APPLICATIONS: { default: 'An error occurred while loading the applications: {message}' },
  BLOCK_USER: { default: 'An error occurred while blocking the user: {message}' },
  FETCH_CONNECTIONS: { default: 'An error occurred while loading the connections: {message}' },
  EMAIL_CHANGE: { default: 'An error occurred while changing the email: {message}' },
  FIELDS_CHANGE: { default: 'An error occurred while changing the users fields: {message}' },
  FETCH_LANGUAGE_DICTIONARY: { default: 'An error occurred while loading the language dictionary: {message}' },
  FETCH_LOG: { default: 'An error occurred while loading the log record: {message}' },
  FETCH_LOGS: { default: 'An error occurred while loading the logs list: {message}' },
  REMOVE_MULTIFACTOR: { default: 'An error occurred while removing multi factor authentication for the user: {message}' },
  PASSWORD_CHANGE: { default: 'An error occurred while changing the password: {message}' },
  PASSWORD_RESET: { default: 'An error occurred while resetting the password: {message}' },
  FETCH_SCRIPT: { default: 'An error occurred while loading the script: {message}' },
  UPDATE_SCRIPT: { default: 'An error occurred while saving the script: {message}' },
  FETCH_SETTINGS: { default: 'An error occurred while loading the settings: {message}' },
  UNBLOCK_USER: { default: 'An error occurred while unblocking the user: {message}' },
  FETCH_USER_LOGS: { default: 'An error occurred while loading the user logs: {message}' },
  FETCH_USER_DEVICES: { default: 'An error occurred while loading the user devices: {message}' },
  FETCH_USER: { default: 'An error occurred while loading the user: {message}' },
  CREATE_USER: { default: 'An error occurred while creating the user: {message}' },
  DELETE_USER: { default: 'An error occurred while deleting the user: {message}' },
  USERNAME_CHANGE: { default: 'An error occurred while changing the username: {message}' },
  FETCH_USERS: { default: 'An error occurred while loading the users list: {message}' },
  RESEND_VERIFICATION_EMAIL: { default: 'An error occurred while sending verification email: {message}' }
};

export default (errors = {}, error) => {
  if (!error) {
    return null;
  }

  error = (error.toJS) ? error.toJS() : error;
  const messages = Object.assign({}, defaultMessages, errors);
  const message = (messages[error.type] && messages[error.type][error.status]) || messages[error.type].default;

  return message.replace('{message}', error.message || messages.defaultErrorMessage);
};
