var express = require('express');
let http = require('http');
var bodyParser = require("body-parser");
let app = express();

const to_jid ='88f148d43f0141f6a2901225ef6f5e49@conference.xmppdev.zoom.us';
const account_id ='Uoj5nh68RtK_C737r6XTIw';

app.use(express.static('./static'));
app.use(bodyParser.json());

const { oauth2, client, setting } = require('zoom-bot-sdk');

setting.setUrl('https://dev.zoom.us'); // if you are in projection,not use this.

let oauth2Client = oauth2(
  'nKZmSkNSSXOxFcVCtB0jaA',//client id
  'cI9PraeqEXzNM0mSYpIh7LHWW9kkJurQ',//client secret
  'https://3a1d72a0.ngrok.io/oauth'//redirect uri
);

//create zoomBot
let zoomBot = client(
  'nKZmSkNSSXOxFcVCtB0jaA',//client id
  'cI9PraeqEXzNM0mSYpIh7LHWW9kkJurQ',//verify code
  'v1prfqdonqtjw9e4urow4bca@xmppdev.zoom.us',//jid
  'OjusNewBotTest'
).commands([{ command: 'create', description: 'create a new meeting', hint:' <userName> <date>'}]).defaultAuth(oauth2Client.connect());

/*let foxApp=null;//oauth app
zoomBot.on('commands', async function (event) {
    let {command} = event;
    if(foxApp===null){return;}
        try {
            let userInfo = await foxApp.getUser();
            let channelList = await foxApp.channelList(userInfo.id);
            if(channelList.length>0){
                let obj = channelList[1];
                let { group_jid } = obj;
                await foxApp.sendMessage({
                    to_jid: group_jid, account_id: userInfo.account_id,
                    body: { "type": "message", "text": `message from command ${command}` },
                    header: { text: 'fox reply' }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
});*/
zoomBot.on('commands',function(e){
    let {payload,data,type,command,message}=e;//origin message from IM is message
    let { toJid: to_jid, accountId: account_id, name } = payload;
    if(command==='create'){

      console.log("i have received the command");
      /*
       we format your command string /zoom create foxjiang 2019-08-08 in group chat
       and command==='create' data=['foxjiang','2019-08-08']
      */
      //group explain message from channelList，type==='one' explain message from 1:1 chat
      let text = type === 'group' ? `message user ${data[1]}` : `message user ${data[1]}`;
      //create a new userApp and run,you can store your userApp in your code
      let foxApp = zoomBot.create({auth: oauth2Client.connect()});
      //replay a message to zoom clinet
      foxApp.sendMessage({
        to_jid,
        account_id,
        body: {type:'message',text}, header: { text: `reply from ${name}`}
      });
    }
    // else if(command==='delete'){//other command logic}
    else if(command==="help"){

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
    else if(command==="Translate"){

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

    else if(command==="links"){

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

    else if(command=== "form"){

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

    else if(command==="multiple"){

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

});


app.all('/message', function (req, res) {//get message api
  let { body, headers } = req;
  //i will add help,
  zoomBot.handle({ body, headers }, function (err) {
    if (err) { console.log(err,"this is an error with /message"); }
    res.send('ok');
  });
});

app.get('/oauth', async function (req, res) {
    try {
        let connection = await oauth2Client.connectByCode(req.query.code);
        //change foxApp to current oauth2 user
        foxApp = zoomBot.create({ auth: connection });
        res.send('ok');
    } catch (e) {
        res.send(e);
    }
});



var server = http.createServer(app);
server.listen(2525, function () { console.log(`2525 is opened`); });
