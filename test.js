var db = require('./models');

db.link.create({
	url:'www.google.com',
	hash: 'hdhh'
}).then(function(link){
	console.log(link.get());
});