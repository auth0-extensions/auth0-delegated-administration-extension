import { Router } from 'express';

import Users from '../lib/users';
import { verifyUserAccess } from '../lib/middlewares';

export default (storage, scriptManager) => {
  const api = Router();
  const users = new Users(scriptManager);

  api.post('/', users.create);
  api.get('/', users.getAll);
  api.get('/:id', verifyUserAccess(scriptManager), users.getOne);
  api.delete('/:id', verifyUserAccess(scriptManager), users.delete);
  api.post('/:email/password-reset', users.resetPassword);
  api.put('/:id/change-password', verifyUserAccess(scriptManager), users.changePassword);
  api.put('/:id/change-username', verifyUserAccess(scriptManager), users.changeUsername);
  api.put('/:id/change-email', verifyUserAccess(scriptManager), users.changeEmail);
  api.get('/:id/devices', verifyUserAccess(scriptManager), users.getDevices);
  api.get('/:id/logs', verifyUserAccess(scriptManager), users.getLogs);
  api.delete('/:id/multifactor/:provider', verifyUserAccess(scriptManager), users.removeMFA);
  api.put('/:id/block', verifyUserAccess(scriptManager), users.block);
  api.put('/:id/unblock', verifyUserAccess(scriptManager), users.unblock);
  api.post('/:id/send-verification-email', verifyUserAccess(scriptManager), users.sendVerification);

  return api;
};
