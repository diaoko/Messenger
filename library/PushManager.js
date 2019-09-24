let request = require('request');
let pushUrl= 'https://kupush.ga';
let sendOnePush = function (registrationId, msg,msg_id=0,important=0,ttl=0) {
    let options = {
        url: pushUrl+ '/sender',
        method: 'POST',
        json : true,
        form: {
            important: important,
            messageId: msg_id,
            ttl: ttl,
            $registrationId: registrationId,
            data : JSON.stringify(msg)
        }
    };

    function callback(error, response, body) {
        if (!error ) {
            console.log("---------------->"+body.code);

        }
        else {

            console.log("push error: "+error);
        }
    }

    request(options, callback);
};
let sendBatchPush = function () {

};
let sendPushToSpecificTopic = function (topic,msg,msg_id = 0,important = 0,ttl = 0) {
    let options = {
        url: pushUrl+ '/sender/specific',
        method: 'POST',
        json : true,
        form: {
            important: important,
            messageId: msg_id,
            ttl: ttl,
            retain : 0,
            topic: topic,
            data : JSON.stringify(msg)
        }
    };

    function callback(error, response, body) {
        if (!error ) {
            console.log("---------------->"+body.code);

        }
        else {

            console.log("push error: "+error);
        }
    }

    request(options, callback);
};
let addTopic = function(registrationIds,tags, name,type='s'){

};

let removeTopic = function(){

};
module.exports = {
    sendPushToSpecificTopic : sendPushToSpecificTopic ,
    sendPushToSpecificUser : sendOnePush

};