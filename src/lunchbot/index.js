import { JSDOM } from 'jsdom';
import request from 'request';

import logger from '../log';

const menuUrl = 'http://pompier.fi/albertinkatu/lounas/';

const parsePompierMenu = (html) => {
  const jsdom = new JSDOM(html);
  const elementIndex = new Date().getDay() + 3;
  const cssSelector = `.page-content :nth-child(${elementIndex})`;
  // TODO: content validation
  const linesString = jsdom.window.document.querySelector(cssSelector).textContent;
  const lines = linesString.split('\n');
  return [`<${menuUrl}|${lines[0]}>`, ...lines.slice(1, lines.length)].join('\n');
};

const fetchPompierMenu = async (url = menuUrl) => new Promise((resolve) => {
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
  // TODO: env variable validation
  request({
    uri: process.env.SLACK_WEBHOOK,
    method: 'POST',
    json: payload,
  });
  logger.info('Posted menu to slack!');
})();

