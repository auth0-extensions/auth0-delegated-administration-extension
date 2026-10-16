// DAE_E2E_WINDOW=left,top,width,height places every browser window, e.g. for screen recordings
const parseWindowBounds = (value) => {
  if (!value) return null;
  const numbers = value.split(',').map(Number);
  if (numbers.length !== 4 || numbers.some(Number.isNaN)) throw new Error(`DAE_E2E_WINDOW must be left,top,width,height, not ${value}`);
  const [ left, top, width, height ] = numbers;
  return { left, top, width, height };
};

const windowBounds = parseWindowBounds(process.env.DAE_E2E_WINDOW);

const placeWindow = async (page) => {
  if (!windowBounds) return;
  const cdp = await page.context().newCDPSession(page);
  const { windowId } = await cdp.send('Browser.getWindowForTarget');
  // Chrome ignores new bounds for a maximised or full screen window
  await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: 'normal' } });
  await cdp.send('Browser.setWindowBounds', { windowId, bounds: windowBounds });
  await cdp.detach();
};

module.exports = { windowBounds, placeWindow };
