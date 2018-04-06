import request from 'request';
import RssParser from 'rss-parser';

import logger from '../log';

const newsUrl = 'https://feeds.yle.fi/uutiset/v1/recent.rss?publisherIds=YLE_UUTISET';
const rssParser = new RssParser();

const fetchNews = async (url = newsUrl) => {
  const feed = await rssParser.parseURL(url);
  logger.info(feed.title);
  // TODO: error handling
  return `<${feed.items[0].link}|${feed.items[0].title}>`;
};

(async () => {
  logger.info('Fetching news...');
  const text = await fetchNews();
  logger.info(`Result:\n${text}`);
  const payload = { text };
  // TODO: env variable validation
  request({
    uri: process.env.NEWSBOT_WEBHOOK,
    method: 'POST',
    json: payload,
  }, () => logger.info('Posted news to slack!'));
})();

