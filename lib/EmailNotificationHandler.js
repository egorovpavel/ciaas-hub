'use strict';
var nodemailer = require('nodemailer');
var swig  = require('swig');
var Promise  = require('bluebird');
var _  = require('lodash');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

var EmailNotificationHandler = function(logger){
    var send = function(name,id,body,status,email){
        var promise = Promise.pending();
        transporter.sendMail({
            from: 'minion@cipsisel.com',
            to: email,
            subject: "Build "+ name +" #"+id+ (!status ? " successful" : " failed"),
            html: body
        },function(err){
            if(err){
                promise.reject(err);
            }else{
                promise.resolve(true);
            }
        });
        promise.promise;
    };

    var handle = function(build, done){
        var diff = (new Date(build.finished)).getTime() - (new Date(build.started)).getTime();
        build.duration = new Date(diff);
        var body = swig.renderFile(__dirname+'/../templates/build_report.html', {
            build: build
        });
        Promise.all(_.map(build.notify,function(email){
            return send(build.reposity.name,build.buildid,body,build.status,email);
        })).then(function(){
            done();
        });
    };

    return {
        handle : handle
    }
};

module.exports = EmailNotificationHandler;