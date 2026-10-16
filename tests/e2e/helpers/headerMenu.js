async function openHeaderMenu(page) {
  await page.getByRole('navigation', { name: 'header' }).getByRole('button').click();
  return page.getByRole('menu');
}

module.exports = { openHeaderMenu };
