'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Activiti = mongoose.model('Activiti'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Activiti already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Activiti
 */
exports.create = function(req, res) {
	var activiti = new Activiti(req.body);
	activiti.user = req.user;

	activiti.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(activiti);
		}
	});
};

/**
 * Show the current Activiti
 */
exports.read = function(req, res) {
	res.jsonp(req.activiti);
};

/**
 * Update a Activiti
 */
exports.update = function(req, res) {
	var activiti = req.activiti ;

	activiti = _.extend(activiti , req.body);

	activiti.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(activiti);
		}
	});
};

/**
 * Delete an Activiti
 */
exports.delete = function(req, res) {
	var activiti = req.activiti ;

	activiti.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(activiti);
		}
	});
};

/**
 * List of Activitis
 */
exports.list = function(req, res) { Activiti.find().sort('-created').populate('user', 'displayName').exec(function(err, activitis) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(activitis);
		}
	});
};

/**
 * Activiti middleware
 */
exports.activitiByID = function(req, res, next, id) { Activiti.findById(id).populate('user', 'displayName').exec(function(err, activiti) {
		if (err) return next(err);
		if (! activiti) return next(new Error('Failed to load Activiti ' + id));
		req.activiti = activiti ;
		next();
	});
};

/**
 * Activiti authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.activiti.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};