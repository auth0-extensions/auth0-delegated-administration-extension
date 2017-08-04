/*
 * This hook will run each time a user is created.
 * When admins create users they can assign them to any vendor they like.
 * If the vendor does not exist, it will automatically be stored in storage.
 *
 * The next time an admin will try to create a user, the vendor list will contain this new vendor.
 * In order to achieve this functionality you will need a hook similar to: memberships-storage.js
 */
function(ctx, callback) {
  if (!ctx.payload.memberships || ctx.payload.memberships.length === 0) {
    return callback(new Error('The user must be created within a vendor.'));
  }

  var roles = ctx.request.user.app_metadata.roles;
  if (roles && roles.length && roles.indexOf('Vendor Manager') > -1) {
    // The user is a vendor manager. They can assign new users to whatever membership they want.
  } else {
    var currentVendor = ctx.request.user.app_metadata.vendor;
    if (!currentVendor || !currentVendor.length) {
      return callback(new Error('The current user is not part of any vendor.'));
    }

    // Normal users can only assign users to their own vendor.
    if (ctx.payload.memberships[0].length > 1 || ctx.payload.memberships[0] !== currentVendor) {
      return callback(new Error('You can only create users within your own vendor.'));
    }
  }

  ctx.read()
    .then(function(data) {
      // We will first need to figure out if the new user has been assigned to one or more new vendors.
      var hasNewVendors = false;
      var vendors = data.vendors || [ ];
      if (ctx.payload.memberships && ctx.payload.memberships.length) {
        for (var i = 0; i < ctx.payload.memberships.length; i++) {
          var currentMembership = ctx.payload.memberships[i];
          if (vendors.indexOf(currentMembership) < 0) {
            vendors.push(currentMembership);
            hasNewMembership = true;
          }
        }
      }

      // If that is the case, we persist the new vendors in storage.
      if (hasNewVendors) {
        data.vendors = vendors;
        return ctx.write(data);
      }

      return vendors;
    })
    .then(function() {
      // Then we finally construct the user object to create the user.
      callback(null, {
        username: ctx.payload.username,
        email: ctx.payload.email,
        password: ctx.payload.password,
        connection: ctx.payload.connection,
        app_metadata: {
          vendor: ctx.payload.memberships[0]
        }
      });
    })
    .catch(callback);
}
