'use strict';

const puppeteer = require('puppeteer');
const util = require('./util');

const root_dir = util.initRootDir();

(async () => {
  const browser = await puppeteer.launch();
  for(let i=1;i<=7;i++) {
    await listPosts(browser, i);
  }
  await browser.close();
})();

async function listPosts(browser, pageNumber) {
  const page = await browser.newPage();
  let archive_url = `https://liujiacai.net/archives/`;
  if (pageNumber > 1) {
    archive_url = `${archive_url}page/${pageNumber}/`;
  }
  const resp = await page.goto(archive_url, {timeout: 60000});

  const blogposts = await page.$$eval('ul > li > a', (links) => {
    return links.map(link => {
      let title = link.textContent;
      return {
        url: link.href,
        title: title.replace('/', '_'),
      };
    })
      .filter(link => link.url.includes('blog'));
  });
  console.log(blogposts);

  for (let post of blogposts) {
    console.log(`start print ${post.url} ...`);
    try {
      let filepath = `${root_dir}/${post.title}.pdf`;
      const m = /\d+\/\d+\/\d+/.exec(post.url);
      if (m !== null) {
        filepath = `${root_dir}/${m[0].replace(/\//g,'-')}-${post.title}.pdf`;
      }
      await util.saveAsPDF(browser, filepath, {url: post.url});
    } catch(err) {
      console.error(`${post.url} failed, err: ${err}`);
    }
  };
}
