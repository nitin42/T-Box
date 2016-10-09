'use strict';

var Dropbox = require('dropbox');
var dbx = new Dropbox({ accessToken: 'dnauvo0Y1yAAAAAAAAACvg4Y6B3rH7eaSOU5NB21VOEuKbaLL6eGMYYkSCiDs1k-' });

module.exports = {
	dbx: dbx
};
