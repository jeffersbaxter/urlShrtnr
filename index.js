var express = require('express');
var bodyParser = require("body-parser");
var app = express();
var db = require("./models");
var Hashids = require('hashids');
hashids = new Hashids('this is my salt');

var ejsLayouts = require('express-ejs-layouts');
app.use(ejsLayouts);

app.set("view engine", 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use("/css", express.static(__dirname + '/css'));



app.get("/", function(req,res){
	res.render("index");
});

app.post("/showLink", function(req,res){
	var newLink = req.body.q;
	db.link.create({
		url: newLink
	}).then(function(row){
		var hashName = hashids.encode(row.id);
		row.updateAttributes({
			hash: hashName
		})
		res.redirect('/showLink/'+row.id);
	});
});

app.get('*', function(req,res){
	res.render('404');
});
app.get('/showLink/:id', function(req,res){
	var id = req.params.id;
	db.link.findById(id).then(function(row){
		var url = row.url;
		var hash = row.hash;
		res.render('showLink', {url: url, hash: hash});
	});
});

app.get('/:hash', function(req,res){
	var hash = req.params.hash;
	var id = hashids.decode(hash);
	id = id[0];
	db.link.findById(id).then(function(row){
		var url = row.url;
		res.redirect(url);
	});
});




app.listen(process.env.PORT || 3000);