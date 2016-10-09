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

		it('should share files through a link', function(){
			vorpal.exec('Share /Users/nitintulswani/Dropbox/functionality.js', function(err){
				should.not.exist(err);
				stdout.should.containEql('link to share');
			});
		});

		it('should download files', function(){
			vorpal.exec('Download https://db.tt/Hjbq7Cy4', function(err){
				should.not.exist(err);
				stdout.should.containEql('File: saved');
			});
		});

		it('should give metadata about the file', function(){
			vorpal.exec('Info /Users/nitintulswani/Dropbox/functionality.js', function(err){
				should.not.exist(err);
				stdout.should.containEql('name:');
				stdout.should.containEql('path_lower:');
			});
		});

		it('should create a new folder', function(){
			vorpal.exec('Create new', function(err){
				should.not.exist(err);
				stdout.should.containEql('created successfully');
			});
		});

		it('should show the contents of a folder', function(){
			vorpal.exec('Show /Users/nitintulswani/Dropbox/Books', function(err){
				should.not.exist(er);
				stdout.should.containEql('linux');
				stdout.should.containEql('Automata');
				stdout.should.containEql('SQL');
			});
		});

		it('should delete the unneeded files', function(){
			vorpal.exec('Delete /Users/nitintulswani/Dropbox/asciinema-player.js', function(err){
				should.not.exist(err);
				stdout.should.containEql('File deleted');
			});
		});

		it('should save the urls on Dropbox', function(){
			vorpal.exec('Save google.com Google', function(err){
				should.not.exist(err);
				stdout.should.not.containEql('Url');
				stdout.should.not.containEql('saved to Dropbox');
			});
		});
	});
});
