import { JSDOM } from 'jsdom';
import request from 'request';

import logger from '../log';

const parsePompierMenu = (html) => {
  const jsdom = new JSDOM(html);
  const elementIndex = new Date().getDay() + 3;
  const cssSelector = `.page-content :nth-child(${elementIndex})`;
  return jsdom.window.document.querySelector(cssSelector).textContent;
};

const fetchPompierMenu = async (url = 'http://pompier.fi/albertinkatu/lounas/') => new Promise((resolve) => {
  request(
    url,
    (error, { statusCode }, html) => {
      if (!error && statusCode === 200) {
        return resolve(parsePompierMenu(html));
      }
      const errorMsg = `Failed fetching Pompier menu: ${statusCode}`;
      logger.error(errorMsg);
      return resolve(errorMsg);
    },
  );
});

(async () => {
  logger.info('Fetching Pompier menu for today...');
  const text = await fetchPompierMenu();
  const payload = { text };
  request({
    uri: process.env.SLACK_WEBHOOK,
    method: 'POST',
    json: payload,
  });
})();

