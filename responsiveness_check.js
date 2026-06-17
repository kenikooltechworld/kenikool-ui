
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/playground');

  const viewports = [
    { width: 1280, height: 800, name: 'Desktop' },
    { width: 768, height: 1024, name: 'Tablet' },
    { width: 375, height: 667, name: 'Mobile' },
  ];

  const results = [];

  for (const vp of viewports) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    
    const layoutCheck = await page.evaluate((viewportName) => {
      const grid = document.querySelector('k-grid');
      const row = document.querySelector('k-row');
      const navbar = document.querySelector('k-navbar-horizontal');
      
      return {
        viewport: viewportName,
        gridWidth: grid ? grid.getBoundingClientRect().width : 'N/A',
        rowWidth: row ? row.getBoundingClientRect().width : 'N/A',
        navbarHeight: navbar ? navbar.getBoundingClientRect().height : 'N/A',
        // Check for specific responsive classes or styles that might be missing
        computedGridDisplay: grid ? getComputedStyle(grid).display : 'N/A'
      };
    }, vp.name);
    
    results.push(layoutCheck);
  }

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
