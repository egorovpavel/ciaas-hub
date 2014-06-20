'use strict';
var Queue = require('bull');
var db = require('sequelize');

var Hub = function(redisConfig, persistanceHandler, notificationHandler,logger){
	var resultQueue = Queue('result',redisConfig.port,redisConfig.host);
	var statusQueue = Queue('status',redisConfig.port,redisConfig.host);

	var statusHandler = function(job, complete){
		persistanceHandler.updateStatus(job.data).then(complete);
	}

	var resultHandler = function(job, complete){
		logger.info("HANDLING", job.data);
		persistanceHandler.closeBuild(job.data).then(complete);
	}

	var startHandle = function(){
		logger.info("STARTED");
		resultQueue.process(resultHandler);
		statusQueue.process(statusHandler);
	};

	return {
		handle : startHandle
	}
};

module.exports = Hub;