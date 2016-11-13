/**
 * @author Nitin Tulswani <tulswani19@gmail.com>
 */

'use strict';

/** Dependencies */
const vorpal = require('vorpal')();
const utilities = require('../utils/utilities.js');
const Dropbox = require('dropbox');
const fs = require('fs');
const request = require("request");
const path = require('path');
const dbx = require('../utils/token.js').dbx;
const chalk = require('chalk');

// Globals
var file, src, FILE, dir, linkto, fl, token, link, 
meta, info, n, folder, list, unneeded, unlink, URL, 
nick;

/** 
 * @instance
 */
const error = chalk.bold.red;
const info = chalk.bold.blue;

/**
 * @params vorpal - vorpal commands
 */
module.exports = function(vorpal) {

					// Uploading a file
					vorpal
						.command('Upload [file]', 'Uploads a file (less than 150 MB) to Dropbox ')	
						.action(function(args, cb){
							if (args.file) {
								file = args.file;
								try {
									if (fs.lstatSync(file).isFile()) {
										src = args.file.split('/').pop(); // Get the file from the relative path
										dir = path.dirname(file);
									}
								}
								catch (err) {
									if (err.code === 'ENOENT') {
										this.log(error('❌  File not found!'));
										cb();
									} 
								}
							}
							
							/** @type {string} - file source  */
							var a = utilities.FILE(src); 

							if (fs.existsSync(file)) {
								this.prompt({
									type: 'confirm',
									name: 'continue',
									default: false,
									message: info('The file ' + src + ' will be uploaded to Dropbox. Sure?')
								},
								/**
								 * @params {string} result - Result from the user command 
								 */
								function(result){
									if (result.continue) {
										upload();
										cb();
									}
									else {
										cb();
									}
								});

								function upload() {
									fs.readFile(path.join(dir, src), function (err, contents) {
										if (err) {
											console.log('❌ Error: ', err);
										}

									// This uploads basic.js to the root of your dropbox
										dbx.filesUpload({ path: a, contents: contents, autorename: true, mute: false })
												.then(function (response) {
													console.log('✅  File ' + src + ' uploaded to Dropbox!');
												})
												.catch(function (err) {
													console.log(err);
												});
									});
								}
							}
						});

					// Sharing a file link
					vorpal
						.command('Share [linkto]', 'Share a file through a link generated')	
						.action(function(args, cb){
							if (args.linkto) {
								linkto = args.linkto;
								try {
									if (fs.lstatSync(linkto).isFile()) {
										fl = args.linkto.split('/Dropbox')[1]; // Get the file from the relative path
									}
								}
								catch (err) {
									if (err.code === 'ENOENT') {
										this.log(error('❌  File not found!'));
										cb();
									} 
								}
							}

							if (fs.existsSync(linkto)) {
								this.prompt({
									type: 'confirm',
									name: 'continue',
									default: false,
									message: info('Link for the file ' + fl + ' will be generated. Sure?')
								},
								/**
								 * @params {string} result - Result from the user command 
								 */
								function(result){
									if (result.continue) {
										generate_link();
										cb();
									}
									else {
										cb();
									}
								});
							}

							function generate_link() {
								dbx.sharingCreateSharedLink({ path: fl, short_url: true })
									.then(function (response) {
										console.log('The link to share is ' + response.url);
									})
									.catch(function (err) {
										console.log(err);
									});
							}
						});

					vorpal
						.command('Download [link]', 'Download a file given the share link from Dropbox')
						.action(function(args, cb){
							if (args.link) {
								link = args.link;
								try {
									var reg = new RegExp('^(https://db.tt/)[a-zA-Z0-9]{8}$');
									if (reg.test(link) === true) {
										download(link);
									}
									else {
										console.log(error('❌  The link is not valid!'));
										cb();
									}
								}
								catch (err) {
									this.log('❌  Please provide the valid url');
									cb();
								}
							}
							
							// Expanind the relatively short urls using the request module
							/**
							 * @params {string} shortUrl - Short url for download redirect
							 */
							function download(shortUrl) {
								request( { method: "HEAD", url: shortUrl, followAllRedirects: true },
									function (error, response) {
										dbx.sharingGetSharedLinkFile({ url: response.request.href })
											.then(function (data) {
												fs.writeFile(data.name, function (err) {
													if (err) { throw err; }
													cb();
													console.log('✅  File: ' + data.name + ' saved.');
												});
											})
											.catch(function (err) {
					  							throw err;
											});
									});
							}
						});

					vorpal
						.command('Info [meta]', 'Information about the file on Dropbox')	
						.action(function(args, cb){
							if (args.meta) {
								meta = args.meta;
								try {
									if (fs.lstatSync(meta).isFile()) {
										info = args.meta.split('/Dropbox')[1]; // Get the file from the relative path
									}
								}
								catch (err) {
									if (err.code === 'ENOENT') {
										this.log(error('❌  File not found!'));
										cb();
									} 
								}
							}

							dbx.filesGetMetadata({ path: info })
								.then(function(data){
									console.log(data);
								})
								.catch(function(err){
									throw err;
								});

						});

					vorpal
						.command('Create [new]', 'Create a new folder on Dropbox')
						.action(function(args, cb){
							if (args.new) {
								n = args.new;
								try {
										create();
								}
								catch (err) {
									this.log(error('❌  Provide a valid name for the folder.'));
								}
							}

							function create() {
								dbx.filesCreateFolder({ path: '/' + n, autorename: true })
					  				.then(function (response) {
					  					cb();
					    				console.log('✅  ' + n + ' Created successfully.');
					  				})
					  				.catch(function (err) {
					    				console.log(err);
					  				});			
							}
						});

					vorpal
						.command('Show [folder]', 'List all the files in a folder on Dropbox')
						.action(function(args, cb){
							if (args.folder) {
								folder = args.folder;
								try {
									if (fs.lstatSync(folder).isDirectory()) {
										list = args.folder.split('/Dropbox')[1]; // Get the folder name from the relative path
									}
									else {
										console.log(error('❌  Please provide path to folder'));
									}
								}
								catch (err) { throw err; } 
							}

							if (fs.existsSync(folder)) {
								list_files();
								cb();
							}

							function list_files() {
								dbx.filesListFolder({ path: list })
									.then(function(data){
										data.entries.forEach(function(item){
											console.log(item.name);
										});
									})
									.catch(function(err){
										throw err;
									})
							}
						});

					vorpal	
						.command('Delete [unneeded]', 'Delete a file from Dropbox')
						.action(function(args, cb){
							if (args.unneeded) {
								unneeded = args.unneeded;
								try {
									if (fs.lstatSync(unneeded).isFile()) {
										unlink = args.unneeded.split('/Dropbox')[1]; // Get the folder name from the relative path
									}
								}
								catch (err) {
									if (err.code === 'ENOENT') {
										this.log(error('❌  File does not exists!'));
										cb();
									} 
								}			
							}

							if (fs.existsSync(unneeded)) {
								this.prompt({
									type: 'confirm',
									name: 'continue',
									default: false,
									message: info('File ' + unlink + ' will be deleted from the Dropbox. Sure?')
								},
								function(result){
									if (result.continue) {
										delete_file();
										cb();
									}
									else {
										cb();
									}
								});
							}

							function delete_file() {
								dbx.filesDelete({ path: unlink })
									.then(function(data){
										console.log('✅  File ' + data.name + ' deleted.');
									})
									.catch(function(err){
										throw err;
									})
							}
						});

					vorpal
						.command('Save [page] [nick]', 'Save a url to Dropbox with a name provided')
						.action(function(args, cb){
							if (args.page) {
								URL = args.page;
								try {
									var m = new RegExp(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
									if (m.test(URL) === true) {
										save_url();
										cb();
									}
									else {
										console.log(error('❌  Provide a valid url!'));
										cb();
									}
								}
								catch (err) { throw err; }
							}

							function save_url(){
								dbx.filesSaveUrl({ path: '/' + args.nick, url: 'https://' + URL  })
									.then(function (data) {
										console.log('✅  Url saved to Dropbox!');
									})
									.catch(function (err) {
											throw err;
									});		
							}
						});

					vorpal
						.delimiter('➥')
						.show();
}
