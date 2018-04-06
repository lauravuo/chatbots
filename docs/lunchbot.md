# Step-by-step for lunchbot

Lunchbot is a simple bot that fetches the daily lunch menu for Pompier restaurant and posts it to Slack. The daily menu is fetched and parsed from restaurant home page i.e. HTML-output. Lunchbot is written with JavaScript and it can be run in Node.js-environment.

Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code server-side. To run lunchbot locally, you need to install Node.js-tools on your machine. [Follow the instructions](./node-env.md).

Ok, now you should have the development environment up and running locally. Let's start coding.

## Get the menu

First we fetch and parse the HTML page that contains the weekly lunch menu with HTTP GET request.
We use two helper libraries, 'request' for HTTP transport and 'jsdom' for parsing the HTML.

Replace all content in ./src/index.js with following code:

```
import { JSDOM } from 'jsdom';
import request from 'request';

import logger from './log';

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
})();
```

Test your bot. It should print out menu for the day (or error message). Run in terminal:

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

## Post menu to Slack

Ok, now you have created the Slack integration and you have the webhook URL that you need for posting the menu text to Slack.

Add code that sends the data to Slack.

Replace the bottommost block in ./src/index.js with following code:

```
(async () => {
  logger.info('Fetching Pompier menu for today...');
  const text = await fetchPompierMenu();
  logger.info(`Result:\n${text}`);
  const payload = { text };
  request({
    uri: 'https://hooks.slack.com/services/TODO',
    method: 'POST',
    json: payload,
  }, () => logger.info('Posted menu to slack!'));
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
  logger.info('Fetching Pompier menu for today...');
  const text = await fetchPompierMenu();
  logger.info(`Result:\n${text}`);
  const payload = { text };
  request({
    uri: process.env.SLACK_WEBHOOK,
    method: 'POST',
    json: payload,
  }, () => logger.info('Posted menu to slack!'));
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

