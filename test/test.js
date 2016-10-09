require('assert');

const Vorpal = require('vorpal');
var should = require('should');
var main = require('../src/main.js');

var vorpal, stdout;

// Pipe the data received through the vorpal command line and log the returned string
function stdoutFn(data){
	stdout += data;
	return '';
}

describe('terminal-drop', function(){
	describe('root', function(){
		before('vorpal preps', function(){
			vorpal = new Vorpal().pipe(stdoutFn).show();
		});

		beforeEach('vorpal preps', function(){
			stdout = '';
		});

		it('should exist and be a function', function(){
			should.exist(main);
			main.should.be.type('function');
		});

		it('should import into vorpal', function(){
			(function(){
				vorpal.use(main);	
			}).should.not.throw();
		});
	});
});
