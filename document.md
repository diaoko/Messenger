# Documentation

This is a Chat Api Documentation :)

## RequestOtp

this end point send a request to server and server generate a 6 digit code and send by mobile Text Message to User

### url

```bash
BASE_URL/v1/user/RequestOTP
```
### parameter

```bash
'mobile'
```

### response

```javascript
{
    "code": 100,
    "haserror": false
}
```


## Login

by this end point user send otp and login to the API

### url

```bash
BASE_URL/v1/user/Login
```
### parameter

```bash
'mobile'
'otp'
```

### response

```javascript
{
    "haserror": false,
    "code": 100,
    "user": {
    "id": "user unique id in chat system",
        "token": "user login jwt token",
        "refresh": "refresh token",
        "expireTime": "expire time of token",
        "avatars": [list off user avatars id]
    }
}
```


## Update User Profile 

by this end point user can edit first and last name and profile avatar

### url

```bash
BASE_URL/v1/user/updateProfile
```
### parameter

```bash
'Authorization' : jwt token(send in header)
'first_name' :string
'last_name' :string
'avatar' :file
```

### response

```javascript
{
    "haserror": false,
    "code": 100,
    "msg": "profile updated"
}
```

## Update User Profile 

this end point return list of all chats which related to authenticated user

### url

```bash
BASE_URL/v1/getAllChats
```
### parameter

```bash
'Authorization' : jwt token(send in header)
```

### response

```javascript
{
    "chats": [
        {
            "id": "5d6fff1e80bc007ddf0bc9e9",
            "type": "private",
            "first_name": "diaoko",
            "last_name": "mahmoodi",
            "unread_messages": 12,
            "chat_photo": {
                "small_file_id": 1,
                "large_file_id": 2
            },
            "conversations": [
                {
                    "message_id": "5d700baaac206f08563b34ff",
                    "type": "voice",
                    "time": 1567624107,
                    "sender": {
                        "id": "1dc4d7rf5vv5fvs",
                        "type": "user",
                        "username": "diaoko89",
                        "first_name": "diaoko",
                        "last_name": "mahmoodi"
                    },
                    "voice_message": {
                        "file_id": "5d700baaac206f08563b34fe",
                        "file_type": "voice",
                        "file_extension": "jpg",
                        "file_duration": "380",
                        "file_size": "23656"
                    }
                }
            ]
        }
    ]
}
```
## Get Messages 

get list of messages which related to specific chat by chat_id

### url

```bash
BASE_URL/v1/getMessages
```
### parameter

```bash
'Authorization' : jwt token(send in header)
'chat_id' : id of chat that want to get messages list
```

### response

```javascript
{
    "conversations": [
        {
            "message_id": "5d6fff1e80bc007ddf0bc9ea",
            "type": "text_message",
            "time": 1567620895,
            "sender": {
                "id": "1dc4d7rf5vv5fvs",
                "type": "user",
                "username": "diaoko89",
                "first_name": "diaoko",
                "last_name": "mahmoodi"
            },
            "text_message": {
                "text": "how are you"
            }
        },
        {
            "message_id": "5d6fff2e80bc007ddf0bc9eb",
            "type": "text_message",
            "time": 1567620910,
            "sender": {
                "id": "1dc4d7rf5vv5fvs",
                "type": "user",
                "username": "diaoko89",
                "first_name": "diaoko",
                "last_name": "mahmoodi"
            },
            "text_message": {
                "text": "hello"
            }
        },
        {
            "message_id": "5d700b95ac206f08563b34fd",
            "type": "voice",
            "time": 1567624086,
            "sender": {
                "id": "1dc4d7rf5vv5fvs",
                "type": "user",
                "username": "diaoko89",
                "first_name": "diaoko",
                "last_name": "mahmoodi"
            },
            "voice_message": {
                "file_id": "5d700b95ac206f08563b34fc",
                "file_type": "voice",
                "file_extension": "ogg",
                "file_duration": "380",
                "file_size": "23656"
            }
        },
        {
            "message_id": "5d700baaac206f08563b34ff",
            "type": "voice",
            "time": 1567624107,
            "sender": {
                "id": "1dc4d7rf5vv5fvs",
                "type": "user",
                "username": "diaoko89",
                "first_name": "diaoko",
                "last_name": "mahmoodi"
            },
            "voice_message": {
                "file_id": "5d700baaac206f08563b34fe",
                "file_type": "voice",
                "file_extension": "ogg",
                "file_duration": "320",
                "file_size": "2656"
            }
        }
    ]
}
```
## send Text Message 

send a text message to specific user,channel,group and etc...

### url

```bash
BASE_URL/v1/sendTextMessage
```
### parameter

```bash
'Authorization' : jwt token(send in header)
'receiver_id':id of user,channel,group or etc...
'reply_to' :id of message which you want to reply
'parse_mode' :style of text message
'text' :body of text message 
```

### response

```javascript
{
    "haserror": false,
    "code": 100,
    "conversation": {
        "message_id": "5d701770e3868f102d4782de",
        "type": "text_message",
        "sender": {
            "id": "1dc4d7rf5vv5fvs",
            "type": "user",
            "username": "diaoko89",
            "first_name": "diaoko",
            "last_name": "mahmoodi"
        },
        "text_message": {
            "text": "hello"
        }
    }
}
```
## send Voice Message 

send a voice message to specific user,channel,group and etc...

### url

```bash
BASE_URL/v1/sendVoiceMessage
```
### parameter

```bash
'Authorization' : jwt token(send in header)
'receiver_id':id of user,channel,group or etc...
'reply_to' :id of message which you want to reply
'voice' :voice file 

```

### response

```javascript
{
    "haserror": false,
    "code": 100,
    "conversation": {
        "message_id": "5d7018d5e3868f102d4782e0",
        "type": "voice",
        "sender": {
            "id": "1dc4d7rf5vv5fvs",
            "type": "user",
            "username": "diaoko89",
            "first_name": "diaoko",
            "last_name": "mahmoodi"
        },
        "voice_message": {
            "file_id": "5d7018d5e3868f102d4782df",
            "file_extension": "mp3",
            "file_duration": "371",
            "file_size": "5936411"
        }
    }
}
```
