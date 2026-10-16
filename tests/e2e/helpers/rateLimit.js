// How long an emptied Management API burst (shared by DAE and these tests) takes to refill. Free/dev: 10 at 2/s.
// Enterprise: 50 at 16/s, and a user page load uses well under 50, so a short margin is enough
const BURST_REFILL_MS_BY_TIER = { free: 5000, enterprise: 1000 };

const tier = process.env.AUTH0_TENANT_TIER || 'free';
if (!(tier in BURST_REFILL_MS_BY_TIER)) {
  throw new Error(`AUTH0_TENANT_TIER must be one of ${Object.keys(BURST_REFILL_MS_BY_TIER).join(', ')}, not ${tier}`);
}
const BURST_REFILL_MS = BURST_REFILL_MS_BY_TIER[tier];

let lastManagementApiActivity = 0;

const markManagementApiActivity = () => {
  lastManagementApiActivity = Date.now();
};

const waitForBurstRefill = async () => {
  const remaining = lastManagementApiActivity + BURST_REFILL_MS - Date.now();
  if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
};

module.exports = { markManagementApiActivity, waitForBurstRefill };
