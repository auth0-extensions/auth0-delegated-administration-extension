/*
 * The context object exposes a read method which allows you to read custom data (up to 500kb).
 * For admins, we will return the whole list of vendors from storage and set createMemberships to true,
 * which will allow them to define new vendors (memberships) in the UI.
 *
 * For normal users, their memberships are limited to the current vendor they are a part of.
 *
 * See create-storage.js to understand how this data is populated.
 */
 function(ctx, callback) {
   var roles = ctx.request.user.app_metadata.roles;
   if (roles && roles.length && roles.indexOf('Vendor Manager') > -1) {
     return ctx.read()
       .then(function(data) {
         return callback(null, {
           createMemberships: true,
           memberships: data.vendors || [ ]
         });
       })
       .catch(callback);
   }

   var currentVendor = ctx.request.user.app_metadata.currentVendor;
   if (!currentVendor || !currentVendor.length) {
     return callback(null, [ ]);
   }

   return callback(null, {
     memberships: [ currentVendor ]
   });
}
