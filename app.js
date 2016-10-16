var autoprefixer = require('autoprefixer');
var bodyParser = require('body-parser');
var postcss = require('postcss');
var express = require('express');
var app = express();

var autoprefix = function autoprefix(css) {
	return postcss([ autoprefixer ]).process(css);
}

app.use(bodyParser.json());

app.post('/', function(req, res) {
	try {
		var css = req.body.data.attributes.css;
	} catch(e) {
		return res.status(422).send('Invalid request');
	}

	autoprefix(css).then(function(result) {
		var errors = result.warnings().map(function (warn) {
				return warn.toString();
		});

		if (errors.length) {
			res.status(400).send(errors.join(','));
		}

		res.send(result.css);
	}).catch(function(err) {
		res.status(400).send('Error autoprefixing css');
	});
});

app.listen(3000, function() {
	console.log('listening on port 3000');
});


