/*
 * This is an empty hook which will return an empty array for the current user's memberships.
 */
function(ctx, callback) {
  return callback(null, {
    memberships: [ ]
  });
}
