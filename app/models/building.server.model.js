'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Building Schema
 */
var BuildingSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Building name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Building', BuildingSchema);