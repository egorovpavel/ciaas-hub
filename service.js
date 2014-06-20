'use strict';
var Hub = require('./lib/hub.js');
var Logger = require('winston');
var persistanceHandler = require('./lib/SQLPersistanceHandler.js');
var config = require('./config.json')[process.env.NODE_ENV || 'development'];
var hub = new Hub(config, persistanceHandler,null,Logger);
hub.handle();