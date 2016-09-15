import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { auth } from './auth';
import { applications } from './applications';
import { connections } from './connections';
import { mfa } from './mfa';
import { block } from './block';
import { unblock } from './unblock';
import { log } from './log';
import { logs } from './logs';
import { user } from './user';
import { users } from './users';
import { scripts } from './scripts';
import { settings } from './settings';
import { deleteUser } from './deleteUser';
import { passwordReset } from './passwordReset';
import { passwordChange } from './passwordChange';
import { usernameChange } from './usernameChange';
import { userCreate } from './userCreate';
import { emailChange } from './emailChange';
import { accessLevel } from './accessLevel';
import { resendVerificationEmail } from './resendVerificationEmail';

export default combineReducers({
  routing: routerReducer,
  applications,
  connections,
  auth,
  mfa,
  block,
  unblock,
  log,
  logs,
  passwordChange,
  passwordReset,
  deleteUser,
  user,
  users,
  usernameChange,
  emailChange,
  userCreate,
  scripts,
  settings,
  resendVerificationEmail,
  accessLevel,
  form: formReducer
});
