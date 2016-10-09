'use strict';

var Dropbox = require('dropbox');
var dbx = new Dropbox({ accessToken: '****************************************************************' });

module.exports = {
	dbx: dbx
};
