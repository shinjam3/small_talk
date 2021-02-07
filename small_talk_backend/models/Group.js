const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('../models/User');

const GroupSchema = new Schema({
	members: [{
		firstName: String,
		lastName: String,
		_id: Schema.Types.ObjectId
	}],
	dateCreated: {
		type: Date,
		required: true
	},
	dateString: {
		type: String, 
		required: true
	},
	timeString: {
		type: String,
		required: true
	}
}, {collection: 'groups'});

module.exports = Group = mongoose.model('groups', GroupSchema);