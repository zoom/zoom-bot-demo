//require ('zoom-bot-sdk');
var express = require('express');
let http = require('http');
var bodyParser = require("body-parser");
let app = express();
app.use(express.static('./TranslateBot/test.html'));
app.use(bodyParser.json());

const { oauth2, client, setting } = require('zoom-bot-sdk');

const to_jid = '1eb8f00546464e86ab3fa8903e7a5c52@conference.xmppdev.zoom.us';
const account_id = 'Uoj5nh68RtK_C737r6XTIw';

setting.setUrl('https://dev.zoom.us'); // if you are in projection,not use this.

let oauth2Client = oauth2(
  'nKZmSkNSSXOxFcVCtB0jaA', //client id
  'cI9PraeqEXzNM0mSYpIh7LHWW9kkJurQ', //client secret
  'http://06ba2623.ngrok.io/oauth' //redirect uri
);


oauth2Client.on('tokens',function(tokens){
  console.log(tokens,999)

})

//create zoomBot
let zoomBot = client(
  'nKZmSkNSSXOxFcVCtB0jaA',//client id
  'wtIceovcROe68qBa_NsDgQ',//verify code
  'v1prfqdonqtjw9e4urow4bca@xmppdev.zoom.us',//jid
  'OjusNewBotTest'
).commands(
[{ command: 'create', description: 'create a new meeting', hint: ' <userName> <date>' }]
[{ command: 'help', description: 'this is help', hint: 'Type a message ' }]).defaultAuth(oauth2Client.connect());


zoomBot.on('commands', function (e) {
  let { payload, data, type, command, message } = e;//origin message from IM is message
  let { toJid: to_jid, accountId: account_id, name } = payload;
  if (command === 'create') {
    console.log("i have received the command");
    /*
     we format your command string /zoom create foxjiang 2019-08-08 in group chat
     and command==='create' data=['foxjiang','2019-08-08']
    */
    //group explain message from channelList，type==='one' explain message from 1:1 chat
    let text = type === 'group' ? `message user ${data[1]}` : `message user ${data[1]}`;
    //create a new userApp and run,you can store your userApp in your code
    let foxApp = zoomBot.create({ auth: oauth2Client.connect() });
    //replay a message to zoom clinet
    foxApp.sendMessage({
      to_jid,
      account_id,
      body: { type: 'message', text }, header: { text: `reply from ${name}` }
    });
  }
  // else if(command==='delete'){//other command logic}
  else if (command === "help") {

    console.log("we are within help");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{limit:'2', items:[{text: 'update', event_id:'update', event:'sendMsg(\"/weather update\")'},{text: 'delete', event_id:'delete', event:'sendMsg(\"/weather delete\")'}]}], header: { text: `This is help, it shows multiple messages` }
    });

  }


  //Configuring the "translate" command
  else if (command === "Translate") {

    console.log("we are in translate");

  }


  //Configuring the "link" command. This command displays an example for link.

  else if (command === "links") {

    console.log("we are in links");

  }


  //Configuring the "form" command. This command displays an example using Form.

  else if (command === "form") {

    console.log("we are within forms");

    foxApp.sendMessage({
      to_jid,
      account_id,
      body: [{limit:'2', items:[{text: 'update', event_id:'update', event:'sendMsg(\"/weather update\")'},{text: 'delete', event_id:'delete', event:'sendMsg(\"/weather delete\")'}]}], header: { text: `This is help, it shows multiple messages` }
    });

  }



  //Configuring the "buttons" command. This command displays an example of buttons command.

  else if (command === "multiple") {

    console.log("we are in multiple");
  }

  else {
    console.log("you are wrong ");
  }

});


app.all('/message', function (req, res) {//get message api
  let { body, headers } = req;
  //i will add help,
  zoomBot.handle({ body, headers }, function (err) {
    if (err) { console.log(err, "this is an error with /message"); }
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
server.listen(3003, function () { console.log(`3003 is opened`); });
