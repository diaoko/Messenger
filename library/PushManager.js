let request = require('request');
var Push = require('../models/push');
let pushUrl= 'https://kupush.ga/';
let sendOnePush = function (registrationId, msg,msg_id=0,important=0,ttl=0) {

    let options = {
        url: pushUrl+ 'sender',
        method: 'POST',
        json : false,
        form: {
            important: important,
            messageId: `${msg_id}`,
            ttl: ttl,
            retain:0,
            username: '7f710150fd864dc4bc76e433801e3aca',
            data : JSON.stringify(msg)
        }
    };

    function callback(error, response, body) {
        if (!error ) {
            let push = new Push({
                push : msg
            });
            push.save(function (err, push) {
                if (err) {

                }
                else {}
            });
        }
        else {

        }
    }

    request(options, callback);
};
let sendBatchPush = function (registrationId, msg,msg_id=1,important=1,ttl=9999999999999) {
    //console.log(registrationId);
    let options = {
        url: pushUrl+ 'sender/many',
        method: 'POST',
        qsStringifyOptions: {arrayFormat: 'repeat'},
        json : false,
        form: {
            important: important,
            messageId: `${msg_id}`,
            ttl: ttl,
            retain:0,
            username: registrationId,
            data : JSON.stringify(msg)
        }
    };
    console.log(options.form);
    function callback(error, response, body) {
        if (!error ) {
            let push = new Push({
                push : msg
            });
            push.save(function (err, push) {
                if (err) {

                }
                else {}
            });
        }
        else {

        }
    }
    request(options, callback);
};
let sendPushToSpecificTopic = function (topic,msg,msg_id = 1,important = 1,ttl = 9999999999) {
    let options = {
        url: pushUrl+ 'sender/specific',
        method: 'POST',
        json : false,
        form: {
            important: important,
            messageId: `${msg_id}`,
            ttl: ttl,
            retain : 0,
            topic: `${topic}`,
            data : JSON.stringify(msg)
        }
    };

    function callback(error, response, body) {
        if (!error ) {
            let push = new Push({
                push : msg
            });
            push.save(function (err, push) {
                if (err) {

                }
                else {}
            });
        }
        else {

            console.log("push error: "+error);
        }
    }

    request(options, callback);
};
let addTopic = function(topic,usernames,tags,type){
    let options = {
        url: pushUrl+ 'sender/addTopic',
        qsStringifyOptions: {arrayFormat: 'repeat'},
        method: 'POST',
        json : false,
        form: {
            username: usernames,
            tag: tags,
            topic: `${topic}`,
            type : `${type}`
        }
    };
    console.log(options.form.type);
    function callback(error, response, body) {
        if (!error ) {
            console.log("add topic =>"+JSON.stringify(response.body));
            let msg = {
                type : 191,
                topic :{
                    topic : `${response.body}`,
                    act : type,
                    tags : tags
                }
            };

            sendBatchPush(usernames,msg);
            let push = new Push({
                push : msg
            });
            push.save(function (err, push) {
                if (err) {

                }
                else {}
            });
        }
        else {

            console.log("push error: "+error);
        }
    }

    request(options, callback);
};
        }
        else {

            console.log("push error: "+error);
        }
    }

    request(options, callback);
};
let removeTopic = function(){

};
module.exports = {
    sendPushToSpecificTopic : sendPushToSpecificTopic ,
    sendPushToSpecificUser : sendOnePush,
    sendPushToMultipleUser : sendBatchPush,
    addTopic : addTopic

};