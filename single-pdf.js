const puppeteer = require('puppeteer');

(async() => {

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  // await page.setViewport({width: 1200, height: 800, deviceScaleFactor: 2});
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('please input url param!');
    process.exit(1);
    return;
  }

  const pageUrl = args[0];
  const resp = await page.goto(pageUrl);
  if (!resp.ok()) {
    let msg = await resp.text();
    console.error(`open ${pageUrl} failed, body: ${msg}, header: ${resp.headers()}`);
    process.exit(1);
  }

  await page.pdf({
    path: `output/${resp.url().replace(/\//g,'-')}.pdf`,
    printBackground: true,
    displayHeaderFooter: true,
    preferCSSPageSize: true,
    scale: 1,
    headerTemplate: `
<div style="width:100%; text-align:right; font-size:10px;">
    <span class="date"></span>
  </div>
`,
    footerTemplate: `
<div style="width:100%; text-align:left; font-size:10px;">
    <span class="url"></span>
  </div>
  <div style="width:100%; text-align:right; font-size:10px;">
    <span class="pageNumber"></span> / <span class="totalPages"></span>
  </div>
`,
    margin: {
      bottom: 100,
      top: 50
    },
  });
  await browser.close();
})();
