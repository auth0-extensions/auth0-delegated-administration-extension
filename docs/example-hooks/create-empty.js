/*
 * This default create hook will allow dashboard user to create new users.
 */
function(ctx, callback) {
  return callback(null, {
    username: ctx.payload.username,
    email: ctx.payload.email,
    password: ctx.payload.password,
    connection: ctx.payload.connection,
    /*
     * Memberships could be used to fill information in app_metadata
     *  app_metadata: {
     *    department: ctx.payload.memberships[0]
     *  }
     */
  });
}
