const puppeteer = require('puppeteer');
const util = require('./util');

(async() => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // await page.setViewport({width: 1200, height: 800, deviceScaleFactor: 2});
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('please input url param!');
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
  const body = await resp.text();
  let filepath = /<title>(.+)<\/title>/.exec(body)[1] + '.pdf';
  const m = /\d+\/\d+\/\d+/.exec(resp.url());
  if (m !== null) {
     filepath = `${m[0].replace(/\//g,'-')}-${filepath}`;
  }
  console.log(`save to ${filepath}...`);

  await util.saveAsPDF(browser, pageUrl, filepath);
  await browser.close();
})();
