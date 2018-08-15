import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import { accessLevel } from './accessLevel';
import { applications } from './applications';
import { auth } from './auth';
import { block } from './block';
import { connections } from './connections';
import { emailChange } from './emailChange';
import { languageDictionary } from './languageDictionary';
import { log } from './log';
import { logs } from './logs';
import { mfa } from './mfa';
import { passwordChange } from './passwordChange';
import { passwordReset } from './passwordReset';
import { scripts } from './scripts';
import { settings } from './settings';
import { styleSettings } from './styleSettings';
import { unblock } from './unblock';
import { removeBlocks } from './removeBlocks';
import { user } from './user';
import { userCreate } from './userCreate';
import { userDelete } from './userDelete';
import { fieldsChange } from './fieldsChange';
import { usernameChange } from './usernameChange';
import { users } from './users';
import { verificationEmail } from './verificationEmail';

function lastAction(state = null, action) {
  return action;
}

export default combineReducers({
  routing: routerReducer,
  accessLevel,
  applications,
  auth,
  block,
  connections,
  emailChange,
  languageDictionary,
  log,
  logs,
  mfa,
  passwordChange,
  passwordReset,
  scripts,
  settings,
  styleSettings,
  unblock,
  removeBlocks,
  user,
  userCreate,
  userDelete,
  fieldsChange,
  usernameChange,
  users,
  verificationEmail,
  lastAction,
  form: formReducer
});
