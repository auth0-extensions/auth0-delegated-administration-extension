const defaultMessages = {
  error: 'An error occurred while',
  load_settings: 'loading the settings',
  load_applications: 'loading the applications',
  block_user: 'blocking the user',
  load_connections: 'loading the connections',
  change_email: 'changing the email',
  change_fields: 'changing the users fields',
  load_dictionary: 'loading the language dictionary',
  load_log: 'loading the log record',
  load_logs: 'loading the logs list',
  remove_mfa: 'removing multi factor authentication for the user',
  change_password: 'changing the password',
  reset_password: 'resetting the password',
  load_script: 'loading the script',
  save_script: 'saving the script',
  unblock_user: 'unblocking the user',
  load_user_logs: 'loading the user logs',
  load_user_devices: 'loading the user devices',
  load_user: 'loading the user',
  create_user: 'creating the user',
  delete_user: 'deleting the user',
  change_username: 'changing the username',
  load_users: 'loading the users list',
  send_email: 'sending verification email'
};

export default (errors, error) => {
  if (!error) {
    return null;
  }

  error = error.toJS();

  if (errors && error && error.type && errors[error.type]) {
    return `${errors[error.type]}${error.message || ''}`;
  }

  return `${defaultMessages.error} ${defaultMessages[error.type] || ''}: ${error.message || ''}`;
};
