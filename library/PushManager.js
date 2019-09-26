let request = require('request');
let pushUrl= 'https://kupush.ga';
let sendOnePush = function (registrationId, msg,msg_id=0,important=0,ttl=0) {

    let options = {
        url: pushUrl+ '/sender',
        method: 'POST',
        json : false,
        form: {
            important: important,
            messageId: msg_id,
            ttl: ttl,
            retain:0,
            username: '1d3d4b2f540b4c18b3b6cfbfad048db8',
            data : JSON.stringify(msg)
        }
    };

    function callback(error, response, body) {
        if (!error ) {
            //console.log("---------------->"+body.code);
            //console.log("---------------->"+error);
            //console.log("---------------->"+response.body);
            //console.log(options);
        }
        else {

            //console.log("push error: "+error);
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
            //console.log("---------------->"+body.code);
            console.log("---------------->"+JSON.stringify(response.body));

        }
        else {

            console.log("push error: "+error);
        }
    }

    request(options, callback);
};
let addTopic = function(topic,usernames,tags,type){
    let options = {
        url: pushUrl+ '/sender/addTopic',
        method: 'POST',
        json : true,
        form: {
            username: usernames,
            tag: tags,
            topic: topic,
            type : type
        }
    };

    function callback(error, response, body) {
        if (!error ) {
            console.log("=========>"+JSON.stringify(response.body));

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
    addTopic : addTopic

};