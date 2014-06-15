'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Building = mongoose.model('Building'),
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
				message = 'Building already exists';
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
 * Create a Building
 */
exports.create = function(req, res) {
	var building = new Building(req.body);
	building.user = req.user;

	building.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(building);
		}
	});
};

/**
 * Show the current Building
 */
exports.read = function(req, res) {
	res.jsonp(req.building);
};

/**
 * Update a Building
 */
exports.update = function(req, res) {
	var building = req.building ;

	building = _.extend(building , req.body);

	building.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(building);
		}
	});
};

/**
 * Delete an Building
 */
exports.delete = function(req, res) {
	var building = req.building ;

	building.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(building);
		}
	});
};

/**
 * List of Buildings
 */
exports.list = function(req, res) { Building.find().sort('-created').populate('user', 'displayName').exec(function(err, buildings) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(buildings);
		}
	});
};

/**
 * Building middleware
 */
exports.buildingByID = function(req, res, next, id) { Building.findById(id).populate('user', 'displayName').exec(function(err, building) {
		if (err) return next(err);
		if (! building) return next(new Error('Failed to load Building ' + id));
		req.building = building ;
		next();
	});
};

/**
 * Building authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.building.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};