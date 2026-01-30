/**
 * Custom Domain Selection Hook - Simple Static Domain
 * 
 * This example shows how to use a static custom domain for all operations.
 * The custom domain will be used for password resets and email verifications.
 */

function(ctx, callback) {
  // Always use the same custom domain
  return callback(null, {
    useCanonicalDomain: true
  });
}
