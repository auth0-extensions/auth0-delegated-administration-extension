/**
 * Custom Domain Selection Hook - Organization-Based Domain
 * 
 * This example shows how to use different custom domains based on the
 * administrator's organization. Each organization can have its own
 * branded custom domain.
 */

function(context, callback) {
  const emailToDomain = {
    'domain1.com': 'domain1.example.com',
    'domain2.com': 'domain2.example.com',
  };
  
  function getDomainFromEmail(userEmail) {
    if (!userEmail) return null;
    const domain = userEmail.split('@')[1];
    return emailToDomain[domain];
}
  
  function shouldUseCanonical(userEmail){
    const domain = userEmail.split('@')[1];
    return domain === 'corp.com';
  }
  
  let userEmail;
  
  if (context.method === 'create') {
    userEmail = context.payload.email;
  } else {
    userEmail = context.request.originalUser.email;
  }
  
  const customDomain = getDomainFromEmail(userEmail);

  // Use a known tenant custom domain
  if (customDomain) {
    return callback(null, { customDomain: customDomain });
  }

  // Use canonical domain
  if (shouldUseCanonical(userEmail)) {
    return callback(null, { useCanonicalDomain: true });
  }
  
  // Do not specify domain in custom header, delegate to Tenant Default Domain
  return callback(null, {});
}