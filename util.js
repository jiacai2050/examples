'use strict';

const puppeteer = require('puppeteer');
const fs = require('fs');

async function saveAsPDF(browser, url, filepath) {
  const page = await browser.newPage();
  const resp = await page.goto(url, {timeout: 120000});
  if (resp.status() < 400) {
    await page.pdf({
      path: filepath,
      printBackground: true,
      displayHeaderFooter: true,
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
  } else {
    // let msg = await resp.text();
    console.error(`visit ${post.url} failed, status: ${resp.statusText()}, header: ${JSON.stringify(resp.headers())}`);
  }

}


function initRootDir() {
  let root_dir = "/tmp/blog";
  const args = process.argv.slice(2);
  if (args.length > 0) {
    root_dir = args[0];
  }
  if (fs.existsSync(root_dir)) {
    if (fs.readdirSync(root_dir).length > 0) {
      console.error(`root_dir ${root_dir} isn't empty`);
      process.exit(1);
    }
  } else {
    console.log(`create dir ${root_dir}...`);
    fs.mkdirSync(root_dir);
  }

  console.log(`root_dir set to ${root_dir}`);
  return root_dir;
}

module.exports = {
  saveAsPDF: saveAsPDF,
  initRootDir: initRootDir,
};
