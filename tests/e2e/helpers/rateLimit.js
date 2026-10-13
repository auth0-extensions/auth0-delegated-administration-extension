// Free and dev tenants get a Management API burst of 10, refilled at 2 requests/second and shared by DAE and
// these tests, so this is how long an emptied burst takes to refill
const BURST_REFILL_MS = 5000;

let lastManagementApiActivity = 0;

const markManagementApiActivity = () => {
  lastManagementApiActivity = Date.now();
};

const waitForBurstRefill = async () => {
  const remaining = lastManagementApiActivity + BURST_REFILL_MS - Date.now();
  if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
};

module.exports = { markManagementApiActivity, waitForBurstRefill };
