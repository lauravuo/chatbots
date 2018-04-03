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

## Schedule daily builds for CircleCI
