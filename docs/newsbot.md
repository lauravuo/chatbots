# Step-by-step for newsbot

Newsbot is a simple bot that fetches the latest news from YLE rss feed and posts it to Slack. Newsbot is written with JavaScript and it can be run in Node.js-environment.

Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code server-side. To run lunchbot locally, you need to install Node.js-tools on your machine. [Follow the instructions](./node-env.md).

Ok, now you should have the development environment up and running locally. Let's start coding.

## Get the news

First we fetch and parse the RSS feed that contains the freshest news.
We use one helper library, 'rss-parser'.

Replace all content in ./src/index.js with following code:

```
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
})();

```

Test your bot. It should print out the latest news. Run in terminal:

```
npm start
```

## Create Slack integration

Ok, now you have the content you would like to post to Slack. You need to create an integration to your Slack workspace so that you can send the data to correct place.

The integration is called [incoming webhook](https://api.slack.com/incoming-webhooks).

Go ahead and create a new incoming webhook to New Friends Co workspace in [Slack UI](https://newfriendsco.slack.com/apps/new/A0F7XDUAZ-incoming-webhooks).
NOTE: in free Slack workspaces there is a 10 integration limit, so please do this step together in teams so that we don't run out of slots.

Slack creates the webhook URL for you. Please store it for later use.

Define the channel you want your message to appear in. You can also define the bot name and icon in the webhook settings view. Save when you are ready.

## Post news to Slack

Ok, now you have created the Slack integration and you have the webhook URL that you need for posting the news to Slack.

Add code that sends the data to Slack.

Replace the bottommost block in ./src/index.js with following code:

```
(async () => {
  logger.info('Fetching news...');
  const text = await fetchNews();
  logger.info(`Result:\n${text}`);
  const payload = { text };
  // TODO: env variable validation
  request({
    uri: 'https://hooks.slack.com/services/TODO',
    method: 'POST',
    json: payload,
  }, () => logger.info('Posted news to slack!'));
})();
```

Replace the uri-property (string starting with 'https') with the Slack webhook URL you acquired in previous step.

Test it! Run in terminal:

```
npm start
```

Your message should appear in Slack.

## Finalize the code

It is a bad practice to store sensitive information in source code. The webhook URL is sensitive information since anyone can post to our Slack workspace who gets the hold of that URL. Thus we read the URL from environment variable during program execution.

In terminal, type (replace the URL with the actual webhook URL):

Mac:

```
export SLACK_WEBHOOK=https://hooks.slack.com/services/TODO
```

Windows:

```
set SLACK_WEBHOOK=https://hooks.slack.com/services/TODO
```

Replace the bottommost block in ./src/index.js with following code:

```
(async () => {
  logger.info('Fetching news...');
  const text = await fetchNews();
  logger.info(`Result:\n${text}`);
  const payload = { text };
  // TODO: env variable validation
  request({
    uri: process.env.SLACK_WEBHOOK,
    method: 'POST',
    json: payload,
  }, () => logger.info('Posted news to slack!'));
})();
```

Now URL is read from environment instead of storing it in source code.

Test it! Run in terminal:

```
npm start
```

Your message should appear in Slack.

Last thing is to finalize the ./package.json file. Replace all 'TODO'-strings with the correct information.

That's it! Now you are ready to open source your bot and make it run according to a specific schedule. See [deployment](./deployment.md)-section.


## See example workflow on video

[![See the flow](https://img.youtube.com/vi/ZqbcFRHZ7WM/0.jpg)](http://www.youtube.com/watch?v=ZqbcFRHZ7WM)

