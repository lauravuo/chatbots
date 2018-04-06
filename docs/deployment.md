# Deployment for simple slackbot

Ok, now we have the code for slackbot, but we don't want to run it manually each day. Instead, we would like it to post the menu automatically daily before lunchtime.

Normally we would do the scheduling using e.g. a cron job in our local machine or in a virtual machine in some cloud service. For this demo we utilize free Continuous Integration system that is usually used for testing and deploying code.

## Create GitHub account

Create [GitHub](https://github.com/join) account if you don't have one already. GitHub is a cloud service where code can be stored. Storing open source code is free.

## Install git

Git is a command line utility to keep track of code versions. You need git in order to push code to GitHub. See [instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) for installation.

After successfull installation, verify in terminal that git works by running 'git --version'. You may need to restart terminal after the installation. Example:

```
$ git --version
git version 2.15.1 (Apple Git-101)
```

## Create Git repository and push project codes to new repository

Login to GitHub, [create a new project and push the project codes there](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line/).

## Enable CircleCI builds

Ok, now our codes are in GitHub. Next step is to enable CircleCI builds for the project.

Login to [CircleCI](https://circleci.com/dashboard) with your GitHub account. Add project using the left menu action "Add projects".

The CI flow is defined in project file .circleci/config.yml. By default it runs only linter for the code (analyses code for potential error).

## Schedule daily builds for CircleCI

You can use CircleCI to run your bot daily at the same time. Open CI configuration file: .circleci/config.yml.

Add new job under the jobs section:

```
  lunch:
    docker:
      - image: circleci/node:9.9.0

    working_directory: ~/repo

    steps:
      - checkout

      # Download and cache dependencies
      - restore_cache:
          keys:
          - v1-dependencies-{{ checksum "package.json" }}
          # fallback to using the latest cache if no exact match is found
          - v1-dependencies-

      - run: npm install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
        
      - run: npm start
```

Add new workflow under the workflows section:

```
   lunchtime:
     triggers:
       - schedule:
           cron: "0 7 * * 1-5"
           filters:
             branches:
               only:
                 - master
     jobs:
       - lunch

```

The schedule means that the job is run from Monday to Friday at 7 AM GMT.
Check [how cron syntax works](https://crontab.guru/).

Check full example of [CI configuration file](../.circleci/config.yml).
