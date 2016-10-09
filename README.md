## T-Box
[![CircleCI](https://circleci.com/gh/nitin42/T-Box.svg?style=svg)](https://circleci.com/gh/nitin42/T-Box) [![dependencies]](https://img.shields.io/badge/dependencies-up--to--date-green.svg) [![npm]](https://img.shields.io/badge/npm-2.15.9-blue.svg)

A command line utility to manage the file uploads, downloads and sharing directly from terminal on your **Dropbox**. Built with [Vorpal.js](vorpal.js.org).

### Requirements & Dependencies

* Node.js(v4.6.0)
* Dropbox app (optional for checking the results)

### Install

```
git clone https://github.com/nitin42/T-Box.git
cd T-Box
npm install 
node run.js

```

### Usage

To manage the files directly from terminal on your **Dropbox** account, you would need to have your access token which is a ***three step process***. After you have your access token, open ```token.js``` and paste it. Thats it!

```
➥ help

  Commands:

    help [command...]   Provides help for a given command.
    exit                Exits application.
    Upload [file]       Uploads a file (less than 150 MB) to Dropbox
    Share [linkto]      Share a file through a link generated
    Download [link]     Download a file given the share link from Dropbox
    Info [meta]         Information about the file on Dropbox
    Create [new]        Create a new folder on Dropbox
    Show [folder]       List all the files in a folder on Dropbox
    Delete [unneeded]   Delete a file from Dropbox
    Save [page] [nick]  Save a url to Dropbox with a name provided

```

**Note** - Due to some new changes in the Dropbox API, now users can only upload the file less than 150 MB with minimal methods. Additional uploads with size more than 150 MB can only be uploaded with upload sessions. 

### Contributing 

Add unit tests for any or changed functionality

### Release History

* 0.1.0 Initial release

### License

MIT




