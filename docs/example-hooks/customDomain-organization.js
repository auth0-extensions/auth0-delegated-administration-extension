/**
 * Custom Domain Selection Hook - Organization-Based Domain
 * 
 * This example shows how to use different custom domains based on the
 * administrator's organization. Each organization can have its own
 * branded custom domain.
 */

function(ctx, callback) {
  // Get the organization from the admin user's metadata
  const org = ctx.request.user.app_metadata?.organization;
  
  // Map organizations to their custom domains
  const domains = {
    'enterprise': 'auth.enterprise.com',
    'partner': 'auth.partner.com',
    'customer': 'login.customer.com'
  };
  
  // Return the appropriate custom domain, or use canonical domain as fallback
  return callback(null, {
    customDomain: domains[org] || null,
    useCanonicalDomain: !domains[org]  // Use canonical if org not found
  });
}
