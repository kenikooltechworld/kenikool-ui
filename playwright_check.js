
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/playground');

  console.log('Checking for Custom Elements...');
  const elements = await page.evaluate(() => {
    const customTags = Array.from(document.querySelectorAll('*'))
      .filter(el => el.tagName.toLowerCase().startsWith('k-'))
      .map(el => el.tagName.toLowerCase());
    return {
      allTags: customTags,
      uniqueTags: [...new Set(customTags)],
      title: document.title
    };
  });

  console.log('Found Tags:', JSON.stringify(elements.uniqueTags));
  console.log('Page Title:', elements.title);

  // Check if any elements are not upgraded (still in unupgraded state)
  const unupgraded = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .filter(el => el.tagName.toLowerCase().startsWith('k-') && !el.getAttribute('custom-element-defined')) 
      // Note: this is a simplified check; usually you'd check customElements.get()
      .map(el => el.tagName.toLowerCase());
  });
  
  // A better check: check if the elements are actually defined in the customElements registry
  const defined = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('*'))
      .filter(el => el.tagName.toLowerCase().startsWith('k-'))
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        isDefined: customElements.get(el.tagName.toLowerCase()) !== undefined
      }));
  });

  console.log('Definition Status:', JSON.stringify(defined));

  await browser.close();
})();
