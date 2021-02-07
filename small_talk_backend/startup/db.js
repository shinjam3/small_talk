const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
	let db = config.get('db');
	if(!db.includes('&w=majority')) {
		db = db + '&w=majority';
	};
	
	mongoose
	.connect(db, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
	.then(() => console.log('MongoDB Connected...'))
	.catch(err => console.log(err));
}