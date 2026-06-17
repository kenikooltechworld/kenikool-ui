
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/playground');

  // Set to a small mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  const tableAnalysis = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('k-table'));
    return tables.map(table => {
      const rect = table.getBoundingClientRect();
      const scrollWidth = table.scrollWidth;
      const clientWidth = table.clientWidth;
      
      return {
        tag: 'k-table',
        rect: { width: rect.width, left: rect.left, right: rect.right },
        scrollWidth: scrollWidth,
        clientWidth: clientWidth,
        isOverflowing: scrollWidth > clientWidth,
        computedStyle: {
          overflow: getComputedStyle(table).overflow,
          overflowX: getComputedStyle(table).overflowX,
          display: getComputedStyle(table).display
        }
      };
    });
  });

  console.log(JSON.stringify(tableAnalysis, null, 2));
  await browser.close();
})();
