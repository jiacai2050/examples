'use strict';

const puppeteer = require('puppeteer');
const util = require('./util');

const root_dir = util.initRootDir();
(async () => {
  const browser = await puppeteer.launch();
  await listPosts(browser);
  await browser.close();
})();

async function listPosts(browser) {
  const page = await browser.newPage();
  let archive_url = `file:///Users/chenxiang/.rustup/toolchains/stable-x86_64-apple-darwin/share/doc/rust/html/book/index.html`;

  const resp = await page.goto(archive_url, {timeout: 60000});
  const blogposts = await page.$$eval('nav div ol a', (links) => {
    return links.map(link => {
      let title = link.textContent;
      return {
        url: link.href,
        title: title.replace('/', '_'),
      };
    });
      // .filter(link => link.url.includes('blog'));
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
      await util.saveAsPDF(browser, post.url, filepath);
    } catch(err) {
      console.error(`${post.url} failed, err: ${err}`);
    }
  };
}
