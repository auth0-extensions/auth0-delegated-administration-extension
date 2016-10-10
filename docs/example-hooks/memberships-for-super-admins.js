/*
 * This example assumes the current user's app_metadata contains their department.
 * If they are part of the IT department, they should have multiple memberships.
 */
function(ctx, callback) {
  var currentDepartment = ctx.request.user.app_metadata.department;
  if (!currentDepartment || !currentDepartment.length) {
    return callback(null, [ ]);
  }

  if (currentDepartment === 'IT') {
    return callback(null, {
      memberships: [ 'IT', 'HR', 'Finance', 'Marketing' ]
    });
  }

  return callback(null, {
    memberships: [ currentDepartment ]
  });
}
