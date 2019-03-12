var express = require('express');
let  app = express();
//const config = require('./config');
const request = require('request');
const favicon = require('serve-favicon');
const logger = require('morgan');
const methodOverride = require('method-override');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const errorHandler = require('errorhandler');
const clientID = 'nKZmSkNSSXOxFcVCtB0jaA';
const clientSecret = 'cI9PraeqEXzNM0mSYpIh7LHWW9kkJurQ';
const redirectUrl = 'https://3a1d72a0.ngrok.io/oauth/';



app.use(logger('dev'));
app.use(methodOverride());
app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

    // parse multipart/form-data
app.use(multer());


var access_token=null;
app.get('/', (req, res) => {

    //this will check if the code parameter is in the url, if not the most likely case is that this is the user's inital visit to oauth and we need to redirect them (Step 1)
    //if there is a code, it most likely means they were redirected here from zoom oauth screen
    if (req.query.code) {



        let url = 'https://dev.zoom.us/oauth/token?grant_type=authorization_code&code=' + req.query.code + '&redirect_uri=' + redirectUrl;

        //STEP 3
        //we need to exchange the code for a oauth token
        request.post(url, function (error, response, body) {

            //the response should be a JSON payload
            body = JSON.parse(body);

            //get refresh token
            let refresh_token = body.refresh_token

            if (body.access_token) {

                //STEP 4
                //we can now use the access token to make API calls
                request.get('https://dev.zoom.us/v2/users/me', function (error, response, body) {
                    if(error){
                        console.log('Error in API ', error)
                    }else{
                        body = JSON.parse(body);
                        console.log('API call ', body);
                        //do something with the data
                        //this is most likely where you want to connect the zoom user to the calendly user, there will be a zoom user id
                        //add where you'll want to store the access token for future requests
                    }
                }).auth(null, null, true, body.access_token);

            } else {
                //handle error, something went wrong
                console.log("this isnt working");
            }

        }).auth(clientID, clientSecret);

        return;
    }

    //STEP 2
    //no code provided, so redirect the user to get the code
    res.redirect('https://dev.zoom.us/oauth/authorize?response_type=code&client_id=' + clientID + '&redirect_uri=' + redirectUrl);
});


app.get('/oauth',function(req,res){
console.log(req.query);
var code=req.query.code;
request({
    url: "https://dev.zoom.us/oauth/token",
    json: {
      grant_type: "authorization_code",
      code:code,client_id:clientID,
      client_secret:clientSecret,
      redirect_uri:"http://localhost:2525/oauth/"
    },
    form: {
      grant_type: "authorization_code",
      code:code,client_id:clientID,
      client_secret:clientSecret,
      redirect_uri:"http://localhost:2525/oauth/"
    },
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Basic 83hch36ZSVDhSM3RUJlQTo2NmFuWEZpNHBnS0c0ajjd744w1MkhGQ3QyTGRxZDYxZA=='
    },
    method: "POST",
    json: true   // <--Very important!!!
},function (error, response, body){
    access_token=response.body.access_token;
    console.log(access_token);
  //  res.send({access_token:access_token});
  return callback(res,access_token);
})

});

function callback(res,access_token){
  var str="Basic "+access_token;
  var contents={
  "head": {
    "text": "Main Title",
    "style": {
      "color": "#000",
      "bold": true
    },
    "subHead": {
      "text": "This is a imple message"
    }
  },
  "body": [
    {
      "type": "message",
      "text": "Message body"
    }
  ]
}
/*  var options = { method: 'POST',
                  url: 'https://dev.zoom.us/v2/im/chat/messages',
                  headers: {
                            Authorization: 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                           },
                  body: {
                            robot_jid: "v1prfqdonqtjw9e4urow4bca@xmppdev.zoom.us", //Located in marketplace, bot JID
                            to_jid: "88f148d43f0141f6a2901225ef6f5e49@conference.xmppdev.zoom.us", //Group jid
                            account_id: 'Uoj5nh68RtK_C737r6XTIw', //User account ID
                            content: contents //Message to be group
                        },
                  json: true
                };

  request(options,function (error, response, body){

    if(error){
      res.send({"error":error});
    }
    else{
      res.send({"Status":"sent"});
    }

  })*/



}

//Configuring the "help" command.


app.post('/handleMessage',function(req,res){
  console.log("we in help");
var contents={"Code":400,"Message":"Please input a valid option"};
if(req.body.payload.cmd=="help"){

  console.log("we are within help");

  contents={
  "head": {
    "text": "Help Tab, This also demo's buttons",
    "style": {
      "color": "#000",
      "bold": true
    },
    "subHead": {
      "text": "Gives help information"
    }
  },
  "body": [
    {
      "type": "actions",
      "limit": 2,
      "items": [
        {
          "text": "Update",
          "event_id": "update",
          "event": "sendMsg(\"/ZoomDemo update\")",
          "link": "https://dev.zoom.us"
        },
        {
          "text": "Delete",
          "event_id": "delete",
          "event": "sendMsg(\"/ZoomDemo delete\")"
        }
      ]
    }
  ]
}
}


//Configuring the "translate" command
else if(req.body.payload.cmd=="Translate"){

  console.log("we are in translate");
  contents={
  "head": {
    "text": "This translates the string",
    "style": {
      "color": "#000",
      "bold": true
    },
    "subHead": {
      "text": "Gives help information"
    }
  },
  "body": [
    {
      "type": "message",
      "text": "Translate here",
      "link": "https://www.googleapis.com/auth/cloud-translation"
    }
  ]
}
}


//Configuring the "link" command. This command displays an example for link.

else if(req.body.payload.cmd=="links"){

  console.log("we are in links");
  contents={
  "head": {
    "text": "This message shows links",
    "style": {
      "color": "#000",
      "bold": true
    },
    "subHead": {
      "text": "Gives info on links"
    }
  },
  "body": [
   {
     "type": "message",
     "text": "Shows the link feature",
     "link": "www.zoom.us"
   }
 ]
}
}


//Configuring the "form" command. This command displays an example using Form.

else if(req.body.payload.cmd== "form"){

  console.log("we are in form");
  contents={
  "head": {
    "text": "This message shows using fields for form like look",
    "style": {
      "color": "#000",
      "bold": true
    },
    "subHead": {
      "text": "Gives info on forms"
    }
  },
  "body": [
   {
     "type": "fields",
     "items": [
       {
         "key": "China",
         "value": "CN"
       },
       {
         "key": "USA",
         "value": "US",
         "link": "https://zoom.us"
       }
     ]
   }
 ]
}
}



//Configuring the "buttons" command. This command displays an example of buttons command.

else if(req.body.payload.cmd=="multiple"){

  console.log("we are in multiple");
  contents={
    "head": {
    "text": "This is a new message head"
  },
  "body": [
    {
      "type": "message",
      "text": "This is message body simple message"
    },
    {
      "type": "message",
      "text": "this is a message with a new style",
      "style": {
        "color": "#CCCCCC",
        "bold": true
      }
    },
    {
      "type": "message",
      "text": "This is message 2"
    },
    {
      "type": "message",
      "text": "This is a message with a different color",
      "style": {
        "color": "#FFA500",
        "bold": true
      }
    },
    {
      "type": "message",
      "text": "this is message 3"
    }
  ]
}
}

else{
  contents={
  "head": {
    "text": "Input valid information",
    "style": {
      "color": "#000",
      "bold": true
    },
    "subHead": {
      "text": "Input valid information"
    }
  },
  "body": [
    {
      "type": "message",
      "text": "Options: help or Rich Message Display or Translate"
    }
  ]
  }
}



 var options = { method: 'POST',
                  url: 'https://dev.zoom.us/v2/im/chat/messages',
                  headers: {
                            Authorization: 'Bearer ' + access_token,
                            'Content-Type': 'application/json'
                           },
                  body: {
                            robot_jid: "v1prfqdonqtjw9e4urow4bca@xmppdev.zoom.us", //Located in marketplace, bot JID
                            to_jid: "88f148d43f0141f6a2901225ef6f5e49@conference.xmppdev.zoom.us", //Group jid
                            account_id: 'Uoj5nh68RtK_C737r6XTIw', //User account ID
                            content: contents //Message to be group
                        },
                  json: true
                };



    request(options,function (error, response, body){
      console.log(response);
      if(error){
        res.send({"error":error});
      }
      else{
        res.send({"Status":"sent"});
      }

    })
});



app.listen(2525, () => console.log('Zoom api oauth sample app listening on port 2525!'))
