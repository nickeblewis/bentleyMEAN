'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Activiti Schema
 */
var ActivitiSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Activiti name',
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

mongoose.model('Activiti', ActivitiSchema);