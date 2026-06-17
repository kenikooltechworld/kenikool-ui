
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/playground');

  // Set to mobile viewport
  await page.setViewportSize({ width: 375, height: 667 });

  const tableAnalysis = await page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('k-table'));
    return tables.map((table, i) => {
      const rect = table.getBoundingClientRect();
      const scrollWidth = table.scrollWidth;
      const clientWidth = table.clientWidth;
      
      return {
        index: i,
        width: rect.width,
        scrollWidth: scrollWidth,
        clientWidth: clientWidth,
        isOverflowing: scrollWidth > clientWidth,
        overflowSucceeded: (scrollWidth > clientWidth && getComputedStyle(table).overflowX !== 'visible')
      };
    });
  });

  console.log(JSON.stringify(tableAnalysis, null, 2));
  await browser.close();
})();
