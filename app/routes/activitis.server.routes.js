'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var activitis = require('../../app/controllers/activitis');

	// Activitis Routes
	app.route('/activitis')
		.get(activitis.list)
		.post(users.requiresLogin, activitis.create);

	app.route('/activitis/:activitiId')
		.get(activitis.read)
		.put(users.requiresLogin, activitis.hasAuthorization, activitis.update)
		.delete(users.requiresLogin, activitis.hasAuthorization, activitis.delete);

	// Finish by binding the Activiti middleware
	app.param('activitiId', activitis.activitiByID);
};