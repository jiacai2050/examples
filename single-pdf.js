const puppeteer = require('puppeteer');
const util = require('./util');

(async() => {

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('please input url param!');
    process.exit(1);
    return;
  }

  const browser = await util.newBrowser();
  for(let pageUrl of args) {
    try {
      await goto(browser, pageUrl);
    } catch(e) {
      console.trace(`goto ${pageUrl} failed`,e);
    }

  }
  await browser.close();
})();

async function goto(browser, pageUrl) {
  console.log(`goto ${pageUrl}...`);
  const page = await browser.newPage();
  // https://github.com/puppeteer/puppeteer/blob/v5.2.0/docs/api.md#pagegotourl-options
  // networkidle2
  const resp = await page.goto(pageUrl, {timeout: 60000 * 3, waitUntil: 'load'});
  if (resp.status() >= 400) {
    let msg = await resp.text();
    console.error(`visit ${pageUrl} failed, status: ${resp.statusText()}, header: ${JSON.stringify(resp.headers())}`);
    return;
  }
  const body = await resp.text();
  const title_result = /<title>(.+)<\/title>/.exec(body);
  let filepath = `${pageUrl.replace(/\//g, '-')}.pdf`;
  if (!!title_result) {
    filepath = title_result[1] + '.pdf';
  }
  const m = /\d+\/\d+\/\d+/.exec(resp.url());
  if (!!m) {
    filepath = `${m[0].replace(/\//g,'-')}-${filepath}`;
  }
  console.log(`save to ${filepath}...`);

  await util.saveAsPDF(browser, filepath, {page: page});
}
