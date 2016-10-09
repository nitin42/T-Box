const vorpal = require('vorpal')();

vorpal
	.use(require('./src/main.js'))
	.use(require('./utils/utilities.js'))
	.use(require('./utils/token.js').dbx)
	.show();