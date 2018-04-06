import { JSDOM } from 'jsdom';
import request from 'request';

import logger from '../log';

const menuUrl = 'http://pompier.fi/albertinkatu/lounas/';
const weekdays = ['Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai'];

const parsePompierMenu = (html) => {
  const dayIndex = new Date().getDay() - 1;
  if (dayIndex < 0 || dayIndex >= weekdays.length) {
    return 'Lunch available only weekdays!';
  }

  // Parse menu text
  const jsdom = new JSDOM(html);
  const cssSelector = '.page-content';
  const menu = jsdom.window.document.querySelector(cssSelector).textContent;

  // Find correct substring from menu
  const startIndex = menu.indexOf(weekdays[dayIndex]);
  const endIndex = dayIndex < weekdays.length - 1
    ? menu.indexOf(weekdays[dayIndex + 1])
    : menu.length;
  if (startIndex >= 0 && startIndex < endIndex) {
    const linesString = menu.substring(startIndex, endIndex);
    const lines = linesString.split('\n');

    // Format output
    return [`<${menuUrl}|${lines[0]}>`, ...lines.slice(1, lines.length)].join('\n');
  }

  return 'Error fetching Pompier lunch information';
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
  logger.info(`Result:\n${text}`);
  const payload = { text };
  // TODO: env variable validation
  request({
    uri: process.env.LUNCHBOT_WEBHOOK,
    method: 'POST',
    json: payload,
  }, () => logger.info('Posted menu to slack!'));
})();

