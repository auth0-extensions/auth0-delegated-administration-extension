/*
 * This example assumes the current user's app_metadata contains a list of departments which
 * represents the current memberships (eg: [ "Finance", "HR" ])
 */
function(ctx, callback) {
  return callback(null, {
    memberships: ctx.request.user.app_metadata.departments
  });
}
